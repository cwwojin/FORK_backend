#!/usr/bin/env bash

if ! [ -e ./.env ]; then
    aws s3 cp s3://fork-secure/env/.env ./.env
fi

docker compose --profile $1 up -d --force-recreate