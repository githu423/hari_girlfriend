/* ═══════════════════════════════════════════════
   Happy My Girl Day — Buku untuk Sinta Liya 🌹
   dari Ibah Misbah
   ═══════════════════════════════════════════════ */

const CONFIG = {
  pacar: "Sinta Liya",
  aku: "Ibah Misbah",
  // hitungan hari dimulai dari 1 Januari 2026
  jadian: new Date(2026, 0, 1, 0, 0, 0),
};

const PREF = {
  musicOn: true,        // musik nyala otomatis sejak awal
  musicVolume: 0.80,    // 0 - 1
  videoAutoplay: true,  // video jalan sendiri
  videoDelay: 2000,     // jeda sebelum video mulai (milidetik)
};

/* ───────── penyimpanan (tahan refresh) ───────── */
const KEY = "mygirlday-sinta-v1";
const STATE = Object.assign({
  page: 0, maxSeen: 0, tasks: {}, roses: [], roseMsg: "", quizIndex: 0, quizDone: false,
  dollPlays: 0, dollMsg: "", dressed: false, heartPct: 0, unlocked: false,
  signature: "", sealed: false, gateOpen: false, music: false, loveIndex: 0
}, (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })());
let saveT;
function save() {
  clearTimeout(saveT); saveT = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(STATE)); } catch { }
  }, 120);
}
function resetAll() { try { localStorage.removeItem(KEY); } catch { } location.reload(); }

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ───────── kelopak mawar ───────── */
(function petals() {
  const c = $("#petals"), x = c.getContext("2d");
  let w, h; const P = [];
  const N = innerWidth < 600 ? 18 : 34;
  const size = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
  size(); addEventListener("resize", size);
  const mk = () => ({
    x: rnd(0, w), y: rnd(-h, 0), r: rnd(5, 13), s: rnd(.3, 1.1), a: rnd(0, 6.28),
    va: rnd(-.025, .025), sw: rnd(0, 1.7), o: rnd(.25, .75),
    c: Math.random() < .18 ? "#ffd27a" : "#ff2e63"
  });
  for (let i = 0; i < N; i++) P.push(mk());
  (function loop() {
    x.clearRect(0, 0, w, h);
    for (const p of P) {
      p.y += p.s; p.a += p.va; p.x += Math.sin(p.y / 55) * p.sw * .45;
      if (p.y > h + 24) Object.assign(p, mk(), { y: -24 });
      x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = p.o; x.fillStyle = p.c;
      x.beginPath(); x.ellipse(0, 0, p.r, p.r * .6, 0, 0, 6.3); x.fill();
      x.fillStyle = "rgba(255,255,255,.3)";
      x.beginPath(); x.ellipse(-p.r * .28, 0, p.r * .38, p.r * .26, 0, 0, 6.3); x.fill();
      x.restore();
    }
    requestAnimationFrame(loop);
  })();
})();

/* ───────── hati terbang ───────── */
function burst(x, y, n = 8, chars = ["❤️", "💗", "💘", "🌹", "✨"]) {
  const box = $("#hearts");
  for (let i = 0; i < n; i++) {
    const e = document.createElement("span");
    e.className = "fly-heart";
    e.textContent = chars[(Math.random() * chars.length) | 0];
    e.style.cssText = `left:${x}px;top:${y}px;font-size:${rnd(16, 30)}px;animation-delay:${i * 35}ms`;
    e.style.setProperty("--dx", rnd(-90, 90) + "px");
    e.style.setProperty("--rot", rnd(-60, 60) + "deg");
    box.appendChild(e);
    setTimeout(() => e.remove(), 1900);
  }
}
const burstAt = (el, n = 10, c) => {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, n, c);
};
addEventListener("click", (e) => { if (!e.target.closest("#sigPad,.icon-btn,.nav-btn")) burst(e.clientX, e.clientY, 3); });
function flash() { const f = $("#flash"); f.classList.remove("on"); void f.offsetWidth; f.classList.add("on"); }

/* ═════════ MESIN HALAMAN ═════════ */
const pages = $$(".page");
const TASKS = {
  baca: { done: false, msg: "Baca dulu suratnya ya, sebentar aja 💌" },
  doll: { done: false, msg: "Ajak Badtz main dulu dong, kasihan 🐧" },
  rose: { done: false, msg: "Petik minimal 3 mawar dulu ya 🌹" },
  quiz: { done: false, msg: "Selesaikan kuisnya dulu, gampang kok 😌" },
  heart: { done: false, msg: "Tahan hatinya sampai 100% dulu ya 💗" },
  sign: { done: false, msg: "Tanda tangan dulu di kotaknya 🖊️" },
};
Object.keys(TASKS).forEach(k => { if (STATE.tasks[k]) TASKS[k].done = true; });
let cur = 0, maxSeen = Math.min(STATE.maxSeen | 0, 10);

const dotsBox = $("#dots");
pages.forEach((p, i) => {
  const b = document.createElement("button");
  b.className = "dot"; b.type = "button";
  b.title = p.dataset.title || "Halaman " + (i + 1);
  b.addEventListener("click", () => { if (i <= maxSeen) go(i); });
  dotsBox.appendChild(b);
});
const dots = $$(".dot");

