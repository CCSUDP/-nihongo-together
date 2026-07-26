import { readFileSync, writeFileSync } from "node:fs";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  throw new Error("usage: node scripts/generate-open-vocab-seed.mjs <syllabus.json> <output.sql>");
}

const syllabus = JSON.parse(readFileSync(inputPath, "utf8"));
const rows = [];
const seen = new Set();

function sql(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function collectItems(chapter) {
  const items = [];
  for (const lesson of chapter.children ?? []) {
    for (const child of lesson.children ?? []) {
      if (child.type === "vocabularySet") items.push(...(child.children ?? []));
    }
  }
  return items.filter((item) => item.type === "vocabularyItem");
}

for (const chapter of syllabus.children ?? []) {
  const sourceLevel = chapter.id.replace("chapter-", "").toUpperCase();
  const levels = sourceLevel === "N5-N4" ? ["N5", "N4"] : [sourceLevel];
  for (const item of collectItems(chapter)) {
    for (const level of levels) {
      const expression = String(item.word || item.value || "").trim();
      const reading = String(item.transcription || expression).trim();
      if (!expression || !reading) continue;
      const key = `${level}\0${expression}\0${reading}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push([
        level,
        expression,
        reading,
        String(item.translation || item.definition || "释义待补充").trim(),
        "",
        String(item.partOfSpeech || "未分类").trim(),
        sourceLevel === "N5-N4"
          ? "Egg Rolls JLPT 10K · N5–N4 综合"
          : `Egg Rolls JLPT 10K · ${level}`,
      ]);
    }
  }
}

const statements = [];
const batchSize = 80;
for (let index = 0; index < rows.length; index += batchSize) {
  const values = rows
    .slice(index, index + batchSize)
    .map((row) => `(${row.map(sql).join(",")})`)
    .join(",\n");
  statements.push(
    `INSERT OR IGNORE INTO vocabulary\n(level, expression, reading, meaning_zh, meaning_en, part_of_speech, source)\nVALUES\n${values};`,
  );
}

writeFileSync(
  outputPath,
  `-- Generated from @polyglot-bundles/ja-jlpt-syllabi@0.1.5 (MIT).\n-- Source deck: Egg Rolls JLPT 10K v3. N5 and N4 are supplied as a combined reference band.\n${statements.join("\n--> statement-breakpoint\n")}\n`,
);

const counts = rows.reduce((result, row) => {
  result[row[0]] = (result[row[0]] || 0) + 1;
  return result;
}, {});
console.log(JSON.stringify({ rows: rows.length, statements: statements.length, counts }));
