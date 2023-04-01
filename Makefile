.PHONY: contrib crm

contrib:
	@cp -n -r contrib/* ./ || true

down:
	docker compose down --volumes --remove-orphans

pull:
	docker compose pull

up: do-up up-hasura migration
latest: do-up backup up-hasura migration

do-up: contrib pull up-traefik up-postgres up-www up-crm up-sneg

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
	docker compose exec hasura-console hasura-cli migrate --database-name dsworks create "$(NAME)"

migration:
	docker compose exec hasura-console sh -c "hasura-cli deploy"

crm-install:
	docker compose run --rm -T --user $(shell id -u):$(shell id -g) crm npm install

sneg-install:
	docker compose run --rm -T --user $(shell id -u):$(shell id -g) sneg npm install

up-crm: crm-install
	docker compose up -d --build --force-recreate crm

up-sneg: sneg-install
	docker compose up -d --build --force-recreate sneg

up-www:
	docker compose up -d --build --force-recreate www

permissions:
	sudo chown -R $(shell id -u):$(shell id -g) .

console:
	docker compose exec hasura-console bash

crm:
	docker compose run --rm --label ru.grachevko.dhu="" --label traefik.enable=false crm sh

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
