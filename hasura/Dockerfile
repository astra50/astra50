FROM node:19.0.0-alpine3.16 as gq

RUN set -ex \
    && npm install -g graphqurl@v1.0.1

ENTRYPOINT ["gq"]

FROM ${DOCKER_IO:-docker.io}/hasura/graphql-engine:v2.22.0.cli-migrations-v3 as hasura
