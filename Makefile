.PHONY: contrib crm

MAKEFLAGS += --no-print-directory

contrib:
	@cp -n -r contrib/* ./ || true

down:
	docker compose down --volumes --remove-orphans
pull:
	docker compose pull $(SERVICE)
build:
	docker compose build $(SERVICE)

up: do-up up-hasura migration
latest: do-up backup up-hasura migration

do-up: contrib pull up-traefik up-postgres up-www up-crm up-sneg

-deploy:
	$(eval OLD_CONTAINER := $(shell docker compose ps -q $(SERVICE) | head -1))
	docker compose up -d --scale $(SERVICE)=2 --no-recreate --wait $(SERVICE)
	docker stop --time 60 $(OLD_CONTAINER) || docker kill $(OLD_CONTAINER)
	docker rm -f $(OLD_CONTAINER)
	docker compose up -d --scale $(SERVICE)=1 --no-recreate --wait $(SERVICE)

up-traefik:
	docker compose up -d --force-recreate traefik

up-postgres:
	docker compose up -d --force-recreate postgres
	docker compose exec postgres sh -c "until nc -z 127.0.0.1 5432; do sleep 0.1; done"
	docker compose exec postgres psql -c "create database hasura"

up-hasura:
	docker compose up -d --force-recreate --build hasura
	docker compose exec postgres sh -c "until nc -z hasura 80; do sleep 0.5; done"
	docker compose up -d --force-recreate hasura-console

migration-generate: NAME ?= $(shell sh -c 'read -p "Migration name: " username; echo $$username')
migration-generate: ## Create new migration
	docker compose exec hasura-console hasura-cli migrate --database-name default create "$(NAME)"
migration:
	docker compose exec hasura-console sh -c "hasura-cli deploy"
migration-apply: ## apply migration only
	docker compose exec hasura-console hasura-cli --database-name default migrate apply
migration-rollback: ## rollback one latest migration
	docker compose exec hasura-console hasura-cli --database-name default migrate apply --down 1
migration-test: migration migration-rollback migration-apply ## test latest migration (rollback/apply)
	@$(MAKE) migration-rollback
	@$(MAKE) migration-apply

crm-install:
	docker compose run --rm -T --user $(shell id -u):$(shell id -g) crm npm install

sneg-install:
	docker compose run --rm -T --user $(shell id -u):$(shell id -g) sneg npm install

up-crm: crm-install
	docker compose up -d --build --force-recreate crm

up-sneg: sneg-install
	docker compose up -d --build --force-recreate sneg

.PHONY: www
www:
	docker compose run --rm --label ru.grachevko.dhu="" --label traefik.enable=false www sh
up-www:
	docker compose up -d --build --force-recreate www
install-www:
	docker compose run --rm -T www npm install
www-schema-build:
	docker compose build gq
www-schema: www-schema-build
	docker compose run --rm gq -H "X-Hasura-Admin-Secret: admin" -H "X-Hasura-Role: anonymous" --introspect --format=json > www/graphql.schema.json
www-push: IMAGE=cr.grachevko.ru/astra50/www:latest
www-push: www-schema
	docker build --tag $(IMAGE) www/
	docker push $(IMAGE)
www-deploy: SERVICE=www
www-deploy: pull -deploy
www-deploy-build: build -deploy

permissions:
	sudo chown -R $(shell id -u):$(shell id -g) .

console:
	docker compose exec hasura-console bash

crm:
	docker compose run --rm --label ru.grachevko.dhu="" --label traefik.enable=false crm sh
crm-update:
	docker compose run --rm -T --label ru.grachevko.dhu="" --label traefik.enable=false crm sh -c "ncu -u && npm install"
crm-push: IMAGE=cr.grachevko.ru/astra50/crm:latest
crm-push:
	docker build --tag $(IMAGE) crm/
	docker push $(IMAGE)
crm-deploy: OLD_CONTAINER=$(shell docker compose ps -q www | head -1)
crm-deploy: SERVICE=www
crm-deploy: pull -deploy
crm-deploy-build: build -deploy

cli-postgres:
	docker compose exec -w /var/lib/postgresql/data postgres bash

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
