import { writeFileSync } from "node:fs";

const words = [
  ["N5","会う","あう","见面","to meet","动词"],["N5","青","あお","蓝色","blue","名词"],["N5","赤","あか","红色","red","名词"],["N5","明るい","あかるい","明亮的；开朗的","bright; cheerful","形容词"],["N5","秋","あき","秋天","autumn","名词"],["N5","開く","あく","打开；开着","to open","动词"],["N5","開ける","あける","打开（某物）","to open something","动词"],["N5","上げる","あげる","举起；提高","to raise","动词"],["N5","朝","あさ","早晨","morning","名词"],["N5","朝ご飯","あさごはん","早饭","breakfast","名词"],["N5","明日","あした","明天","tomorrow","名词"],["N5","足","あし","脚；腿","foot; leg","名词"],["N5","遊ぶ","あそぶ","玩；游玩","to play","动词"],["N5","暖かい","あたたかい","温暖的","warm","形容词"],["N5","頭","あたま","头；头脑","head","名词"],["N5","新しい","あたらしい","新的","new","形容词"],["N5","あちら","あちら","那边；那位","over there","代词"],["N5","暑い","あつい","炎热的","hot weather","形容词"],["N5","後","あと","之后；后面","after; behind","名词"],["N5","兄","あに","哥哥","older brother","名词"],
  ["N4","安心","あんしん","放心；安心","relief; peace of mind","名词"],["N4","安全","あんぜん","安全","safety","名词"],["N4","案内","あんない","引导；介绍","guidance","名词"],["N4","以下","いか","以下","not more than; below","名词"],["N4","以外","いがい","以外","except; other than","名词"],["N4","医学","いがく","医学","medicine","名词"],["N4","意見","いけん","意见","opinion","名词"],["N4","石","いし","石头","stone","名词"],["N4","急ぐ","いそぐ","赶快；着急","to hurry","动词"],["N4","一生","いっしょう","一生","whole life","名词"],["N4","一度","いちど","一次；一度","once","副词"],["N4","一番","いちばん","最；第一","most; number one","副词"],["N4","以内","いない","以内","within","名词"],["N4","田舎","いなか","乡下","countryside","名词"],["N4","受付","うけつけ","接待处；受理","reception","名词"],["N4","運転","うんてん","驾驶","driving","名词"],["N4","遠慮","えんりょ","客气；谢绝","reserve; restraint","名词"],["N4","お祝い","おいわい","祝贺；贺礼","celebration","名词"],["N4","起こす","おこす","叫醒；引起","to wake; cause","动词"],["N4","落とす","おとす","使落下；弄丢","to drop; lose","动词"],
  ["N3","愛情","あいじょう","爱情；爱意","love; affection","名词"],["N3","合図","あいず","信号；暗号","signal","名词"],["N3","相手","あいて","对方；伙伴","partner; opponent","名词"],["N3","明かり","あかり","灯光；光亮","light","名词"],["N3","握手","あくしゅ","握手","handshake","名词"],["N3","悪魔","あくま","恶魔","devil","名词"],["N3","暗記","あんき","背诵；记忆","memorization","名词"],["N3","安定","あんてい","稳定","stability","名词"],["N3","意外","いがい","意外","unexpected","形容动词"],["N3","意志","いし","意志","will; intention","名词"],["N3","医療","いりょう","医疗","medical care","名词"],["N3","影響","えいきょう","影响","influence","名词"],["N3","援助","えんじょ","援助","assistance","名词"],["N3","演説","えんぜつ","演讲","speech","名词"],["N3","横断","おうだん","横穿；横断","crossing","名词"],["N3","応募","おうぼ","应征；报名","application","名词"],["N3","温度","おんど","温度","temperature","名词"],["N3","解決","かいけつ","解决","solution","名词"],["N3","確認","かくにん","确认","confirmation","名词"],["N3","活動","かつどう","活动","activity","名词"],
  ["N2","圧倒","あっとう","压倒","overwhelm","名词"],["N2","扱う","あつかう","处理；操作","to handle","动词"],["N2","改める","あらためる","改正；重新做","to reform; renew","动词"],["N2","案外","あんがい","意外地","unexpectedly","副词"],["N2","依然","いぜん","依然","still; as before","副词"],["N2","維持","いじ","维持","maintenance","名词"],["N2","一応","いちおう","姑且；大致","for the time being","副词"],["N2","一段と","いちだんと","更加；越发","even more","副词"],["N2","引用","いんよう","引用","quotation","名词"],["N2","応用","おうよう","应用","application","名词"],["N2","解釈","かいしゃく","解释；理解","interpretation","名词"],["N2","改善","かいぜん","改善","improvement","名词"],["N2","快適","かいてき","舒适","comfortable","形容动词"],["N2","確実","かくじつ","确实；可靠","certain; reliable","形容动词"],["N2","活躍","かつやく","活跃","active role","名词"],["N2","観察","かんさつ","观察","observation","名词"],["N2","関心","かんしん","关心；兴趣","interest","名词"],["N2","基準","きじゅん","标准；基准","standard","名词"],["N2","傾向","けいこう","倾向","tendency","名词"],["N2","検討","けんとう","研究；讨论","consideration","名词"],
  ["N1","現像","げんぞう","显影（胶片）","developing film","名词"],["N1","原則","げんそく","原则","principle","名词"],["N1","見地","けんち","观点；立场","point of view","名词"],["N1","現地","げんち","当地；现场","actual place; local","名词"],["N1","限定","げんてい","限定；限制","limitation","名词"],["N1","原点","げんてん","原点；起点","origin","名词"],["N1","原典","げんてん","原典；原始资料","original source","名词"],["N1","原爆","げんばく","原子弹","atomic bomb","名词"],["N1","原文","げんぶん","原文","original text","名词"],["N1","厳密","げんみつ","严密；严格","strict; precise","形容动词"],["N1","賢明","けんめい","明智","wise; prudent","形容动词"],["N1","権限","けんげん","权限；职权","authority","名词"],["N1","懸命","けんめい","拼命；竭尽全力","eager; devoted","形容动词"],["N1","合意","ごうい","达成一致","agreement","名词"],["N1","合理","ごうり","合理","rationality","名词"],["N1","克服","こくふく","克服","overcoming","名词"],["N1","根拠","こんきょ","根据；依据","basis; grounds","名词"],["N1","混同","こんどう","混淆","confusion","名词"],["N1","採択","さいたく","采纳；通过","adoption","名词"],["N1","錯覚","さっかく","错觉","illusion","名词"],
];

