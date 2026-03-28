import { useState, useRef, useCallback } from "react";

const C = {
  gold: "#B69B4C",
  goldDark: "#8C7635",
  goldMed: "#C9AD5C",
  goldLight: "#F7F2E4",
  goldLighter: "#FBF8F0",
  border: "#E6DFD3",
  borderLight: "#F0EBE2",
  text: "#2C2620",
  textSec: "#6B6155",
  textMuted: "#A99E90",
  warn: "#B5804A",
  warnLight: "#FDF6EE",
  warnBorder: "#E8D0B8",
  green: "#5A8C6F",
  greenLight: "#EEF5F0",
  greenBorder: "#C8DDD0",
  orange: "#C47A30",
  orangeLight: "#FFF5EB",
  danger: "#D81B60",
  dangerLight: "#FCE4EC",
};

const kakinokiData = [
  { grade: 0, title: "正常", desc: "口腔乾燥や唾液の粘性亢進はない" },
  {
    grade: 1,
    title: "軽度",
    desc: "唾液が粘性亢進、やや唾液が少ない。唾液が糸を引く",
  },
  { grade: 2, title: "中等度", desc: "唾液が極めて少ない。細かい泡がみられる" },
  { grade: 3, title: "重度", desc: "唾液が舌粘膜上にみられない" },
];

const icons = {
  hygiene: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </>
  ),
  dryness: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  bite: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  tongue: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </>
  ),
  pressure: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  chewing: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6v6H9z" />
    </>
  ),
  swallow: (
    <>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <polyline points="8 6 12 9 16 6" />
    </>
  ),
};

const adviceTexts = {
  swallow:
    "食べ物や飲み物を「飲み込む」機能が低下しています。食事中にむせやすくなったり、気管に入ってしまう（誤嚥）リスクが高まります。飲み込みやすくするための食事指導や、嚥下訓練を行っていく必要があります。",
  hygiene:
    "舌に汚れ（舌苔）が多く付着し、お口の中の清潔度が低下している状態です。細菌が繁殖しやすくなるため、毎日の歯みがきに加え、舌ブラシを使ったケアや、当院での定期的な専門クリーニング（細菌数管理）を行いましょう。",
  dryness:
    "お口の中の水分量（唾液の量）が少なくなり、乾燥しやすい状態です。お口が乾くと虫歯や口臭の原因になるほか、食事がしづらくなります。こまめな水分補給や、唾液腺マッサージ、口腔保湿剤の活用で潤いを保ちましょう。",
  chewing:
    "食べ物を細かく噛み砕く能力が低下しています。胃腸に負担がかかり、十分な栄養やエネルギーが吸収されにくくなる恐れがあります。よく噛むことを意識した食事の工夫や、噛み合わせの治療を並行して行いましょう。",
  tongue:
    "唇や頬、舌を素早く動かす機能が低下しています。食べこぼしが増えたり、滑舌が悪くなる原因に繋がります。お口周りの筋肉を鍛えるトレーニング（MFT）を毎日の生活に取り入れ、機能を改善していきましょう。",
  pressure:
    "舌の筋力（舌圧）が低下しています。舌の力は、食べ物を口の中でまとめたり、安全に飲み込んだりするために非常に重要です。当院でご案内しているトレーニング器具（ペコパンダ等）を毎日の生活に取り入れ、舌の力を鍛えていきましょう。",
  biteLow:
    "噛み締める力（咬合力）が弱くなっています。硬いものが食べにくくなる原因となります。しっかりと噛める状態を取り戻すため、合わない入れ歯や噛み合わせの調整、必要な歯の治療を進めていきましょう。",
  biteHigh:
    "噛み締める力（咬合力）が強すぎる状態です。無意識の食いしばりや歯ぎしりにより、歯が割れたり、顎の関節に過度な負担がかかるリスクがあります。大切な歯を守るために、就寝時のマウスピースの装着や、筋肉の緊張を和らげるボトックス治療をご提案いたします。",

  overallDeclined:
    "検査の結果、お口の機能の低下（口腔機能低下症）が認められました。放置すると全身の健康に悪影響を及ぼすリスクがあります。ご自身の歯でおいしく安全に食事を続けるために、「まもる　なおす　ととのえる」の視点から、当院と一緒に改善プログラムに取り組んでいきましょう。",
  overallSuspect:
    "検査の結果、お口の機能の一部に低下のサイン（口腔機能低下症の疑い）が見られます。早い段階でケアやトレーニングを始めることで、機能の回復が十分に可能です。「まもる　なおす　ととのえる」の視点から、健やかなお口の環境づくりをサポートいたします。",
  overallNormal:
    "検査の結果、現在のところお口の機能は正常に保たれています。大変素晴らしい状態です。この良好な状態を長く維持できるよう、引き続き「まもる　なおす　ととのえる」の視点で当院がしっかりとサポートさせていただきます。",
};

