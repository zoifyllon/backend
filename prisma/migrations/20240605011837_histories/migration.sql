-- CreateTable
CREATE TABLE `histories` (
    `history_id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_url` VARCHAR(255) NOT NULL,
    `percentage` INTEGER NOT NULL,
    `disease` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `histories` ADD CONSTRAINT `histories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
