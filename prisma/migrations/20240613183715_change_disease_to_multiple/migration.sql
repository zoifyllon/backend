/*
  Warnings:

  - You are about to drop the column `disease` on the `histories` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `histories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `histories` DROP COLUMN `disease`,
    DROP COLUMN `percentage`;

-- CreateTable
CREATE TABLE `diseases` (
    `disease_id` INTEGER NOT NULL AUTO_INCREMENT,
    `history_id` INTEGER NOT NULL,
    `disease` VARCHAR(255) NOT NULL,
    `percentage` INTEGER NOT NULL,

    PRIMARY KEY (`disease_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diseases` ADD CONSTRAINT `diseases_history_id_fkey` FOREIGN KEY (`history_id`) REFERENCES `histories`(`history_id`) ON DELETE CASCADE ON UPDATE CASCADE;
