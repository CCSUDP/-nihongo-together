"use client";

import { FormEvent, useMemo, useState } from "react";
import { LearningHeader } from "./components/learning-header";

type Task = {
  id: number;
  type: string;
  title: string;
  detail: string;
  duration: number;
  accent: "mint" | "blue" | "sand" | "coral";
};

type Room = {
  id: number;
  level: string;
  title: string;
  mode: string;
  people: number;
  capacity: number;
  remaining: string;
};

type Group = {
  id: number;
  level: string;
  name: string;
  goal: string;
  schedule: string;
  members: number;
  activity: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    type: "词汇",
    title: "N2 高频词 · 第 18 组",
    detail: "30 词 · 间隔复习",
    duration: 12,
    accent: "mint",
  },
  {
    id: 2,
    type: "听力",
    title: "新闻听解 · 通勤话题",
    detail: "精听 2 遍 · 跟读 1 遍",
    duration: 18,
    accent: "blue",
  },
  {
    id: 3,
    type: "语法",
    title: "〜に違いない / 〜にすぎない",
    detail: "例句 8 条 · 对比练习",
    duration: 15,
    accent: "sand",
  },
  {
    id: 4,
    type: "口语",
    title: "和搭子复述今日新闻",
    detail: "21:30 开始 · 2 人已约",
    duration: 15,
    accent: "coral",
  },
];

const rooms: Room[] = [
  {
    id: 1,
    level: "N2",
    title: "晚间 40 分钟静默自习",
    mode: "番茄钟 · 麦克风关闭",
    people: 7,
    capacity: 10,
    remaining: "28:16",
  },
  {
    id: 2,
    level: "N3",
    title: "NHK 慢速新闻精听",
    mode: "同步播放 · 结束交流",
    people: 4,
    capacity: 6,
    remaining: "18:42",
  },
  {
    id: 3,
    level: "N2",
    title: "语法错题集中复盘",
    mode: "各自练习 · 文字提问",
    people: 9,
    capacity: 12,
    remaining: "34:08",
  },
];

const groups: Group[] = [
  {
    id: 1,
    level: "N2",
    name: "十二月 N2 稳定通过组",
    goal: "每日词汇 + 每周两套真题",
    schedule: "工作日 21:30",
    members: 16,
    activity: "刚刚",
  },
  {
    id: 2,
    level: "N3",
    name: "东京生活口语练习",
    goal: "生活场景对话与纠音",
    schedule: "二 / 四 / 六 20:00",
    members: 8,
    activity: "12 分钟前",
  },
  {
    id: 3,
    level: "N4",
    name: "零碎时间词汇打卡",
    goal: "每天 30 词，互相检查",
    schedule: "每日自由打卡",
    members: 23,
    activity: "25 分钟前",
  },
];

const week = [
  { day: "一", value: 34 },
  { day: "二", value: 48 },
  { day: "三", value: 26 },
  { day: "四", value: 52 },
  { day: "五", value: 43 },
  { day: "六", value: 60 },
  { day: "日", value: 38 },
];

