-- CreateTable
CREATE TABLE "SongKey" (
    "songKeyID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SongKey_pkey" PRIMARY KEY ("songKeyID")
);

-- CreateTable
CREATE TABLE "Scale" (
    "scaleID" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("scaleID")
);

-- CreateTable
CREATE TABLE "Role" (
    "roleID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "memberID" INTEGER,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleID")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permissionID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "memberID" INTEGER,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permissionID")
);

-- CreateTable
CREATE TABLE "Member" (
    "memberID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("memberID")
);

-- CreateTable
CREATE TABLE "Participant" (
    "participantID" SERIAL NOT NULL,
    "memberID" INTEGER NOT NULL,
    "scaleID" INTEGER NOT NULL,
    "scaleScaleID" INTEGER,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("participantID")
);

-- CreateTable
CREATE TABLE "Ministry" (
    "ministryID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerID" INTEGER NOT NULL,

    CONSTRAINT "Ministry_pkey" PRIMARY KEY ("ministryID")
);

-- CreateTable
CREATE TABLE "Song" (
    "songID" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT[],
    "observations" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "lyricUrl" TEXT NOT NULL,
    "chordsUrl" TEXT NOT NULL,
    "artistID" INTEGER NOT NULL,
    "keyID" INTEGER NOT NULL,
    "ministryID" INTEGER NOT NULL,
    "scaleID" INTEGER,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("songID")
);

-- CreateTable
CREATE TABLE "Artist" (
    "artistID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("artistID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_userID_key" ON "Member"("userID");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("memberID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("memberID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_scaleScaleID_fkey" FOREIGN KEY ("scaleScaleID") REFERENCES "Scale"("scaleID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("memberID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ministry" ADD CONSTRAINT "Ministry_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_keyID_fkey" FOREIGN KEY ("keyID") REFERENCES "SongKey"("songKeyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_scaleID_fkey" FOREIGN KEY ("scaleID") REFERENCES "Scale"("scaleID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_ministryID_fkey" FOREIGN KEY ("ministryID") REFERENCES "Ministry"("ministryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistID_fkey" FOREIGN KEY ("artistID") REFERENCES "Artist"("artistID") ON DELETE RESTRICT ON UPDATE CASCADE;
