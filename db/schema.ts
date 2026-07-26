import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const vocabulary = sqliteTable(
  "vocabulary",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    level: text("level").notNull(),
    expression: text("expression").notNull(),
    reading: text("reading").notNull(),
    meaningZh: text("meaning_zh").notNull(),
    meaningEn: text("meaning_en").notNull().default(""),
    partOfSpeech: text("part_of_speech").notNull().default(""),
    source: text("source").notNull().default("JMdict / Open Anki JLPT"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("vocabulary_level_idx").on(table.level),
    index("vocabulary_expression_idx").on(table.expression),
    uniqueIndex("vocabulary_level_expression_reading_uidx").on(
      table.level,
      table.expression,
      table.reading,
    ),
  ],
);

export const questions = sqliteTable(
  "questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    level: text("level").notNull(),
    type: text("type").notNull(),
    prompt: text("prompt").notNull(),
    optionsJson: text("options_json").notNull(),
    correctIndex: integer("correct_index").notNull(),
    explanation: text("explanation").notNull(),
    source: text("source").notNull().default("日语搭子原创"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("questions_level_idx").on(table.level),
    index("questions_level_type_idx").on(table.level, table.type),
  ],
);

export const attempts = sqliteTable(
  "attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userEmail: text("user_email").notNull(),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id),
    selectedIndex: integer("selected_index").notNull(),
    isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("attempts_user_created_idx").on(table.userEmail, table.createdAt),
    index("attempts_question_idx").on(table.questionId),
  ],
);
