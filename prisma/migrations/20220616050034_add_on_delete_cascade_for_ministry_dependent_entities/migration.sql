-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_ministryID_fkey";

-- DropForeignKey
ALTER TABLE "MinisterSongKey" DROP CONSTRAINT "MinisterSongKey_ministryID_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_ministryID_fkey";

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisterSongKey" ADD CONSTRAINT "MinisterSongKey_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE CASCADE ON UPDATE CASCADE;
