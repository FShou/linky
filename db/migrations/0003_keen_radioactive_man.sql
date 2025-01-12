CREATE TABLE `Links` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Link' NOT NULL,
	`description` text,
	`slug` text NOT NULL,
	`link` text NOT NULL,
	`qr_code` text,
	`banner` text,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Links_slug_unique` ON `Links` (`slug`);