#!/usr/bin/env bash
# Helper build script for local or CI use
set -euo pipefail

echo "Tornando mvnw executável..."
chmod +x mvnw

echo "Construindo com mvnw (skip tests)..."
./mvnw -B -DskipTests package

echo "Build concluído. Artefatos em target/."
