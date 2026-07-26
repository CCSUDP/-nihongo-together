CREATE TABLE `attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_email` text NOT NULL,
	`question_id` integer NOT NULL,
	`selected_index` integer NOT NULL,
	`is_correct` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `attempts_user_created_idx` ON `attempts` (`user_email`,`created_at`);--> statement-breakpoint
CREATE INDEX `attempts_question_idx` ON `attempts` (`question_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`level` text NOT NULL,
	`type` text NOT NULL,
	`prompt` text NOT NULL,
	`options_json` text NOT NULL,
	`correct_index` integer NOT NULL,
	`explanation` text NOT NULL,
	`source` text DEFAULT '日语搭子原创' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `questions_level_idx` ON `questions` (`level`);--> statement-breakpoint
CREATE INDEX `questions_level_type_idx` ON `questions` (`level`,`type`);--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`level` text NOT NULL,
	`expression` text NOT NULL,
	`reading` text NOT NULL,
	`meaning_zh` text NOT NULL,
	`meaning_en` text DEFAULT '' NOT NULL,
	`part_of_speech` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'JMdict / Open Anki JLPT' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `vocabulary_level_idx` ON `vocabulary` (`level`);--> statement-breakpoint
CREATE INDEX `vocabulary_expression_idx` ON `vocabulary` (`expression`);--> statement-breakpoint
CREATE UNIQUE INDEX `vocabulary_level_expression_reading_uidx` ON `vocabulary` (`level`,`expression`,`reading`);