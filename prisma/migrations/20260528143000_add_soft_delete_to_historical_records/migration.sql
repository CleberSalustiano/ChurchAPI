ALTER TABLE "cults"
ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "costs"
ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "offers"
ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "special_offers"
ADD COLUMN "deletedAt" TIMESTAMP(3);

ALTER TABLE "tithes"
ADD COLUMN "deletedAt" TIMESTAMP(3);
