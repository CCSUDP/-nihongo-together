"use client";

import { FormEvent, useEffect, useState } from "react";
import { LearningHeader } from "../components/learning-header";

type Word = {
  id: number;
  level: string;
  expression: string;
  reading: string;
  meaningZh: string;
  meaningEn: string;
  partOfSpeech: string;
  source: string;
};

type VocabularyResponse = {
  words: Word[];
  pagination: { page: number; total: number; pages: number };
  levelNote: string;
};

const levels = ["N5", "N4", "N3", "N2", "N1"];

async function fetchWords(level: string, search: string, page: number) {
  const params = new URLSearchParams({
    level,
    q: search,
    page: String(page),
  });
  const response = await fetch(`/api/vocabulary?${params}`);
  if (!response.ok) throw new Error("词汇数据暂时无法读取");
  return (await response.json()) as VocabularyResponse;
}

export default function VocabularyPage() {
  const [level, setLevel] = useState("N5");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<VocabularyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWords() {
    try {
      setData(await fetchWords(level, search, page));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void fetchWords(level, search, page)
      .then((nextData) => {
        if (active) setData(nextData);
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
  }, [level, page, search]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setPage(1);
    setSearch(query.trim());
  }

  return (
    <main className="app-shell">
      <LearningHeader active="vocabulary" />
      <div className="learning-page">
        <section className="learning-hero">
          <div>
            <p className="eyebrow">OPEN DATA · N5—N1</p>
            <h1>真实词汇库</h1>
            <p>
              收录开放 JLPT 10K 词汇的日文词形、读音与中文释义，
              覆盖 N5–N1。先查清楚，再开始记忆。
            </p>
          </div>
          <a className="primary-button compact" href="/practice">
            用这些词开始练习 →
          </a>
        </section>

        <section className="data-toolbar panel">
          <div className="level-switch" aria-label="选择 JLPT 等级">
            {levels.map((item) => (
              <button
                key={item}
                className={level === item ? "selected" : ""}
                aria-pressed={level === item}
                onClick={() => {
                  setLoading(true);
                  setError("");
                  setLevel(item);
                  setPage(1);
                }}
              >
                <strong>{item}</strong>
                <small>{item === "N5" ? "基础" : item === "N1" ? "高级" : "进阶"}</small>
              </button>
            ))}
          </div>
          <form className="word-search" onSubmit={submitSearch}>
            <label htmlFor="word-query">搜索词形、假名或中文</label>
            <div>
              <input
                id="word-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例如：安心 / あんしん / 放心"
                maxLength={40}
              />
              <button className="primary-button" type="submit">
                搜索
              </button>
            </div>
          </form>
        </section>

        <div className="dataset-note">
          <span>参考等级</span>
          <p>
            {data?.levelNote ||
              "等级参考公开学习资料整理，可用于阶段复习。"}
          </p>
          <a href="/sources">查看数据来源</a>
        </div>

        <section className="panel vocabulary-panel" aria-live="polite">
          <div className="panel-heading vocabulary-heading">
            <div>
              <p className="section-kana">VOCABULARY DATASET</p>
              <h2>{level} 词汇</h2>
            </div>
            <span className="count">
              {data ? `共 ${data.pagination.total} 词` : "读取中"}
            </span>
          </div>

          {loading ? (
            <div className="data-state">正在从词汇数据库读取…</div>
          ) : error ? (
            <div className="data-state error-state">
              <p>{error}</p>
              <button
                className="outline-button"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  void loadWords();
                }}
              >
                重新加载
              </button>
            </div>
          ) : data?.words.length ? (
            <>
              <div className="word-table">
                <div className="word-row word-head" aria-hidden="true">
                  <span>词汇</span>
                  <span>读音</span>
                  <span>中文释义</span>
                  <span>词性</span>
                  <span>来源</span>
                </div>
                {data.words.map((word) => (
                  <article className="word-row" key={word.id}>
                    <span className="word-expression">
                      <i>{word.level}</i>
                      <strong>{word.expression}</strong>
                    </span>
                    <span className="word-reading">{word.reading}</span>
                    <span>
                      <strong>{word.meaningZh}</strong>
                      <small>{word.meaningEn}</small>
                    </span>
                    <span className="pos-tag">{word.partOfSpeech}</span>
                    <span className="source-short">{word.source}</span>
                  </article>
                ))}
              </div>
              <div className="pagination">
                <button
                  className="outline-button"
                  disabled={page <= 1}
                  onClick={() => {
                    setLoading(true);
                    setError("");
                    setPage((current) => current - 1);
                  }}
                >
                  ← 上一页
                </button>
                <span>
                  第 {data.pagination.page} / {data.pagination.pages} 页
                </span>
                <button
                  className="outline-button"
                  disabled={page >= data.pagination.pages}
                  onClick={() => {
                    setLoading(true);
                    setError("");
                    setPage((current) => current + 1);
                  }}
                >
                  下一页 →
                </button>
              </div>
            </>
          ) : (
            <div className="data-state">没有找到匹配词汇，请换个关键词。</div>
          )}
        </section>
      </div>
    </main>
  );
}
