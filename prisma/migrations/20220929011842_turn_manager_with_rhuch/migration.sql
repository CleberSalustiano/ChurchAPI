/*
  Warnings:

  - You are about to drop the column `id_manager` on the `churchs` table. All the data in the column will be lost.
  - Added the required column `id_church` to the `managers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_managers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "managers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "managers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_managers" ("id", "id_member") SELECT "id", "id_member" FROM "managers";
DROP TABLE "managers";
ALTER TABLE "new_managers" RENAME TO "managers";
CREATE TABLE "new_churchs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "creationDate" DATETIME NOT NULL,
    "id_location" INTEGER NOT NULL,
    CONSTRAINT "churchs_id_location_fkey" FOREIGN KEY ("id_location") REFERENCES "locations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_churchs" ("creationDate", "id", "id_location") SELECT "creationDate", "id", "id_location" FROM "churchs";
DROP TABLE "churchs";
ALTER TABLE "new_churchs" RENAME TO "churchs";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
