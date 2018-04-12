COMPOSE_FILE?=dev.yml
COMPOSE_CMD=docker-compose -f $(COMPOSE_FILE)
RUN_APP=$(COMPOSE_CMD) run --rm app

default:
	make build
	make runserver

build:
	docker-compose -f $(COMPOSE_FILE) build

runserver:
	$(COMPOSE_CMD) up

build-infra-production:
	./bin/build-infra production

deploy-production:
	./bin/deploy production gifz.mkamycki.com
