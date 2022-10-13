/*
  Warnings:

  - You are about to drop the column `dateEnd` on the `managers` table. All the data in the column will be lost.
  - You are about to drop the column `dateStart` on the `managers` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_managers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    CONSTRAINT "managers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "managers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_managers" ("id", "id_church", "id_member") SELECT "id", "id_church", "id_member" FROM "managers";
DROP TABLE "managers";
ALTER TABLE "new_managers" RENAME TO "managers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
