/*
  Warnings:

  - A unique constraint covering the columns `[name,ministryID]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Artist_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_ministryID_key" ON "Artist"("name", "ministryID");
