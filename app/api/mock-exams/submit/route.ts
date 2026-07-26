import { getExam } from "@/app/data/exam-data";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    level?: string;
    variant?: number;
    answers?: Record<string, number>;
  };
  const level = String(body.level || "").toUpperCase();
  const variant = Number(body.variant);
  if (!["N5", "N4", "N3", "N2", "N1"].includes(level) || ![1, 2].includes(variant) || !body.answers) {
    return Response.json({ error: "交卷数据无效" }, { status: 400 });
  }

  const exam = getExam(level, variant);
  const details = exam.questions.map((question) => {
    const selectedIndex = body.answers?.[question.id];
    return {
      id: question.id,
      selectedIndex: Number.isInteger(selectedIndex) ? selectedIndex : null,
      correctIndex: question.correctIndex,
      isCorrect: selectedIndex === question.correctIndex,
      explanation: question.explanation,
      transcript: question.transcript,
    };
  });
  const correct = details.filter((item) => item.isCorrect).length;
  return Response.json({
    score: Math.round((correct / details.length) * 100),
    correct,
    total: details.length,
    details,
  });
}
