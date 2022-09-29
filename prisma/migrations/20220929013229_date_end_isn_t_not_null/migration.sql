-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_managers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    "dateStart" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEnd" DATETIME,
    CONSTRAINT "managers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "managers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_managers" ("dateEnd", "dateStart", "id", "id_church", "id_member") SELECT "dateEnd", "dateStart", "id", "id_church", "id_member" FROM "managers";
DROP TABLE "managers";
ALTER TABLE "new_managers" RENAME TO "managers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