function canLeave(i) {
  const t = pages[i].dataset.task;
  return !t || TASKS[t].done;
}
function go(i, dir = i > cur ? 1 : -1) {
  i = clamp(i, 0, pages.length - 1);
  if (i === cur) return;
  const old = pages[cur];
  old.classList.remove("active");
  old.classList.toggle("prev", dir > 0);
  pages[i].classList.remove("prev");
  pages[i].classList.add("active");
  pages[i].scrollTop = 0;
  cur = i; maxSeen = Math.max(maxSeen, i);
  STATE.page = i; STATE.maxSeen = maxSeen; save();
  sync();
  onEnter(i);
}
function sync() {
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === cur);
    d.classList.toggle("done", i < maxSeen);
    d.disabled = i > maxSeen;
  });
  $("#navLabel").textContent = pages[cur].dataset.title || "";
  $("#prev").disabled = cur === 0;
  const last = cur === pages.length - 1;
  $("#next").disabled = last;
  $("#next").classList.toggle("locked", !last && !canLeave(cur));
  $("#nav").hidden = false;
}
function nudge(msg) {
  const n = $("#next"); n.classList.remove("nudge"); void n.offsetWidth; n.classList.add("nudge");
  const l = $("#lockMsg"); l.textContent = msg; l.classList.add("show");
  clearTimeout(nudge._t); nudge._t = setTimeout(() => l.classList.remove("show"), 2600);
}
function tryNext() {
  if (!canLeave(cur)) return nudge(TASKS[pages[cur].dataset.task].msg);
  go(cur + 1, 1);
}
function finishTask(key) {
  if (!TASKS[key] || TASKS[key].done) return;
  TASKS[key].done = true; STATE.tasks[key] = true; save();
  if (pages[cur].dataset.task === key) { sync(); nudge("Selesai! Lanjut ke halaman berikutnya ›"); flash(); }
}

