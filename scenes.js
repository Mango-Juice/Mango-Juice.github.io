// 장면 구성과 타이밍, 화면 생성 도우미
const IMG = {
  olb: "assets/images/olb.jpg",
  tr: "assets/images/tr.jpg",
  sd: "assets/images/sd.jpg",
  m3: "assets/images/m3.png",
  m4: "assets/images/m4.png",
  m6: "assets/images/m6.png",
  hm2: "assets/images/hm2.jpg",
  olg: "assets/images/olg.jpg",
  sdb: "assets/images/sdb.jpg",
  tfa: "assets/images/tfa.jpg",
  hra: "assets/images/hra.jpg",
};
const BPM = 160,
  B = 60 / BPM,
  BAR = B * 4,
  STEP = B / 4;
let K = 1;
const d = (n) => `--d:${(n * B * K).toFixed(3)}s`;
const du = (n) => `--du:${(n * B * K).toFixed(3)}s`;
const kin = (txt, s, st = 0.16, extra = "") =>
  [...txt]
    .map((c, i) =>
      c === " "
        ? '<span class="sp"></span>'
        : `<span class="ch" style="${d(s + i * st)};${extra}">${c}</span>`,
    )
    .join("");
let actN = 0;
const tag = (t) =>
  `<div class="tagc a l" style="--d:0s">${t.replace(/ACT \d+/, () => "ACT " + String(++actN).padStart(2, "0"))}</div>`;
const mq = (t, top) =>
  `<div class="mq" style="--t:${top || 300}px">${(t + " · ").repeat(6)}</div>`;
const chips = (arr, top, s) =>
  `<div class="chips" style="top:${top}px">${arr.map((c, i) => `<span class="a up" style="${d(s + i * 0.5)}">${c}</span>`).join("")}</div>`;
const steps = (arr, top) =>
  `<div class="steps" style="top:${top}px">${arr.map((s, i) => `<div class="st lit" style="${d(s[1])}"><i>${String(i + 1).padStart(2, "0")}</i>${s[0]}</div>`).join("")}</div>`;
const cnt = (to, dec, b, dur, fmt, from = 0) =>
  `<span class="cnt" data-from="${from}" data-to="${to}" data-dec="${dec}" data-b="${(b * K).toFixed(3)}" data-dur="${(dur * K).toFixed(3)}" data-fmt="${fmt ? 1 : 0}">${from}</span>`;
const nd = (x, y, w, h, t, d0, cls = "", an = "up") =>
  `<div class="nd a ${an} ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${d(d0)}">${t}</div>`;
const arw = (p, d0, len = 500, col) => {
  const n = (p.match(/-?\d+\.?\d*/g) || []).map(Number);
  const ex = n[n.length - 1],
    ey = p.includes("H") ? n[1] : n[n.length - 1];
  const x = p.includes("H") ? ex : n[n.length - 2];
  return `<path class="pth" d="${p}" style="--len:${len};${d(d0)};${col ? "stroke:" + col : ""}"/><polygon class="ahd" points="${x - 13},${ey - 8} ${x + 1},${ey} ${x - 13},${ey + 8}" style="--d2:${(d0 * B * K + 0.5).toFixed(3)}s${col ? ";fill:" + col : ""}"/>`;
};
const svg = (x) => `<svg class="ar" viewBox="0 0 1920 1080">${x}</svg>`;
const eqs = (ne, ok) =>
  `<div class="eqw"><div class="eqm seq" style="color:var(--red);${d(ne[0])};${du(ne[1])}"><i></i><i></i><b></b></div><div class="eqm a pop" style="color:var(--green);${d(ok)}"><i></i><i></i></div></div>`;
const foot = (t, s) => `<div class="foot a up" style="${d(s)}">${t}</div>`;

const SC = [];
const add = (bars, o) =>
  SC.push({ bars, ob: bars, acc: "#ffb454", lv: 3, ...o });

