FROM node:16.9-alpine AS builder

WORKDIR /data

RUN set -ex \
    && npm install docxtemplater pizzip number-to-words-ru \
    && npm install https://cdn.sheetjs.com/xlsx-0.19.2/xlsx-0.19.2.tgz

FROM n8nio/n8n:0.231.2 AS n8n

COPY --from=builder /data/node_modules/docxtemplater /usr/local/lib/node_modules/n8n/node_modules/docxtemplater
COPY --from=builder /data/node_modules/pizzip /usr/local/lib/node_modules/n8n/node_modules/pizzip
COPY --from=builder /data/node_modules/number-to-words-ru /usr/local/lib/node_modules/n8n/node_modules/number-to-words-ru
COPY --from=builder /data/node_modules/xlsx /usr/local/lib/node_modules/n8n/node_modules/xlsx
COPY --from=builder /data/node_modules/pako /usr/local/lib/node_modules/n8n/node_modules/pako
COPY assets/* /opt/templates/
