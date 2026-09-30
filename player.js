// scenes.js 다음에 실행: 재생 제어, 오디오, 배경 애니메이션
let acc = 0;
SC.forEach((s) => {
  s.t0 = acc * BAR;
  acc += s.bars;
  s.t1 = acc * BAR;
});
const DUR = SC[SC.length - 1].t1;
const fx = document.getElementById("fx");
SC.forEach((s) => {
  K = s.bars / s.ob;
  const e = document.createElement("section");
  e.className = "sc" + (s.solid ? " solid" : "");
  e.innerHTML = s.html();
  fx.appendChild(e);
  s.el = e;
  s.cnt = [...e.querySelectorAll(".cnt")];
});

const $ = (s) => document.querySelector(s),
  stage = $("#stage"),
  ui = $("#ui");
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(${-960 * s}px,${-540 * s}px) scale(${s})`;
}
addEventListener("resize", fit);
fit();
function sceneAt(t) {
  let i = 0;
  while (i < SC.length - 1 && t >= SC[i].t1) i++;
  return i;
}

/* 오디오 */
let ac,
  master,
  noise,
  startAt = 0,
  step = 0,
  timer = null,
  state = "idle",
  muted = false,
  pausedAt = 0,
  rate = 1;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const CH = [
    [57, 60, 64, 69],
    [53, 57, 60, 65],
    [60, 64, 67, 72],
    [55, 59, 62, 67],
  ],
  BASS = [33, 29, 36, 31];
function env(g, t, a, dc, peak) {
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + dc);
}
function osc(type, f, t, a, dc, peak, cut) {
  const o = ac.createOscillator(),
    g = ac.createGain();
  o.type = type;
  o.frequency.value = f;
  if (cut) {
    const l = ac.createBiquadFilter();
    l.type = "lowpass";
    l.frequency.value = cut;
    o.connect(l);
    l.connect(g);
  } else o.connect(g);
  env(g, t, a, dc, peak);
  g.connect(master);
  o.start(t);
  o.stop(t + a + dc + 0.05);
}
function kick(t, v = 1) {
  const o = ac.createOscillator(),
    g = ac.createGain();
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  env(g, t, 0.003, 0.32, 0.95 * v);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + 0.4);
}
function nz(t, dc, hp, peak, type = "highpass", loop) {
  const s = ac.createBufferSource();
  s.buffer = noise;
  s.loop = !!loop;
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.value = hp;
  const g = ac.createGain();
  env(g, t, 0.002, dc, peak);
  s.connect(f);
  f.connect(g);
  g.connect(master);
  s.start(t);
  s.stop(t + dc + 0.05);
}
function riser(t) {
  const s = ac.createBufferSource();
  s.buffer = noise;
  s.loop = true;
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 2;
  const LB = BAR / rate;
  f.frequency.setValueAtTime(300, t);
  f.frequency.exponentialRampToValueAtTime(9000, t + LB);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.01, t);
  g.gain.linearRampToValueAtTime(0.35, t + LB);
  s.connect(f);
  f.connect(g);
  g.connect(master);
  s.start(t);
  s.stop(t + LB);
}
function play(s, t) {
  const T = s * STEP,
    i = sceneAt(T),
    S = SC[i],
    L = S.lv,
    b = s % 16,
    bar = Math.floor(s / 16),
    ci = bar % 4,
    last = T >= S.t1 - BAR - 1e-6;
  const first = Math.abs(T - S.t0) < STEP / 2;
  if (first) {
    kick(t, 1.1);
    osc("sine", 48, t, 0.005, 0.7, 0.5);
    nz(t, 0.5, 3000, 0.18);
  }
  if (b === 0)
    CH[ci].forEach((m) =>
      osc("triangle", mtof(m), t, 0.3, BAR / rate, 0.05, 1800),
    );
  if (L === 1 && (b === 0 || b === 8)) kick(t, 0.7);
  if (L >= 2 && (b === 0 || b === 6 || b === 10 || (L >= 4 && b === 14)))
    kick(t, b === 0 ? 1 : 0.8);
  if (L >= 2 && b % 4 === 2) nz(t, 0.08, 7500, 0.055);
  if (L >= 2 && b === 8) nz(t, 0.2, 1600, 0.15, "bandpass");
  if (L >= 2 && (b === 0 || b === 6 || b === 10)) {
    osc(
      "sawtooth",
      mtof(BASS[ci] + (b === 10 ? 12 : 0)),
      t,
      0.01,
      b === 0 ? 0.5 : 0.22,
      0.16,
      480,
    );
  }
  if (L >= 2 && b === 0) osc("sine", mtof(BASS[ci]), t, 0.01, 0.6, 0.3);
  if (L >= 3 && b % 2 === 0) nz(t, 0.03, 9000, 0.03);
  if (L >= 3 && (L >= 4 ? b % 2 === 0 : b % 4 === 0)) {
    const c = CH[ci],
      m = c[(b / 2 + bar) % c.length] + (b % 8 < 4 ? 12 : 24);
    osc("square", mtof(m), t, 0.004, 0.18, 0.028, 2800);
  }
  if (L >= 4 && b === 0 && bar % 4 === 0) nz(t, 1.4, 5000, 0.16);
  if (S.riser && last) {
    if (b === 0) riser(t);
    if (b >= 8 && (b % 4 === 0 || b >= 12))
      nz(t, 0.09, 1500, 0.06 + b * 0.008, "bandpass");
  }
  if (i === SC.length - 1 && T >= S.t1 - BAR - 1e-6 && b === 0) {
    [45, 57, 60, 64, 69].forEach((m) =>
      osc("sawtooth", mtof(m), t, 0.02, 3.5, 0.06, 2400),
    );
    nz(t, 2, 4000, 0.2);
  }
}
function pump() {
  while (
    state === "play" &&
    step * STEP < DUR &&
    startAt + (step * STEP) / rate < ac.currentTime + 0.2
  ) {
    play(step, startAt + (step * STEP) / rate);
    step++;
  }
}
function init() {
  if (ac) return;
  ac = new (window.AudioContext || window.webkitAudioContext)();
  master = ac.createGain();
  master.gain.value = muted ? 0 : 0.75;
  const c = ac.createDynamicsCompressor();
  master.connect(c);
  c.connect(ac.destination);
  noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const dd = noise.getChannelData(0);
  for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
}
function now() {
  return state === "idle"
    ? 0
    : state === "pause"
      ? pausedAt
      : Math.min(DUR, (ac.currentTime - startAt) * rate);
}
function applyAnim() {
  document.getAnimations().forEach((a) => {
    if (a.playbackRate !== rate) a.playbackRate = rate;
    if (state === "pause") {
      if (a.playState === "running") a.pause();
    } else if (a.playState === "paused") a.play();
  });
}
function seek(v, keep) {
  init();
  startAt = ac.currentTime - v / rate;
  step = Math.ceil(v / STEP);
  state = "play";
  ac.resume();
  lastSc = -1;
  if (!timer) timer = setInterval(pump, 25);
  pump();
  $("#pp").textContent = "⏸";
  if (keep) {
    pausedAt = v;
    state = "pause";
    ac.suspend();
    $("#pp").textContent = "▶";
  }
}
function toggle() {
  if (state === "idle" || state === "end") {
    seek(0);
    return;
  }
  if (state === "play") {
    pausedAt = now();
    state = "pause";
    ac.suspend();
    $("#pp").textContent = "▶";
    applyAnim();
  } else {
    state = "play";
    startAt = ac.currentTime - pausedAt / rate;
    ac.resume();
    pump();
    $("#pp").textContent = "⏸";
    applyAnim();
  }
}
function jump(dt) {
  if (state === "idle") return;
  seek(Math.max(0, Math.min(DUR - 0.05, now() + dt)), state === "pause");
}
const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
function setRate(r) {
  const v = state === "idle" ? 0 : now();
  rate = r;
  if (ac && state === "play") startAt = ac.currentTime - v / rate;
  $("#sp").textContent = r + "×";
  applyAnim();
}

/* 장면 전환 */
let lastSc = -1;
function setScene(i, t) {
  const nat = lastSc >= 0 && i === lastSc + 1 && t - SC[i].t0 < 0.3;
  SC.forEach((s, k) => {
    s.el.classList.remove("on");
    if (k === i) {
      void s.el.offsetWidth;
      s.el.style.setProperty("--lt", (t - s.t0).toFixed(3) + "s");
      s.el.classList.add("on");
    }
  });
  document.documentElement.style.setProperty("--acc", SC[i].acc);
  if (nat) {
    ["wipe", "fx"].forEach((id) => {
      const e = document.getElementById(id);
      e.classList.remove(id === "wipe" ? "go" : "shake");
      void e.offsetWidth;
      e.classList.add(id === "wipe" ? "go" : "shake");
    });
  }
  lastSc = i;
  requestAnimationFrame(() => requestAnimationFrame(applyAnim));
}
const ease = (x) => 1 - Math.pow(1 - x, 3);

/* 배경 */
const cv = $("#bg"),
  cx = cv.getContext("2d"),
  P = Array.from({ length: 80 }, () => ({
    x: Math.random() * 1920,
    y: Math.random() * 1080,
    r: 1 + Math.random() * 3,
    v: 0.3 + Math.random() * 1,
  }));
const SL = Array.from({ length: 22 }, () => ({
  x: Math.random() * 1920,
  y: Math.random() * 1080,
  l: 120 + Math.random() * 400,
  v: 14 + Math.random() * 30,
}));
function bg(t, lv) {
  cx.clearRect(0, 0, 1920, 1080);
  const acc = getComputedStyle(document.documentElement).getPropertyValue(
    "--acc",
  );
  cx.strokeStyle = "#ffffff0c";
  cx.lineWidth = 1;
  const o = (t * 60) % 80;
  for (let x = -80 + o; x < 1920; x += 80) {
    cx.beginPath();
    cx.moveTo(x, 0);
    cx.lineTo(x, 1080);
    cx.stroke();
  }
  for (let y = 0; y < 1080; y += 80) {
    cx.beginPath();
    cx.moveTo(0, y);
    cx.lineTo(1920, y);
    cx.stroke();
  }
  cx.fillStyle = acc;
  cx.globalAlpha = 0.3;
  P.forEach((p) => {
    p.y -= p.v * (1 + lv);
    if (p.y < -5) {
      p.y = 1085;
      p.x = Math.random() * 1920;
    }
    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, 7);
    cx.fill();
  });
  cx.strokeStyle = acc;
  cx.lineWidth = 2;
  cx.globalAlpha = 0.1 + lv * 0.03;
  SL.forEach((s) => {
    s.x -= s.v * (0.5 + lv * 0.5);
    if (s.x < -s.l) {
      s.x = 1920 + Math.random() * 400;
      s.y = Math.random() * 1080;
    }
    cx.beginPath();
    cx.moveTo(s.x, s.y);
    cx.lineTo(s.x + s.l, s.y);
    cx.stroke();
  });
  cx.globalAlpha = 1;
}

/* 루프 */
const fmt = (s) =>
  Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
$("#tm").textContent = "0:00 / " + fmt(DUR);
function frame() {
  const t = now();
  let lv = 1;
  if (state !== "idle") {
    const i = sceneAt(t);
    if (i !== lastSc) setScene(i, t);
    const S = SC[i],
      lt = t - S.t0;
    lv = S.lv;
    S.cnt.forEach((e) => {
      const x = Math.max(
          0,
          Math.min(1, (lt - e.dataset.b * B) / (e.dataset.dur * B)),
        ),
        v = +e.dataset.from + (+e.dataset.to - +e.dataset.from) * ease(x);
      let s = v.toFixed(+e.dataset.dec);
      if (+e.dataset.fmt) s = Number(s).toLocaleString("en-US");
      e.textContent = s;
    });
    if (t >= DUR && state === "play") {
      state = "end";
      $("#pp").textContent = "▶";
    }
    document.documentElement.style.setProperty(
      "--beat",
      Math.max(0, 1 - ((t / (2 * B)) % 1) * 2.5).toFixed(2),
    );
    $("#seek i").style.width = (t / DUR) * 100 + "%";
    $("#tm").textContent = fmt(t) + " / " + fmt(DUR);
  }
  bg(t, lv / 4);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* 조작 */
$("#start").onclick = () => {
  $("#start").classList.add("gone");
  ui.classList.remove("hide");
  seek(0);
};
$("#pp").onclick = toggle;
$("#bk").onclick = () => jump(-5);
$("#fw").onclick = () => jump(5);
$("#sp").onclick = () =>
  setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length]);
$("#mu").onclick = () => {
  muted = !muted;
  if (master) master.gain.value = muted ? 0 : 0.75;
  $("#mu").textContent = muted ? "🔇" : "🔊";
};
$("#seek").onclick = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  if (state !== "idle")
    seek(
      Math.min(DUR - 0.1, ((e.clientX - r.left) / r.width) * DUR),
      state === "pause",
    );
};
addEventListener("keydown", (e) => {
  if (state === "idle") return;
  if (e.code === "Space") {
    e.preventDefault();
    toggle();
  } else if (e.code === "ArrowLeft") {
    e.preventDefault();
    jump(-5);
  } else if (e.code === "ArrowRight") {
    e.preventDefault();
    jump(5);
  }
});
let hideT;
addEventListener("mousemove", () => {
  if (state === "idle") return;
  ui.classList.remove("hide");
  clearTimeout(hideT);
  hideT = setTimeout(() => {
    if (state === "play") ui.classList.add("hide");
  }, 2200);
});
["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach((ev) =>
  document.addEventListener(ev, (e) => e.preventDefault()),
);
addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey || e.metaKey) &&
    ["c", "x", "a", "s", "u", "p"].includes(e.key.toLowerCase())
  )
    e.preventDefault();
});
window.__SC = SC;
