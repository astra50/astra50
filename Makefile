.DEFAULT_GOAL := help-short

MAKEFLAGS += --no-print-directory

### Help
help-short:
	@grep -E '^[a-zA-Z_-]+( [a-zA-Z_-]+)*:[ a-zA-Z_-]+?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
help:
	@grep -E '^[a-zA-Z_-]+( [a-zA-Z_-]+)*:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

### dev
.PHONY: contrib
contrib:
	@cp -n -r contrib/* ./ || true
permissions:
	sudo chown -R $(shell id -u):$(shell id -g) .

.PHONY: crm www hasura postgres
crm www hasura: ## Get terminal inside container
	@docker compose run --rm $(CLI_LABEL) --entrypoint sh $@ -c 'if [ -x "$$(command -v bash)" ]; then exec bash; else exec sh; fi'

### docker compose
CLI_LABEL := --label ru.grachevko.dhu="" --label traefik.enable=false

down: ## docker compose down
	docker compose down --volumes --remove-orphans
pull: ## docker compose pull
	docker compose pull $(SERVICE)
build: ## docker compose build
	docker compose build $(SERVICE)

### up/deploy
up: do-up migration
latest: do-up backup migration
do-up: contrib pull up-traefik up-postgres up-hasura up-www up-crm up-sneg

-deploy:
	$(eval OLD_CONTAINER := $(shell docker compose ps -q $(SERVICE) | head -1))
	docker compose up -d --scale $(SERVICE)=2 --no-recreate --wait $(SERVICE)
	docker stop --time 60 $(OLD_CONTAINER) || docker kill $(OLD_CONTAINER)
	docker rm -f $(OLD_CONTAINER)
	docker compose up -d --scale $(SERVICE)=1 --no-recreate --wait $(SERVICE)

### Traefik
up-traefik:
	docker compose up -d --force-recreate traefik

### Postgres
up-postgres:
	docker compose up -d --force-recreate postgres
	docker compose exec postgres sh -c "until nc -z 127.0.0.1 5432; do sleep 0.1; done"
	docker compose exec postgres psql -c "create database hasura"

### Hasura
up-hasura:
	docker compose up -d --force-recreate --build hasura
	docker compose exec postgres sh -c "until nc -z hasura 80; do sleep 0.5; done"
	docker compose up -d --force-recreate hasura-console
deploy-hasura: SERVICE=hasura
deploy-hasura: build -deploy
metadata: ### Export hasura metadata and save it in ./metadata directory
	docker compose exec hasura-console hasura-cli metadata export

### Migration
migration-generate: NAME ?= $(shell sh -c 'read -p "Migration name: " username; echo $$username')
migration-generate: ## Create new migration
	docker compose exec hasura-console hasura-cli migrate --database-name default create "$(NAME)"
migration: ## apply migration and hasura metadata
	docker compose exec hasura-console sh -c "hasura-cli deploy"
migration-apply: ### apply migration only
	docker compose exec hasura-console hasura-cli --database-name default migrate apply
migration-rollback: ### rollback one latest migration
	docker compose exec hasura-console hasura-cli --database-name default migrate apply --down 1
migration-test: migration migration-rollback migration-apply ## test latest migration (rollback/apply)
	@$(MAKE) migration-rollback
	@$(MAKE) migration-apply
deploy-migration: INDEX=$(shell docker compose ps hasura | tail -1 | awk '{print $$1}' | awk -F  "-" '{print $$NF}')
deploy-migration:
	docker compose exec --index $(INDEX) --env HASURA_GRAPHQL_ENDPOINT=http://hasura:8080 hasura sh -c "hasura-cli deploy"

### CRM
install-crm:
	docker compose run --rm -T $(CLI_LABEL) --user $(shell id -u):$(shell id -g) crm npm install
up-crm: install-crm
	docker compose up -d --build --force-recreate crm
update-crm:
	docker compose run --rm -T $(CLI_LABEL) crm sh -c "ncu -u && npm install"
schema-crm: gq-build
	docker compose run --rm gq -H "X-Hasura-Admin-Secret: admin" -H "X-Hasura-Role: government" --introspect --format=json > crm/graphql.schema.json
codegen-crm:
	docker compose run --rm -T --label ru.grachevko.dhu="" --label traefik.enable=false crm npm run codegen
push-crm: IMAGE=cr.grachevko.ru/astra50/crm:latest
push-crm:
	docker build --tag $(IMAGE) crm/
	docker push $(IMAGE)
deploy-crm: OLD_CONTAINER=$(shell docker compose ps -q crm | head -1)
deploy-crm: SERVICE=crm
deploy-crm: pull -deploy
deploy-crm-build: build -deploy

### Sneg
install-sneg:
	docker compose run --rm -T --user $(shell id -u):$(shell id -g) sneg npm install
up-sneg: install-sneg
	docker compose up -d --build --force-recreate sneg

### www
install-www:
	docker compose run --rm -T www npm install
up-www: schema-www
	docker compose up -d --build --force-recreate www
update-www:
	docker compose run --rm -T $(CLI_LABEL) www sh -c "ncu -u && npm install"
schema-www: gq-build
	docker compose run --rm gq -H "X-Hasura-Admin-Secret: admin" -H "X-Hasura-Role: anonymous" --introspect --format=json > www/graphql.anonymous.json
	docker compose run --rm gq -H "X-Hasura-Admin-Secret: admin" -H "X-Hasura-Role: member" --introspect --format=json > www/graphql.member.json
codegen-www:
	docker compose run --rm -T --label ru.grachevko.dhu="" --label traefik.enable=false www npm run codegen
push-www: IMAGE=cr.grachevko.ru/astra50/www:latest
push-www: schema-www
	docker build --tag $(IMAGE) www/
	docker push $(IMAGE)
deploy-www: SERVICE=www
deploy-www: pull -deploy
deploy-www-build: build -deploy

### gq
gq-build:
	docker compose build gq

### Backup
BACKUP_SERVER=s4.automagistre.ru
BACKUP_FILE=var/backup.sql.gz
HASURA_BACKUP_FILE=var/hasura_backup.sql.gz
backup-download:
	@scp -q -o LogLevel=QUIET ${BACKUP_SERVER}:$$(ssh ${BACKUP_SERVER} ls -t /opt/backups/*crm.sql.gz | head -1) $(BACKUP_FILE)
	@scp -q -o LogLevel=QUIET ${BACKUP_SERVER}:$$(ssh ${BACKUP_SERVER} ls -t /opt/backups/*crm-hasura.sql.gz | head -1) $(HASURA_BACKUP_FILE)

backup-restore:
	docker compose up -d --force-recreate postgres
	docker compose exec postgres sh -c "until nc -z 127.0.0.1 5432; do sleep 0.1; done"
	@docker compose exec postgres sh -c " \
		psql postgres -c \"DROP DATABASE IF EXISTS astra50\" \
		&& psql postgres -c \"CREATE DATABASE astra50\" \
		&& psql postgres -c \"DROP DATABASE IF EXISTS hasura\" \
		&& psql postgres -c \"CREATE DATABASE hasura\" \
		&& gunzip < $(BACKUP_FILE) | psql \
		&& gunzip < $(HASURA_BACKUP_FILE) | psql hasura \
		"

backup-fresh:
	@ssh ${BACKUP_SERVER} 'docker exec -i $$(docker ps --filter name=astra50_postgres_backup -q | head -1) /backup.sh'

backup: backup-download backup-restore
