#!/usr/bin/env bash

if ! [ -e ./.env.dev ]; then
    aws s3 cp s3://fork-foodies/env/.env.dev ./.env.dev
fi
if ! [ -e ./.env.test ]; then
    aws s3 cp s3://fork-foodies/env/.env.test ./.env.test
fi
if ! [ -e ./.env.prod ]; then
    aws s3 cp s3://fork-foodies/env/.env.prod ./.env.prod
fi

docker compose --profile $1 up --force-recreate