/*
  Warnings:

  - You are about to drop the column `id_special_offer` on the `members` table. All the data in the column will be lost.
  - Added the required column `id_member` to the `special_offers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_churchs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "creationDate" DATETIME NOT NULL,
    "id_manager" INTEGER,
    "id_location" INTEGER NOT NULL,
    CONSTRAINT "churchs_id_manager_fkey" FOREIGN KEY ("id_manager") REFERENCES "managers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "churchs_id_location_fkey" FOREIGN KEY ("id_location") REFERENCES "locations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_churchs" ("creationDate", "id", "id_location", "id_manager") SELECT "creationDate", "id", "id_location", "id_manager" FROM "churchs";
DROP TABLE "churchs";
ALTER TABLE "new_churchs" RENAME TO "churchs";
CREATE TABLE "new_special_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "id_offer" INTEGER NOT NULL,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "special_offers_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "special_offers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "special_offers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_special_offers" ("date", "id", "id_church", "id_offer", "reason") SELECT "date", "id", "id_church", "id_offer", "reason" FROM "special_offers";
DROP TABLE "special_offers";
ALTER TABLE "new_special_offers" RENAME TO "special_offers";
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
    "foto" TEXT
);
INSERT INTO "new_members" ("batism_date", "birth_date", "cpf", "email", "foto", "id", "login", "name", "password", "rg", "titleChurch") SELECT "batism_date", "birth_date", "cpf", "email", "foto", "id", "login", "name", "password", "rg", "titleChurch" FROM "members";
DROP TABLE "members";
ALTER TABLE "new_members" RENAME TO "members";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
