#!/bin/sh
set -eu

PUBLIC_DIR="${PUBLIC_DIR:-/usr/share/nginx/html}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/conf.d/default.conf}"
PORT="${PORT:-8080}"

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

python - <<'PY'
import os
from pathlib import Path

conf_path = Path(os.getenv("NGINX_CONF", "/etc/nginx/conf.d/default.conf"))
port = os.getenv("PORT", "8080")
text = conf_path.read_text(encoding="utf-8")
conf_path.write_text(text.replace("__PORT__", port), encoding="utf-8")
PY

exec "$@"
