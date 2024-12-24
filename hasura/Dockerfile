FROM node:19.0.0-alpine3.16 AS gq

RUN set -ex \
    && npm install -g graphqurl@v1.0.1

ENTRYPOINT ["gq"]

FROM hasura/graphql-engine:v2.44.0.cli-migrations-v3 AS hasura

RUN set -ex \
    && chmod 1777 /tmp

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s CMD curl --fail http://127.0.0.1:8080/healthz || exit 1
