import { env } from "cloudflare:workers";
import { ensureLearningData } from "@/db/ensure-learning-data";

const LEVELS = new Set(["N1", "N2", "N3", "N4", "N5"]);

export async function GET(request: Request) {
  await ensureLearningData(env.DB);

  const url = new URL(request.url);
  const level = (url.searchParams.get("level") || "N5").toUpperCase();
  const query = (url.searchParams.get("q") || "").trim().slice(0, 40);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

  if (!LEVELS.has(level)) {
    return Response.json({ error: "不支持的 JLPT 等级" }, { status: 400 });
  }

  const limit = 20;
  const offset = (page - 1) * limit;
  const pattern = `%${query}%`;

  const [rows, totalRow] = await env.DB.batch([
    env.DB.prepare(
      `SELECT id, level, expression, reading, meaning_zh AS meaningZh,
              meaning_en AS meaningEn, part_of_speech AS partOfSpeech, source
       FROM vocabulary
       WHERE level = ?1
         AND (?2 = '' OR expression LIKE ?3 OR reading LIKE ?3 OR meaning_zh LIKE ?3)
       ORDER BY id
       LIMIT ?4 OFFSET ?5`,
    ).bind(level, query, pattern, limit, offset),
    env.DB.prepare(
      `SELECT COUNT(*) AS total
       FROM vocabulary
       WHERE level = ?1
         AND (?2 = '' OR expression LIKE ?3 OR reading LIKE ?3 OR meaning_zh LIKE ?3)`,
    ).bind(level, query, pattern),
  ]);

  const total = Number(totalRow.results[0]?.total || 0);
  return Response.json({
    words: rows.results,
    pagination: {
      page,
      pageSize: limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
    levelNote:
      level === "N5" || level === "N4"
        ? "开放数据将 N5 与 N4 作为综合参考带；这里保留为两个复习入口，不代表官方等级边界。"
        : "JLPT 等级来自开放 10K 学习资料的参考分级，并非官方词表。",
  });
}
