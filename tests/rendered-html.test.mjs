import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import test from "node:test";

const productionWorkerUrl = new URL("../dist/server/index.js", import.meta.url);
const testWorkerUrl = new URL("../dist/server/index.test.mjs", import.meta.url);
const productionWorkerSource = readFileSync(productionWorkerUrl, "utf8");
assert.match(productionWorkerSource, /import \{ env \} from "cloudflare:workers";/);
writeFileSync(
  testWorkerUrl,
  productionWorkerSource.replace(
    'import { env } from "cloudflare:workers";',
    "const env = globalThis.__TEST_CLOUDFLARE_ENV__ ?? {};",
  ),
);

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

async function renderPath(pathname) {
  const workerUrl = new URL(testWorkerUrl);
  workerUrl.searchParams.set("route", `${pathname}-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders development preview metadata", async () => {
  const workerUrl = new URL(testWorkerUrl);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders the Japanese study workspace", async () => {
  const workerUrl = new URL(testWorkerUrl);
  workerUrl.searchParams.set("workspace", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /日语搭子/);
  assert.match(html, /今日计划/);
  assert.match(html, /专注房间/);
  assert.match(html, /学习小组/);
  assert.match(html, /创建学习小组/);
});

test("renders the real vocabulary library", async () => {
  const response = await renderPath("/vocabulary");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /真实词汇库/);
  assert.match(html, /N5/);
  assert.match(html, /N1/);
  assert.match(html, /参考等级/);
});

test("renders JLPT-style practice", async () => {
  const response = await renderPath("/practice");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /JLPT 风格练习/);
  assert.match(html, /选择练习等级/);
});

test("renders graded reading and listening practice", async () => {
  const response = await renderPath("/skills");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /分级精读・精听/);
  assert.match(html, /文章精读/);
  assert.match(html, /情境精听/);
  assert.match(html, /N5/);
  assert.match(html, /N1/);
});

test("renders the N5-N1 mock exam catalog", async () => {
  const response = await renderPath("/exams");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /全科模拟考试/);
  assert.match(html, /语言知识/);
  assert.match(html, /阅读/);
  assert.match(html, /听力/);
});

test("renders the dense mock exam workspace", async () => {
  const response = await renderPath("/exams/session?level=N2&variant=1");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /正在准备模拟卷/);
  assert.match(html, /模拟考试/);
});

test("renders data sources and licensing", async () => {
  const response = await renderPath("/sources");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /数据来源与授权/);
  assert.match(html, /JMdict/);
  assert.match(html, /CC BY-SA 4.0/);
});
