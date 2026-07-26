"use client";

import { useEffect, useMemo, useState } from "react";
import { LearningHeader } from "../../components/learning-header";

type PublicQuestion = {
  id: string;
  section: string;
  type: string;
  prompt: string;
  options: string[];
  passage?: string;
  hasAudio?: boolean;
};
type Exam = {
  title: string;
  level: string;
  variant: number;
  durationMinutes: number;
  questions: PublicQuestion[];
};
type ResultDetail = {
  id: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  transcript?: string;
};
type Result = { score: number; correct: number; total: number; details: ResultDetail[] };

export default function ExamSessionPage() {
  const [exam, setExam] = useState<Exam | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level") || "N5";
    const variant = params.get("variant") || "1";
    void fetch(`/api/mock-exams?level=${level}&variant=${variant}`)
      .then((response) => response.json())
      .then((payload: { exam: Exam }) => {
        setExam(payload.exam);
        setRemaining(payload.exam.durationMinutes * 60);
      })
      .catch(() => setError("模拟卷加载失败，请返回重试。"));
  }, []);

  useEffect(() => {
    if (!exam || result || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [exam, remaining, result]);

  const question = exam?.questions[current];
  const sections = useMemo(() => {
    const groups = new Map<string, number[]>();
    exam?.questions.forEach((item, index) => groups.set(item.section, [...(groups.get(item.section) || []), index]));
    return [...groups.entries()];
  }, [exam]);
  const resultMap = useMemo(() => new Map(result?.details.map((item) => [item.id, item]) || []), [result]);

  async function submitExam() {
    if (!exam || submitting || result) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/mock-exams/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ level: exam.level, variant: exam.variant, answers }),
      });
      if (!response.ok) throw new Error();
      setResult((await response.json()) as Result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("交卷失败，请检查网络后重试。已选答案仍保留在本页。");
    } finally {
      setSubmitting(false);
    }
  }

  function playListening() {
    if (!question?.hasAudio || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = resultMap.get(question.id)?.transcript;
    if (!text && !result && exam) {
      const params = new URLSearchParams({
        level: exam.level,
        variant: String(exam.variant),
        questionId: question.id,
      });
      void fetch(`/api/mock-exams/audio?${params}`).then(async (response) => {
        const payload = (await response.json()) as { speechText?: string };
        if (payload.speechText) speak(payload.speechText);
      });
      return;
    }
    if (text) speak(text);
  }

  function speak(text: string) {
    const cleaned = text.replace(/(?:^|。)(男|女|店長|店員)：/g, "。");
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = "ja-JP";
    utterance.rate = exam?.level === "N5" ? 0.82 : 0.92;
    window.speechSynthesis.speak(utterance);
  }

  if (error && !exam) return <main className="app-shell"><LearningHeader active="exams" /><div className="learning-page data-state error-state">{error}</div></main>;
  if (!exam || !question) return <main className="app-shell"><LearningHeader active="exams" /><div className="learning-page data-state">正在准备模拟卷…</div></main>;

  const detail = resultMap.get(question.id);
  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  return (
    <main className="app-shell">
      <LearningHeader active="exams" />
      <div className="exam-session-page">
        <header className="exam-session-header">
          <div><p className="eyebrow">{exam.level} · FULL PRACTICE</p><h1>{exam.title}</h1></div>
          {result ? (
            <div className="score-pill"><strong>{result.score}</strong><span>分 · {result.correct}/{result.total}</span></div>
          ) : (
            <div className={`timer-pill ${remaining < 300 ? "urgent" : ""}`}><span>剩余时间</span><strong>{minutes}:{seconds}</strong></div>
          )}
        </header>

        <div className="exam-workspace">
          <section className="panel exam-question-area">
            <div className="question-meta"><span>{question.section} · {question.type}</span><span>{current + 1} / {exam.questions.length}</span></div>
            {question.passage && <article className="reading-passage">{question.passage}</article>}
            {question.hasAudio && (
              <div className="listening-player">
                <button onClick={playListening}>▶ 播放日语音频</button>
                <span>{result ? "交卷后可查看原文" : "建议完整听完再选择答案"}</span>
              </div>
            )}
            <h2 className="question-prompt">{question.prompt}</h2>
            <div className="answer-list exam-answer-list">
              {question.options.map((option, index) => {
                const selected = answers[question.id] === index;
                const correct = Boolean(result && detail?.correctIndex === index);
                const wrong = Boolean(result && selected && !correct);
                return (
                  <button key={`${question.id}-${index}`} disabled={Boolean(result)} className={`${selected ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => setAnswers((value) => ({ ...value, [question.id]: index }))}>
                    <span>{index + 1}</span><strong>{option}</strong>
                  </button>
                );
              })}
            </div>
            {result && detail && (
              <div className={`answer-explanation ${detail.isCorrect ? "correct" : "wrong"}`}>
                <strong>{detail.isCorrect ? "回答正确" : `正确答案：${question.options[detail.correctIndex]}`}</strong>
                <p>{detail.explanation}</p>
                {detail.transcript && <details><summary>查看听力原文</summary><p lang="ja">{detail.transcript}</p></details>}
              </div>
            )}
            <div className="exam-nav-buttons">
              <button className="outline-button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>← 上一题</button>
              {current < exam.questions.length - 1 ? (
                <button className="primary-button" onClick={() => setCurrent((value) => value + 1)}>下一题 →</button>
              ) : (
                <button className="primary-button" disabled={submitting || Boolean(result)} onClick={() => void submitExam()}>{submitting ? "正在交卷…" : "提交整卷"}</button>
              )}
            </div>
            {error && <p className="inline-error">{error}</p>}
          </section>

          <aside className="panel answer-sheet">
            <div className="answer-sheet-title"><div><p className="section-kana">ANSWER SHEET</p><h2>答题卡</h2></div><strong>{Object.keys(answers).length}/{exam.questions.length}</strong></div>
            {sections.map(([section, indexes]) => (
              <section key={section}><h3>{section}</h3><div>{indexes.map((index) => {
                const item = exam.questions[index];
                const itemResult = resultMap.get(item.id);
                return <button key={item.id} onClick={() => setCurrent(index)} className={`${index === current ? "current" : ""} ${answers[item.id] !== undefined ? "answered" : ""} ${itemResult ? (itemResult.isCorrect ? "right" : "miss") : ""}`}>{index + 1}</button>;
              })}</div></section>
            ))}
            {!result ? <button className="submit-sheet-button" onClick={() => void submitExam()} disabled={submitting}>{submitting ? "正在交卷…" : "提前交卷"}</button> : <a className="submit-sheet-button" href="/exams">返回模拟卷列表</a>}
          </aside>
        </div>
      </div>
    </main>
  );
}