const esc = (value) => `'${String(value).replaceAll("'", "''")}'`;
const values = words
  .map((word) => `(${word.map(esc).join(",")},'JMdict / Open Anki JLPT')`)
  .join(",\n");

const questions = [];
for (const level of ["N5", "N4", "N3", "N2", "N1"]) {
  const levelWords = words.filter((word) => word[0] === level);
  levelWords.forEach((word, index) => {
    const distractors = [1, 2, 3].map(
      (offset) => levelWords[(index + offset) % levelWords.length][3],
    );
    const options = [word[3], ...distractors];
    const rotation = index % 4;
    const rotated = options.slice(rotation).concat(options.slice(0, rotation));
    questions.push([
      level,
      index % 2 === 0 ? "词义判断" : "文字词汇",
      `「${word[1]}（${word[2]}）」的中文意思是？`,
      JSON.stringify(rotated),
      String(rotated.indexOf(word[3])),
      `「${word[1]}」读作「${word[2]}」，意思是“${word[3]}”。`,
      "日语搭子原创 · JLPT 风格练习",
    ]);
  });
}

const questionValues = questions
  .map((question) => `(${question.map(esc).join(",")})`)
  .join(",\n");

const sql = `INSERT OR IGNORE INTO vocabulary
(level, expression, reading, meaning_zh, meaning_en, part_of_speech, source)
VALUES
${values};

CREATE UNIQUE INDEX IF NOT EXISTS questions_level_prompt_uidx
ON questions (level, prompt);

INSERT OR IGNORE INTO questions
(level, type, prompt, options_json, correct_index, explanation, source)
VALUES
${questionValues};
`;

writeFileSync(new URL("../drizzle/0002_expand_jlpt_questions.sql", import.meta.url), sql);
console.log(`Generated ${words.length} vocabulary rows and ${questions.length} questions.`);
