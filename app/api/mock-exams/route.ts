import { examCatalog, publicExam } from "@/app/data/exam-data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const level = url.searchParams.get("level")?.toUpperCase();
  const variant = Number(url.searchParams.get("variant") || 1);

  if (!level) {
    return Response.json({ exams: examCatalog });
  }
  if (!["N5", "N4", "N3", "N2", "N1"].includes(level) || ![1, 2].includes(variant)) {
    return Response.json({ error: "模拟卷参数无效" }, { status: 400 });
  }
  return Response.json({ exam: publicExam(level, variant) });
}
