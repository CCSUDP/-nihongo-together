import { LearningHeader } from "../components/learning-header";

export default function SourcesPage() {
  return (
    <main className="app-shell">
      <LearningHeader active="sources" />
      <div className="learning-page sources-page">
        <section className="learning-hero">
          <div>
            <p className="eyebrow">TRANSPARENT CONTENT</p>
            <h1>数据来源与授权</h1>
            <p>学习内容只有来源清楚，才能长期维护，也才能放心使用。</p>
          </div>
        </section>

        <section className="source-grid">
          <article className="panel source-card">
            <span className="source-number">01</span>
            <p className="section-kana">DICTIONARY DATA</p>
            <h2>JMdict 日语词典</h2>
            <p>
              日文词形、读音和英文释义主要参考 JMdict/EDICT Dictionary
              Project。数据采用 Creative Commons Attribution-ShareAlike
              4.0（CC BY-SA 4.0）授权。
            </p>
            <a href="https://www.edrdg.org/edrdg/licence.html">
              查看 JMdict 授权说明 ↗
            </a>
          </article>

          <article className="panel source-card">
            <span className="source-number">02</span>
            <p className="section-kana">REFERENCE LEVELS</p>
            <h2>开放 JLPT 等级资料</h2>
            <p>
              词汇主库来自 MIT 授权的开放 JLPT 10K 数据包，共导入约
              1.17 万条分级记录。上游将 N5 与 N4 合并为一个参考带，本站明确保留这一说明。
            </p>
            <a href="https://www.npmjs.com/package/@polyglot-bundles/ja-jlpt-syllabi">
              查看开放 10K 数据包 ↗
            </a>
          </article>

          <article className="panel source-card">
            <span className="source-number">03</span>
            <p className="section-kana">ORIGINAL QUESTIONS</p>
            <h2>本站原创练习</h2>
            <p>
              练习围绕常见 JLPT 文字词汇考点编写，并提供中文解析。题库会持续按备考范围扩充。
            </p>
            <a href="https://www.jlpt.jp/e/guideline/testsections.html">
              查看官方题型结构 ↗
            </a>
          </article>

          <article className="panel source-card coral-source">
            <span className="source-number">04</span>
            <p className="section-kana">LISTENING EXTENSION</p>
            <h2>NHK 官方日语学习</h2>
            <p>
              站内听力为原创文本并使用设备自带日语语音朗读。需要更多真实广播输入时，可前往 NHK WORLD-JAPAN
              官方日语学习页面；本站不复制或重新托管 NHK 音频。
            </p>
            <a href="https://www.nhk.or.jp/lesson/zh/" target="_blank" rel="noreferrer">
              打开 NHK 简明日语 ↗
            </a>
          </article>

        </section>

        <section className="license-note panel">
          <div className="brand-mark" aria-hidden="true">
            注
          </div>
          <div>
            <h2>内容维护</h2>
            <p>
              词汇等级与释义会持续校对；语法、阅读、听力和模拟卷均为本站原创 JLPT
              风格练习，不冒充官方历年真题。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
