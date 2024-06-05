-- DropForeignKey
ALTER TABLE `histories` DROP FOREIGN KEY `histories_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `histories` ADD CONSTRAINT `histories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
