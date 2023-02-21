/*
  Warnings:

  - You are about to drop the column `login` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `members` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CultOffer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_cult" INTEGER NOT NULL,
    "id_offer" INTEGER NOT NULL,
    CONSTRAINT "CultOffer_id_cult_fkey" FOREIGN KEY ("id_cult") REFERENCES "cults" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CultOffer_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "email" TEXT NOT NULL,
    "foto" TEXT,
    "id_church" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    CONSTRAINT "members_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "members_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_members" ("batism_date", "birth_date", "cpf", "email", "foto", "id", "id_church", "name", "rg", "titleChurch") SELECT "batism_date", "birth_date", "cpf", "email", "foto", "id", "id_church", "name", "rg", "titleChurch" FROM "members";
DROP TABLE "members";
ALTER TABLE "new_members" RENAME TO "members";
CREATE UNIQUE INDEX "members_cpf_key" ON "members"("cpf");
CREATE UNIQUE INDEX "members_id_user_key" ON "members"("id_user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
