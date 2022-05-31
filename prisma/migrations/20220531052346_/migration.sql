/*
  Warnings:

  - The primary key for the `MinisterSongKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ministerID` on the `MinisterSongKey` table. All the data in the column will be lost.
  - Added the required column `memberID` to the `MinisterSongKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MinisterSongKey" DROP CONSTRAINT "MinisterSongKey_pkey",
DROP COLUMN "ministerID",
ADD COLUMN     "memberID" INTEGER NOT NULL,
ADD CONSTRAINT "MinisterSongKey_pkey" PRIMARY KEY ("songID", "memberID");

-- AddForeignKey
ALTER TABLE "MinisterSongKey" ADD CONSTRAINT "MinisterSongKey_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("memberID") ON DELETE RESTRICT ON UPDATE CASCADE;
