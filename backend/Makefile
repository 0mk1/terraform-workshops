COMPOSE_FILE?=dev.yml
COMPOSE_CMD=docker-compose -f $(COMPOSE_FILE)
RUN_DJANGO = $(COMPOSE_CMD) run --rm django
RUN_DJANGO_NO_DEPS = $(COMPOSE_CMD) run --rm --no-deps django
RUN_MANAGE = $(RUN_DJANGO) manage

default:
	make build
	make isort
	make lint
	make test

build:
	$(COMPOSE_CMD) build

runserver:
	$(COMPOSE_CMD) run --service-ports --rm django runserver

bootstrap:
	$(RUN_DJANGO) bootstrap

load_test_data:
	$(RUN_MANAGE) create_test_user a@a.com
	$(RUN_MANAGE) populate_db_from_dir ./test_data/

sh:
	$(RUN_DJANGO) sh

shell:
	$(RUN_DJANGO) shell

lint:
	$(RUN_DJANGO_NO_DEPS) lint

isort:
	$(RUN_DJANGO_NO_DEPS) isort .

test:
	$(RUN_DJANGO) test -vv

create_admin:
	$(RUN_MANAGE) createsuperuser --username admin

redis-cli:
	$(COMPOSE_CMD) run --rm redis redis-cli -h redis

psql:
	$(COMPOSE_CMD) run --rm postgres psql -h postgres -U postgres

logs:
	$(COMPOSE_CMD) logs -f

build-infra-production:
	./bin/build-infra production
