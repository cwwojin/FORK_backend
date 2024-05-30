#!/usr/bin/env bash

# meilisearch directory setup
if [ -d ./.meili_data ]; then
    rm -r .meili_data/*
else
    mkdir .meili_data
fi

if ! [ -d ./.meilisync ]; then
    mkdir .meilisync
fi

# download key files from S3
if ! [ -e ./.env ]; then
    aws s3 cp s3://fork-foodies/env/.env ./.env
fi

if ! [ -e ./.meilisync/config.dev.yml ]; then
    aws s3 cp s3://fork-foodies/meili_config/config.dev.yml ./.meilisync/config.dev.yml
fi

if ! [ -e ./.meilisync/config.prod.yml ]; then
    aws s3 cp s3://fork-foodies/meili_config/config.prod.yml ./.meilisync/config.prod.yml
fi

# run docker-compose
docker compose --profile $1 up -d --force-recreate