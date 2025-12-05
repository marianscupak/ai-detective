ALTER TABLE `chat_message` ADD `reasoning` text;--> statement-breakpoint
ALTER TABLE `chat_message` DROP COLUMN `progress`;--> statement-breakpoint
ALTER TABLE `game_session` ADD `progress` real;