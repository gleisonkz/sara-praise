-- CreateTable
CREATE TABLE "_ParticipantToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToRole_AB_unique" ON "_ParticipantToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToRole_B_index" ON "_ParticipantToRole"("B");

-- AddForeignKey
ALTER TABLE "_ParticipantToRole" ADD FOREIGN KEY ("A") REFERENCES "Participant"("participantID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToRole" ADD FOREIGN KEY ("B") REFERENCES "Role"("roleID") ON DELETE CASCADE ON UPDATE CASCADE;
