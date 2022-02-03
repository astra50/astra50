.PHONY: contrib

contrib:
	@cp -n -r contrib/* ./ || true

down:
	docker-compose down --volumes --remove-orphans

pull:
	docker-compose pull

up: contrib pull up-postgres up-hasura up-crm up-sneg

up-postgres:
	docker-compose up -d --force-recreate postgres
	docker-compose exec postgres sh -c "until nc -z 127.0.0.1 5432; do sleep 0.1; done"

up-hasura:
	docker-compose exec postgres psql -U db -c "create database hasura"
	docker-compose up -d --force-recreate hasura
	docker-compose exec postgres sh -c "until nc -z hasura 80; do sleep 0.1; done"
	docker-compose exec hasura sh -c " \
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
	docker-compose up -d --force-recreate crm

up-sneg: sneg-install
	docker-compose up -d --force-recreate sneg

permissions:
	sudo chown -R $(shell id -u):$(shell id -g) .

console:
	docker-compose exec hasura-console bash

cli:
	docker-compose run --rm --user $(shell id -u):$(shell id -g) --label ru.grachevko.dhu="" crm sh

cli-postgres:
	docker-compose exec -w /var/lib/postgresql/data postgres bash

BACKUP_SERVER=s3.automagistre.ru
BACKUP_FILE=var/backup.sql.gz
backup-download:
	@scp -q -o LogLevel=QUIET ${BACKUP_SERVER}:$$(ssh ${BACKUP_SERVER} ls -t /opt/astra50/backups/postgres/*crm.sql.gz | head -1) $(BACKUP_FILE)

backup-restore:
	@docker-compose exec postgres sh -c " \
		psql -U db postgres -c \"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'db' AND pid <> pg_backend_pid()\"; \
		psql -U db postgres -c \"DROP DATABASE db\"; \
		psql -U db postgres -c \"CREATE DATABASE db\" \
		&& gunzip < $(BACKUP_FILE) | psql -U db \
		"

backup: backup-download backup-restore

latest: up backup
