/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Stall` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Stall` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `stall` DROP FOREIGN KEY `Stall_id_fkey`;

-- AlterTable
ALTER TABLE `stall` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Registration` (
    `userId` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile` BIGINT NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Registration_email_key`(`email`),
    UNIQUE INDEX `Registration_firstname_lastname_key`(`firstname`, `lastname`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Stall_userId_key` ON `Stall`(`userId`);

-- AddForeignKey
ALTER TABLE `Stall` ADD CONSTRAINT `Stall_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Registration`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
