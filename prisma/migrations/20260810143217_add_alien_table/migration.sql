-- CreateTable
CREATE TABLE "Alien" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "planet" TEXT NOT NULL,
    "abilities" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "transform" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "firstAppearance" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alien_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alien_sourceId_key" ON "Alien"("sourceId");

-- CreateIndex
CREATE INDEX "Alien_series_idx" ON "Alien"("series");

-- CreateIndex
CREATE INDEX "Alien_name_idx" ON "Alien"("name");