const initState = () => ({
  patientId: "",
  patientName: "",
  date: "",
  swallowScore: "",
  tongueScores: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  kakinokiGrade: null,
  remainingTeeth: "",
  tongueLipPa: "",
  tongueLipTa: "",
  tongueLipKa: "",
  tonguePressure: "",
  biteForce: "",
  advice: "",
});

function judgeSwallow(v) {
  const n = parseFloat(v);
  return v === "" || isNaN(n)
    ? { status: "" }
    : { status: n >= 3 ? "low" : "normal" };
}
function judgeHygiene(scores) {
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 18) * 100);
  return {
    total,
    pct,
    status: total > 0 ? (pct >= 50 ? "low" : "normal") : "",
  };
}
function judgeDryness(grade) {
  return grade === null
    ? { status: "" }
    : { status: grade >= 2 ? "low" : "normal" };
}
function judgeChewing(v) {
  const n = parseFloat(v);
  return v === "" || isNaN(n)
    ? { status: "" }
    : { status: n < 20 ? "low" : "normal" };
}

function judgeTongueLip(pa, ta, ka) {
  const vals = [pa, ta, ka].map((v) => parseFloat(v)).filter((v) => !isNaN(v));
  if (vals.length === 0) return { status: "", display: "" };

  const rates = vals.map((v) => v / 5);
  const minRate = Math.min(...rates);
  const status = minRate < 6.0 ? "low" : "normal";

  const pRate =
    pa !== "" && !isNaN(parseFloat(pa)) ? (parseFloat(pa) / 5).toFixed(1) : "-";
  const tRate =
    ta !== "" && !isNaN(parseFloat(ta)) ? (parseFloat(ta) / 5).toFixed(1) : "-";
  const kRate =
    ka !== "" && !isNaN(parseFloat(ka)) ? (parseFloat(ka) / 5).toFixed(1) : "-";

  const display = `パ:${pRate} タ:${tRate} カ:${kRate}`;

  return { status, display };
}

function judgePressure(v) {
  const n = parseFloat(v);
  return v === "" || isNaN(n)
    ? { status: "" }
    : { status: n < 30 ? "low" : "normal" };
}
function judgeBite(v) {
  const n = parseFloat(v);
  if (v === "" || isNaN(n)) return { status: "" };
  if (n > 500) return { status: "high" };
  if (n < 375) return { status: "low" };
  return { status: "normal" };
}

function getOverall(count) {
  if (count >= 3)
    return {
      key: "declined",
      label: "口腔機能低下症",
      color: C.warn,
      bg: C.warnLight,
    };
  if (count >= 1)
    return {
      key: "suspect",
      label: "口腔機能低下症の疑い",
      color: C.orange,
      bg: C.orangeLight,
    };
  return { key: "normal", label: "正常", color: C.green, bg: C.greenLight };
}

const overallOptions = [
  { key: "declined", label: "口腔機能低下症", color: C.warn, bg: C.warnLight },
  {
    key: "suspect",
    label: "口腔機能低下症の疑い",
    color: C.orange,
    bg: C.orangeLight,
  },
  { key: "normal", label: "正常", color: C.green, bg: C.greenLight },
];

function Badge({ status, label }) {
  const isMatch =
    (status === "low" && label === "低下") ||
    (status === "normal" && label === "正常") ||
    (status === "high" && label === "過大");
  let color = C.textMuted;
  let bg = "#fff";
  let border = C.border;

  if (isMatch) {
    if (label === "低下") {
      color = C.warn;
      bg = C.warnLight;
      border = C.warn;
    } else if (label === "正常") {
      color = C.green;
      bg = C.greenLight;
      border = C.green;
    } else if (label === "過大") {
      color = C.danger;
      bg = C.dangerLight;
      border = C.danger;
    }
  }

  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        padding: "4px 14px",
        borderRadius: 20,
        border: `1.5px solid ${isMatch ? border : C.border}`,
        color: isMatch ? color : C.textMuted,
        background: isMatch ? bg : "#fff",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function IconBox({ id }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: C.goldLight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.gold,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        style={{ width: 19, height: 19 }}
      >
        {icons[id]}
      </svg>
    </div>
  );
}

function CardBg(status) {
  if (status === "low")
    return { background: C.warnLight, border: `1px solid ${C.warnBorder}` };
  if (status === "high")
    return { background: C.dangerLight, border: `1px solid ${C.danger}` };
  if (status === "normal")
    return { background: C.greenLight, border: `1px solid ${C.greenBorder}` };
  return { background: C.goldLighter, border: `1px solid ${C.borderLight}` };
}

