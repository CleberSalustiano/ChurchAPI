/*
  Warnings:

  - You are about to drop the column `date` on the `churchs` table. All the data in the column will be lost.
  - Added the required column `id_church` to the `special_offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creationDate` to the `churchs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_locations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "street" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,
    "id_church" INTEGER,
    CONSTRAINT "locations_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_locations" ("cep", "city", "country", "district", "id", "id_church", "state", "street") SELECT "cep", "city", "country", "district", "id", "id_church", "state", "street" FROM "locations";
DROP TABLE "locations";
ALTER TABLE "new_locations" RENAME TO "locations";
CREATE TABLE "new_special_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "id_offer" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "special_offers_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "special_offers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_special_offers" ("date", "id", "id_offer", "reason") SELECT "date", "id", "id_offer", "reason" FROM "special_offers";
DROP TABLE "special_offers";
ALTER TABLE "new_special_offers" RENAME TO "special_offers";
CREATE TABLE "new_churchs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "creationDate" DATETIME NOT NULL,
    "id_manager" INTEGER NOT NULL,
    CONSTRAINT "churchs_id_manager_fkey" FOREIGN KEY ("id_manager") REFERENCES "managers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_churchs" ("id", "id_manager") SELECT "id", "id_manager" FROM "churchs";
DROP TABLE "churchs";
ALTER TABLE "new_churchs" RENAME TO "churchs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
