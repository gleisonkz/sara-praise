/*
  Warnings:

  - You are about to drop the `_MinistryToScale` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ministryID` to the `Scale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MinistryToScale" DROP CONSTRAINT "_MinistryToScale_A_fkey";

-- DropForeignKey
ALTER TABLE "_MinistryToScale" DROP CONSTRAINT "_MinistryToScale_B_fkey";

-- AlterTable
ALTER TABLE "Scale" ADD COLUMN     "ministryID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_MinistryToScale";

-- AddForeignKey
ALTER TABLE "Scale" ADD CONSTRAINT "Scale_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE RESTRICT ON UPDATE CASCADE;
