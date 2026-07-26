# Real JLPT Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为日语搭子增加覆盖 N5–N1 的持久化真实词汇库、JLPT 风格练习和用户答题记录。

**Architecture:** D1 保存结构化内容与答题记录，Vinext API 路由负责校验和查询，客户端页面负责筛选、答题与反馈。内容页与现有首页共享同一视觉系统，授权说明独立成页。

**Tech Stack:** Vinext、React 19、TypeScript、Drizzle ORM、Cloudflare D1、Node test

## Global Constraints

- 五个等级都必须有词汇和练习题。
- JLPT 等级必须标为参考等级，原创题必须标为 JLPT 风格练习。
- 词汇和题目必须通过数据库读取，不以浏览器存储作为真实来源。
- PC 端维持高信息密度，移动端无横向溢出。
- 所有来源和授权必须在站内可查看。

---

### Task 1: Render contracts

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `/vocabulary`、`/practice`、`/sources` 的服务端 HTML。
- Produces: 对三个页面标题、等级入口、参考等级和授权文案的失败测试。

- [ ] **Step 1:** 添加三个路由的渲染断言。
- [ ] **Step 2:** 运行 `npm test`，确认因路由不存在而失败。

### Task 2: D1 schema and seed

**Files:**
- Modify: `.openai/hosting.json`
- Modify: `db/schema.ts`
- Create: `drizzle/0000_real_jlpt_data.sql`

**Interfaces:**
- Produces: `vocabulary`、`questions`、`attempts` 三张表及 N5–N1 首批数据。

- [ ] **Step 1:** 把 D1 逻辑绑定设置为 `DB`。
- [ ] **Step 2:** 定义三张表和等级、搜索、答题记录索引。
- [ ] **Step 3:** 写入每级至少 20 个词和 5 道原创题的迁移数据。

### Task 3: Read and attempt APIs

**Files:**
- Create: `app/api/vocabulary/route.ts`
- Create: `app/api/questions/route.ts`
- Create: `app/api/attempts/route.ts`

**Interfaces:**
- Produces: `GET /api/vocabulary?level=N5&q=&page=1`、`GET /api/questions?level=N5`、`POST /api/attempts`。

- [ ] **Step 1:** 校验等级、搜索长度、页码与答案载荷。
- [ ] **Step 2:** 使用准备语句或 Drizzle 查询 D1。
- [ ] **Step 3:** 写答题记录时从服务端身份头读取用户邮箱。

### Task 4: Vocabulary and practice pages

**Files:**
- Create: `app/vocabulary/page.tsx`
- Create: `app/practice/page.tsx`
- Create: `app/sources/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Task 3 的 JSON API。
- Produces: 真实词汇检索、分级练习、解析、结果页和来源页。

- [ ] **Step 1:** 创建带加载、失败、空结果状态的词汇页。
- [ ] **Step 2:** 创建逐题作答、即时解析和正确率总结的练习页。
- [ ] **Step 3:** 创建来源授权页并更新首页导航。
- [ ] **Step 4:** 完成响应式与键盘焦点样式。

### Task 5: Verification and deployment

**Files:**
- Modify only if verification finds a defect.

**Interfaces:**
- Produces: 经过自动化与交互验证的新生产版本。

- [ ] **Step 1:** 运行 `npm run lint` 和 `npm test`。
- [ ] **Step 2:** 启动 agent preview，检查词汇筛选、搜索和完整答题流程。
- [ ] **Step 3:** 创建 Sites checkpoint，并验证生产部署终态。
