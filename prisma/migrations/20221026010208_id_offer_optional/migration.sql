-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "id_treasurer" INTEGER NOT NULL,
    CONSTRAINT "offers_id_treasurer_fkey" FOREIGN KEY ("id_treasurer") REFERENCES "treasurers" ("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT
);
INSERT INTO "new_offers" ("id", "id_treasurer", "value") SELECT "id", "id_treasurer", "value" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE TABLE "new_tethes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "id_special_offer" INTEGER NOT NULL,
    CONSTRAINT "tethes_id_special_offer_fkey" FOREIGN KEY ("id_special_offer") REFERENCES "special_offers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tethes" ("id", "id_special_offer", "month", "year") SELECT "id", "id_special_offer", "month", "year" FROM "tethes";
DROP TABLE "tethes";
ALTER TABLE "new_tethes" RENAME TO "tethes";
CREATE TABLE "new_special_offers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reason" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "id_offer" INTEGER NOT NULL,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "special_offers_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "special_offers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members" ("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT,
    CONSTRAINT "special_offers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT
);
INSERT INTO "new_special_offers" ("date", "id", "id_church", "id_member", "id_offer", "reason") SELECT "date", "id", "id_church", "id_member", "id_offer", "reason" FROM "special_offers";
DROP TABLE "special_offers";
ALTER TABLE "new_special_offers" RENAME TO "special_offers";
CREATE TABLE "new_cults" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "theme" TEXT NOT NULL,
    "id_offer" INTEGER,
    "id_church" INTEGER NOT NULL,
    CONSTRAINT "cults_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers" ("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT,
    CONSTRAINT "cults_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs" ("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT
);
INSERT INTO "new_cults" ("date", "id", "id_church", "id_offer", "theme") SELECT "date", "id", "id_church", "id_offer", "theme" FROM "cults";
DROP TABLE "cults";
ALTER TABLE "new_cults" RENAME TO "cults";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
