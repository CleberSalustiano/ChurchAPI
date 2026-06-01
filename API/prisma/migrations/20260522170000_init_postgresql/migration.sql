-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "batism_date" TIMESTAMP(3) NOT NULL,
    "titleChurch" TEXT NOT NULL,
    "cpf" BIGINT NOT NULL,
    "rg" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "foto" TEXT,
    "id_church" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managers" (
    "id" SERIAL NOT NULL,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treasurers" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "id_member" INTEGER NOT NULL,

    CONSTRAINT "treasurers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "id_treasurer" INTEGER NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_offers" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "id_offer" INTEGER NOT NULL,
    "id_member" INTEGER NOT NULL,
    "id_church" INTEGER NOT NULL,

    CONSTRAINT "special_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tethes" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "id_special_offer" INTEGER NOT NULL,

    CONSTRAINT "tethes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "churchs" (
    "id" SERIAL NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "id_location" INTEGER NOT NULL,

    CONSTRAINT "churchs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cults" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "theme" TEXT NOT NULL,
    "id_offer" INTEGER,
    "id_church" INTEGER NOT NULL,

    CONSTRAINT "cults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costs" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "id_church" INTEGER NOT NULL,

    CONSTRAINT "costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CultOffer" (
    "id" SERIAL NOT NULL,
    "id_cult" INTEGER NOT NULL,
    "id_offer" INTEGER NOT NULL,

    CONSTRAINT "CultOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "members_cpf_key" ON "members"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "members_id_user_key" ON "members"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "locations_cep_key" ON "locations"("cep");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treasurers" ADD CONSTRAINT "treasurers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_id_treasurer_fkey" FOREIGN KEY ("id_treasurer") REFERENCES "treasurers"("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;

-- AddForeignKey
ALTER TABLE "special_offers" ADD CONSTRAINT "special_offers_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "special_offers" ADD CONSTRAINT "special_offers_id_member_fkey" FOREIGN KEY ("id_member") REFERENCES "members"("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;

-- AddForeignKey
ALTER TABLE "special_offers" ADD CONSTRAINT "special_offers_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs"("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;

-- AddForeignKey
ALTER TABLE "tethes" ADD CONSTRAINT "tethes_id_special_offer_fkey" FOREIGN KEY ("id_special_offer") REFERENCES "special_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "churchs" ADD CONSTRAINT "churchs_id_location_fkey" FOREIGN KEY ("id_location") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cults" ADD CONSTRAINT "cults_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers"("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;

-- AddForeignKey
ALTER TABLE "cults" ADD CONSTRAINT "cults_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs"("id") ON DELETE SET DEFAULT ON UPDATE SET DEFAULT;

-- AddForeignKey
ALTER TABLE "costs" ADD CONSTRAINT "costs_id_church_fkey" FOREIGN KEY ("id_church") REFERENCES "churchs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CultOffer" ADD CONSTRAINT "CultOffer_id_cult_fkey" FOREIGN KEY ("id_cult") REFERENCES "cults"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CultOffer" ADD CONSTRAINT "CultOffer_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

