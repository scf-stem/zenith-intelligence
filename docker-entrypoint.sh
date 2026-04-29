#!/bin/sh
set -eu

PUBLIC_DIR="${PUBLIC_DIR:-/usr/share/nginx/html}"
mkdir -p "$PUBLIC_DIR"

python - <<'PY' > "$PUBLIC_DIR/env.js"
import json
import os

keys = [
    "VITE_API_BASE_URL",
]

env = {key: os.getenv(key, "") for key in keys}
print(f"window.__env__ = {json.dumps(env, ensure_ascii=False)};")
PY

exec "$@"
