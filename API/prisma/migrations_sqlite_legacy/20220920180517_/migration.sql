/*
  Warnings:

  - You are about to drop the column `id_church` on the `locations` table. All the data in the column will be lost.
  - Added the required column `id_location` to the `churchs` table without a default value. This is not possible if the table is not empty.

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
    "cep" INTEGER NOT NULL
);
INSERT INTO "new_locations" ("cep", "city", "country", "district", "id", "state", "street") SELECT "cep", "city", "country", "district", "id", "state", "street" FROM "locations";
DROP TABLE "locations";
ALTER TABLE "new_locations" RENAME TO "locations";
CREATE TABLE "new_churchs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "creationDate" DATETIME NOT NULL,
    "id_manager" INTEGER NOT NULL,
    "id_location" INTEGER NOT NULL,
    CONSTRAINT "churchs_id_manager_fkey" FOREIGN KEY ("id_manager") REFERENCES "managers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "churchs_id_location_fkey" FOREIGN KEY ("id_location") REFERENCES "locations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_churchs" ("creationDate", "id", "id_manager") SELECT "creationDate", "id", "id_manager" FROM "churchs";
DROP TABLE "churchs";
ALTER TABLE "new_churchs" RENAME TO "churchs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
