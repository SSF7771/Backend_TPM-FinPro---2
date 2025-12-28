-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teamName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isBinusian` BOOLEAN NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Team_teamName_key`(`teamName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leader` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `whatsappNumber` VARCHAR(191) NOT NULL,
    `lineId` VARCHAR(191) NOT NULL,
    `githubId` VARCHAR(191) NOT NULL,
    `birthPlace` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `cvUrl` VARCHAR(191) NOT NULL,
    `idCardUrl` VARCHAR(191) NOT NULL,
    `teamId` INTEGER NOT NULL,

    UNIQUE INDEX `Leader_email_key`(`email`),
    UNIQUE INDEX `Leader_whatsappNumber_key`(`whatsappNumber`),
    UNIQUE INDEX `Leader_lineId_key`(`lineId`),
    UNIQUE INDEX `Leader_teamId_key`(`teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Leader` ADD CONSTRAINT `Leader_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
