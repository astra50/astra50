FROM node:18.12.1-alpine3.16 as node-base

WORKDIR /data

ENV PATH=/app/node_modules/.bin:${PATH}

FROM node-base AS node

ENV NODE_ENV production

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/var/cache/npm \
    set -ex \
    && npm install

COPY tsconfig.json .
COPY public public
COPY src src

RUN set -ex \
    && npm run build

#
# nginx
#
FROM nginx:1.22.1-alpine as nginx-base

WORKDIR /data

RUN --mount=type=cache,target=/var/cache/apk \
    set -ex \
    && apk add gzip brotli \
    && tempDir="$(mktemp -d)" \
    && chown nobody:nobody $tempDir \
    && apk add --virtual .build-deps \
        gcc \
        libc-dev \
        make \
        openssl-dev \
        pcre-dev \
        zlib-dev \
        linux-headers \
        libxslt-dev \
        gd-dev \
        geoip-dev \
        perl-dev \
        libedit-dev \
        mercurial \
        bash \
        alpine-sdk \
        findutils \
        brotli-dev \
    && su nobody -s /bin/sh -c " \
        export HOME=${tempDir} \
        && cd ${tempDir} \
        && curl -L https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz | tar xz \
        && curl -L https://github.com/google/ngx_brotli/archive/v1.0.0rc.tar.gz | tar xz \
        && cd nginx-${NGINX_VERSION} \
        && ./configure `2>&1 nginx -V | grep _module | awk -F ':' ' { print $2 }'` --with-compat \
            --add-dynamic-module=${tempDir}/ngx_brotli-1.0.0rc \
        && make modules \
        " \
    && cp ${tempDir}/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/ \
    && cp ${tempDir}/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/ \
    && rm -rf ${tempDir} \
    && apk del .build-deps

FROM nginx-base AS nginx

ENV NGINX_ENTRYPOINT_QUIET_LOGS 1

COPY --from=node /data/build .
COPY etc/nginx.conf /etc/nginx/nginx.conf

RUN find . \
    -type f \
    \( \
        -name "*.css" \
        -or -name "*.eot" \
        -or -name "*.html" \
        -or -name "*.js" \
        -or -name "*.json" \
        -or -name "*.otf" \
        -or -name "*.svg" \
        -or -name "*.ttf" \
        -or -name "*.woff" \
     \) \
    -exec gzip -9 --name --suffix=.gz --keep {} \; \
    -exec brotli --best --suffix=.br --keep {} \; \
    -exec echo Compressed: {} \;

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s CMD curl --fail http://127.0.0.1/healthcheck || exit 1
