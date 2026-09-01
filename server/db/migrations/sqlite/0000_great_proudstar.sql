CREATE TABLE `districts` (
	`district_slug` text PRIMARY KEY NOT NULL,
	`district` text NOT NULL,
	`statename` text NOT NULL,
	`state_slug` text NOT NULL,
	`pincode_count` integer NOT NULL,
	`office_count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pincodes_summary` (
	`pincode` text PRIMARY KEY NOT NULL,
	`district` text NOT NULL,
	`district_slug` text NOT NULL,
	`statename` text NOT NULL,
	`state_slug` text NOT NULL,
	`circle` text NOT NULL,
	`region` text NOT NULL,
	`division` text NOT NULL,
	`office_count` integer NOT NULL,
	`primary_offices` text NOT NULL,
	`latitude` real,
	`longitude` real
);
--> statement-breakpoint
CREATE TABLE `post_offices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pincode` text NOT NULL,
	`officename` text NOT NULL,
	`office_slug` text NOT NULL,
	`officetype` text NOT NULL,
	`delivery` text NOT NULL,
	`district` text NOT NULL,
	`district_slug` text NOT NULL,
	`statename` text NOT NULL,
	`state_slug` text NOT NULL,
	`circle` text NOT NULL,
	`region` text NOT NULL,
	`division` text NOT NULL,
	`latitude` real,
	`longitude` real
);
--> statement-breakpoint
CREATE TABLE `states` (
	`state_slug` text PRIMARY KEY NOT NULL,
	`statename` text NOT NULL,
	`district_count` integer NOT NULL,
	`pincode_count` integer NOT NULL,
	`office_count` integer NOT NULL
);
