.PHONY: contrib

contrib:
	@cp -n -r contrib/* ./ || true

down:
	docker-compose down --volumes --remove-orphans

pull:
	docker-compose pull

up: do-up up-hasura migration
latest: do-up backup up-hasura migration

do-up: contrib pull up-traefik up-postgres up-crm up-sneg

up-traefik:
	docker-compose up -d --force-recreate traefik

up-postgres:
	docker-compose up -d --force-recreate postgres
	docker-compose exec postgres sh -c "until nc -z 127.0.0.1 5432; do sleep 0.1; done"
	docker-compose exec postgres psql -c "create database hasura"

up-hasura:
	docker-compose up -d --force-recreate hasura
	docker-compose exec postgres sh -c "until nc -z hasura 80; do sleep 0.5; done"
	docker-compose up -d --force-recreate hasura-console

migration:
	docker-compose exec hasura-console sh -c " \
		hasura-cli metadata apply \
		&& hasura-cli migrate apply --all-databases \
		&& hasura-cli metadata reload \
		&& hasura-cli migrate status --database-name default \
		"

crm-install:
	docker-compose run --rm --user $(shell id -u):$(shell id -g) crm npm install

sneg-install:
	docker-compose run --rm --user $(shell id -u):$(shell id -g) sneg npm install

up-crm: crm-install
	docker-compose up -d --build --force-recreate crm

up-sneg: sneg-install
	docker-compose up -d --build --force-recreate sneg

permissions:
	sudo chown -R $(shell id -u):$(shell id -g) .

console:
	docker-compose exec hasura-console bash

crm:
	docker-compose run --rm --label ru.grachevko.dhu="" --label traefik.enable=false crm sh

cli-postgres:
	docker-compose exec -w /var/lib/postgresql/data postgres bash

BACKUP_SERVER=s4.automagistre.ru
BACKUP_FILE=var/backup.sql.gz
HASURA_BACKUP_FILE=var/hasura_backup.sql.gz
backup-download:
	@scp -q -o LogLevel=QUIET ${BACKUP_SERVER}:$$(ssh ${BACKUP_SERVER} ls -t /opt/backups/*crm.sql.gz | head -1) $(BACKUP_FILE)
	@scp -q -o LogLevel=QUIET ${BACKUP_SERVER}:$$(ssh ${BACKUP_SERVER} ls -t /opt/backups/*crm-hasura.sql.gz | head -1) $(HASURA_BACKUP_FILE)

backup-restore:
	@docker-compose exec postgres sh -c " \
		psql postgres -c \"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'astra50' AND pid <> pg_backend_pid()\"; \
		psql postgres -c \"DROP DATABASE astra50\"; \
		psql postgres -c \"CREATE DATABASE astra50\" \
		&& gunzip < $(BACKUP_FILE) | psql \
		&& gunzip < $(HASURA_BACKUP_FILE) | psql hasura \
		"

backup: backup-download backup-restore
