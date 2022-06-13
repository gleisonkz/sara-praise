/*
  Warnings:

  - You are about to drop the `_ParticipantToRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ParticipantToRole" DROP CONSTRAINT "_ParticipantToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantToRole" DROP CONSTRAINT "_ParticipantToRole_B_fkey";

-- DropTable
DROP TABLE "_ParticipantToRole";

-- CreateTable
CREATE TABLE "ParticipantRole" (
    "participantRoleID" SERIAL NOT NULL,
    "roleID" INTEGER NOT NULL,
    "participantID" INTEGER NOT NULL,

    CONSTRAINT "ParticipantRole_pkey" PRIMARY KEY ("participantRoleID")
);

-- AddForeignKey
ALTER TABLE "ParticipantRole" ADD CONSTRAINT "ParticipantRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("roleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantRole" ADD CONSTRAINT "ParticipantRole_participantID_fkey" FOREIGN KEY ("participantID") REFERENCES "Participant"("participantID") ON DELETE RESTRICT ON UPDATE CASCADE;
