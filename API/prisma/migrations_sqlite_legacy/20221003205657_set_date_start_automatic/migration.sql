-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_treasurers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "id_member" INTEGER NOT NULL,
    CONSTRAINT "treasurers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_treasurers" ("endDate", "id", "id_member", "startDate") SELECT "endDate", "id", "id_member", "startDate" FROM "treasurers";
DROP TABLE "treasurers";
ALTER TABLE "new_treasurers" RENAME TO "treasurers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
