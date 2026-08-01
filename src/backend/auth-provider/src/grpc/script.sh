#!/usr/bin/env bash

set -e

uv run python -m grpc_tools.protoc \
    -I ../../../contracts \
    --python_out=./src/grpc/generated \
    --grpc_python_out=./src/grpc/generated \
    --mypy_out=./src/grpc/generated \
    --mypy_grpc_out=./src/grpc/generated \
    ../../../contracts/auth.proto

echo "gRPC code generated successfully."