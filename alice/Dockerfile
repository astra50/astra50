FROM golang:1.23.4-alpine3.21 AS golang

ARG GOOS
ENV CGO_ENABLED=0 \
    GOOS=$GOOS \
    GOARCH=amd64 \
    CGO_CPPFLAGS="-I/usr/include" \
    UID=0 GID=0 \
    CGO_CFLAGS="-I/usr/include" \
    CGO_LDFLAGS="-L/usr/lib -lpthread -lrt -lstdc++ -lm -lc -lgcc -lz" \
    PKG_CONFIG_PATH="/usr/lib/pkgconfig"

RUN set -ex && \
    chmod 1777 /tmp && \
    apk upgrade && \
    apk add \
    && rm -rf /var/cache/apk/* && \
    go install github.com/air-verse/air@latest

FROM golang AS build

WORKDIR /go/src/app
COPY ./cmd ./cmd
COPY ./internal ./internal
COPY ./go.mod ./go.mod
COPY ./go.sum ./go.sum
COPY ./main.go ./main.go

RUN set -ex \
    && go build -v \
    -o /out/main \
    -ldflags "-extldflags '-static'" \
    ./main.go

FROM alpine:3.21

WORKDIR /app

ENV GIN_MODE=release

COPY --from=build --chown=app:app /out/main /usr/local/bin/alice

RUN set -ex && \
    chmod 1777 /tmp && \
    addgroup -g 1000 app && \
    adduser -H -u 1000 -G app -s /bin/sh -D app && \
    apk upgrade && \
    apk add \
      ca-certificates \
      tzdata \
    && rm -rf /var/cache/apk/*

USER app

ENTRYPOINT ["alice"]
CMD ["serve"]
STOPSIGNAL SIGTERM
