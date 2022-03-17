-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "ministryID" INTEGER;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE SET NULL ON UPDATE CASCADE;
