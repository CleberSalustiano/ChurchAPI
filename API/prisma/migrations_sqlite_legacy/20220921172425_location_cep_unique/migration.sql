/*
  Warnings:

  - A unique constraint covering the columns `[cep]` on the table `locations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "locations_cep_key" ON "locations"("cep");
