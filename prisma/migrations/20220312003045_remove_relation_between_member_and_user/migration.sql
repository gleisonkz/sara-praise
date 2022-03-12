-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userID_fkey";

-- DropIndex
DROP INDEX "Member_userID_key";