function InputCard({ id, name, sub, status, criteria, hasHigh, children }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        ...CardBg(status),
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <IconBox id={id} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
              {name}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              {sub}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Badge status={status} label="正常" />
          <Badge status={status} label="低下" />
          {hasHigh && <Badge status={status} label="過大" />}
        </div>
      </div>
      {children}
      <div
        style={{
          marginTop: 10,
          fontSize: 11,
          color: C.textMuted,
          background: "rgba(255,255,255,0.7)",
          display: "inline-block",
          padding: "3px 10px",
          borderRadius: 4,
        }}
      >
        <strong style={{ fontWeight: 600, color: C.goldDark }}>
          判定基準:
        </strong>{" "}
        {criteria}
      </div>
    </div>
  );
}

function Section({ title, titleRight, children, compact }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        background: "#fff",
        borderRadius: 12,
        border: `1px solid ${C.borderLight}`,
        padding: compact ? "16px 18px" : "20px 24px",
        marginBottom: compact ? 0 : 12,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: C.gold,
            letterSpacing: 2,
          }}
        >
          {title}
        </div>
        {titleRight && <div>{titleRight}</div>}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function TongueScoreGrid({ scores, onChange }) {
  const labels = [
    "①左奥",
    "②中奥",
    "③右奥",
    "④左中",
    "⑤中央",
    "⑥右中",
    "⑦左前",
    "⑧中前",
    "⑨右前",
  ];
  const scoreColors = [
    { border: C.border, bg: "#fff", color: C.textMuted },
    { border: "#D4B870", bg: "#FFF9ED", color: "#A68B3C" },
    { border: C.warn, bg: "#F9EDE3", color: C.warn },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 12,
          fontSize: 12,
          color: C.textSec,
          flexWrap: "wrap",
        }}
      >
        <span>
          <strong style={{ color: C.textMuted }}>スコア0</strong> 舌苔なし
        </span>
        <span>
          <strong style={{ color: "#A68B3C" }}>スコア1</strong>{" "}
          薄い舌苔（舌乳頭が見える）
        </span>
        <span>
          <strong style={{ color: C.warn }}>スコア2</strong>{" "}
          厚い舌苔（舌乳頭が見えない）
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
            flex: "1 1 280px",
            maxWidth: 400,
          }}
        >
          {scores.map((score, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 8,
                border: `1px solid ${C.borderLight}`,
                padding: "8px 4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textSec }}>
                {labels[i]}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {[0, 1, 2].map((si) => {
                  const active = score === si;
                  const sc = scoreColors[si];
                  return (
                    <button
                      key={si}
                      onClick={() => {
                        const next = [...scores];
                        next[i] = si;
                        onChange(next);
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 5,
                        fontSize: 13,
                        fontWeight: 700,
                        border: `2px solid ${
                          active ? sc.border : C.borderLight
                        }`,
                        background: active ? sc.bg : "#FAFAF8",
                        color: active ? sc.color : "#D0CBC2",
                        cursor: "pointer",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        transition: "all 0.15s",
                        padding: 0,
                      }}
                    >
                      {si}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "12px 16px",
            background: "#fff",
            borderRadius: 8,
            border: `1px solid ${C.borderLight}`,
            flex: "1 1 180px",
          }}
        >
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>
            舌苔の付着度（TCI）
          </div>
          <div style={{ fontSize: 12, color: C.textSec, marginBottom: 8 }}>
            スコア合計 / 18 × 100
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1,
            }}
          >
            {scores.reduce((a, b) => a + b, 0)}
            <span style={{ fontSize: 13, fontWeight: 400, color: C.textMuted }}>
              {" "}
              / 18
            </span>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.text,
              marginTop: 6,
            }}
          >
            {Math.round((scores.reduce((a, b) => a + b, 0) / 18) * 100)}
            <span style={{ fontSize: 13, fontWeight: 400, color: C.textMuted }}>
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KakinokiSelector({ grade, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {kakinokiData.map((k) => {
        const selected = grade === k.grade;
        const isWarn = k.grade >= 2;
        return (
          <button
            key={k.grade}
            onClick={() => onChange(selected ? null : k.grade)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 8,
              textAlign: "left",
              border: `2px solid ${
                selected ? (isWarn ? C.warn : C.green) : C.borderLight
              }`,
              background: selected
                ? isWarn
                  ? C.warnLight
                  : C.greenLight
                : "#fff",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: `2px solid ${
                  selected ? (isWarn ? C.warn : C.green) : C.border
                }`,
                background: selected ? (isWarn ? C.warn : C.green) : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {selected && (
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>
                  ✓
                </span>
              )}
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: selected ? (isWarn ? C.warn : C.green) : C.text,
                }}
              >
                {k.grade}度（{k.title}）
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.textMuted,
                  marginTop: 2,
                  lineHeight: 1.5,
                }}
              >
                {k.desc}
              </div>
            </div>
          </button>
        );
      })}
      <div
        style={{
          fontSize: 10,
          color: C.textMuted,
          lineHeight: 1.6,
          marginTop: 4,
          padding: "6px 10px",
          background: C.goldLighter,
          borderRadius: 6,
        }}
      >
        ※
        細かい泡＝おおよそ1mm以下の泡あるいは白く見える泡。粘液亢進は糸引き状態で判定。1〜2mm以上の泡の場合は1度と判定。
      </div>
    </div>
  );
}

