-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_ministryID_fkey";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE CASCADE ON UPDATE CASCADE;