$("#next").addEventListener("click", tryNext);
$("#prev").addEventListener("click", () => go(cur - 1, -1));
addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "PageDown") tryNext();
  if (e.key === "ArrowLeft" || e.key === "PageUp") go(cur - 1, -1);
  if (e.key === "Escape") closeHelp();
});
/* geser (swipe) */
let sx = 0, sy = 0, st = 0;
addEventListener("touchstart", (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
addEventListener("touchend", (e) => {
  if (e.target.closest("#sigPad,#heartBtn,video")) return;
  const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
  if (Date.now() - st < 700 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
    dx < 0 ? tryNext() : go(cur - 1, -1);
  }
}, { passive: true });

/* aksi saat masuk halaman */
let typedStarted = false, clockStarted = false;
function onEnter(i) {
  const t = pages[i].dataset.title;
  if (t === "Ucapan" && !typedStarted) { typedStarted = true; typeIt(); setTimeout(() => finishTask("baca"), 9000); }
  if (t === "Waktu Kita" && !clockStarted) { clockStarted = true; startClock(); }
  if (t === "Video") { const c = $("#curtain"); if (c) { c.classList.add("open"); setTimeout(() => c.style.display = "none", 1700); } }
  if (t === "Sertifikat") setTimeout(fitPad, 300);
  if (t === "Penutup") { burst(innerWidth / 2, innerHeight / 2, 26); flash(); }
}
/* boot dipanggil di akhir file */

/* ───────── sampul: tombol "Bukan" kabur ───────── */
const NO_TEASE = ["eh? coba lagi deh 👀", "bohong ah, kamu Sinta kok 😏", "tombolnya malu-malu 🙈",
  "udah nyerah aja, kamu tetep Sinta ❤️", "dia lari terus, capek lho ngejar 😂", "fix kamu Sinta. titik. 💘"];
let noCount = 0;
const noBtn = $("#noBtn");
function runAway() {
  noCount++;
  const r = Math.min(noCount * 20, 130);
  noBtn.style.transform = `translate(${rnd(-r, r)}px,${rnd(-r / 2, r / 2)}px) rotate(${rnd(-14, 14)}deg) scale(${Math.max(.35, 1 - noCount * .09)})`;
  $("#noTease").textContent = NO_TEASE[Math.min(noCount - 1, NO_TEASE.length - 1)];
  if (noCount >= 6) { noBtn.style.opacity = 0; noBtn.style.pointerEvents = "none"; }
}
noBtn.addEventListener("mouseenter", runAway);
noBtn.addEventListener("click", (e) => { e.preventDefault(); runAway(); });
$("#yesBtn").addEventListener("click", (e) => { burst(e.clientX, e.clientY, 24); flash(); go(1, 1); });

/* ───────── amplop ───────── */
$("#envelope").addEventListener("click", (e) => {
  e.currentTarget.classList.add("open");
  burst(e.clientX, e.clientY, 18, ["💌", "❤️", "✨"]);
  bgm.play().then(() => { mb.classList.add("on"); mb.textContent = "🎶"; }).catch(() => { });
  setTimeout(() => go(2, 1), 650);
});

/* ───────── musik ───────── */
const bgm = $("#bgm"), mb = $("#musicBtn");
mb.addEventListener("click", async () => {
  try {
    if (bgm.paused) { await bgm.play(); mb.classList.add("on"); mb.textContent = "🎶"; }
    else { bgm.pause(); mb.classList.remove("on"); mb.textContent = "🎵"; }
  } catch { mb.textContent = "🔇"; mb.title = "Taruh lagu di assets/song.mp3"; }
});

/* ───────── bantuan ───────── */
const help = $("#help");
const openHelp = () => { help.hidden = false; help.style.display = "grid"; };
const closeHelp = () => { help.hidden = true; help.style.display = "none"; };
$("#helpBtn").addEventListener("click", openHelp);
$("#helpClose").addEventListener("click", closeHelp);
help.addEventListener("click", (e) => { if (e.target === help) closeHelp(); });

/* ───────── mesin ketik ───────── */
const LINES = [
  "Buat kamu, yang paling aku sayang…",
  "Hari ini resmi jadi HARI-NYA KAMU 🎀",
  "Nggak ada kado mahal, cuma ada aku. Gapapa ya? 🙈",
  "Selamat My Girl Day, Sinta Liya ❤️"
];
function typeIt() {
  const el = $("#typed"); let li = 0, ci = 0, del = false;
  (function tick() {
    const t = LINES[li];
    el.textContent = del ? t.slice(0, --ci) : t.slice(0, ++ci);
    let d = del ? 22 : rnd(36, 70);
    if (!del && ci === t.length) { if (li === LINES.length - 1) { finishTask("baca"); return; } del = true; d = 1600; }
    if (del && ci === 0) { del = false; li++; d = 220; }
    setTimeout(tick, d);
  })();
}

/* surat 3D */
const letter = $(".letter");
if (letter && matchMedia("(hover:hover)").matches) {
  letter.addEventListener("mousemove", (e) => {
    const r = letter.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
    letter.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
  });
  letter.addEventListener("mouseleave", () => letter.style.transform = "");
}

/* ───────── jam ───────── */
function startClock() {
  const pad2 = (n) => String(n).padStart(2, "0");
  const tick = () => {
    let ms = Date.now() - CONFIG.jadian.getTime(); if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    $("#cD").textContent = Math.floor(s / 86400).toLocaleString("id-ID");
    $("#cH").textContent = pad2(Math.floor(s / 3600) % 24);
    $("#cM").textContent = pad2(Math.floor(s / 60) % 60);
    $("#cS").textContent = pad2(s % 60);
  };
  tick(); setInterval(tick, 1000);

  const days = Math.max(1, Math.floor((Date.now() - CONFIG.jadian) / 864e5));
  const f = [
    `☀️ ${days.toLocaleString("id-ID")} kali matahari terbit, kamu tetap yang pertama aku pikirin`,
    `💓 jantungku udah berdetak ±${(days * 100800).toLocaleString("id-ID")} kali buat kamu`,
    `🌹 kalau 1 mawar per hari, kamu udah punya ${days.toLocaleString("id-ID")} tangkai`,
    `😴 aku mimpiin kamu ±${Math.floor(days * .7).toLocaleString("id-ID")} malam (sisanya lupa)`,
    `📈 level sayang: ${days.toLocaleString("id-ID")} — dan belum pernah turun`
  ];
  $("#facts").innerHTML = f.map((t, i) => `<span class="fact" style="animation-delay:${i * 120}ms">${t}</span>`).join("");
}

/* ───────── Badtz ───────── */
const DOLL = ["Halo Sinta! 🐧", "Hari ini kamu cantik banget 😍", "Ibah titip peluk, katanya 🤗",
  "Jangan lupa makan ya! 🍜", "Aku jagain kamu dari rebahan 😎", "Nakal tapi sayang, kayak dia 😜",
  "Kamu juara 1 di hatinya dia 🏆", "Kalau dia nyebelin, laporin ke aku 📣",
  "Dia latihan ngomong 'sayang' depan cermin lho 🤫", "Katanya sih nggak baper. Bohong. 🙄"];
const ACT = {
  peluk: ["Hmphh… peluk balik! 🤗", "Anget banget, jangan dilepas 🥺", "Peluk level: nggak mau lepas 💞"],
  kasih: ["NYAM NYAM! makasih 🍰", "Enak! tapi kamu lebih manis 😳", "Kue habis. Hatiku kenyang 🍰❤️"],
  dandan: ["Ganteng nggak? 🎀", "Dasi kupu-kupu mode: ON 😎", "Siap jadi pendamping kamu! 🤵"],
  rahasia: ["…dia nyimpen fotomu di home screen 📱", "…dia bikin web ini sampai begadang 😵", "…dia bilang kamu cinta terakhirnya 🤍"]
};
let di = 0, dollPlays = STATE.dollPlays | 0;
const bubble = $("#dollBubble"), doll = $("#doll");
function say(txt, cls = "hit") {
  doll.classList.remove("hit", "jump"); void doll.offsetWidth; doll.classList.add(cls);
  bubble.textContent = txt;
  bubble.style.animation = "none"; void bubble.offsetWidth; bubble.style.animation = "";
  dollPlays++; STATE.dollPlays = dollPlays; STATE.dollMsg = txt; save();
  if (dollPlays >= 3) finishTask("doll");
}
doll.addEventListener("click", (e) => {
  di = (di + 1) % DOLL.length; say(DOLL[di]);
  burst(e.clientX, e.clientY, 6, ["💗", "🐧", "✨"]);
});
$$(".chips .chip").forEach(b => b.addEventListener("click", (e) => {
  const k = b.dataset.act, a = ACT[k];
  say(a[(Math.random() * a.length) | 0], "jump");
  if (k === "dandan") { dressUp(); }
  const em = { peluk: ["🤗", "💗"], kasih: ["🍰", "🍩", "✨"], dandan: ["🎀", "✨"], rahasia: ["🤫", "💌"] }[k];
  burst(e.clientX, e.clientY, 11, em);
}));
function dressUp() { $("#bowtie").setAttribute("opacity", "1"); $("#hat").setAttribute("opacity", "1"); STATE.dressed = true; save(); }
if (STATE.dressed) dressUp();
if (STATE.dollMsg) bubble.textContent = STATE.dollMsg;

const pupils = $("#pupils");
addEventListener("pointermove", (e) => {
  const r = doll.getBoundingClientRect(); if (!r.width) return;
  pupils.style.transform = `translate(${clamp((e.clientX - (r.left + r.width / 2)) / 40, -4, 4)}px,
    ${clamp((e.clientY - (r.top + r.height * .28)) / 40, -3, 3)}px)`;
}, { passive: true });

/* ───────── mawar ───────── */
const ROSES = [
  "Buat senyummu — yang bisa mberesin hari aku yang paling berantakan.",
  "Buat sabarmu — yang kebangetan sabarnya ngadepin aku.",
  "Buat suaramu — lagu favorit yang nggak pernah aku skip.",
  "Buat matamu — tempat paling nyaman buat aku pulang.",
  "Buat ngambekmu — yang ujung-ujungnya tetep aku kangenin 🙈",
  "Buat tanganmu — yang selalu pas kalau digenggam aku.",
  "Buat mimpimu — aku ikut doain, dan aku mau ada di sana.",
  "Buat hari-hari susah kita — kita lewatin, dan kita masih di sini.",
  "Buat besok, lusa, dan seterusnya. Semuanya, maunya sama kamu."
];
const bq = $("#bouquet"), picked = new Set();
ROSES.forEach((msg, i) => {
  const b = document.createElement("button");
  b.className = "stalk"; b.type = "button"; b.setAttribute("aria-label", "Mawar " + (i + 1));
  b.innerHTML = `<svg width="46" height="92" viewBox="0 0 54 104">
    <path d="M27 42v56" stroke="#2f9e44" stroke-width="5" stroke-linecap="round"/>
    <path d="M27 66c-14 0-18-10-18-10s10-6 18 4z" fill="#2f9e44"/>
    <path d="M27 82c14 0 18-10 18-10s-10-6-18 4z" fill="#37b24d"/>
    <g class="head"><circle cx="27" cy="26" r="20" fill="#b3002d"/>
    <circle cx="27" cy="26" r="14.5" fill="#e01e4f"/><circle cx="27" cy="26" r="9" fill="#ff5177"/>
    <circle cx="27" cy="26" r="3.6" fill="#ffd0dc"/>
    <path d="M12 20q15-9 30 0" stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none"/></g></svg>`;
  b.addEventListener("click", (e) => {
    b.classList.add("picked"); picked.add(i);
    STATE.roses = [...picked]; STATE.roseMsg = msg; save();
    const m = $("#roseMsg"); m.style.opacity = 0;
    setTimeout(() => { m.textContent = "“" + msg + "”"; m.style.opacity = 1; }, 150);
    $("#roseBar").style.width = (picked.size / ROSES.length * 100) + "%";
    $("#roseCount").textContent = `${picked.size} / ${ROSES.length} mawar dipetik`;
    burst(e.clientX, e.clientY, 7, ["🌹", "💖"]);
    if (picked.size >= 3) finishTask("rose");
    if (picked.size === ROSES.length) {
      $("#roseCount").innerHTML = "<b>Buketnya lengkap 💐 — semuanya buat kamu, Sinta.</b>";
      burst(innerWidth / 2, innerHeight / 2, 34, ["🌹", "💐", "❤️"]); flash();
    }
  });
  bq.appendChild(b);
});
/* pulihkan mawar yang sudah dipetik */
if (STATE.roses && STATE.roses.length) {
  const st = [...bq.children];
  STATE.roses.forEach(i => st[i] && st[i].classList.add("picked"));
  picked.clear(); STATE.roses.forEach(i => picked.add(i));
  $("#roseBar").style.width = (picked.size / ROSES.length * 100) + "%";
  $("#roseCount").textContent = `${picked.size} / ${ROSES.length} mawar dipetik`;
  if (STATE.roseMsg) $("#roseMsg").textContent = "“" + STATE.roseMsg + "”";
  if (picked.size === ROSES.length) $("#roseCount").innerHTML = "<b>Buketnya lengkap 💐 — semuanya buat kamu, Sinta.</b>";
}

/* ───────── kuis ───────── */
const QUIZ = [
  {
    q: "Siapa wanita kesayangan Ibah Misbah?", o: ["Sinta Liya 🌹", "Sinta Liya (lagi)", "Ya… Sinta Liya lah"],
    f: "Benar semua. Emang nggak ada opsi lain 😌"
  },
  {
    q: "Bunga favoritmu apa hayo?", o: ["Mawar merah 🌹", "Mawar merah tapi banyak", "Mawar merah dari Ibah"],
    f: "Yes! Dan stoknya seumur hidup ❤️"
  },
  {
    q: "Seberapa sayang Ibah ke kamu?", o: ["Banyak banget", "Banyak banget ×1000", "Sampai bikin web ini"],
    f: "Jawaban kamu kurang besar. Yang bener: semuanya 🤍"
  },
  {
    q: "Kalau kamu ngambek, Ibah harus gimana?", o: ["Minta maaf dulu", "Beliin makanan", "Peluk, terus nggak dilepas"],
    f: "Noted. Akan dilaksanakan seumur hidup 🫡"
  },
  {
    q: "Terakhir: mau nggak dicintai Ibah terus-terusan?", o: ["Mau banget ❤️", "Iya dong", "Udah dari dulu"],
    f: "Alhamdulillah. Perjanjian sah 🎉"
  }
];
let qi = STATE.quizIndex | 0;
function renderQ() {
  const Q = QUIZ[qi];
  $("#qText").textContent = Q.q;
  $("#qProg").textContent = `Soal ${qi + 1} dari ${QUIZ.length}`;
  $("#qFeed").textContent = "\u00a0"; $("#qFeed").classList.remove("big");
  const box = $("#qOpts"); box.innerHTML = "";
  Q.o.forEach(t => {
    const b = document.createElement("button");
    b.className = "opt"; b.type = "button"; b.textContent = t;
    b.addEventListener("click", (e) => {
      box.querySelectorAll(".opt").forEach(x => x.disabled = true);
      b.classList.add("good");
      $("#qFeed").textContent = Q.f;
      burst(e.clientX, e.clientY, 10, ["✅", "💖", "🌹"]);
      setTimeout(() => {
        qi++; STATE.quizIndex = qi; save();
        if (qi < QUIZ.length) renderQ();
        else {
          $("#qText").textContent = "Skor kamu: 100/100 🏆";
          box.innerHTML = "";
          $("#qFeed").classList.add("big");
          $("#qFeed").textContent = "Sempurna. Ya iyalah, semua jawabannya kamu 😚";
          $("#qProg").textContent = "Lulus dengan predikat: Pacar Teladan";
          burst(innerWidth / 2, innerHeight / 2, 26, ["🏆", "🎉", "❤️"]);
          STATE.quizDone = true; save(); finishTask("quiz");
        }
      }, 1150);
    });
    box.appendChild(b);
  });
}
if (STATE.quizDone || qi >= QUIZ.length) {
  $("#qText").textContent = "Skor kamu: 100/100 🏆";
  $("#qOpts").innerHTML = "";
  $("#qFeed").classList.add("big");
  $("#qFeed").textContent = "Sempurna. Ya iyalah, semua jawabannya kamu 😚";
  $("#qProg").textContent = "Lulus dengan predikat: Pacar Teladan";
} else renderQ();

/* ───────── tahan hati ───────── */
let pct = STATE.unlocked ? 100 : 0, holding = false, unlocked = !!STATE.unlocked, raf = null;
const TEASE = ["tekan dan <b>tahan</b> ya… 😳", "nah gitu, jangan dilepas 💗", "setengah jalan, kamu kuat!",
  "dikit lagi sayang 🥺", "WAAA HAMPIR PENUH!! 🔥"];
const hb = $("#heartBtn");
function update() {
  $("#fill").setAttribute("y", 112 - 112 * pct / 100);
  $("#heartPct").textContent = Math.round(pct) + "%";
  $("#heartTease").innerHTML = TEASE[Math.min(TEASE.length - 1, Math.floor(pct / 21))];
}
function loopHold() {
  if (!holding || unlocked) return;
  pct = Math.min(100, pct + .9); update();
  if (pct >= 100) return unlockVideo();
  raf = requestAnimationFrame(loopHold);
}
function decay() {
  if (holding || unlocked || pct <= 0) return;
  pct = Math.max(0, pct - .5); update(); requestAnimationFrame(decay);
}
if (unlocked) { update(); $("#heartTease").innerHTML = "<b>Sudah kebuka 🎬 lanjut ke halaman videonya</b>"; }

hb.addEventListener("pointerdown", (e) => {
  if (unlocked) return; e.preventDefault();
  holding = true; hb.classList.add("beat"); cancelAnimationFrame(raf); loopHold(); burstAt(hb, 3);
});
const relHold = () => {
  if (unlocked || !holding) return;
  holding = false; hb.classList.remove("beat"); cancelAnimationFrame(raf); requestAnimationFrame(decay);
};
["pointerup", "pointercancel", "pointerleave"].forEach(t => hb.addEventListener(t, relHold));
addEventListener("pointerup", relHold);

function unlockVideo() {
  unlocked = true; holding = false; hb.classList.remove("beat");
  $("#heartPct").textContent = "100%";
  $("#heartTease").innerHTML = "<b>Kebuka! Lanjut ke halaman berikutnya 🎬</b>";
  burstAt(hb, 40); flash();
  STATE.unlocked = true; save(); finishTask("heart");
  setTimeout(() => go(cur + 1, 1), 1100);
}

/* ───────── sertifikat ───────── */
if (!STATE.certDate) { STATE.certDate = new Date().toISOString(); save(); }
const CERT_DATE = new Date(STATE.certDate);
const CERT_DATE_STR = CERT_DATE.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
if (!STATE.serial) { STATE.serial = "SL-" + CERT_DATE.getFullYear() + "-" + String(Math.floor(rnd(100, 999))); save(); }
$("#certDate").textContent = "Ditetapkan pada " + CERT_DATE_STR + " • No. " + STATE.serial;
$("#certSerial") && ($("#certSerial").textContent = "No. " + STATE.serial);

const pad = $("#sigPad"), px = pad.getContext("2d");
let drawing = false, signed = false, last = null, ink = 0;
function fitPad() {
  const r = pad.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  if (!r.width) return;
  const img = signed ? pad.toDataURL() : null;
  pad.width = r.width * dpr; pad.height = r.height * dpr;
  px.setTransform(dpr, 0, 0, dpr, 0, 0);
  px.lineCap = "round"; px.lineJoin = "round"; px.strokeStyle = "#8a0d3a";
  const src = img || STATE.signature;
  if (src) { const i = new Image(); i.onload = () => px.drawImage(i, 0, 0, r.width, r.height); i.src = src; }
}
addEventListener("resize", () => setTimeout(fitPad, 150));
const ppos = (e) => { const r = pad.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
pad.addEventListener("pointerdown", (e) => { e.preventDefault(); pad.setPointerCapture(e.pointerId); drawing = true; last = ppos(e); });
pad.addEventListener("pointermove", (e) => {
  if (!drawing) return; e.preventDefault();
  const p = ppos(e), d = Math.hypot(p.x - last.x, p.y - last.y);
  px.lineWidth = Math.max(1.4, 4.2 - d * .12);
  px.beginPath(); px.moveTo(last.x, last.y); px.lineTo(p.x, p.y); px.stroke();
  ink += d; last = p;
  if (!signed && ink > 40) {
    signed = true; $("#padHint").style.display = "none";
    $("#certStatus").textContent = "Tanda tangan terdeteksi ✨ tinggal klik “Sahkan & Simpan”.";
    finishTask("sign");
  }
});
const endDraw = () => { if (!drawing) return; drawing = false; if (signed) { try { STATE.signature = pad.toDataURL("image/png"); save(); } catch { } } };
["pointerup", "pointercancel", "pointerleave"].forEach(t => pad.addEventListener(t, endDraw));

$("#clearSig").addEventListener("click", () => {
  px.clearRect(0, 0, pad.width, pad.height); signed = false; ink = 0;
  STATE.signature = ""; STATE.sealed = false; STATE.tasks.sign = false; TASKS.sign.done = false; save(); sync();
  $("#padHint").style.display = ""; $("#wax").classList.remove("on");
  $("#certStatus").textContent = "Belum ditandatangani…";
});
/* pulihkan tanda tangan tersimpan */
if (STATE.signature) {
  signed = true; ink = 999;
  $("#padHint").style.display = "none";
  $("#certStatus").textContent = "Tanda tangan kamu tersimpan ✨";
  setTimeout(fitPad, 200);
  if (STATE.sealed) { $("#wax").classList.add("on"); $("#certStatus").textContent = "Sertifikat sudah disahkan 🌹 bisa di-download lagi kapan aja."; }
}

$("#previewClose").addEventListener("click", () => { const m = $("#preview"); m.hidden = true; m.style.display = "none"; });
$("#preview").addEventListener("click", (e) => { if (e.target.id === "preview") { e.currentTarget.hidden = true; e.currentTarget.style.display = "none"; } });

$("#sigImg").addEventListener("error", function () {
  const w = document.createElement("div");
  w.style.cssText = 'font-family:"Caveat",cursive;font-size:2.3rem;color:#8a0d3a;transform:rotate(-7deg)';
  w.textContent = CONFIG.aku;
  this.replaceWith(w);
});

/* ══ render sertifikat resolusi tinggi (tanpa library) ══ */
const CW = 2000, CH = 1414;  // rasio A4 landscape @ ±170 dpi

function roundRect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function drawRose(c, x, y, R) {
  const g = c.createRadialGradient(x - R * .25, y - R * .3, R * .1, x, y, R);
  g.addColorStop(0, "#ff7a9c"); g.addColorStop(1, "#a3002a");
  c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, 6.3); c.fill();
  c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = R * .07;
  for (let i = 1; i <= 4; i++) { c.beginPath(); c.arc(x, y, R * (1 - i * .19), 0, 6.3); c.stroke(); }
  c.fillStyle = "#ffd6e2"; c.beginPath(); c.arc(x, y, R * .12, 0, 6.3); c.fill();
}
function wrap(c, text, x, y, maxW, lh) {
  const words = text.split(" "); let line = "", yy = y;
  for (const w of words) {
    if (c.measureText(line + w + " ").width > maxW && line) { c.fillText(line.trim(), x, yy); line = w + " "; yy += lh; }
    else line += w + " ";
  }
  c.fillText(line.trim(), x, yy); return yy + lh;
}
function loadImg(src) {
  return new Promise((res) => {
    const i = new Image(); i.crossOrigin = "anonymous";
    i.onload = () => res(i); i.onerror = () => res(null); i.src = src;
  });
}

async function renderCertificate() {
  const cv = document.createElement("canvas");
  cv.width = CW; cv.height = CH;
  const c = cv.getContext("2d");
  try { await document.fonts.ready; } catch { }

  /* latar krem bergradasi + tekstur lembut */
  const bg = c.createLinearGradient(0, 0, CW, CH);
  bg.addColorStop(0, "#fffdf7"); bg.addColorStop(.5, "#fff6f1"); bg.addColorStop(1, "#ffeef4");
  c.fillStyle = bg; c.fillRect(0, 0, CW, CH);
  const glow1 = c.createRadialGradient(0, 0, 0, 0, 0, CW * .5);
  glow1.addColorStop(0, "rgba(255,46,99,.10)"); glow1.addColorStop(1, "transparent");
  c.fillStyle = glow1; c.fillRect(0, 0, CW, CH);
  const glow2 = c.createRadialGradient(CW, CH, 0, CW, CH, CW * .5);
  glow2.addColorStop(0, "rgba(201,162,39,.16)"); glow2.addColorStop(1, "transparent");
  c.fillStyle = glow2; c.fillRect(0, 0, CW, CH);

  /* watermark mawar besar */
  c.save(); c.globalAlpha = .05; drawRose(c, CW / 2, CH / 2 + 40, 420); c.restore();

  /* bingkai emas ganda */
  const m = 56;
  c.strokeStyle = "#c9a227"; c.lineWidth = 8; roundRect(c, m, m, CW - m * 2, CH - m * 2, 28); c.stroke();
  c.strokeStyle = "#e3c565"; c.lineWidth = 3; roundRect(c, m + 20, m + 20, CW - (m + 20) * 2, CH - (m + 20) * 2, 18); c.stroke();
  /* ornamen sudut */
  c.strokeStyle = "#c9a227"; c.lineWidth = 5;
  const L = 86, o = m + 46;
  [[o, o, 1, 1], [CW - o, o, -1, 1], [o, CH - o, 1, -1], [CW - o, CH - o, -1, -1]].forEach(([x, y, sx, sy]) => {
    c.beginPath(); c.moveTo(x + sx * L, y); c.lineTo(x, y); c.lineTo(x, y + sy * L); c.stroke();
    c.beginPath(); c.arc(x + sx * 18, y + sy * 18, 9, 0, 6.3); c.fillStyle = "#c9a227"; c.fill();
  });

  const cx = CW / 2;
  c.textAlign = "center"; c.textBaseline = "alphabetic";

  /* kepala */
  c.fillStyle = "#a07b14"; c.font = '600 26px Quicksand, sans-serif';
  c.fillText("S  E  R  T  I  F  I  K  A  T     R  E  S  M  I", cx, 206);

  c.fillStyle = "#b3002d"; c.font = '700 italic 104px "Playfair Display", Georgia, serif';
  c.fillText("Happy My Girl Day", cx, 318);

  /* garis hias + mawar */
  const ry = 366;
  const lg = c.createLinearGradient(cx - 420, 0, cx + 420, 0);
  lg.addColorStop(0, "rgba(201,162,39,0)"); lg.addColorStop(.5, "#c9a227"); lg.addColorStop(1, "rgba(201,162,39,0)");
  c.strokeStyle = lg; c.lineWidth = 3;
  c.beginPath(); c.moveTo(cx - 420, ry); c.lineTo(cx - 44, ry); c.stroke();
  c.beginPath(); c.moveTo(cx + 44, ry); c.lineTo(cx + 420, ry); c.stroke();
  drawRose(c, cx, ry, 26);

  c.fillStyle = "#6b3449"; c.font = '500 30px Quicksand, sans-serif';
  c.fillText("Dengan ini dinyatakan bahwa", cx, 442);

  /* nama */
  c.fillStyle = "#8a0d3a"; c.font = '700 italic 118px "Playfair Display", Georgia, serif';
  c.fillText(CONFIG.pacar, cx, 566);
  c.strokeStyle = "rgba(138,13,58,.3)"; c.lineWidth = 2;
  c.beginPath(); c.moveTo(cx - 330, 594); c.lineTo(cx + 330, 594); c.stroke();

  c.fillStyle = "#6b3449"; c.font = '500 31px Quicksand, sans-serif';
  let y = wrap(c, "secara sah, sadar, dan tanpa paksaan sedikit pun ditetapkan sebagai Wanita Kesayangan satu-satunya dari " + CONFIG.aku + ",", cx, 652, 1300, 46);

  /* hak istimewa */
  const perks = ["Pelukan tak terbatas, kapan pun diminta", "Dibelain terus, walaupun lagi salah",
    "Didengerin curhatnya sampai tuntas", "Dikasih mawar merah tanpa perlu alasan",
    "Dikangenin setiap hari, tanpa jeda"];
  c.textAlign = "left";
  const px0 = cx - 430; let py = y + 26;
  c.font = '600 29px Quicksand, sans-serif';
  perks.forEach((t, i) => {
    const yy = py + i * 46;
    c.fillStyle = "#c9a227"; c.beginPath(); c.arc(px0 - 26, yy - 10, 7, 0, 6.3); c.fill();
    c.fillStyle = "#5a2a3d"; c.fillText(t, px0, yy);
  });
  c.textAlign = "center";
  c.fillStyle = "#8b6274"; c.font = 'italic 500 25px Quicksand, sans-serif';
  c.fillText("Berlaku seumur hidup. Tidak dapat dibatalkan, dialihkan, atau ditukar.", cx, py + perks.length * 46 + 26);

  /* stempel lilin */
  const sx2 = CW - 230, sy2 = 240;
  c.save(); c.translate(sx2, sy2); c.rotate(-.14);
  const wg = c.createRadialGradient(-18, -20, 8, 0, 0, 86);
  wg.addColorStop(0, "#ff6b8c"); wg.addColorStop(1, "#8e0030");
  c.fillStyle = wg; c.beginPath();
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * 6.283, r = 80 + Math.sin(i * 3.1) * 7;
    i ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  c.closePath(); c.fill();
  c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 60, 0, 6.3); c.stroke();
  drawRose(c, 0, 0, 34);
  c.restore();

  /* tanda tangan */
  const sigY = CH - 290, colW = 520;
  const cols = [{ x: cx - 330, name: CONFIG.aku, role: "Pemberi Hadiah" },
  { x: cx + 330, name: CONFIG.pacar, role: "Penerima Hadiah" }];

  const sigIbah = await loadImg("assets/signature.png");
  if (sigIbah && sigIbah.width) {
    const h = 150, w = Math.min(colW - 40, sigIbah.width / sigIbah.height * h);
    c.drawImage(sigIbah, cols[0].x - w / 2, sigY - h, w, h);
  } else {
    c.fillStyle = "#8a0d3a"; c.font = '600 84px Caveat, cursive';
    c.save(); c.translate(cols[0].x, sigY - 24); c.rotate(-.1); c.fillText(CONFIG.aku, 0, 0); c.restore();
  }

  if (STATE.signature) {
    const si = await loadImg(STATE.signature);
    if (si) {
      const h = 150, w = Math.min(colW - 40, si.width / si.height * h);
      c.drawImage(si, cols[1].x - w / 2, sigY - h, w, h);
    }
  }

  cols.forEach(col => {
    c.strokeStyle = "#3a1326"; c.globalAlpha = .55; c.lineWidth = 3;
    c.beginPath(); c.moveTo(col.x - colW / 2, sigY + 6); c.lineTo(col.x + colW / 2, sigY + 6); c.stroke();
    c.globalAlpha = 1;
    c.fillStyle = "#3a1326"; c.font = '600 38px "Playfair Display", Georgia, serif';
    c.fillText(col.name, col.x, sigY + 56);
    c.fillStyle = "#8b6274"; c.font = '500 24px Quicksand, sans-serif';
    c.fillText(col.role, col.x, sigY + 92);
  });

  /* kaki */
  c.fillStyle = "#8b6274"; c.font = '500 24px Quicksand, sans-serif';
  c.fillText("Ditetapkan pada " + CERT_DATE_STR + "   •   No. " + STATE.serial + "   •   Dibuat dengan sepenuh hati", cx, CH - 96);

  return cv;
}

$("#saveCert").addEventListener("click", async () => {
  if (!signed) {
    $("#certStatus").textContent = "Eits… tanda tangan dulu dong di kotaknya 🖊️";
    pad.animate([{ transform: "translateX(0)" }, { transform: "translateX(-9px)" },
    { transform: "translateX(9px)" }, { transform: "translateX(0)" }], { duration: 340 });
    return;
  }
  const btn = $("#saveCert"); btn.disabled = true;
  $("#wax").classList.add("on"); $("#cert").classList.add("sealed");
  STATE.sealed = true; save();
  $("#certStatus").textContent = "Menyiapkan sertifikat resolusi tinggi…";
  try {
    const cv = await renderCertificate();
    await new Promise(r => cv.toBlob(b => {
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.download = "Sertifikat-My-Girl-Day-" + CONFIG.pacar.replace(/ /g, "-") + ".png";
      a.href = url; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000); r();
    }, "image/png"));
    $("#certStatus").textContent = "Tersimpan! 2000×1414 px, siap dicetak 😌 Sah seumur hidup.";
    burstAt($("#cert"), 26, ["📜", "🌹", "❤️", "✨"]); flash();
  } catch (e) {
    $("#certStatus").textContent = "Gagal menyimpan — coba sekali lagi ya 🙏";
  }
  btn.disabled = false;
  setTimeout(() => go(cur + 1, 1), 1100);
});

