-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "alienId" INTEGER;

-- CreateIndex
CREATE INDEX "Favorite_alienId_idx" ON "Favorite"("alienId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_alienId_fkey" FOREIGN KEY ("alienId") REFERENCES "Alien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
