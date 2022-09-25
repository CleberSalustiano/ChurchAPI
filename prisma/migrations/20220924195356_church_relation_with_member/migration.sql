/*
  Warnings:

  - Added the required column `id_church` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "members_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_members" ("batism_date", "birth_date", "cpf", "email", "foto", "id", "login", "name", "password", "rg", "titleChurch") SELECT "batism_date", "birth_date", "cpf", "email", "foto", "id", "login", "name", "password", "rg", "titleChurch" FROM "members";
DROP TABLE "members";
ALTER TABLE "new_members" RENAME TO "members";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
