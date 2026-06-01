ALTER TABLE "cults"
ADD COLUMN "recurrenceGroup" TEXT,
ADD COLUMN "recurrencePattern" TEXT,
ADD COLUMN "recurrenceUntil" TIMESTAMP(3);
