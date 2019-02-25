#!/usr/bin/env bash
cd docs
find ./ -exec echo "'{}'," \; | sort |  grep -v service-worker.js