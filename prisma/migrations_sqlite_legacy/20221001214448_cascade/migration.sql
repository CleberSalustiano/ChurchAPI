-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_managers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    "dateStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEnd" DATETIME,
    CONSTRAINT "managers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "managers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_managers" ("dateEnd", "dateStart", "id", "id_church", "id_member") SELECT "dateEnd", "dateStart", "id", "id_church", "id_member" FROM "managers";
DROP TABLE "managers";
ALTER TABLE "new_managers" RENAME TO "managers";
CREATE TABLE "new_members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "batism_date" DATETIME NOT NULL,
    "titleChurch" TEXT NOT NULL,
    "cpf" BIGINT NOT NULL,
    "rg" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "foto" TEXT,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "members_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_members" ("batism_date", "birth_date", "cpf", "email", "foto", "id", "id_church", "login", "name", "password", "rg", "titleChurch") SELECT "batism_date", "birth_date", "cpf", "email", "foto", "id", "id_church", "login", "name", "password", "rg", "titleChurch" FROM "members";
DROP TABLE "members";
ALTER TABLE "new_members" RENAME TO "members";
CREATE UNIQUE INDEX "members_cpf_key" ON "members"("cpf");
CREATE TABLE "new_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "id_treasurer" INTEGER NOT NULL,
    CONSTRAINT "offers_id_treasurer_fkey" FOREIGN KEY ("id_treasurer") REFERENCES "treasurers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("id", "id_treasurer", "value") SELECT "id", "id_treasurer", "value" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
