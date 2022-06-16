-- DropForeignKey
ALTER TABLE "Scale" DROP CONSTRAINT "Scale_ministryID_fkey";

-- AddForeignKey
ALTER TABLE "Scale" ADD CONSTRAINT "Scale_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE CASCADE ON UPDATE CASCADE;
