import { env } from "cloudflare:workers";
import { ensureLearningData } from "@/db/ensure-learning-data";

export async function POST(request: Request) {
  await ensureLearningData(env.DB);

  const payload = (await request.json()) as {
    questionId?: number;
    selectedIndex?: number;
  };
  const questionId = Number(payload.questionId);
  const selectedIndex = Number(payload.selectedIndex);

  if (
    !Number.isInteger(questionId) ||
    questionId < 1 ||
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex > 3
  ) {
    return Response.json({ error: "答题数据无效" }, { status: 400 });
  }

  const question = await env.DB.prepare(
    "SELECT correct_index AS correctIndex FROM questions WHERE id = ?1",
  )
    .bind(questionId)
    .first<{ correctIndex: number }>();

  if (!question) {
    return Response.json({ error: "题目不存在" }, { status: 404 });
  }

  const isCorrect = selectedIndex === Number(question.correctIndex);
  const email = request.headers.get("oai-authenticated-user-email");

  if (email) {
    await env.DB.prepare(
      `INSERT INTO attempts (user_email, question_id, selected_index, is_correct)
       VALUES (?1, ?2, ?3, ?4)`,
    )
      .bind(email, questionId, selectedIndex, isCorrect ? 1 : 0)
      .run();
  }

  return Response.json({ isCorrect, saved: Boolean(email) });
}
