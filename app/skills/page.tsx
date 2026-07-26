"use client";

import { useEffect, useState } from "react";
import { LearningHeader } from "../components/learning-header";

type SkillQuestion = { id: string; section: string; type: string; prompt: string; passage?: string; options: string[]; hasAudio?: boolean };
type Review = { isCorrect: boolean; correctIndex: number; explanation: string; transcript?: string };

export default function SkillsPage() {
  const [mode, setMode] = useState<"reading" | "listening">("reading");
  const [level, setLevel] = useState("N5");
  const [variant, setVariant] = useState(1);
  const [question, setQuestion] = useState<SkillQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void fetch(`/api/skill-practice?level=${level}&mode=${mode}&variant=${variant}`)
      .then((response) => response.json())
      .then((payload: { question: SkillQuestion }) => { if (active) setQuestion(payload.question); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [level, mode, variant]);

  function resetQuestion() {
    setLoading(true);
    setSelected(null);
    setReview(null);
  }

  function changeMode(nextMode: "reading" | "listening") {
    resetQuestion();
    setMode(nextMode);
  }

  function changeLevel(nextLevel: string) {
    resetQuestion();
    setLevel(nextLevel);
  }

  function changeVariant(nextVariant: number) {
    resetQuestion();
    setVariant(nextVariant);
  }

  async function submit() {
    if (selected === null) return;
    const response = await fetch("/api/skill-practice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ level, mode, variant, selectedIndex: selected }),
    });
    setReview((await response.json()) as Review);
  }

  async function play() {
    if (!question || !("speechSynthesis" in window)) return;
    const params = new URLSearchParams({ level, variant: String(variant), questionId: question.id });
    const response = await fetch(`/api/mock-exams/audio?${params}`);
    const payload = (await response.json()) as { speechText?: string };
    if (!payload.speechText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(payload.speechText.replace(/(?:^|。)(男|女|店長|店員)：/g, "。"));
    utterance.lang = "ja-JP";
    utterance.rate = level === "N5" ? 0.82 : 0.92;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="app-shell">
      <LearningHeader active="skills" />
      <div className="learning-page">
        <section className="learning-hero">
          <div><p className="eyebrow">READING & LISTENING · N5—N1</p><h1>分级精读・精听</h1><p>使用原创日语材料训练信息定位、主旨判断和真实语速下的行动理解。</p></div>
          <a className="outline-button hero-link" href="/exams">进入全科模拟考试</a>
        </section>
        <section className="skills-layout">
          <aside className="panel skill-controls">
            <div className="mode-switch">
              <button className={mode === "reading" ? "selected" : ""} onClick={() => changeMode("reading")}>文章精读</button>
              <button className={mode === "listening" ? "selected" : ""} onClick={() => changeMode("listening")}>情境精听</button>
            </div>
            <p className="section-kana">LEVEL</p>
            <div className="skill-levels">{["N5", "N4", "N3", "N2", "N1"].map((item) => <button className={item === level ? "selected" : ""} key={item} onClick={() => changeLevel(item)}>{item}</button>)}</div>
            <p className="section-kana">MATERIAL</p>
            <div className="material-switch"><button className={variant === 1 ? "selected" : ""} onClick={() => changeVariant(1)}>材料 A</button><button className={variant === 2 ? "selected" : ""} onClick={() => changeVariant(2)}>材料 B</button></div>
            <div className="exam-note"><strong>训练方式</strong><p>{mode === "reading" ? "先快速定位问题，再回到原文寻找依据。" : "先听完整对话，再抓住最后确定的行动、时间或地点。"}</p></div>
          </aside>
          <section className="panel skill-question">
            {loading || !question ? <div className="data-state">正在读取 {level} 材料…</div> : <>
              <div className="question-meta"><span>{question.section} · {question.type}</span><span>{variant}/2</span></div>
              {question.passage && <article className="reading-passage" lang="ja">{question.passage}</article>}
              {question.hasAudio && <div className="listening-stage"><div className="audio-rings" aria-hidden="true"><i /><i /><i /></div><button onClick={() => void play()}>▶ 播放日语对话</button><p>可重复播放；建议第一遍不看选项。</p></div>}
              <h2 className="question-prompt">{question.prompt}</h2>
              <div className="answer-list">
                {question.options.map((option, index) => {
                  const correct = review?.correctIndex === index;
                  const wrong = review && selected === index && !correct;
                  return <button key={option} disabled={Boolean(review)} className={`${selected === index ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => setSelected(index)}><span>{String.fromCharCode(65 + index)}</span><strong>{option}</strong></button>;
                })}
              </div>
              {review && <div className={`answer-explanation ${review.isCorrect ? "correct" : "wrong"}`}><strong>{review.isCorrect ? "回答正确" : `正确答案：${question.options[review.correctIndex]}`}</strong><p>{review.explanation}</p>{review.transcript && <details><summary>查看听力原文</summary><p lang="ja">{review.transcript}</p></details>}</div>}
              <div className="question-actions"><span>日语搭子原创 · JLPT 风格训练</span>{!review ? <button className="primary-button" disabled={selected === null} onClick={() => void submit()}>提交答案</button> : <button className="primary-button" onClick={() => changeVariant(variant === 1 ? 2 : 1)}>下一篇 →</button>}</div>
            </>}
          </section>
        </section>
      </div>
    </main>
  );
}
