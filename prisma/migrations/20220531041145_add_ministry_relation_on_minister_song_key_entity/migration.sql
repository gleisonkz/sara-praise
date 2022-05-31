/*
  Warnings:

  - Added the required column `ministryID` to the `MinisterSongKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MinisterSongKey" ADD COLUMN     "ministryID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MinisterSongKey" ADD CONSTRAINT "MinisterSongKey_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE RESTRICT ON UPDATE CASCADE;
