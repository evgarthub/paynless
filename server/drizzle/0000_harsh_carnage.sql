CREATE TABLE `bill_items` (
	`id` text PRIMARY KEY NOT NULL,
	`bill_id` text NOT NULL,
	`utility_id` text NOT NULL,
	`input_type` text NOT NULL,
	`previous_reading` real,
	`current_reading` real,
	`consumption` real,
	`applied_rate` real NOT NULL,
	`total_cost` real NOT NULL,
	`is_estimated` integer DEFAULT false,
	FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`utility_id`) REFERENCES `utilities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bills` (
	`id` text PRIMARY KEY NOT NULL,
	`billing_period` text NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'UNPAID',
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `tariff_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`utility_id` text NOT NULL,
	`rate_per_unit` real DEFAULT 0,
	`fixed_fee` real DEFAULT 0,
	`reference_url` text,
	`effective_from` integer NOT NULL,
	FOREIGN KEY (`utility_id`) REFERENCES `utilities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `utilities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`unit` text,
	`ha_entity_id` text,
	`created_at` integer
);
