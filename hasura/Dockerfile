FROM node:19.0.0-alpine3.16 as gq

RUN set -ex \
    && npm install -g graphqurl@v1.0.1

ENTRYPOINT ["gq"]

FROM ${DOCKER_IO:-docker.io}/hasura/graphql-engine:v2.26.0.cli-migrations-v3 as hasura

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s CMD curl --fail http://127.0.0.1/healthz || exit 1
