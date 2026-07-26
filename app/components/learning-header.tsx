/* eslint-disable @next/next/no-html-link-for-pages */

type LearningHeaderProps = {
  active?: "home" | "vocabulary" | "practice" | "skills" | "exams" | "sources";
};

export function LearningHeader({ active = "home" }: LearningHeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="日语搭子首页">
        <span className="brand-mark" aria-hidden="true">
          日
        </span>
        <span>
          <strong>日语搭子</strong>
          <small>NIHONGO TOGETHER</small>
        </span>
      </a>

      <nav className="main-nav" aria-label="主导航">
        <a className={active === "home" ? "active" : ""} href="/">
          学习总览
        </a>
        <a
          className={active === "vocabulary" ? "active" : ""}
          href="/vocabulary"
        >
          真实词汇库
        </a>
        <a
          className={active === "practice" ? "active" : ""}
          href="/practice"
        >
          分项练习
        </a>
        <a className={active === "skills" ? "active" : ""} href="/skills">
          精读精听
        </a>
        <a className={active === "exams" ? "active" : ""} href="/exams">
          模拟考试
        </a>
        <a className={active === "sources" ? "active" : ""} href="/sources">
          数据来源
        </a>
      </nav>

      <div className="profile">
        <div className="profile-copy">
          <strong>小满学日语</strong>
          <span>
            <i aria-hidden="true" /> N2 冲刺中
          </span>
        </div>
        <span className="avatar" aria-hidden="true">
          満
        </span>
      </div>
    </header>
  );
}
