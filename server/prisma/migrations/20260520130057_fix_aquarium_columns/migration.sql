/*
  Warnings:

  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "water_type" AS ENUM ('marine', 'freshwater');

-- DropForeignKey
ALTER TABLE "verification_token" DROP CONSTRAINT "verification_token_user_id_fkey";

-- AlterTable
ALTER TABLE "aquarium" ADD COLUMN     "aquarium_type" "water_type",
ADD COLUMN     "liters" INTEGER;

-- DropTable
DROP TABLE "verification_token";
