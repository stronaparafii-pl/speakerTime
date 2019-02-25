#!/usr/bin/env bash
cd docs
echo "'./',"
find ./ -type f -exec echo "'{}'," \; | sort | grep -v service-worker.js