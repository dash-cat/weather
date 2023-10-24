#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Setup frontend

pushd frontend
    npm install
    npm run build
popd

# Setup backend

pushd backend
    npm install
    npm run start
popd