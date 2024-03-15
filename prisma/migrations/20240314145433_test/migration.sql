/*
  Warnings:

  - The primary key for the `stall` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `stall` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `stall` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userId` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `stall` DROP FOREIGN KEY `Stall_userId_fkey`;

-- AlterTable
ALTER TABLE `stall` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- AddForeignKey
ALTER TABLE `Stall` ADD CONSTRAINT `Stall_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
