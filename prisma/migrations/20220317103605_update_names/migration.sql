/*
  Warnings:

  - You are about to drop the column `scaleScaleID` on the `Participant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_scaleScaleID_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "scaleScaleID";

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_scaleID_fkey" FOREIGN KEY ("scaleID") REFERENCES "Scale"("scaleID") ON DELETE RESTRICT ON UPDATE CASCADE;
