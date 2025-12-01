CREATE TABLE `case_character` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`role` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `detective_case`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `case_evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`description` text NOT NULL,
	`location` text NOT NULL,
	`significance` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `detective_case`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chat_message` (
	`id` text PRIMARY KEY NOT NULL,
	`game_session_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`game_session_id`) REFERENCES `game_session`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chat_message_session_idx` ON `chat_message` (`game_session_id`);--> statement-breakpoint
CREATE TABLE `detective_case` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`title` text NOT NULL,
	`theme` text NOT NULL,
	`summary` text NOT NULL,
	`location` text NOT NULL,
	`date_time` text NOT NULL,
	`incident` text NOT NULL,
	`culprit_character_id` text NOT NULL,
	`motive` text NOT NULL,
	`method` text NOT NULL,
	`notes_for_ai` text,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`case_id` text NOT NULL,
	`status` text NOT NULL,
	`started_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`case_id`) REFERENCES `detective_case`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `game_session_user_case_idx` ON `game_session` (`user_id`,`case_id`);