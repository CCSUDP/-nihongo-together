"use client";

import { useEffect, useState } from "react";
import { LearningHeader } from "../components/learning-header";

type CatalogExam = {
  slug: string;
  level: string;
  variant: number;
  title: string;
  durationMinutes: number;
  questionCount: number;
};

export default function ExamsPage() {
  const [exams, setExams] = useState<CatalogExam[]>([]);
  const [level, setLevel] = useState("N5");

  useEffect(() => {
    void fetch("/api/mock-exams")
      .then((response) => response.json())
      .then((payload: { exams: CatalogExam[] }) => setExams(payload.exams));
  }, []);

  const filtered = exams.filter((exam) => exam.level === level);
  return (
    <main className="app-shell">
      <LearningHeader active="exams" />
      <div className="learning-page">
        <section className="learning-hero exam-hero">
          <div>
            <p className="eyebrow">FULL-LENGTH PRACTICE · N5—N1</p>
            <h1>全科模拟考试</h1>
            <p>每级两套原创 JLPT 风格模拟卷，覆盖语言知识、语法、阅读与听力。答案和解析仅在交卷后显示。</p>
          </div>
          <div className="exam-hero-stat">
            <strong>10</strong>
            <span>套分级模拟卷</span>
          </div>
        </section>

        <section className="exam-catalog">
          <aside className="panel exam-level-panel">
            <p className="section-kana">SELECT LEVEL</p>
            <h2>目标等级</h2>
            <div className="exam-level-list">
              {["N5", "N4", "N3", "N2", "N1"].map((item) => (
                <button key={item} className={item === level ? "selected" : ""} onClick={() => setLevel(item)}>
                  <strong>{item}</strong>
                  <span>{item === "N5" ? "基础入门" : item === "N1" ? "高级综合" : "能力进阶"}</span>
                </button>
              ))}
            </div>
            <div className="exam-note">
              <strong>模拟卷说明</strong>
              <p>题目为本站原创练习，不宣称为官方历年真题。听力由浏览器日语语音朗读。</p>
            </div>
          </aside>

          <div className="exam-cards">
            {filtered.map((exam) => (
              <article className="panel exam-card" key={exam.slug}>
                <div className="exam-card-top">
                  <span>{exam.level}</span>
                  <small>SET {exam.variant === 1 ? "A" : "B"}</small>
                </div>
                <h2>{exam.title}</h2>
                <p>一套完成四个核心模块，适合阶段检测与考前节奏训练。</p>
                <div className="exam-sections">
                  <span>语言知识</span><span>语法</span><span>阅读</span><span>听力</span>
                </div>
                <dl>
                  <div><dt>题量</dt><dd>{exam.questionCount} 题</dd></div>
                  <div><dt>建议时间</dt><dd>{exam.durationMinutes} 分钟</dd></div>
                  <div><dt>评分</dt><dd>交卷即出</dd></div>
                </dl>
                <a className="primary-button exam-start-link" href={`/exams/session?level=${exam.level}&variant=${exam.variant}`}>
                  开始模拟考试 →
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