/* ════════════════ MAIN ════════════════ */
export default function OralHealthApp() {
  const [d, setD] = useState(initState());
  const [mode, setMode] = useState("input");
  const printRef = useRef(null);

  const set = useCallback((k, v) => setD((prev) => ({ ...prev, [k]: v })), []);

  const swal = judgeSwallow(d.swallowScore);
  const hyg = judgeHygiene(d.tongueScores);
  const dry = judgeDryness(d.kakinokiGrade);
  const chew = judgeChewing(d.remainingTeeth);
  const tlip = judgeTongueLip(d.tongueLipPa, d.tongueLipTa, d.tongueLipKa);
  const pres = judgePressure(d.tonguePressure);
  const bite = judgeBite(d.biteForce);

  const allItems = [
    {
      id: "swallow",
      name: "嚥下機能",
      sub: "飲み込む力（EAT-10）",
      status: swal.status,
      displayVal: d.swallowScore ? `${d.swallowScore} 点` : "",
      criteria: "3点以上で低下",
    },
    {
      id: "hygiene",
      name: "口腔衛生",
      sub: "お口の清潔さ（舌苔付着度 TCI）",
      status: hyg.status,
      displayVal: hyg.total > 0 ? `${hyg.total}/18（${hyg.pct}%）` : "",
      criteria: "TCI 50%以上で低下",
    },
    {
      id: "dryness",
      name: "口腔乾燥",
      sub: "お口の潤い（柿の木分類・視診）",
      status: dry.status,
      displayVal:
        d.kakinokiGrade !== null
          ? `${d.kakinokiGrade}度（${kakinokiData[d.kakinokiGrade].title}）`
          : "",
      criteria: "2度以上で低下",
    },
    {
      id: "chewing",
      name: "咀嚼機能",
      sub: "噛み砕く力（残存歯数）",
      status: chew.status,
      displayVal: d.remainingTeeth ? `${d.remainingTeeth} 本` : "",
      criteria: "20本未満で低下 ※残根・動揺度3を除く",
    },
    {
      id: "tongue",
      name: "舌唇運動",
      sub: "舌・唇の動き",
      status: tlip.status,
      displayVal: tlip.display ? `${tlip.display}` : "",
      criteria: "いずれかが6.0回/秒未満で低下",
    },
    {
      id: "pressure",
      name: "舌圧",
      sub: "舌の筋力",
      status: pres.status,
      displayVal: d.tonguePressure ? `${d.tonguePressure} kPa` : "",
      criteria: "30kPa未満で低下",
    },
    {
      id: "bite",
      name: "咬合力",
      sub: "噛む力",
      status: bite.status,
      displayVal: d.biteForce ? `${d.biteForce} N` : "",
      criteria: "375N未満で低下 / 500N超で過大",
      hasHigh: true,
    },
  ];

  const lowCount = allItems.filter((i) => i.status === "low").length;
  const judgedCount = allItems.filter((i) => i.status !== "").length;
  const autoOverall = getOverall(lowCount);

  const handleGenerateAdvice = () => {
    if (judgedCount === 0) {
      alert(
        "検査結果が入力されていません。数値を入力して判定を確定させてください。"
      );
      return;
    }

    let newAdvice = [];
    if (swal.status === "low")
      newAdvice.push("【嚥下機能低下】\n" + adviceTexts.swallow);
    if (hyg.status === "low")
      newAdvice.push("【口腔衛生】\n" + adviceTexts.hygiene);
    if (dry.status === "low")
      newAdvice.push("【口腔乾燥】\n" + adviceTexts.dryness);
    if (chew.status === "low")
      newAdvice.push("【咀嚼機能低下】\n" + adviceTexts.chewing);
    if (tlip.status === "low")
      newAdvice.push("【舌唇運動低下】\n" + adviceTexts.tongue);
    if (pres.status === "low")
      newAdvice.push("【低舌圧】\n" + adviceTexts.pressure);
    if (bite.status === "low")
      newAdvice.push("【咬合力低下】\n" + adviceTexts.biteLow);
    if (bite.status === "high")
      newAdvice.push("【咬合力過大】\n" + adviceTexts.biteHigh);

    if (autoOverall.key === "declined") {
      newAdvice.push("【総評】\n" + adviceTexts.overallDeclined);
    } else if (autoOverall.key === "suspect") {
      newAdvice.push("【総評】\n" + adviceTexts.overallSuspect);
    } else if (autoOverall.key === "normal") {
      newAdvice.push("【総評】\n" + adviceTexts.overallNormal);
    }

    if (
      d.advice !== "" &&
      !window.confirm(
        "現在入力されているアドバイスを上書きしてもよろしいですか？"
      )
    ) {
      return;
    }
    set("advice", newAdvice.join("\n\n"));
  };

  // 修正箇所: 印刷モードを引数として受け取り、PDFモードの場合は直前にガイドを出す
  const handlePrint = (printMode) => {
    const el = printRef.current;
    if (!el) return;

    if (printMode === "pdf") {
      alert(
        "【iPadでのPDF保存手順】\n\n次に表示されるプレビュー画面の右上（または上部）にある「共有マーク（四角から上矢印が出るアイコン）」をタップし、メニューから「ファイルに保存」または目的のアプリを選択してください。"
      );
    }

    const w = window.open("", "_blank");

    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Noto Sans JP',sans-serif;background:#fff;}
        @media print{
          @page{size:A4;margin:0;}
          body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
          .page-break { page-break-before: always !important; break-before: page !important; padding-top: 15mm !important; }
        }
      </style></head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  };

  const handleReset = () => {
    if (window.confirm("入力内容をすべてクリアしますか？")) setD(initState());
  };

  const numInput = {
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1.5px solid ${C.border}`,
    fontSize: 20,
    fontWeight: 700,
    width: 120,
    textAlign: "right",
    outline: "none",
    background: "#fff",
    fontFamily: "'Noto Sans JP', sans-serif",
    appearance: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F2ED",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: `2px solid ${C.gold}`,
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 8,
              height: 8,
              background: C.gold,
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: 18,
              fontWeight: 700,
              color: C.text,
              letterSpacing: 2,
            }}
          >
            口腔機能管理計画書
          </span>
          <span
            style={{
              fontSize: 10,
              color: C.textMuted,
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}
          >
            入力システム
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["input", "preview"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "7px 20px",
                borderRadius: 20,
                border: `1.5px solid ${mode === m ? C.gold : C.border}`,
                background: mode === m ? C.goldLight : "#fff",
                color: mode === m ? C.goldDark : C.textMuted,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {m === "input" ? "入力" : "プレビュー"}
            </button>
          ))}
          {/* 修正箇所: 印刷ボタンとPDF保存ボタンを独立させ、Googleドライブボタンを削除 */}
          <button
            onClick={() => handlePrint("print")}
            style={{
              padding: "7px 20px",
              borderRadius: 20,
              border: "none",
              background: `linear-gradient(135deg, ${C.green}, #45785A)`,
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            印刷する
          </button>
          <button
            onClick={() => handlePrint("pdf")}
            style={{
              padding: "7px 20px",
              borderRadius: 20,
              border: "none",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            PDF保存
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "7px 14px",
              borderRadius: 20,
              border: `1.5px solid ${C.border}`,
              background: "#fff",
              color: C.textMuted,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            リセット
          </button>
        </div>
      </div>

      {/* ════ INPUT ════ */}
      {mode === "input" && (
        <div style={{ maxWidth: 780, margin: "24px auto", padding: "0 16px" }}>
          <Section title="患者情報">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  flex: "1 1 120px",
                }}
              >
                <span style={{ fontSize: 12, color: C.textMuted }}>
                  カルテ番号 (PT. NO)
                </span>
                <input
                  value={d.patientId}
                  onChange={(e) => set("patientId", e.target.value)}
                  placeholder="00000"
                  style={{
                    ...numInput,
                    width: "100%",
                    fontSize: 16,
                    fontWeight: 500,
                    textAlign: "left",
                  }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  flex: "1 1 200px",
                }}
              >
                <span style={{ fontSize: 12, color: C.textMuted }}>患者名</span>
                <input
                  value={d.patientName}
                  onChange={(e) => set("patientName", e.target.value)}
                  placeholder="山田 太郎"
                  style={{
                    ...numInput,
                    width: "100%",
                    fontSize: 16,
                    fontWeight: 500,
                    textAlign: "left",
                  }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  flex: "1 1 150px",
                }}
              >
                <span style={{ fontSize: 12, color: C.textMuted }}>検査日</span>
                <input
                  type="date"
                  value={d.date}
                  onChange={(e) => set("date", e.target.value)}
                  style={{
                    ...numInput,
                    width: "100%",
                    fontSize: 15,
                    fontWeight: 500,
                    textAlign: "left",
                  }}
                />
              </label>
            </div>
          </Section>

          <Section title="① 嚥下機能（EAT-10）">
            <InputCard
              id="swallow"
              name="嚥下機能"
              sub="EAT-10スコア（合計点数）"
              status={swal.status}
              criteria="3点以上で低下"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  inputMode="decimal"
                  value={d.swallowScore}
                  onChange={(e) => set("swallowScore", e.target.value)}
                  placeholder="—"
                  style={numInput}
                />
                <span style={{ fontSize: 14, color: C.textMuted }}>
                  点（EAT-10合計）
                </span>
              </div>
            </InputCard>
          </Section>

          <Section title="② 口腔衛生（舌苔付着度 TCI）">
            <InputCard
              id="hygiene"
              name="口腔衛生"
              sub="舌を9区画に分け、各区画の舌苔スコア（0・1・2）を記録"
              status={hyg.status}
              criteria="TCI 50%以上で低下"
            >
              <TongueScoreGrid
                scores={d.tongueScores}
                onChange={(v) => set("tongueScores", v)}
              />
            </InputCard>
          </Section>

          <Section title="③ 口腔乾燥（柿の木分類・視診）">
            <InputCard
              id="dryness"
              name="口腔乾燥"
              sub="柿の木分類に基づく視診で判定"
              status={dry.status}
              criteria="2度以上で低下"
            >
              <KakinokiSelector
                grade={d.kakinokiGrade}
                onChange={(v) => set("kakinokiGrade", v)}
              />
            </InputCard>
          </Section>

          <Section title="④ 咀嚼機能（残存歯数）">
            <InputCard
              id="chewing"
              name="咀嚼機能"
              sub="残存歯の本数で判定（残根と動揺度3の歯を除く）"
              status={chew.status}
              criteria="20本未満で低下 ※残根・動揺度3を除く"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  inputMode="decimal"
                  value={d.remainingTeeth}
                  onChange={(e) => set("remainingTeeth", e.target.value)}
                  placeholder="—"
                  style={numInput}
                />
                <span style={{ fontSize: 14, color: C.textMuted }}>本</span>
              </div>
            </InputCard>
          </Section>

          <Section title="⑤ 舌唇運動（オーラルディアドコキネシス）">
            <InputCard
              id="tongue"
              name="舌唇運動"
              sub="パ・タ・カそれぞれの【5秒間】の回数を入力"
              status={tlip.status}
              criteria="いずれかが 1秒あたり 6.0回未満で低下"
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <label
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{ fontSize: 15, fontWeight: 700, color: C.text }}
                  >
                    パ
                  </span>
                  <input
                    inputMode="decimal"
                    value={d.tongueLipPa}
                    onChange={(e) => set("tongueLipPa", e.target.value)}
                    placeholder="—"
                    style={{ ...numInput, width: 70, padding: "8px 10px" }}
                  />
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{ fontSize: 15, fontWeight: 700, color: C.text }}
                  >
                    タ
                  </span>
                  <input
                    inputMode="decimal"
                    value={d.tongueLipTa}
                    onChange={(e) => set("tongueLipTa", e.target.value)}
                    placeholder="—"
                    style={{ ...numInput, width: 70, padding: "8px 10px" }}
                  />
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{ fontSize: 15, fontWeight: 700, color: C.text }}
                  >
                    カ
                  </span>
                  <input
                    inputMode="decimal"
                    value={d.tongueLipKa}
                    onChange={(e) => set("tongueLipKa", e.target.value)}
                    placeholder="—"
                    style={{ ...numInput, width: 70, padding: "8px 10px" }}
                  />
                </label>
                <span
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    marginLeft: "auto",
                  }}
                >
                  回 / 5秒間
                </span>
              </div>
              {tlip.display && (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    color: C.goldDark,
                    background: C.goldLight,
                    padding: "6px 12px",
                    borderRadius: 6,
                    display: "inline-block",
                  }}
                >
                  自動計算(回/秒):{" "}
                  <strong style={{ letterSpacing: 1 }}>{tlip.display}</strong>
                </div>
              )}
            </InputCard>
          </Section>

          <Section title="⑥ 舌圧">
            <InputCard
              id="pressure"
              name="舌圧"
              sub="舌の筋力"
              status={pres.status}
              criteria="30kPa未満で低下"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  inputMode="decimal"
                  value={d.tonguePressure}
                  onChange={(e) => set("tonguePressure", e.target.value)}
                  placeholder="—"
                  style={numInput}
                />
                <span style={{ fontSize: 14, color: C.textMuted }}>kPa</span>
              </div>
            </InputCard>
          </Section>

          <Section title="⑦ 咬合力">
            <InputCard
              id="bite"
              name="咬合力"
              sub="噛む力の計測値"
              status={bite.status}
              criteria="375N未満で低下 / 500N超で過大"
              hasHigh
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  inputMode="decimal"
                  value={d.biteForce}
                  onChange={(e) => set("biteForce", e.target.value)}
                  placeholder="—"
                  style={numInput}
                />
                <span style={{ fontSize: 14, color: C.textMuted }}>
                  N（ニュートン）
                </span>
              </div>
            </InputCard>
          </Section>

          {/* Auto Overall */}
          <Section title="総合判定（自動）">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontSize: 13, color: C.textSec }}>
                判定済み: <strong>{judgedCount}</strong> / 7項目　｜　低下:{" "}
                <strong style={{ color: autoOverall.color, fontSize: 20 }}>
                  {lowCount}
                </strong>{" "}
                項目
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {overallOptions.map((o) => {
                const active = autoOverall.key === o.key;
                return (
                  <div
                    key={o.key}
                    style={{
                      flex: "1 1 120px",
                      padding: "14px 8px",
                      borderRadius: 10,
                      border: `2px solid ${active ? o.color : C.border}`,
                      background: active ? o.bg : "#fff",
                      textAlign: "center",
                      transition: "all 0.2s",
                      opacity: active ? 1 : 0.4,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: `2px solid ${active ? o.color : C.border}`,
                          background: active ? o.color : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {active && (
                          <span
                            style={{
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: active ? o.color : C.textMuted,
                        }}
                      >
                        {o.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {judgedCount === 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: C.textMuted }}>
                検査結果を入力すると自動で判定されます
              </div>
            )}
          </Section>

          <div style={{ marginBottom: 12 }}>
            <Section
              title="担当医のアドバイス"
              compact
              titleRight={
                <button
                  onClick={handleGenerateAdvice}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 4,
                    background: C.goldLight,
                    color: C.goldDark,
                    border: `1px solid ${C.gold}`,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 11,
                    transition: "all 0.2s",
                  }}
                >
                  自動生成✨
                </button>
              }
            >
              <textarea
                value={d.advice}
                onChange={(e) => set("advice", e.target.value)}
                placeholder="患者さんへのアドバイスを入力..."
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  flex: 1,
                  minHeight: 200,
                  padding: 14,
                  borderRadius: 8,
                  border: `1.5px solid ${C.border}`,
                  fontSize: 14,
                  lineHeight: 2,
                  resize: "vertical",
                  outline: "none",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
              />
            </Section>
          </div>

          <div style={{ textAlign: "center", padding: "8px 0 32px" }}>
            <button
              onClick={() => setMode("preview")}
              style={{
                padding: "14px 44px",
                borderRadius: 24,
                border: "none",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              プレビューを確認 →
            </button>
          </div>
        </div>
      )}

      {/* ════ PREVIEW ════ */}
      {mode === "preview" && (
        <div style={{ maxWidth: 840, margin: "24px auto", padding: "0 16px" }}>
          <div
            ref={printRef}
            style={{
              width: "210mm",
              minHeight: "297mm",
              background: "#fff",
              margin: "0 auto",
              position: "relative",
              boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                height: 3,
                background: `linear-gradient(90deg, ${C.gold}, ${C.goldMed}, ${C.gold})`,
              }}
            />

            <div
              style={{
                padding: "28px 40px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                borderBottom: `1px solid ${C.border}`,
                position: "relative",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: C.text,
                    letterSpacing: 4,
                  }}
                >
                  口腔機能管理計画書
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 10,
                    color: C.gold,
                    letterSpacing: 3,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  ORAL HEALTH MANAGEMENT CERTIFICATE
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: C.goldDark,
                  }}
                >
                  みわ歯科クリニック船橋
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 9,
                    color: C.textMuted,
                    letterSpacing: 2,
                    marginTop: 2,
                  }}
                >
                  MIWA DENTAL CLINIC FUNABASHI
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 40,
                  right: 40,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 40px",
                background: C.goldLighter,
                borderBottom: `1px solid ${C.borderLight}`,
                gap: 28,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: 2,
                    fontWeight: 600,
                  }}
                >
                  PT. NO
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.text,
                    borderBottom: `1px solid ${C.gold}`,
                    minWidth: 60,
                    paddingBottom: 2,
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {d.patientId || "\u00A0"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: 2,
                    fontWeight: 600,
                  }}
                >
                  NAME
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: C.text,
                    borderBottom: `1px solid ${C.gold}`,
                    minWidth: 160,
                    paddingBottom: 2,
                    display: "inline-block",
                  }}
                >
                  {d.patientName || "\u00A0"}
                </span>
                <span
                  style={{ fontSize: 15, fontWeight: 500, color: C.textSec }}
                >
                  様
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginLeft: "auto",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 12,
                    color: C.gold,
                    letterSpacing: 2,
                    fontWeight: 600,
                  }}
                >
                  DATE
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: C.text,
                    borderBottom: `1px solid ${C.gold}`,
                    minWidth: 120,
                    paddingBottom: 2,
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {d.date ? d.date.replace(/-/g, " / ") : "\u00A0"}
                </span>
              </div>
            </div>

            <div style={{ padding: "18px 32px 12px" }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.gold,
                  letterSpacing: 3,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{ width: 12, height: 1, background: C.borderLight }}
                />{" "}
                検査結果 ── EXAMINATION RESULTS{" "}
                <div
                  style={{ flex: 1, height: 1, background: C.borderLight }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {allItems.map((item) => {
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: "#fff",
                        border: `1px solid ${C.borderLight}`,
                        borderRadius: 7,
                        padding: "12px 14px 10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <IconBox id={item.id} />
                          <div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: C.text,
                              }}
                            >
                              {item.name}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: C.textMuted,
                                marginTop: 1,
                              }}
                            >
                              {item.sub}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <Badge status={item.status} label="正常" />
                          <Badge status={item.status} label="低下" />
                          {item.hasHigh && (
                            <Badge status={item.status} label="過大" />
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          borderTop: `1px solid ${C.borderLight}`,
                          paddingTop: 8,
                          marginTop: "auto",
                        }}
                      >
                        <span
                          style={{
                            fontSize: item.id === "tongue" ? 16 : 20,
                            fontWeight: 700,
                            color: C.text,
                            borderBottom: `1px solid ${C.gold}`,
                            minWidth: 70,
                            paddingBottom: 2,
                            display: "inline-block",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.displayVal || "\u00A0"}
                        </span>
                        <div
                          style={{
                            fontSize: 10,
                            color: C.textMuted,
                            background: C.goldLighter,
                            padding: "3px 8px",
                            borderRadius: 4,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <strong
                            style={{ fontWeight: 600, color: C.goldDark }}
                          >
                            基準:
                          </strong>{" "}
                          {item.criteria}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {allItems.length % 2 !== 0 && (
                  <div
                    style={{ background: "transparent", border: "none" }}
                  ></div>
                )}
              </div>

              {/* Auto Overall */}
              <div
                style={{
                  margin: "12px 0 16px",
                  borderRadius: 10,
                  overflow: "hidden",
                  border: `1.5px solid ${C.gold}`,
                }}
              >
                <div
                  style={{
                    background: C.goldLighter,
                    padding: "8px 20px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.goldDark,
                    letterSpacing: 4,
                    borderBottom: `1px solid ${C.borderLight}`,
                    textAlign: "center",
                  }}
                >
                  総 合 判 定
                </div>
                <div style={{ display: "flex", background: "#fff" }}>
                  {overallOptions.map((o, i) => {
                    const active = autoOverall.key === o.key;
                    return (
                      <div
                        key={o.key}
                        style={{
                          flex: 1,
                          padding: "14px 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          fontSize: 15,
                          fontWeight: 600,
                          color: active ? o.color : C.textMuted,
                          background: active ? o.bg : "#fff",
                          opacity: active ? 1 : 0.5,
                          ...(i > 0
                            ? { borderLeft: `1px solid ${C.borderLight}` }
                            : {}),
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `2px solid ${active ? o.color : C.border}`,
                            background: active ? o.color : "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {active && (
                            <span
                              style={{
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        {o.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="page-break" style={{ marginBottom: 10 }}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 7,
                    border: `1px solid ${C.borderLight}`,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: C.goldDark,
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <svg
                      style={{ color: C.gold }}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    担当医のアドバイス
                  </div>
                  <div
                    style={{
                      border: `1px solid ${C.borderLight}`,
                      borderRadius: 7,
                      padding: 12,
                      minHeight: 180,
                      fontSize: 13,
                      color: C.textSec,
                      lineHeight: 2.2,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {d.advice || "\u00A0"}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "10px 40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderTop: `1px solid ${C.borderLight}`,
                background: C.goldLighter,
              }}
            >
              <div style={{ fontSize: 9, color: C.textMuted }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 5,
                    background: C.gold,
                    transform: "rotate(45deg)",
                    margin: "0 4px",
                    opacity: 0.5,
                  }}
                />
                本書は口腔機能低下症の検査結果および管理計画を記載したものです
                <span
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 5,
                    background: C.gold,
                    transform: "rotate(45deg)",
                    margin: "0 4px",
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "20px 0 32px",
              display: "flex",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <button
              onClick={() => setMode("input")}
              style={{
                padding: "12px 32px",
                borderRadius: 24,
                border: `1.5px solid ${C.border}`,
                background: "#fff",
                color: C.textSec,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              ← 入力に戻る
            </button>
            <button
              onClick={() => handlePrint("print")}
              style={{
                padding: "12px 40px",
                borderRadius: 24,
                border: "none",
                background: `linear-gradient(135deg, ${C.green}, #45785A)`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              印刷する
            </button>
            <button
              onClick={() => handlePrint("pdf")}
              style={{
                padding: "12px 40px",
                borderRadius: 24,
                border: "none",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              PDF保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
