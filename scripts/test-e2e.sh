#!/usr/bin/env bash

MAIN_DOCKER_COMPOSE_FILE="-f docker-compose.yml"
COMPOSE_FILES_PARAMS="$MAIN_DOCKER_COMPOSE_FILE -f docker-compose.e2e.yml"

docker-compose $COMPOSE_FILES_PARAMS up -d

./scripts/wait-up.sh "https://docker:8765/discovery/info" 600
./scripts/wait-up.sh "http://docker:4444/wd/hub" 30

gradle gulpTestE2E

docker-compose $COMPOSE_FILES_PARAMS down