/*
  Warnings:

  - You are about to drop the column `memberID` on the `Role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_memberID_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "memberID";

-- CreateTable
CREATE TABLE "_MemberToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MemberToRole_AB_unique" ON "_MemberToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberToRole_B_index" ON "_MemberToRole"("B");

-- AddForeignKey
ALTER TABLE "_MemberToRole" ADD FOREIGN KEY ("A") REFERENCES "Member"("memberID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberToRole" ADD FOREIGN KEY ("B") REFERENCES "Role"("roleID") ON DELETE CASCADE ON UPDATE CASCADE;
