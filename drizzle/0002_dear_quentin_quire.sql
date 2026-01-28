CREATE TABLE `admin_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(64) NOT NULL,
	`settingValue` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `tool_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`toolId` varchar(128) NOT NULL,
	`toolName` varchar(256) NOT NULL,
	`toolUrl` varchar(512),
	`category` varchar(128),
	`ipHash` varchar(64) NOT NULL,
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tool_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tool_submissions` ADD `aiValidated` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tool_submissions` ADD `aiScore` int;--> statement-breakpoint
ALTER TABLE `tool_submissions` ADD `aiNotes` text;