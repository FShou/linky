CREATE TABLE `Pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Pages' NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Pages_slug_unique` ON `Pages` (`slug`);