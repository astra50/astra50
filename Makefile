.PHONY: contrib

contrib:
	@cp -n -r contrib/* ./ || true

down:
	docker-compose down --volumes --remove-orphans

pull:
	docker-compose pull

up: contrib pull up-postgres up-hasura

up-postgres:
	docker-compose up -d --force-recreate postgres
	docker-compose exec postgres sh -c "until nc -z 127.0.0.1 5432; do sleep 0.1; done"

up-hasura:
	docker-compose exec postgres psql -U db -c "create database hasura"
	docker-compose up -d --force-recreate hasura
	docker-compose exec hasura sh -c "until nc -z 127.0.0.1 80; do sleep 0.1; done"
	docker-compose up -d --force-recreate hasura-console
	docker-compose exec hasura-console sh -c " \
		hasura-cli metadata apply \
		&& hasura-cli migrate apply --all-databases \
		&& hasura-cli metadata reload \
		&& hasura-cli migrate status --database-name default \
		"

permissions:
	sudo chown -R $(shell id -u):$(shell id -g) .

console:
	docker-compose exec hasura-console bash

cli-postgres:
	docker-compose exec -w /var/lib/postgresql/data postgres bash
