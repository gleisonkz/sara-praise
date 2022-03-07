/*
  Warnings:

  - Added the required column `ministryID` to the `SongKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SongKey" ADD COLUMN     "ministryID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SongKey" ADD CONSTRAINT "SongKey_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE RESTRICT ON UPDATE CASCADE;
