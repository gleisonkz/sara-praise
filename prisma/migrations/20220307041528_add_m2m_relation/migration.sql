/*
  Warnings:

  - You are about to drop the column `scaleID` on the `Song` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_scaleID_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "scaleID";

-- CreateTable
CREATE TABLE "_ScaleToSong" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ScaleToSong_AB_unique" ON "_ScaleToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_ScaleToSong_B_index" ON "_ScaleToSong"("B");

-- AddForeignKey
ALTER TABLE "_ScaleToSong" ADD FOREIGN KEY ("A") REFERENCES "Scale"("scaleID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScaleToSong" ADD FOREIGN KEY ("B") REFERENCES "Song"("songID") ON DELETE CASCADE ON UPDATE CASCADE;
