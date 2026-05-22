/*
  Warnings:

  - Added the required column `id_special_offer` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_treasurer` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "managers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_member" INTEGER NOT NULL,
    CONSTRAINT "managers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "treasurers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "id_member" INTEGER NOT NULL,
    CONSTRAINT "treasurers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "churchs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "id_manager" INTEGER NOT NULL,
    CONSTRAINT "churchs_id_manager_fkey" FOREIGN KEY ("id_manager") REFERENCES "managers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cults" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "theme" TEXT NOT NULL,
    "id_offer" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "cults_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cults_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "costs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "costs_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "locations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logradouro" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "locations_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "foto" TEXT,
    "id_special_offer" INTEGER NOT NULL,
    CONSTRAINT "members_id_special_offer_fkey" FOREIGN KEY ("id_special_offer") REFERENCES "special_offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_members" ("batism_date", "birth_date", "cpf", "email", "foto", "id", "login", "name", "password", "rg", "titleChurch") SELECT "batism_date", "birth_date", "cpf", "email", "foto", "id", "login", "name", "password", "rg", "titleChurch" FROM "members";
DROP TABLE "members";
ALTER TABLE "new_members" RENAME TO "members";
CREATE TABLE "new_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "id_treasurer" INTEGER NOT NULL,
    CONSTRAINT "offers_id_treasurer_fkey" FOREIGN KEY ("id_treasurer") REFERENCES "treasurers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("id", "value") SELECT "id", "value" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
