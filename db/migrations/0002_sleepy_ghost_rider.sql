PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Sessions` (
	`id` integer PRIMARY KEY NOT NULL,
	`session_token` text,
	`session_data` text,
	`expires_at` integer NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Sessions`("id", "session_token", "session_data", "expires_at", "user_id", "created_at", "updated_at") SELECT "id", "session_token", "session_data", "expires_at", "user_id", "created_at", "updated_at" FROM `Sessions`;--> statement-breakpoint
DROP TABLE `Sessions`;--> statement-breakpoint
ALTER TABLE `__new_Sessions` RENAME TO `Sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;