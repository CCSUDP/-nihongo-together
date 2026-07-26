"use client";

import { useEffect, useState } from "react";
import { LearningHeader } from "../components/learning-header";

type Question = {
  id: number;
  level: string;
  type: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
};

const levels = ["N5", "N4", "N3", "N2", "N1"];

async function fetchQuestions(level: string) {
  const response = await fetch(`/api/questions?level=${level}`);
  if (!response.ok) throw new Error("题库暂时无法读取");
  const payload = (await response.json()) as { questions: Question[] };
  return payload.questions;
}

export default function PracticePage() {
  const [level, setLevel] = useState("N5");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadQuestions() {
    try {
      setQuestions(await fetchQuestions(level));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void fetchQuestions(level)
      .then((nextQuestions) => {
        if (active) setQuestions(nextQuestions);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "加载失败");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [level]);

  function resetAndLoad(nextLevel = level) {
    setLoading(true);
    setError("");
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    if (nextLevel === level) {
      void loadQuestions();
    } else {
      setLevel(nextLevel);
    }
  }

  const question = questions[current];
  const finished = questions.length > 0 && current >= questions.length;

  async function submitAnswer() {
    if (!question || selected === null || submitted) return;
    const correct = selected === question.correctIndex;
    setSubmitted(true);
    if (correct) setScore((value) => value + 1);
    await fetch("/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        selectedIndex: selected,
      }),
    }).catch(() => undefined);
  }

  function nextQuestion() {
    setCurrent((value) => value + 1);
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <main className="app-shell">
      <LearningHeader active="practice" />
      <div className="learning-page practice-layout">
        <section className="learning-hero">
          <div>
            <p className="eyebrow">ORIGINAL PRACTICE · N5—N1</p>
            <h1>JLPT 风格练习</h1>
            <p>
              覆盖 N5–N1 常见文字词汇考点，每次随机抽取 10 题并配中文解析。
            </p>
          </div>
          <a className="outline-button hero-link" href="/vocabulary">
            先复习真实词汇
          </a>
        </section>

        <section className="practice-shell">
          <aside className="panel practice-sidebar">
            <p className="section-kana">LEVEL</p>
            <h2>选择练习等级</h2>
            <div className="practice-levels">
              {levels.map((item) => (
                <button
                  key={item}
                  className={level === item ? "selected" : ""}
                  aria-pressed={level === item}
                  onClick={() => resetAndLoad(item)}
                >
                  <span>{item}</span>
                  <small>{item === "N5" ? "基础入门" : item === "N1" ? "高级运用" : "能力进阶"}</small>
                </button>
              ))}
            </div>
            <div className="practice-disclaimer">
              <strong>练习说明</strong>
              <p>每级 20 题，进入等级后随机抽取 10 题。</p>
              <a href="/sources">查看来源与授权 →</a>
            </div>
          </aside>

          <section className="panel question-panel" aria-live="polite">
            {loading ? (
              <div className="data-state">正在从题库读取 {level} 练习…</div>
            ) : error ? (
              <div className="data-state error-state">
                <p>{error}</p>
                <button
                  className="outline-button"
                  onClick={() => resetAndLoad()}
                >
                  重新加载
                </button>
              </div>
            ) : finished ? (
              <div className="result-card">
                <span className="result-mark">完</span>
                <p className="section-kana">SESSION COMPLETE</p>
                <h2>{level} 本组练习完成</h2>
                <strong>
                  {score} / {questions.length}
                </strong>
                <p>
                  正确率 {Math.round((score / questions.length) * 100)}%
                  ，答题记录已在登录状态下保存。
                </p>
                <div>
                  <button className="primary-button" onClick={() => resetAndLoad()}>
                    再练一组
                  </button>
                  <a className="outline-button" href="/vocabulary">
                    返回词汇库
                  </a>
                </div>
              </div>
            ) : question ? (
              <>
                <div className="question-meta">
                  <span>{question.type}</span>
                  <span>
                    {current + 1} / {questions.length}
                  </span>
                </div>
                <div
                  className="question-progress"
                  role="progressbar"
                  aria-label="练习进度"
                  aria-valuenow={current + 1}
                  aria-valuemin={1}
                  aria-valuemax={questions.length}
                >
                  <i
                    style={{
                      width: `${((current + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
                <h2 className="question-prompt">{question.prompt}</h2>
                <div className="answer-list">
                  {question.options.map((option, index) => {
                    const chosen = selected === index;
                    const correct = submitted && question.correctIndex === index;
                    const wrong = submitted && chosen && !correct;
                    return (
                      <button
                        key={option}
                        disabled={submitted}
                        className={`${chosen ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
                        onClick={() => setSelected(index)}
                        aria-pressed={chosen}
                      >
                        <span>{String.fromCharCode(65 + index)}</span>
                        <strong>{option}</strong>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div
                    className={`answer-explanation ${
                      selected === question.correctIndex ? "correct" : "wrong"
                    }`}
                  >
                    <strong>
                      {selected === question.correctIndex
                        ? "回答正确"
                        : `正确答案：${question.options[question.correctIndex]}`}
                    </strong>
                    <p>{question.explanation}</p>
                  </div>
                )}

                <div className="question-actions">
                  <span>{question.source}</span>
                  {!submitted ? (
                    <button
                      className="primary-button"
                      disabled={selected === null}
                      onClick={() => void submitAnswer()}
                    >
                      提交答案
                    </button>
                  ) : (
                    <button className="primary-button" onClick={nextQuestion}>
                      下一题 →
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="data-state">该等级暂时没有可用练习。</div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