/* 0. 콜드 오픈 */
add(2, {
  lv: 1,
  riser: 1,
  html: () =>
    ["화면", "앱", "서버", "API", "데이터", "테스트", "배포", "운영"]
      .map(
        (w, i) =>
          `<div class="word wd ${i % 3 == 1 ? "o" : i % 3 == 2 ? "c" : ""}" style="${d(i)};${du(1)}">${w}</div>`,
      )
      .join(""),
});
/* 1. 이름 */
add(2, {
  lv: 4,
  html: () => `<div class="ring" style="${d(0)}"></div>${mq("JEON MINGYU", 620)}
 <div class="mono subc a up" style="top:190px;font-size:28px;letter-spacing:.3em;color:var(--dim);${d(1.5)}">JEON MINGYU · SOFTWARE DEVELOPER</div>
 <div class="name">${kin("전민규", 0, 0.25)}</div>
 <div class="subc a up" style="top:720px;font-size:60px;font-weight:500;${d(3)}">직접 만들고, <span style="color:var(--acc)">끝까지 확인하는</span> 개발자</div>`,
});
/* 2. 숫자 */
add(3, {
  lv: 3,
  acc: "#4fd1c5",
  html: () => `${tag("01 · NUMBERS")}${mq("4.12 · 6 · 5", 560)}
 <div class="stats">
  <div class="stat a up" style="${d(0)}"><div class="n">${cnt(4.12, 2, 0.5, 3)}<small>/ 4.5</small></div><p>아주대 소프트웨어학과<em>2027.02 졸업 예정 · 133학점</em></p></div>
  <div class="stat a up" style="${d(3)}"><div class="n">${cnt(6, 0, 3.5, 2)}<small>개월</small></div><p>안랩 AI서비스개발팀 인턴<em>2025.12 – 2026.06</em></p></div>
  <div class="stat a up" style="${d(6)}"><div class="n">${cnt(5, 0, 6.5, 2)}<small>년</small></div><p>Python 사용 기간<em>가장 오래 쓴 언어</em></p></div></div>
`,
});
/* 3. GitHub */
add(4, {
  lv: 3,
  html: () => {
    const r = [
      ["Python", 1267],
      ["Java", 474],
      ["TypeScript", 381],
      ["JavaScript", 319],
      ["Dart", 302],
      ["C++", 48],
    ];
    return `${tag("02 · GITHUB")}${mq("COMMIT", 700)}<div class="hd a pop" style="${d(0)}">GitHub에 남은 <em>8년</em>의 기록</div>
 <div class="stats s2" style="top:300px">
  <div class="stat a up" style="${d(1)}"><div class="n">${cnt(3018, 0, 1, 3, 1)}</div><p>커밋<em>공개 1,747 · 비공개 1,271</em></p></div>
  <div class="stat a up" style="${d(2)}"><div class="n">${cnt(115, 0, 2, 3)}</div><p>Pull Request<em>협업 저장소 포함</em></p></div>
  <div class="stat a up" style="${d(3)}"><div class="n">${cnt(64, 0, 3, 3)}</div><p>커밋한 저장소<em>15개 계정·조직의 저장소</em></p></div></div>
 <div class="mono a up dim" style="position:absolute;left:120px;top:608px;font-size:20px;letter-spacing:.08em;${d(4)}">저장소 주 언어별 커밋 수</div>
 ${r.map((x, i) => `<div class="rowl s a up" style="top:${644 + i * 54}px;height:50px;${d(4.5 + i * 0.5)}"><b>${x[0]}</b><div class="tr"><div class="fl" style="--w:${(x[1] / 1267).toFixed(3)};${d(5 + i * 0.5)}"></div></div><span>${x[1].toLocaleString("en-US")}</span></div>`).join("")}
 <div class="foot a up" style="bottom:36px;${d(9)}">숫자는 출발점입니다. 지금부터는 무엇을 만들고 어떻게 확인했는지 보여드립니다.</div>`;
  },
});
/* ACT1 Counter */
add(5.5, {
  ob: 6.6,
  lv: 2,
  acc: "#ff7a90",
  html: () => {
    const cs = ["정상 처리", "필터", "캐시", "실패"];
    const y = (i) => 402 + i * 78;
    return `${tag("ACT 01 · 발견 · 안랩")}${mq("MISMATCH", 680)}
 <div class="hd a pop" style="font-size:84px;${d(0)}">합계가 안 맞는 곳에서 <em>결함</em>을 찾았습니다</div>
 ${nd(120, 440, 300, 100, "진단 대상<small>일별 수</small>", 1, "", "l")}
 ${nd(540, 420, 380, 140, "배치 처리<small>Scala / Finagle</small>", 2)}
 ${cs.map((c, i) => nd(1080, y(i) - 32, 340, 64, "<span>" + c + ' <small style="display:inline;margin-left:10px">Counter</small></span>', 4 + i * 0.5, i == 3 ? "hot" : "", "r")).join("")}
 ${nd(1560, 440, 240, 100, "Σ 합계", 7, "", "r")}
 ${nd(540, 336, 380, 62, "예외 → 후속 처리 중단", 9, "hot", "pop")}
 <div class="a pop" style="position:absolute;left:540px;top:336px;width:380px;height:62px;${d(15)}"><div class="nd ok" style="inset:0;width:100%;height:100%;font-size:30px">예외 처리 수정</div></div>
 ${svg(arw("M420 490H536", 2.6, 130) + cs.map((c, i) => arw(`M920 490C1000 490 1000 ${y(i)} 1076 ${y(i)}`, 4 + i * 0.5, 260) + arw(`M1420 ${y(i)}C1490 ${y(i)} 1490 490 1556 490`, 7 + i * 0.3, 260)).join(""))}
 <div class="ln" style="top:730px;display:flex;align-items:center;height:110px;gap:30px">
  <div class="box a l" style="${d(8)}">진단 대상 수</div><div style="position:relative">${eqs([9, 10], 19)}<div class="a up mono" style="position:absolute;left:0;right:0;top:-40px;text-align:center;color:var(--green);font-size:26px;${d(19)}">수정 후</div></div>
  <div class="box a r" style="${d(8)}">정상 + 필터 + 캐시 + 실패</div></div>
 ${foot("계측으로 결함을 발견하고 원인을 분석해 수정안을 제안했고, 사수님의 수정 뒤 재검증까지 제가 맡았습니다.", 20)}`;
  },
});
/* ACT2 DB */
add(5, {
  ob: 6,
  lv: 3,
  acc: "#4fd1c5",
  html: () => {
    let g = "";
    for (let i = 0; i < 96; i++) {
      g += `<div class="blk" style="position:absolute;left:${(i % 24) * 34}px;top:${Math.floor(i / 24) * 34}px;width:26px;height:26px;${d(1 + i * 0.06)}"></div>`;
    }
    return `${tag("ACT 02 · 이관 · 안랩")}${mq("POSTGRESQL", 640)}
 <div class="hd a pop" style="${d(0)}">100만 건을 옮기고,<br><em>5초 타임아웃</em> 조회를 1초 안으로</div>
 <div style="position:absolute;left:120px;top:440px;width:820px;height:130px;${d(1)}" class="a up">${g}</div>
 <div class="a up mono" style="position:absolute;left:120px;top:590px;font-size:120px;font-weight:700;${d(1.5)}">${cnt(1000000, 0, 1.5, 3.5, 1)}<span style="color:var(--acc)">+</span></div>
 <div class="a l" style="position:absolute;left:1050px;top:440px;font-size:40px;color:var(--dim);${d(11)}">관리자 목록 조회</div>
 <div class="seq" style="position:absolute;left:1050px;top:500px;font-size:140px;line-height:1.1;font-weight:900;color:var(--red);${d(11.5)};${du(6)}">5초 타임아웃</div>
 <div class="a pop" style="position:absolute;left:1050px;top:500px;font-size:140px;line-height:1.1;font-weight:900;color:var(--green);${d(17.5)}">&lt; 1초</div>
 <div class="a up mono" style="position:absolute;left:1050px;top:740px;font-size:34px;color:#d8d5cc;${d(18.5)}">EXPLAIN ANALYZE → 인덱스 적용</div>
 ${["SQL", "CSV", "TXT"].map((t, i) => nd(120 + i * 140, 850, 120, 60, t, 4 + i * 0.4, "", "l")).join("")}
 ${nd(600, 850, 230, 60, "공통 형식", 6)}${nd(890, 850, 320, 60, "COPY · 분할 적재", 7.5)}${nd(1270, 850, 260, 60, "PostgreSQL", 9, "ok", "r")}
 ${svg(arw("M520 880H596", 5.5, 90) + arw("M830 880H886", 7, 70) + arw("M1210 880H1266", 8.5, 70))}
 ${foot("수량·중복·조회·기존 기능을 대조하며 이관했습니다.", 21)}`;
  },
});
/* ACT3 LLM */
add(4, {
  ob: 5,
  lv: 3,
  html: () => {
    const X = (i) => 120 + i * (290 + 57.5);
    const grid = (marks) =>
      `<div class="mini" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;top:80px">${[0, 1, 2, 3, 4, 5].map((i) => `<div class="th">${marks && marks[i] ? `<span class="mk" style="color:${marks[i][0]};${d(marks[i][1])}">${marks[i][2]}</span>` : ""}</div>`).join("")}</div>`;
    const card = (i, title, body, d0) =>
      `<div class="nd a up" style="left:${X(i)}px;top:370px;width:290px;height:270px;place-items:start;${d(d0)}"><div style="font-size:30px">${title}</div>${body}</div>`;
    return `${tag("ACT 03 · 자동화 · 안랩")}${mq("AUTOMATE", 680)}
 <div class="hd a pop" style="font-size:72px;${d(0)}">검수 도구를 만들어,<br>3~4시간 걸리던 일을 <em>1시간 내외</em>로 줄였습니다</div>
 ${card(0, "LLM 진단 보고서", '<div class="mini"><u style="width:90%"></u><u style="width:70%"></u><u style="width:80%"></u><div class="mono" style="color:var(--red);font-size:22px;margin-top:10px">미탐·오탐? 설명 오류?</div></div>', 1)}
 ${card(1, "검수 웹 도구", grid(), 3)}
 ${card(
   2,
   "클릭으로 선택",
   grid([
     ["var(--green)", 6, "✓"],
     ["var(--red)", 6.5, "✕"],
     ["var(--green)", 7, "✓"],
     ["var(--green)", 7.5, "✓"],
     ["var(--red)", 8, "✕"],
   ]),
   5,
 )}
 ${card(3, "결과 누적", '<div class="mini"><u style="width:100%;background:#3ddc9755"></u><u style="width:100%;background:#ff4d5e55"></u><u style="width:100%;background:#3ddc9755"></u><u style="width:100%;background:#3ddc9755"></u></div>', 7)}
 ${card(4, "Confluence 게시", '<div class="mini"><u style="width:60%;background:var(--acc)"></u><u></u><u style="width:85%"></u><u style="width:75%"></u></div>', 9)}
 <div class="mono a up dim" style="position:absolute;left:${X(1)}px;top:645px;font-size:22px;${d(3.5)}">DB 데이터 + S3 스크린샷</div>
 ${svg([0, 1, 2, 3].map((i) => arw(`M${X(i) + 292} 505H${X(i + 1) - 4}`, 2 + i * 2, 70)).join(""))}
 <div class="a l" style="position:absolute;left:120px;top:730px;width:1680px;height:64px;background:#ff4d5e1f;border-left:8px solid var(--red);color:#ffc2c8;font-size:30px;font-weight:700;padding:13px 26px;${d(12)}">BEFORE · 매일 3~4시간</div>
 <div class="a l" style="position:absolute;left:120px;top:814px;width:487px;height:64px;background:#3ddc971f;border-left:8px solid var(--green);color:#b9f5d8;font-size:30px;font-weight:700;padding:13px 26px;white-space:nowrap;${d(15)}">AFTER · 1시간 내외</div>
 ${foot("매일 반복되던 검수를, 출시 전 품질 확인 흐름에 맞는 도구로 바꿨습니다.", 17)}`;
  },
});
/* ACT4 사용자 자리 */
add(5.5, {
  ob: 6.6,
  lv: 4,
  acc: "#4fd1c5",
  html: () => `${tag("ACT 04 · 사용자 관점 · 안랩")}${mq("USER FIRST", 640)}
 <div class="hd a pop" style="${d(0)}">사용자 흐름과 운영 조건에 맞춰<br><em>고쳤습니다</em></div>
 <div class="pn seq" style="${d(1.5)};${du(8.3)}"><h3>재배포 없이</h3><p>추천 질문을 바꿀 때마다 개발팀을 거치던 구조를, 담당자가 직접 수정하고 바로 반영하는 구조로 분리했습니다.</p></div>
 <div class="pn seq" style="${d(9.8)};${du(8.3)}"><h3>실수 전에</h3><p>내부 사용자가 재분석을 의도치 않게 누르는 장면을 보고, 실행 전에 설정을 확인하는 모달을 넣었습니다.</p></div>
 <div class="pn seq" style="${d(18.1)};${du(8.3)}"><h3>만료 데이터에도</h3><p>데이터가 만료되는 운영 환경에 맞춰 E2E 테스트의 검증 대상과 기대 결과를 바꾸고 Cron으로 돌렸습니다.</p></div>`,
});
/* ACT5 하루필름 */
add(5, {
  ob: 6,
  lv: 4,
  acc: "#ff7a90",
  html: () => {
    let g = "";
    for (let i = 0; i < 48; i++) {
      const w = Math.floor(i / 5),
        bad = i === 17;
      g += `<div class="blk${bad ? " bad" : ""}" style="position:absolute;left:${(i % 12) * 114}px;top:${Math.floor(i / 12) * 114}px;width:100px;height:100px;${d(6 + w * 0.9)};${du(bad ? 3.5 : 0)}"></div>`;
    }
    const N = [
      "MediaRecorder<small>녹화</small>",
      "파트 분할<small>대용량 영상</small>",
      "동시 5개 업로드<small>파트당 최대 3회</small>",
      "스토리지<small>ETag 보존</small>",
      "HLS / ABR<small>재생</small>",
    ];
    return `${tag("ACT 05 · 업로드 · 하루필름")}${mq("UPLOAD", 680)}
 <div class="hd a pop" style="font-size:88px;${d(0)}">실패한 파트를 <em>다시 시도하는</em> 업로드</div>
 ${N.map((t, i) => nd(120 + i * 345, 290, 300, 100, t, 1 + i * 1.1, i == 2 ? "hot" : "")).join("")}
 ${svg([0, 1, 2, 3].map((i) => arw(`M${424 + i * 345} 340H${462 + i * 345}`, 1.8 + i * 1.1, 60)).join(""))}
 <div style="position:absolute;left:120px;top:450px;width:1370px;height:450px">${g}</div>
 <div class="a up" style="position:absolute;left:1560px;top:450px;${d(4)}"><div style="font-size:150px;font-weight:900;color:var(--acc);line-height:1">5</div><div style="font-size:28px;color:#b9bcc6">동시 전송</div></div>
 <div class="a up" style="position:absolute;left:1560px;top:660px;${d(5)}"><div style="font-size:150px;font-weight:900;color:var(--acc);line-height:1">3</div><div style="font-size:28px;color:#b9bcc6">파트당 최대 시도</div></div>
 ${foot("녹화 원본과 자막 표시를 분리하고, 업로드에는 파트별 재시도를 적용했습니다.", 16)}`;
  },
});
/* ACT-ORV */
add(4, {
  lv: 3,
  acc: "#ff7a90",
  html: () => {
    const X = (i) => 120 + i * 446;
    const row = (y, arr, d0) =>
      arr
        .map((t, i) =>
          nd(X(i), y, 340, 116, t, d0 + i * 1.1, i == 1 ? "hot" : ""),
        )
        .join("");
    return `${tag("ACT 99 · 영상 · Orv")}${mq("MEDIA", 700)}
 <div class="hd a pop" style="font-size:88px;${d(0)}">영상은 브라우저에서,<br><em>소리</em>는 서버에서</div>
 <div class="mono a up dim" style="position:absolute;left:120px;top:400px;font-size:26px;letter-spacing:.15em;${d(1)}">BROWSER · React · Canvas · WebGL</div>
 ${row(450, ["카메라", "Canvas 분리<small>필터용 · 자막용</small>", "WebGL 필터<small>shader · uniform</small>", "녹화 영상"], 1)}
 <div class="mono a up dim" style="position:absolute;left:120px;top:625px;font-size:26px;letter-spacing:.15em;${d(6)}">SERVER · Java · FFmpeg</div>
 ${row(675, ["영상 파일", "FFmpeg 오디오 추출<small>Java ProcessBuilder</small>", "MP3 생성<small>파일 생성 확인</small>", "S3 저장"], 6.5)}
 ${svg([0, 1, 2].map((i) => arw(`M${X(i) + 342} 508H${X(i + 1) - 4}`, 2 + i * 1.1, 110)).join("") + [0, 1, 2].map((i) => arw(`M${X(i) + 342} 733H${X(i + 1) - 4}`, 7.5 + i * 1.1, 110)).join(""))}
 ${foot("2D 픽셀 처리를 WebGL 렌더링으로 바꾸고, 오디오 추출 API와 테스트까지 작성했습니다.", 12)}`;
  },
});
/* ACT6 소마 */
add(3, {
  ob: 4,
  lv: 2,
  acc: "#ffd54a",
  html: () => {
    const ls = (n) =>
      Array.from(
        { length: n },
        (_, i) => `<div class="t" style="width:${90 - i * 8}%"></div>`,
      ).join("");
    return `${tag("ACT 06 · 앱 · 소프트웨어 마에스트로 13기")}
 <div class="hd a pop" style="${d(0)}">다크 모드에서 형광펜이<br><em>다르게</em> 보였습니다</div>
 <div class="pw a l" style="left:120px;top:470px;${d(2)}">${ls(6)}<div class="hl" style="background:#5b6cff;opacity:.85"></div></div>
 <div class="pw a r" style="left:1040px;top:470px;${d(4.5)}">${ls(6)}<div class="hl" style="background:#ffd54a;opacity:.55"></div></div>
 <div class="a up mono" style="position:absolute;left:120px;top:900px;font-size:34px;color:var(--red);${d(3)}">✕ 필기 전체 색 반전 → 색 왜곡</div>
 <div class="a up mono" style="position:absolute;left:1040px;top:900px;font-size:34px;color:var(--green);${d(5.5)}">✓ 레이어 분리 후 표시색 변환</div>
 ${foot("Flutter 앱 담당 · 필기 라이브러리를 fork해 개선 · MVVM · Clean Architecture", 9)}`;
  },
});
/* ACT-BRIDGE */
add(4, {
  lv: 3,
  acc: "#4fd1c5",
  html: () => {
    const A = [
      ["브라우저 Intent", "외부 페이지 열기"],
      ["전화 Intent", "전화 걸기"],
      ["위치 조회", "권한 확인 · 실패 경로"],
    ];
    return `${tag("ACT 99 · 웹↔앱 · 동네두바퀴")}${mq("BRIDGE", 700)}
 <div class="hd a pop" style="font-size:88px;${d(0)}">웹 화면의 요청을<br><em>Android 기능</em>으로 이었습니다</div>
 ${nd(120, 500, 420, 140, "WebView<small>장소 상세 · React</small>", 1.5, "", "l")}
 ${nd(680, 500, 460, 140, "JavaScript Interface<small>웹 요청 → 네이티브 동작</small>", 3, "hot")}
 ${A.map((a, i) => nd(1300, 410 + i * 130, 500, 100, a[0] + "<small>" + a[1] + "</small>", 5 + i * 1, "ok", "r")).join("")}
 ${svg(arw("M542 570H676", 2.5, 140) + A.map((a, i) => arw(`M1142 570C1220 570 1220 ${460 + i * 130} 1296 ${460 + i * 130}`, 4.5 + i, 260)).join(""))}
 ${chips(["제안 완료 → Toast + Activity 종료", "사진 선택 → 이미지 URI를 웹으로 반환"], 830, 9)}
 ${foot("2인 공동 개발에서 Android WebView 통신을 맡아, 위치 권한과 실패 경로까지 다뤘습니다.", 12)}`;
  },
});
/* ACT7 데이터 */
add(4, {
  ob: 5,
  lv: 3,
  acc: "#4fd1c5",
  html: () => {
    const C = [
      [200, 160, "#ffb454"],
      [540, 280, "#4fd1c5"],
      [290, 360, "#ff7a90"],
    ];
    let g = "",
      h = "";
    let s = 5;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    C.forEach((c, ci) => {
      for (let i = 0; i < 13; i++) {
        const a = rnd() * 6.28,
          r = Math.sqrt(rnd()) * 62;
        g += `<div class="dot" style="left:${c[0] + Math.cos(a) * r - 11}px;top:${c[1] + Math.sin(a) * r - 11}px;--c:${c[2]};${d(0.5 + (ci * 13 + i) * 0.05)};--d2:${((5 + ci * 0.5 + i * 0.04) * B * K).toFixed(3)}s"></div>`;
      }
      h += `<div class="halo a pop" style="left:${c[0]}px;top:${c[1]}px;--c:${c[2]};${d(5.6 + ci * 0.5)}"></div>`;
    });
    for (let i = 0; i < 26; i++) {
      let x, y, ok;
      do {
        x = 20 + rnd() * 720;
        y = 20 + rnd() * 440;
        ok = C.every((c) => Math.hypot(c[0] - x, c[1] - y) > 105);
      } while (!ok);
      g += `<div class="dot" style="left:${x}px;top:${y}px;${d(0.5 + (40 + i) * 0.05)}"></div>`;
    }
    return `${tag("ACT 07 · 데이터 · 백엔드")}
 <div class="hd a pop" style="${d(0)}">흩어진 데이터를<br><em>쓸 수 있는 결과</em>로</div>
 <div style="position:absolute;left:120px;top:460px;width:760px;height:480px;border:2px solid #ffffff22"><div style="position:absolute;inset:0">${g}${h}</div></div>
 <div class="mono a up dim" style="position:absolute;left:120px;top:955px;font-size:24px;${d(5)}">시설 좌표 전체 → 밀집 구간만 강조</div>
 <div class="a r" style="position:absolute;left:960px;top:460px;width:880px;${d(2)}"><div class="mono" style="color:var(--acc);font-size:30px">동네Fit · Backend & System Lead</div><div style="font-size:40px;line-height:1.5;margin-top:10px">시설 좌표 수집 → PostgreSQL·FastAPI → 밀집 구간을 <b style="color:var(--acc)">DBSCAN</b>으로 군집화 → 추천 구역 정렬</div></div>
 <div class="a r" style="position:absolute;left:960px;top:740px;width:880px;${d(9)}"><div class="mono" style="color:var(--acc);font-size:30px">모아봄 · 6인 팀 데이터 수집</div><div style="font-size:40px;line-height:1.5;margin-top:10px">Playwright·asyncio 크롤러 → bulk upsert → 정기 실행</div></div>`;
  },
});

