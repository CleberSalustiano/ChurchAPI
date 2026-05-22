ALTER TABLE "tethes" RENAME TO "tithes";

ALTER TABLE "tithes" RENAME CONSTRAINT "tethes_pkey" TO "tithes_pkey";
ALTER TABLE "tithes" RENAME CONSTRAINT "tethes_id_special_offer_fkey" TO "tithes_id_special_offer_fkey";

ALTER SEQUENCE IF EXISTS "tethes_id_seq" RENAME TO "tithes_id_seq";
ALTER TABLE "tithes" ALTER COLUMN "id" SET DEFAULT nextval('"tithes_id_seq"');
