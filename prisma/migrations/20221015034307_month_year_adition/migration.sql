/*
  Warnings:

  - You are about to drop the column `salaryValue` on the `tethes` table. All the data in the column will be lost.
  - Added the required column `month` to the `tethes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `tethes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tethes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "id_special_offer" INTEGER NOT NULL,
    CONSTRAINT "tethes_id_special_offer_fkey" FOREIGN KEY ("id_special_offer") REFERENCES "special_offers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tethes" ("id", "id_special_offer") SELECT "id", "id_special_offer" FROM "tethes";
DROP TABLE "tethes";
ALTER TABLE "new_tethes" RENAME TO "tethes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
