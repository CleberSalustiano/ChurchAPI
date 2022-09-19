/*
  Warnings:

  - You are about to drop the column `logradouro` on the `locations` table. All the data in the column will be lost.
  - Added the required column `street` to the `locations` table without a default value. This is not possible if the table is not empty.

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
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "locations_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_locations" ("cep", "city", "country", "district", "id", "id_church", "state") SELECT "cep", "city", "country", "district", "id", "id_church", "state" FROM "locations";
DROP TABLE "locations";
ALTER TABLE "new_locations" RENAME TO "locations";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
