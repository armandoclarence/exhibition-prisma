-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mobile` BIGINT NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `user_type_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stall` (
    `id` VARCHAR(191) NOT NULL,
    `stallName` VARCHAR(191) NOT NULL,
    `stallDescription` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NOT NULL,
    `videoUrl` VARCHAR(191) NOT NULL,
    `brochureUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stall` ADD CONSTRAINT `Stall_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
