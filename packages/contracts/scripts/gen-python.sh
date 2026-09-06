#!/usr/bin/env bash
# Generates the Python clients from openapi/*.yaml via openapi-python-client.
# Self-contained: creates its own venv under packages/contracts/.venv so this package
# doesn't need to join the services/* venv loop in the root Makefile.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

VENV=.venv
if [ ! -d "$VENV" ]; then
  python3 -m venv "$VENV"
fi

"$VENV/bin/pip" install -q -U pip
"$VENV/bin/pip" install -q -r requirements.txt

# openapi-python-client shells out to `ruff` to format its output; put the venv on PATH
# so it finds the one we just installed instead of skipping formatting.
export PATH="$PWD/$VENV/bin:$PATH"

mkdir -p generated/python

for spec in gateway ai docai terminology; do
  echo "→ generating python client for ${spec}"
  rm -rf "generated/python/${spec}_client"
  "$VENV/bin/openapi-python-client" generate \
    --path "openapi/${spec}.yaml" \
    --output-path "generated/python/${spec}_client" \
    --meta none \
    --overwrite
done