export default function Home() {
  const [completed, setCompleted] = useState<number[]>([1]);
  const [activeRoom, setActiveRoom] = useState<number | null>(null);
  const [level, setLevel] = useState("全部");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredGroups = useMemo(
    () => groups.filter((group) => level === "全部" || group.level === level),
    [level],
  );

  const completedMinutes = initialTasks
    .filter((task) => completed.includes(task.id))
    .reduce((sum, task) => sum + task.duration, 0);
  const totalMinutes = initialTasks.reduce(
    (sum, task) => sum + task.duration,
    0,
  );
  const progress = Math.round((completedMinutes / totalMinutes) * 100);

  function toggleTask(id: number) {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((taskId) => taskId !== id)
        : [...current, id],
    );
  }

  function toggleRoom(room: Room) {
    const joining = activeRoom !== room.id;
    setActiveRoom(joining ? room.id : null);
    setNotice(joining ? `已进入「${room.title}」` : "已退出专注房间");
    window.setTimeout(() => setNotice(""), 2400);
  }

  function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "新学习小组");
    setDrawerOpen(false);
    setNotice(`「${name}」已创建，本地草稿已保存`);
    event.currentTarget.reset();
    window.setTimeout(() => setNotice(""), 2800);
  }

  return (
    <main className="app-shell">
      <LearningHeader active="home" />

      <div className="workspace" id="overview">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">7月26日 · 日曜日</p>
            <h1>
              下午好，今天也一起<span>稳稳推进。</span>
            </h1>
            <p className="welcome-note">
              今日建议先完成词汇复习，再进入 21:30 的口语小组。
            </p>
          </div>
          <button
            className="primary-button compact"
            onClick={() => setDrawerOpen(true)}
          >
            <span aria-hidden="true">＋</span> 创建学习小组
          </button>
        </section>

        <section className="metrics" aria-label="学习概览">
          <article className="metric-card">
            <div className="metric-icon mint" aria-hidden="true">
              継
            </div>
            <div>
              <span>连续学习</span>
              <strong>
                18<small>天</small>
              </strong>
              <p>本月最长连续记录</p>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon blue" aria-hidden="true">
              週
            </div>
            <div>
              <span>本周完成率</span>
              <strong>
                76<small>%</small>
              </strong>
              <p>较上周提升 8%</p>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon sand" aria-hidden="true">
              時
            </div>
            <div>
              <span>今日专注</span>
              <strong>
                {completedMinutes}<small>分钟</small>
              </strong>
              <p>目标 {totalMinutes} 分钟</p>
            </div>
          </article>
          <article className="metric-card quote-card">
            <span className="jp-note">今日も一歩ずつ。</span>
            <strong>每天进步一点就好。</strong>
            <p>学习不靠情绪，靠可以重复的节奏。</p>
          </article>
        </section>

        <div className="study-grid">
          <section className="panel tasks-panel" id="tasks">
            <div className="panel-heading">
              <div>
                <p className="section-kana">TODAY&apos;S PLAN</p>
                <h2>今日计划</h2>
              </div>
              <span className="count">
                {completed.length} / {initialTasks.length} 已完成
              </span>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="今日计划完成进度"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="task-list">
              {initialTasks.map((task, index) => {
                const isDone = completed.includes(task.id);
                return (
                  <button
                    className={`task-row ${isDone ? "done" : ""}`}
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    aria-pressed={isDone}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <span
                      className={`task-check ${task.accent}`}
                      aria-hidden="true"
                    >
                      {isDone ? "✓" : ""}
                    </span>
                    <span className="task-main">
                      <span className="task-type">{task.type}</span>
                      <strong>{task.title}</strong>
                      <small>{task.detail}</small>
                    </span>
                    <span className="duration">{task.duration} min</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel rooms-panel">
            <div className="panel-heading">
              <div>
                <p className="section-kana">FOCUS ROOMS</p>
                <h2>专注房间</h2>
              </div>
              <span className="online-label">
                <i aria-hidden="true" /> 32 人正在学习
              </span>
            </div>

            <div className="room-list">
              {rooms.map((room, index) => {
                const joined = activeRoom === room.id;
                return (
                  <article
                    className={`room-card ${joined ? "joined" : ""}`}
                    key={room.id}
                    style={{ animationDelay: `${index * 80 + 120}ms` }}
                  >
                    <div className="room-topline">
                      <span className="level-tag">{room.level}</span>
                      <span className="room-time">{room.remaining}</span>
                    </div>
                    <h3>{room.title}</h3>
                    <p>{room.mode}</p>
                    <div className="room-footer">
                      <div className="member-stack" aria-label="小组成员">
                        {["田", "佐", "周", "林"].map((name, memberIndex) => (
                          <span key={name} className={`member m${memberIndex}`}>
                            {name}
                          </span>
                        ))}
                        <small>
                          {room.people}/{room.capacity}
                        </small>
                      </div>
                      <button
                        className={joined ? "joined-button" : "outline-button"}
                        onClick={() => toggleRoom(room)}
                      >
                        {joined ? "学习中 · 退出" : "加入房间"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="side-column">
            <section className="panel review-panel">
              <div className="panel-heading mini">
                <div>
                  <p className="section-kana">REVIEW</p>
                  <h2>复习队列</h2>
                </div>
                <button className="text-button">全部词汇 →</button>
              </div>
              <div className="review-stat">
                <div className="review-ring" aria-label="42 个词待复习">
                  <strong>42</strong>
                  <span>个词</span>
                </div>
                <div>
                  <strong>预计 12 分钟</strong>
                  <p>其中 8 个需要重点复习</p>
                  <button className="primary-button small">开始复习</button>
                </div>
              </div>
            </section>

            <section className="panel week-panel" id="record">
              <div className="panel-heading mini">
                <div>
                  <p className="section-kana">THIS WEEK</p>
                  <h2>学习时长</h2>
                </div>
                <span className="week-total">301 min</span>
              </div>
              <div className="chart" aria-label="本周每日学习分钟数">
                {week.map((item) => (
                  <div className="bar-column" key={item.day}>
                    <span className="bar-value">{item.value}</span>
                    <div className="bar-shell">
                      <i style={{ height: `${item.value * 1.35}px` }} />
                    </div>
                    <small>{item.day}</small>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <i /> 每日目标 45 分钟
              </div>
            </section>
          </aside>
        </div>

        <section className="panel group-panel" id="groups">
          <div className="panel-heading group-heading">
            <div>
              <p className="section-kana">STUDY GROUPS</p>
              <h2>学习小组</h2>
              <p>找到目标和学习时间相近的搭子。</p>
            </div>
            <div className="filter-tabs" aria-label="按 JLPT 等级筛选">
              {["全部", "N2", "N3", "N4"].map((item) => (
                <button
                  key={item}
                  className={level === item ? "selected" : ""}
                  onClick={() => setLevel(item)}
                  aria-pressed={level === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="group-table">
            <div className="group-row table-head" aria-hidden="true">
              <span>小组名称</span>
              <span>学习目标</span>
              <span>常用时间</span>
              <span>成员</span>
              <span>最近活跃</span>
              <span />
            </div>
            {filteredGroups.map((group) => (
              <article className="group-row" key={group.id}>
                <span className="group-name">
                  <i>{group.level}</i>
                  <strong>{group.name}</strong>
                </span>
                <span>{group.goal}</span>
                <span>{group.schedule}</span>
                <span>{group.members} 人</span>
                <span>{group.activity}</span>
                <button
                  className="outline-button"
                  onClick={() => {
                    setNotice(`已申请加入「${group.name}」`);
                    window.setTimeout(() => setNotice(""), 2400);
                  }}
                >
                  申请加入
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div
        className={`drawer-backdrop ${drawerOpen ? "visible" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`group-drawer ${drawerOpen ? "open" : ""}`}
        aria-label="创建学习小组"
        aria-hidden={!drawerOpen}
      >
        <div className="drawer-heading">
          <div>
            <p className="section-kana">NEW STUDY GROUP</p>
            <h2>创建学习小组</h2>
          </div>
          <button
            className="icon-button close-button"
            onClick={() => setDrawerOpen(false)}
            aria-label="关闭创建小组面板"
          >
            ×
          </button>
        </div>
        <p className="drawer-intro">
          小组保持 4–12 人效果最好。先确定一个具体目标，再约定稳定的学习时间。
        </p>
        <form onSubmit={createGroup}>
          <label>
            小组名称
            <input
              required
              name="name"
              placeholder="例如：十二月 N2 稳定通过组"
            />
          </label>
          <label>
            目标等级
            <select name="target" defaultValue="N2">
              <option>N1</option>
              <option>N2</option>
              <option>N3</option>
              <option>N4</option>
              <option>口语</option>
            </select>
          </label>
          <label>
            常用学习时间
            <select name="schedule" defaultValue="工作日 21:30">
              <option>工作日 21:30</option>
              <option>每天早上 08:00</option>
              <option>周末下午</option>
              <option>自由打卡</option>
            </select>
          </label>
          <label>
            学习目标
            <textarea
              name="goal"
              rows={4}
              placeholder="写清楚每天做什么、每周如何复盘。"
            />
          </label>
          <div className="form-note">
            <span aria-hidden="true">あ</span>
            <p>
              <strong>建议</strong>
              目标越具体，越容易找到节奏相同的搭子。
            </p>
          </div>
          <button className="primary-button submit-button" type="submit">
            创建并邀请搭子
          </button>
        </form>
      </aside>

      {notice && (
        <div className="toast" role="status">
          <span aria-hidden="true">✓</span>
          {notice}
        </div>
      )}
    </main>
  );
}
