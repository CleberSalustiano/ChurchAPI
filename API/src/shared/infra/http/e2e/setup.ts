import prismaClient from "../../database/prismaClient";

async function truncateDatabase() {
  const tables = await prismaClient.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
  `;

  if (!tables.length) {
    return;
  }

  const tableNames = tables
    .map(({ tablename }) => `"public"."${tablename}"`)
    .join(", ");

  await prismaClient.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`
  );
}

beforeAll(async () => {
  await prismaClient.$connect();
});

beforeEach(async () => {
  await truncateDatabase();
});

afterAll(async () => {
  await truncateDatabase();
  await prismaClient.$disconnect();
});
