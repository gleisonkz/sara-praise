/*
  Warnings:

  - The primary key for the `ScaleSong` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ScaleSong" DROP CONSTRAINT "ScaleSong_pkey",
ADD COLUMN     "scaleSongID" SERIAL NOT NULL,
ADD CONSTRAINT "ScaleSong_pkey" PRIMARY KEY ("scaleSongID");
