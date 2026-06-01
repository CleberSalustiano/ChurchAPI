#!/usr/bin/env sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
API_DIR="$ROOT_DIR/API"
WEB_DIR="$ROOT_DIR/web"

POSTGRES_CONTAINER=${POSTGRES_CONTAINER:-churchapi-postgres}
POSTGRES_DB=${POSTGRES_DB:-church_api}
POSTGRES_USER=${POSTGRES_USER:-church_api}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-church_api}
API_PORT=${API_PORT:-3333}
WEB_PORT=${WEB_PORT:-3000}
API_URL=${API_URL:-http://localhost:${API_PORT}}
WEB_URL=${WEB_URL:-http://localhost:${WEB_PORT}}

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

cleanup() {
  status=$?

  if [ "${WEB_PID:-}" ]; then
    kill "$WEB_PID" >/dev/null 2>&1 || true
  fi

  if [ "${API_PID:-}" ]; then
    kill "$API_PID" >/dev/null 2>&1 || true
  fi

  wait "${WEB_PID:-}" >/dev/null 2>&1 || true
  wait "${API_PID:-}" >/dev/null 2>&1 || true

  exit "$status"
}

trap cleanup EXIT INT TERM

compose_up_postgres

docker exec "$POSTGRES_CONTAINER" sh -c \
  "until pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\" >/dev/null 2>&1; do sleep 1; done"

export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"
export JWT_SECRET=${JWT_SECRET:-church-app-dev-secret}
export JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-1d}
export CORS_ORIGINS="${WEB_URL},http://127.0.0.1:${WEB_PORT}"
export PASSWORD_RESET_URL_BASE="${WEB_URL}/redefinir-senha"
export EXPOSE_RESET_TOKEN_IN_RESPONSE=${EXPOSE_RESET_TOKEN_IN_RESPONSE:-true}

cd "$API_DIR"
npx prisma migrate deploy
npx prisma generate
npm run seed:demo

printf '\nSistema preparado.\n'
printf 'API: %s\n' "$API_URL"
printf 'Web: %s\n' "$WEB_URL"
printf '\nAcessos demo:\n'
printf '  lider.sede / Sede123\n'
printf '  dirigente.campinas / Campinas123\n'
printf '  tesouraria.campinas / Tesouraria123\n'
printf '  membro.campinas / CampinasMembro123\n'
printf '  membro.temp / 12345678907 (forca troca de senha)\n\n'

PORT="$API_PORT" npm run dev:server &
API_PID=$!

cd "$WEB_DIR"
NEXT_PUBLIC_API_URL="$API_URL" npm run dev -- --hostname 0.0.0.0 --port "$WEB_PORT" &
WEB_PID=$!

wait "$WEB_PID"
