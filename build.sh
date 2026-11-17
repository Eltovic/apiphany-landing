#!/usr/bin/env bash
# Precompiles the JSX sources in src/ into plain JS in dist/.
# Run after editing any src/*.jsx file, and commit dist/ together with src/.
# The site has no npm install step; esbuild is fetched on demand by npx.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
for f in icons sections landing; do
  npx --yes esbuild@0.24.0 "src/$f.jsx" --outfile="dist/$f.js" \
    --loader:.jsx=jsx --jsx=transform --jsx-factory=React.createElement \
    --jsx-fragment=React.Fragment --format=iife --target=es2018 --minify --log-level=warning
done
echo "built: $(ls dist | tr '\n' ' ')"
