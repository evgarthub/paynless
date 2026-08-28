CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`google_id` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);--> statement-breakpoint
INSERT INTO `users` (`id`, `email`, `name`, `created_at`) VALUES ('migration_system', 'system@paynless.local', 'System', unixepoch());--> statement-breakpoint
ALTER TABLE `bills` ADD `user_id` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `utilities` ADD `user_id` text REFERENCES users(id);--> statement-breakpoint
UPDATE `bills` SET `user_id` = 'migration_system';--> statement-breakpoint
UPDATE `utilities` SET `user_id` = 'migration_system';
