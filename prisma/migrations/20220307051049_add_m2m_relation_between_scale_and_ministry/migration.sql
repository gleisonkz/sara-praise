-- CreateTable
CREATE TABLE "_MinistryToScale" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MinistryToScale_AB_unique" ON "_MinistryToScale"("A", "B");

-- CreateIndex
CREATE INDEX "_MinistryToScale_B_index" ON "_MinistryToScale"("B");

-- AddForeignKey
ALTER TABLE "_MinistryToScale" ADD FOREIGN KEY ("A") REFERENCES "Ministry"("ministryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinistryToScale" ADD FOREIGN KEY ("B") REFERENCES "Scale"("scaleID") ON DELETE CASCADE ON UPDATE CASCADE;
