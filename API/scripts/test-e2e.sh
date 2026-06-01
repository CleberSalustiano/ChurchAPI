#!/usr/bin/env sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT_DIR"

POSTGRES_CONTAINER=${POSTGRES_CONTAINER:-churchapi-postgres}
POSTGRES_DB=${POSTGRES_DB:-church_api}
POSTGRES_USER=${POSTGRES_USER:-church_api}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-church_api}
E2E_DB=${E2E_DB:-church_api_e2e}

export DATABASE_URL=${DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${E2E_DB}?schema=public}
export EXPOSE_RESET_TOKEN_IN_RESPONSE=${EXPOSE_RESET_TOKEN_IN_RESPONSE:-true}
export JWT_SECRET=${JWT_SECRET:-church-app-dev-secret}
export JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-1d}

compose_up_postgres() {
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

compose_up_postgres

docker exec "$POSTGRES_CONTAINER" sh -c \
  "until pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\" >/dev/null 2>&1; do sleep 1; done"

docker exec "$POSTGRES_CONTAINER" dropdb --if-exists -U "$POSTGRES_USER" "$E2E_DB"
docker exec "$POSTGRES_CONTAINER" createdb -U "$POSTGRES_USER" "$E2E_DB"

npx prisma migrate deploy
npx jest --config jest.e2e.config.ts --runInBand "$@"
