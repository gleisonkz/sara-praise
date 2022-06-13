-- DropForeignKey
ALTER TABLE "ParticipantRole" DROP CONSTRAINT "ParticipantRole_participantID_fkey";

-- AddForeignKey
ALTER TABLE "ParticipantRole" ADD CONSTRAINT "ParticipantRole_participantID_fkey" FOREIGN KEY ("participantID") REFERENCES "Participant"("participantID") ON DELETE CASCADE ON UPDATE CASCADE;
