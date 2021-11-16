down:
	docker-compose down --volumes --remove-orphans

pull:
	docker-compose pull

install:
	docker-compose run --rm --user $(shell id -u):$(shell id -g) react-admin npm install

up: pull install
	docker-compose up -d --force-recreate react-admin

cli:
	docker-compose run --rm --user $(shell id -u):$(shell id -g) --label ru.grachevko.dhu="" react-admin sh

permissions:
	docker-compose run --rm  react-admin chown -R $(shell id -u):$(shell id -g) .