/* SCREENS */
add(3, {
  lv: 4,
  acc: "#4fd1c5",
  html: () => {
    const fr = (k, l, x, y, w, h, d0) =>
      `<div class="frm a pop" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${d(d0)}"><div class="bar3"><i></i><i></i><i></i></div><img src="${IMG[k]}"><span>${l}</span></div>`;
    return `${tag("ACT 08 · SCREENS")}<div class="hd a pop" style="top:120px;font-size:80px;${d(0)}">화면까지 <em>만든</em> 서비스들</div>
 ${fr("hm2", "건강식 지도", 120, 250, 800, 440, 1)}${fr("olg", "OLPD", 1000, 250, 800, 440, 2)}
 ${fr("sdb", "서당개", 120, 725, 1000, 300, 3.5)}${fr("tr", "동네두바퀴", 1160, 725, 640, 300, 4.5)}`;
  },
});
/* ARCH */
add(3.5, {
  lv: 4,
  acc: "#4fd1c5",
  html: () => {
    const fr = (k, l, x, y, w, h, d0, bg) =>
      `<div class="frm big a pop" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg};${d(d0)}"><div class="bar3"><i></i><i></i><i></i></div><img src="${IMG[k]}" style="object-fit:contain;object-position:center"><span>${l}</span></div>`;
    return `${tag("ACT 99 · ARCHITECTURE")}<div class="hd a pop" style="top:120px;font-size:80px;${d(0)}">구조도로 보는 <em>작업</em></div>
 ${fr("tfa", "동네Fit · Backend & System Lead", 120, 260, 800, 520, 1.5, "#fff")}${fr("hra", "하루필름 · 인프라 설계 참여", 1000, 260, 800, 520, 3, "#fff")}
 <div class="mono a up" style="position:absolute;left:120px;top:820px;width:800px;font-size:32px;line-height:1.6;color:var(--acc);${d(4.5)}">React · FastAPI · PostgreSQL<br>Gemini · Vercel · EC2</div>
 <div class="mono a up" style="position:absolute;left:1000px;top:820px;width:800px;font-size:32px;line-height:1.6;color:var(--acc);${d(5.5)}">React · Node · MySQL<br>RabbitMQ · Docker</div>`;
  },
});
/* ACT8 프로젝트 월 */
add(3, {
  ob: 4,
  lv: 4,
  html: () => {
    const n = [
      "하루필름",
      "안랩 포털",
      "서당개",
      "동네Fit",
      "모아봄",
      "LinkUp",
      "Clean Out",
      "Smiler",
      "Plan Dial",
      "지구두바퀴",
      "동네두바퀴",
      "건강식 지도",
      "OLPD",
      "Orv",
      "A-Rate",
      "FRIDAY 앱·웹",
      "Guppy GPU Cloud",
      "RPi 드라이버",
      "템템",
      "자리배치",
    ];
    return `${tag("ACT 09 · WORKS")}<div class="hd a pop" style="top:120px;font-size:88px;${d(0)}">웹 · 앱 · 서버 · 데이터, <em>개발에 참여한 프로젝트</em></div>
 ${n.map((x, i) => `<div class="tile" style="left:${178 + (i % 5) * 316}px;top:${300 + Math.floor(i / 5) * 170}px;${d(1 + i * 0.7)}">${x}</div>`).join("")}`;
  },
});
/* TOP100 */
add(2, {
  lv: 4,
  acc: "#ffd54a",
  html: () => `${mq("GLOBAL TOP 100", 620)}${tag("ACT 10 · AWARD")}
 <div class="subc mono a up" style="top:190px;font-size:32px;letter-spacing:.25em;color:var(--dim);${d(0)}">2023 GOOGLE SOLUTION CHALLENGE</div>
 <div class="name" style="top:250px;font-size:330px;color:var(--acc)">${kin("TOP 100", 0.5, 0.2)}</div>
 <div class="subc a up" style="top:660px;font-size:64px;font-weight:900;${d(3)}">Smiler · 4인 팀 · 표정 연습 서비스</div>
 <div class="subc a up" style="top:770px;font-size:38px;font-weight:300;color:#d8d5cc;${d(4.5)}">Flutter 앱 · 카메라 촬영 · 채점 · 학습 이력 · 실패 경로 테스트</div>
 <div class="subc mono a up dim" style="top:850px;font-size:26px;${d(5.5)}">Google for Developers 공개 명단 등재</div>`,
});
/* AWARDS */
add(3.5, {
  ob: 4.667,
  lv: 4,
  acc: "#ff7a90",
  html: () => {
    const r = [
      ["Platinum 2", "백준"],
      ["Platinum", "JOBDA 개발자역량평가"],
      ["본선 진출", "SCPC"],
      ["특별상", "TOPCIT 제18회"],
      ["우수상", "2021 APC 아주대 경시대회"],
    ];
    const c = [
      ["SW 마에스트로 13기", "수료 · 2022"],
      ["정보처리산업기사", "2024.06"],
      ["리눅스마스터 2급", "2024.10"],
      ["네트워크관리사 2급", "2024.10"],
      ["SQL 개발자 (SQLD)", "2024.12"],
      ["OPIc IM3", "2026.09"],
    ];
    return `${tag("ACT 11 · RECORD")}
 ${r.map((x, i) => `<div class="big a up" style="top:${150 + i * 165}px;right:auto;width:960px;gap:30px;${d(0.5 + i * 1.4)}"><b style="font-size:78px;min-width:380px">${x[0]}</b><span style="font-size:36px">${x[1]}</span></div>`).join("")}
 ${c.map((x, i) => `<div class="a r" style="position:absolute;left:1180px;top:${150 + i * 135}px;width:620px;border-left:6px solid var(--acc);padding:6px 0 6px 26px;${d(1 + i * 1.2)}"><div style="font-size:44px;font-weight:900">${x[0]}</div><div class="mono dim" style="font-size:26px">${x[1]}</div></div>`).join("")}`;
  },
});

