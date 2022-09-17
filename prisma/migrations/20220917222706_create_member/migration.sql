-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "batism_date" DATETIME NOT NULL,
    "titleChurch" TEXT NOT NULL,
    "cpf" BIGINT NOT NULL,
    "rg" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "foto" TEXT
);
