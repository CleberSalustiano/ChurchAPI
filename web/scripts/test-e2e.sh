#!/usr/bin/env sh

set -eu

WEB_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
API_DIR=$(CDPATH= cd -- "$WEB_DIR/../API" && pwd)

POSTGRES_CONTAINER=${POSTGRES_CONTAINER:-churchapi-postgres}
POSTGRES_DB=${POSTGRES_DB:-church_api}
POSTGRES_USER=${POSTGRES_USER:-church_api}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-church_api}
WEB_E2E_DB=${WEB_E2E_DB:-church_api_web_e2e}
API_PORT=${API_PORT:-3334}
WEB_PORT=${WEB_PORT:-3001}
API_URL=${API_URL:-http://127.0.0.1:${API_PORT}}
WEB_URL=${WEB_URL:-http://127.0.0.1:${WEB_PORT}}
API_LOG=${API_LOG:-/private/tmp/churchapp-api-web-e2e.log}
WEB_LOG=${WEB_LOG:-/private/tmp/churchapp-web-e2e.log}

compose_up_postgres() {
  cd "$API_DIR"

  if docker compose version >/dev/null 2>&1; then
    docker compose up -d postgres
    return
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    docker-compose up -d postgres
    return
  fi

  echo "Neither docker compose nor docker-compose is available." >&2
  exit 1
}

wait_for_http() {
  target_url=$1
  attempts=${2:-60}

  while [ "$attempts" -gt 0 ]; do
    if curl -fsS "$target_url" >/dev/null 2>&1; then
      return 0
    fi

    sleep 1
    attempts=$((attempts - 1))
  done

  echo "Timed out waiting for $target_url" >&2
  return 1
}

cleanup() {
  status=$?

  if [ "${WEB_SERVER_PID:-}" ]; then
    kill "$WEB_SERVER_PID" >/dev/null 2>&1 || true
  fi

  if [ "${API_SERVER_PID:-}" ]; then
    kill "$API_SERVER_PID" >/dev/null 2>&1 || true
  fi

  wait "${WEB_SERVER_PID:-}" >/dev/null 2>&1 || true
  wait "${API_SERVER_PID:-}" >/dev/null 2>&1 || true

  exit "$status"
}

trap cleanup EXIT INT TERM

compose_up_postgres

docker exec "$POSTGRES_CONTAINER" sh -c \
  "until pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\" >/dev/null 2>&1; do sleep 1; done"

docker exec "$POSTGRES_CONTAINER" dropdb --if-exists -U "$POSTGRES_USER" "$WEB_E2E_DB"
docker exec "$POSTGRES_CONTAINER" createdb -U "$POSTGRES_USER" "$WEB_E2E_DB"

cd "$API_DIR"
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${WEB_E2E_DB}?schema=public"
export EXPOSE_RESET_TOKEN_IN_RESPONSE=true
export JWT_SECRET=${JWT_SECRET:-church-app-dev-secret}
export JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-1d}
export CORS_ORIGINS="${WEB_URL},http://localhost:${WEB_PORT}"

npx prisma migrate deploy
npm run build

cd "$WEB_DIR"
NEXT_PUBLIC_API_URL="$API_URL" npm run build

cd "$API_DIR"
PORT="$API_PORT" npm run start >"$API_LOG" 2>&1 &
API_SERVER_PID=$!

wait_for_http "$API_URL/api-docs"

cd "$WEB_DIR"
NEXT_PUBLIC_API_URL="$API_URL" npm run start -- --hostname 127.0.0.1 --port "$WEB_PORT" >"$WEB_LOG" 2>&1 &
WEB_SERVER_PID=$!

wait_for_http "$WEB_URL"

PLAYWRIGHT_BASE_URL="$WEB_URL" PLAYWRIGHT_API_URL="$API_URL" npx playwright test "$@"
