/*
  Warnings:

  - You are about to drop the column `ministryID` on the `Role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_ministryID_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "ministryID";

-- CreateTable
CREATE TABLE "_MinistryToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MinistryToRole_AB_unique" ON "_MinistryToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_MinistryToRole_B_index" ON "_MinistryToRole"("B");

-- AddForeignKey
ALTER TABLE "_MinistryToRole" ADD FOREIGN KEY ("A") REFERENCES "Ministry"("ministryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinistryToRole" ADD FOREIGN KEY ("B") REFERENCES "Role"("roleID") ON DELETE CASCADE ON UPDATE CASCADE;
