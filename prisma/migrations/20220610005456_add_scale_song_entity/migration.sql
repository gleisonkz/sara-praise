/*
  Warnings:

  - You are about to drop the `_ScaleToSong` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ScaleToSong" DROP CONSTRAINT "_ScaleToSong_A_fkey";

-- DropForeignKey
ALTER TABLE "_ScaleToSong" DROP CONSTRAINT "_ScaleToSong_B_fkey";

-- DropTable
DROP TABLE "_ScaleToSong";

-- CreateTable
CREATE TABLE "ScaleSong" (
    "scaleID" INTEGER NOT NULL,
    "songID" INTEGER NOT NULL,
    "artistName" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,
    "ministerSongKey" TEXT NOT NULL,

    CONSTRAINT "ScaleSong_pkey" PRIMARY KEY ("scaleID","songID")
);

-- AddForeignKey
ALTER TABLE "ScaleSong" ADD CONSTRAINT "ScaleSong_scaleID_fkey" FOREIGN KEY ("scaleID") REFERENCES "Scale"("scaleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScaleSong" ADD CONSTRAINT "ScaleSong_songID_fkey" FOREIGN KEY ("songID") REFERENCES "Song"("songID") ON DELETE RESTRICT ON UPDATE CASCADE;
