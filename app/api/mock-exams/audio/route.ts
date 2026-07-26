import { getExam } from "@/app/data/exam-data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const level = String(url.searchParams.get("level") || "").toUpperCase();
  const variant = Number(url.searchParams.get("variant"));
  const questionId = String(url.searchParams.get("questionId") || "");
  if (!["N5", "N4", "N3", "N2", "N1"].includes(level) || ![1, 2].includes(variant)) {
    return Response.json({ error: "音频参数无效" }, { status: 400 });
  }
  const question = getExam(level, variant).questions.find((item) => item.id === questionId);
  if (!question?.transcript) return Response.json({ error: "听力题不存在" }, { status: 404 });
  return Response.json({ speechText: question.transcript });
}
