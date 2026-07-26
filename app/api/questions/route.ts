import { env } from "cloudflare:workers";
import { ensureLearningData } from "@/db/ensure-learning-data";

const LEVELS = new Set(["N1", "N2", "N3", "N4", "N5"]);

export async function GET(request: Request) {
  await ensureLearningData(env.DB);

  const url = new URL(request.url);
  const level = (url.searchParams.get("level") || "N5").toUpperCase();

  if (!LEVELS.has(level)) {
    return Response.json({ error: "不支持的 JLPT 等级" }, { status: 400 });
  }

  const result = await env.DB.prepare(
    `SELECT id, level, type, prompt, options_json AS optionsJson,
            correct_index AS correctIndex, explanation, source
     FROM questions
     WHERE level = ?1
     ORDER BY RANDOM()
     LIMIT 10`,
  )
    .bind(level)
    .all();

  const questions = result.results.map((row) => ({
    ...row,
    options: JSON.parse(String(row.optionsJson)),
    optionsJson: undefined,
  }));

  return Response.json({
    questions,
    contentLabel: "JLPT 风格练习 · 本站原创",
  });
}