/* ORIGIN */
add(5.5, {
  ob: 6.6,
  lv: 2,
  html: () => `${tag("ACT 12 · ORIGIN · 고등학교")}${mq("FIRST BUILD", 640)}
 <div class="hd a pop" style="${d(0)}">처음 만든 것들은<br><em>고등학교</em>에서 나왔습니다</div>
 <div class="pn seq" style="${d(2)};${du(7.8)}"><h3>자리배치 소프트웨어</h3><p>코로나19로 등교가 시작된 초기에 직접 만들어 학급에서 사용했습니다.</p></div>
 <div class="pn seq" style="${d(9.8)};${du(7.8)}"><h3>체온 기록 웹 ‘템템’</h3><p>교사가 잰 체온을 학생이 입력하면 현재 값과 추이를 보여 주는 서비스를 친구와 설계했습니다.</p></div>
 <div class="pn seq" style="${d(17.6)};${du(8.6)}"><h3>응급처치 보조 기구</h3><p>3D 프린팅과 Android Studio로 시각장애인용 기구를 만들었고, 상처를 인식하는 딥러닝 시스템을 설계해 스마트폰으로 체험하게 했습니다.</p></div>`,
});
/* PEOPLE */
add(5.5, {
  ob: 6.6,
  lv: 3,
  acc: "#4fd1c5",
  html: () => `${tag("ACT 13 · TOGETHER")}${mq("FRIDAY · SWEAT", 640)}
 <div class="hd a pop" style="${d(0)}">함께 일하는 방식도 <em>고쳐왔습니다</em></div>
 <div class="pn seq" style="top:400px;${d(2)};${du(12.2)}"><h3>FRIDAY</h3><p class="mono" style="font-size:38px;color:var(--acc)">2019 · 설립·운영 · 교내 소그룹에서 프로젝트 동아리로 · 운영진 3명 → 5명</p><p style="font-size:42px">긴 회의가 부담이라는 이야기를 1:1 면담에서 듣고, 회의를 한 시간으로 제한하고 안건을 미리 공유하고 사소한 논의는 Slack으로 돌렸습니다. 이후 회의 시간이 줄었다는 피드백을 받았습니다.</p></div>
 <div class="pn seq" style="top:400px;${d(14.7)};${du(11.7)}"><h3>SWeat</h3><p class="mono" style="font-size:38px;color:var(--acc)">SW 교육봉사 · 임원진 운영 참여</p><p>일반고 학생에게 Python 기초를 가르치고, 특성화고 학생의 프로젝트를 멘토링하며 교육 자료를 만들었습니다.</p></div>`,
});
/* AI */
add(3.5, {
  ob: 4.667,
  lv: 3,
  acc: "#ff7a90",
  html: () => {
    const pose = (k, d0, dur, cap) =>
      `<div class="seq" style="position:absolute;left:1240px;top:290px;width:560px;height:470px;${d(d0)};${du(dur)}"><img src="${IMG[k]}" style="position:absolute;left:0;right:0;margin:auto;top:40px;height:300px;max-width:420px;object-fit:contain"><div class="mono" style="position:absolute;left:0;right:0;top:350px;text-align:center;font-size:30px;color:var(--acc)">${cap}</div></div>`;
    return `${tag("ACT 14 · AI 협업 · OLPD")}${mq("PLAYTEST", 680)}
 <div class="hd a pop" style="font-size:84px;${d(0)}">AI와 만들고, <em>직접 플레이하며</em> 결함을 잡았습니다</div>
 <div class="a l" style="position:absolute;left:120px;top:300px;width:1000px;height:300px;border:2px solid #ffffff33;border-radius:14px;overflow:hidden;${d(1)}"><img src="${IMG.olb}" style="width:100%;height:100%"></div>
 <div class="mono a up dim" style="position:absolute;left:120px;top:615px;font-size:24px;${d(2)}">죽을 때마다 한 줄 · 자연어 퍼즐 게임</div>
 ${pose("m4", 1.5, 3.5, "죽으면 한 줄 메모")}${pose("m3", 5, 3.5, "메모대로 뛰어넘기")}${pose("m6", 8.5, 4, "다시, 클리어")}
 ${steps(
   [
     ["게임 아이디어 선택", 2],
     ["직접 플레이", 4.5],
     ["반복 행동 결함 발견", 7],
     ["수정 방향 요구", 9.5],
     ["수정 후 재플레이", 11.5],
   ],
   800,
 )}
 ${foot("AI가 구성한 게임을 직접 플레이하며 결함을 찾고, 기존 규칙에 맞는 수정 방향을 제시한 뒤 다시 확인했습니다.", 6)}`;
  },
});
/* DIRECTION */
add(3.5, {
  ob: 4.667,
  lv: 1,
  riser: 1,
  html: () => `${tag("NEXT · 관심 방향")}
 <div class="hp a l" style="left:60px;width:840px;${d(0)}"><div class="mono dim" style="font-size:30px">재미를 느끼는 영역</div><h4 style="color:var(--acc)">화면·앱</h4><p>사용자 흐름이 보이는 곳</p></div>
 <div class="a pop" style="position:absolute;left:900px;top:520px;font-size:100px;font-weight:900;${d(3)}">+</div>
 <div class="hp a r" style="left:960px;width:900px;${d(2)}"><div class="mono dim" style="font-size:30px">더 깊이 파고들 영역</div><h4 style="color:var(--acc)">API·데이터</h4><p>결과가 맞는지 확인되는 곳</p></div>
 <div class="subc a up" style="top:800px;font-size:44px;font-weight:500;line-height:1.5;${d(5)}">화면·앱에서 사용자 흐름을 만들고,<br>API·데이터까지 연결해 <span style="color:var(--acc)">결과를 확인하는 개발</span>에 관심이 있습니다.</div>`,
});
/* PRINCIPLES */
add(3, {
  ob: 4,
  lv: 4,
  solid: 1,
  riser: 1,
  html: () => `${mq("FIND · TRACE · VERIFY", 330)}<div style="position:absolute;left:120px;top:110px;font-size:200px;font-weight:900;line-height:1.35;letter-spacing:-.04em">
 <div>${kin("먼저 발견하고", 0, 0.14)}</div><div>${kin("끝까지 파고들고", 4.5, 0.12)}</div><div>${kin("다시 확인합니다", 9, 0.14)}</div></div>`,
});
/* OUTRO */
add(5, {
  ob: 5,
  lv: 4,
  acc: "#3ddc97",
  html: () => {
    let g = "";
    let r = 11;
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let c = 0; c < 36; c++)
      for (let k = 0; k < 20; k++) {
        const o = [0.18, 0.35, 0.6, 0.9][Math.floor(rnd() * rnd() * 4.6) % 4];
        g += `<i class="cl" style="left:${c * 53 + 6}px;top:${k * 53 + 4}px;--o:${o};${d(c * 0.11 + rnd() * 0.5)}"></i>`;
      }
    return `<div class="dm" style="position:absolute;inset:0;${d(9.5)}">${g}</div>
 <div class="seq term" style="${d(0.4)};${du(9.4)}"><div class="mono a up" style="${d(0.6)}"><span style="color:var(--green)">$</span> ./verify --all</div>
  ${[
    ["타임아웃 → 1초 미만", "관리자 목록 조회", 2],
    ["3~4시간 → 1시간 내외", "일일 검수·보고", 3.6],
    ["100만 건+", "PostgreSQL 이관 · 정합성 검증", 5.2],
    ["합계 불일치 → 일치", "Counter 재검증", 6.8],
  ]
    .map(
      (r) =>
        `<div class="a up" style="${d(r[2])};display:flex;align-items:baseline;gap:40px"><b style="font-size:84px;font-weight:900;color:var(--green);min-width:780px">${r[0]}</b><span class="mono" style="font-size:30px;color:var(--dim)">✓ ${r[1]}</span></div>`,
    )
    .join("")}</div>
 <div class="mono subc a up" style="top:150px;font-size:28px;letter-spacing:.3em;color:var(--dim);${d(11)}">JEON MINGYU</div>
 <div class="name" style="top:210px">${kin("전민규", 10, 0.3)}</div>
 <div class="subc a up" style="top:690px;font-size:72px;font-weight:900;${d(12.5)}">직접 만들고, <span style="color:var(--acc)">끝까지 확인하는</span> 개발자</div>
 <div class="subc a up" style="top:810px;font-size:34px;font-weight:300;color:#b9bcc6;${d(14.5)}">화면 · 앱 · API · 데이터 · 아주대학교 소프트웨어학과 2027.02 졸업 예정</div>
 <div class="subc mono a up" style="top:900px;font-size:40px;letter-spacing:.05em;color:var(--acc);${d(16)}">github.com/Mango-Juice</div>`;
  },
});
