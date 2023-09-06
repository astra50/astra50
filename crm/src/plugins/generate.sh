#!/usr/bin/env sh

set -ex

npx tsc ./src/plugins/scalarTypePolicies.tsx \
  --target es2018 \
  --module commonjs \
  --moduleResolution node \
  --lib esnext \
  --skipLibCheck true \
  --outDir "src/plugins"
