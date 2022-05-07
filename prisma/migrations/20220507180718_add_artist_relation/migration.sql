/*
  Warnings:

  - Added the required column `ministryID` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "ministryID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE RESTRICT ON UPDATE CASCADE;
