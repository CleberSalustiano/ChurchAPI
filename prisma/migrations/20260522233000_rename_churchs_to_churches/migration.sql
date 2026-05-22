ALTER TABLE "churchs" RENAME TO "churches";

ALTER TABLE "churches" RENAME CONSTRAINT "churchs_pkey" TO "churches_pkey";
ALTER TABLE "churches" RENAME CONSTRAINT "churchs_id_location_fkey" TO "churches_id_location_fkey";
ALTER TABLE "churches" RENAME CONSTRAINT "churchs_parentChurchId_fkey" TO "churches_parentChurchId_fkey";

ALTER SEQUENCE IF EXISTS "churchs_id_seq" RENAME TO "churches_id_seq";
ALTER TABLE "churches" ALTER COLUMN "id" SET DEFAULT nextval('"churches_id_seq"');
