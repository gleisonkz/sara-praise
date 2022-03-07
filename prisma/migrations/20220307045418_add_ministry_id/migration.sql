/*
  Warnings:

  - A unique constraint covering the columns `[ministryID]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ministryID` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "ministryID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Member_ministryID_key" ON "Member"("ministryID");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE RESTRICT ON UPDATE CASCADE;
