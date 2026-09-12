/*
  Warnings:

  - You are about to drop the column `alienName` on the `Favorite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,alienId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Made the column `alienId` on table `Favorite` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Favorite_userId_alienName_key";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "alienName",
ALTER COLUMN "alienId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_alienId_key" ON "Favorite"("userId", "alienId");
