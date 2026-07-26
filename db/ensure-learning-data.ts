import schemaSql from "../drizzle/0000_previous_madame_hydra.sql?raw";
import seedSql from "../drizzle/0001_seed_jlpt.sql?raw";
import expandedQuestionsSql from "../drizzle/0002_expand_jlpt_questions.sql?raw";
import openVocabularySql from "../drizzle/0003_import_open_jlpt_vocab.sql?raw";

type D1DatabaseLike = {
  batch<T = unknown>(statements: unknown[]): Promise<T>;
  prepare(query: string): D1PreparedStatementLike;
};

type D1PreparedStatementLike = {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = unknown>(): Promise<T | null>;
};

let initialization: Promise<void> | undefined;

function splitStatements(sql: string) {
  return sql
    .split(/--> statement-breakpoint|;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function makeSchemaIdempotent(statement: string) {
  return statement
    .replace(/^CREATE TABLE /, "CREATE TABLE IF NOT EXISTS ")
    .replace(/^CREATE UNIQUE INDEX /, "CREATE UNIQUE INDEX IF NOT EXISTS ")
    .replace(/^CREATE INDEX /, "CREATE INDEX IF NOT EXISTS ");
}

export function ensureLearningData(database: D1DatabaseLike) {
  initialization ??= (async () => {
    const schemaStatements = splitStatements(schemaSql).map((statement) =>
      database.prepare(makeSchemaIdempotent(statement)),
    );
    await database.batch(schemaStatements);

    const seedStatements = splitStatements(seedSql).map((statement) =>
      database.prepare(statement),
    );
    await database.batch(seedStatements);

    const expandedQuestionStatements = splitStatements(expandedQuestionsSql).map(
      (statement) => database.prepare(statement),
    );
    await database.batch(expandedQuestionStatements);

    await database.batch([
      database.prepare(
        `CREATE TABLE IF NOT EXISTS learning_data_migrations (
          name TEXT PRIMARY KEY NOT NULL,
          applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,
      ),
    ]);
    const openVocabularyImported = await database
      .prepare("SELECT name FROM learning_data_migrations WHERE name = ?1")
      .bind("0003_import_open_jlpt_vocab")
      .first<{ name: string }>();
    if (!openVocabularyImported) {
      const openVocabularyStatements = splitStatements(openVocabularySql).map(
        (statement) => database.prepare(statement),
      );
      for (let index = 0; index < openVocabularyStatements.length; index += 10) {
        await database.batch(openVocabularyStatements.slice(index, index + 10));
      }
      await database.batch([
        database.prepare(
          "INSERT OR IGNORE INTO learning_data_migrations (name) VALUES ('0003_import_open_jlpt_vocab')",
        ),
      ]);
    }
  })().catch((error) => {
    initialization = undefined;
    throw error;
  });

  return initialization;
}
