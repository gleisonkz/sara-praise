-- AlterTable
ALTER TABLE "ScaleSong" ADD COLUMN     "memberID" INTEGER;

-- AddForeignKey
ALTER TABLE "ScaleSong" ADD CONSTRAINT "ScaleSong_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("memberID") ON DELETE SET NULL ON UPDATE CASCADE;
