-- CreateTable
CREATE TABLE "MinisterSongKey" (
    "songID" INTEGER NOT NULL,
    "ministerID" INTEGER NOT NULL,
    "songKeyID" INTEGER NOT NULL,

    CONSTRAINT "MinisterSongKey_pkey" PRIMARY KEY ("songID","ministerID")
);

-- AddForeignKey
ALTER TABLE "MinisterSongKey" ADD CONSTRAINT "MinisterSongKey_songID_fkey" FOREIGN KEY ("songID") REFERENCES "Song"("songID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisterSongKey" ADD CONSTRAINT "MinisterSongKey_songKeyID_fkey" FOREIGN KEY ("songKeyID") REFERENCES "SongKey"("songKeyID") ON DELETE RESTRICT ON UPDATE CASCADE;
