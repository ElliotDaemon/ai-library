CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ipHash` varchar(64) NOT NULL,
	`toolId` varchar(128) NOT NULL,
	`toolName` varchar(256) NOT NULL,
	`toolUrl` varchar(512),
	`category` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tool_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`toolName` varchar(256) NOT NULL,
	`toolUrl` varchar(512) NOT NULL,
	`category` varchar(128),
	`description` text,
	`submitterEmail` varchar(320),
	`ipHash` varchar(64) NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`isHiddenGem` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tool_submissions_id` PRIMARY KEY(`id`)
);
