# 日语搭子 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建并部署一个桌面端优先、学习密度高、可操作的日语组队学习单页网站。

**Architecture:** 使用 Vinext/React 单页客户端组件承载本地交互状态，静态数据集中定义在页面文件中，视觉系统集中在全局样式表。服务端渲染测试验证关键内容和可访问结构，浏览器检查验证交互与响应式布局。

**Tech Stack:** Vinext、React 19、TypeScript、CSS、Node test

## Global Constraints

- PC 端为主体验，1440px 使用高密度三栏学习工作台。
- 移动端自适应且不横向溢出。
- 薄荷绿与暖白为主，加入克制日系元素，避免强娱乐化。
- 动效顺滑、短促、服务于状态反馈，并支持 `prefers-reduced-motion`。
- 不引入账号、支付、聊天或跨用户实时数据。

---

### Task 1: Render contract

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: 构建产物的根路由 HTML。
- Produces: 对产品标题、今日任务、专注房间、学习小组和可访问按钮的渲染契约。

- [ ] **Step 1: Write the failing test**

新增断言，要求 HTML 包含“日语搭子”“今日计划”“专注房间”“学习小组”“创建学习小组”。

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL，因为启动页尚未包含产品内容。

### Task 2: Product workspace

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: 页面内学习任务、房间、小组和周进度数据。
- Produces: `Home()` 单页工作台以及任务切换、房间加入、小组筛选、创建抽屉交互。

- [ ] **Step 1: Implement the minimal product**

把根页面改为客户端组件，加入高密度桌面布局、真实学习数据和四个主要交互。

- [ ] **Step 2: Add the visual system**

实现暖白/薄荷/墨色配色、桌面网格、日系水印、状态组件、响应式布局和减少动态效果规则。

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test`
Expected: PASS，全部渲染契约通过。

### Task 3: Interaction and responsive verification

**Files:**
- Modify only if browser verification finds a defect: `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: 可运行的网站。
- Produces: 经桌面与移动视口验证的交互体验。

- [ ] **Step 1: Start the agent preview**

Run: `sites-preview start "$PWD"`

- [ ] **Step 2: Verify desktop behavior**

在 1440×900 检查首屏密度、完成任务、筛选小组、加入房间和打开/提交创建抽屉。

- [ ] **Step 3: Verify mobile behavior**

在 390×844 检查导航、卡片顺序、抽屉和横向溢出。

- [ ] **Step 4: Run final checks**

Run: `npm run lint && npm test`
Expected: 两个命令均以 0 退出。

### Task 4: Production checkpoint

**Files:**
- Include: 当前完整站点源文件与文档。

**Interfaces:**
- Consumes: 已验证的 checkout。
- Produces: 可访问的私有生产部署。

- [ ] **Step 1: Create a checkpoint**

使用 Sites checkpoint 保存并部署完整体验。

- [ ] **Step 2: Verify deployment status**

等待部署进入终态，并通过主会话状态检查取得生产 URL。
