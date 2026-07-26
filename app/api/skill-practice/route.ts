import { getExam } from "@/app/data/exam-data";

const levels = new Set(["N5", "N4", "N3", "N2", "N1"]);
const modes = new Set(["reading", "listening"]);

function resolveQuestion(level: string, mode: string, variant: number) {
  const section = mode === "reading" ? "阅读" : "听力";
  return getExam(level, variant).questions.find((item) => item.section === section);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const level = String(url.searchParams.get("level") || "N5").toUpperCase();
  const mode = String(url.searchParams.get("mode") || "reading");
  const variant = Number(url.searchParams.get("variant") || 1) === 2 ? 2 : 1;
  if (!levels.has(level) || !modes.has(mode)) return Response.json({ error: "练习参数无效" }, { status: 400 });
  const question = resolveQuestion(level, mode, variant);
  if (!question) return Response.json({ error: "练习不存在" }, { status: 404 });
  return Response.json({
    question: {
      id: question.id,
      section: question.section,
      type: question.type,
      prompt: question.prompt,
      options: question.options,
      passage: question.passage,
      hasAudio: Boolean(question.transcript),
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { level?: string; mode?: string; variant?: number; selectedIndex?: number };
  const level = String(body.level || "").toUpperCase();
  const mode = String(body.mode || "");
  const variant = Number(body.variant) === 2 ? 2 : 1;
  const selectedIndex = Number(body.selectedIndex);
  if (!levels.has(level) || !modes.has(mode) || !Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 3) {
    return Response.json({ error: "答题数据无效" }, { status: 400 });
  }
  const question = resolveQuestion(level, mode, variant);
  if (!question) return Response.json({ error: "练习不存在" }, { status: 404 });
  return Response.json({
    isCorrect: selectedIndex === question.correctIndex,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    transcript: question.transcript,
  });
}