$("#previewCert") && $("#previewCert").addEventListener("click", async () => {
  $("#certStatus").textContent = "Membuat pratinjau…";
  const cv = await renderCertificate();
  $("#previewImg").src = cv.toDataURL("image/png");
  const m2 = $("#preview"); m2.hidden = false; m2.style.display = "grid";
  $("#certStatus").textContent = "Ini tampilan file yang akan kamu download 👀";
});

/* ───────── penutup ───────── */
const LOVE = ["Aku tahu 😌 tapi seneng banget dengernya.", "Ulangi lagi dong, aku suka 🥺",
  "Kamu yang terbaik, Sinta. Beneran. 🤍", "Oke, sekarang aku senyum sendiri. Makasih ya ❤️",
  "Deal: kita tua bareng ya 🌹"];
let li2 = STATE.loveIndex | 0;
$("#loveBtn").addEventListener("click", (e) => {
  burst(e.clientX, e.clientY, 22);
  $("#loveMsg").textContent = LOVE[li2++ % LOVE.length];
  STATE.loveIndex = li2; save();
  flash();
});
$("#againBtn").addEventListener("click", resetAll);

/* ───────── mulai ───────── */
(function boot() {
  const start = clamp(STATE.page | 0, 0, pages.length - 1);
  pages[start].classList.add("active");
  for (let i = 0; i < start; i++) pages[i].classList.add("prev");
  cur = start; maxSeen = Math.max(maxSeen, start);
  if (start > 0) $("#envelope").classList.add("open");
  if (start > 2) { typedStarted = true; $("#typed").textContent = LINES[LINES.length - 1]; }
  sync(); onEnter(start);
  if (start > 0) { const t = $("#resumeMsg"); if (t) { t.textContent = "Dilanjut dari halaman terakhir kamu 💗"; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 3200); } }
})();
