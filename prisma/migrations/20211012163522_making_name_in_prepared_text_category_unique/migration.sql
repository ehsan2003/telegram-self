/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PreparedTextCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PreparedTextCategory_name_key" ON "PreparedTextCategory"("name");
