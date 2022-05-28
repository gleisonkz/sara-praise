/*
  Warnings:

  - You are about to drop the column `ministryID` on the `SongKey` table. All the data in the column will be lost.
  - Added the required column `notation` to the `SongKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SongKey" DROP CONSTRAINT "SongKey_ministryID_fkey";

-- AlterTable
ALTER TABLE "SongKey" DROP COLUMN "ministryID",
ADD COLUMN     "notation" TEXT NOT NULL;
