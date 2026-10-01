/* ═══════════════════════════════════════════════
   Happy My Girl Day — Buku untuk Sinta Liya 🌹
   dari Ibah Misbah
   ═══════════════════════════════════════════════ */

const CONFIG = {
  pacar: "Sinta Liya",
  aku: "Ibah Misbah",
  jadian: new Date(2023, 0, 14, 19, 30, 0), // ← ganti tanggal jadian kalian (bulan dimulai dari 0)
};

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
  const mk = () => ({ x: rnd(0, w), y: rnd(-h, 0), r: rnd(5, 13), s: rnd(.3, 1.1), a: rnd(0, 6.28),
    va: rnd(-.025, .025), sw: rnd(0, 1.7), o: rnd(.25, .75),
    c: Math.random() < .18 ? "#ffd27a" : "#ff2e63" });
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
const burstAt = (el, n = 10, c) => { const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, n, c); };
addEventListener("click", (e) => { if (!e.target.closest("#sigPad,.icon-btn,.nav-btn")) burst(e.clientX, e.clientY, 3); });
function flash() { const f = $("#flash"); f.classList.remove("on"); void f.offsetWidth; f.classList.add("on"); }

/* ═════════ MESIN HALAMAN ═════════ */
const pages = $$(".page");
const TASKS = {
  baca: { done: false, msg: "Baca dulu suratnya ya, sebentar aja 💌" },
  doll: { done: false, msg: "Ajak Badtz main dulu dong, kasihan 🐧" },
  rose: { done: false, msg: "Petik minimal 3 mawar dulu ya 🌹" },
  quiz: { done: false, msg: "Selesaikan kuisnya dulu, gampang kok 😌" },
  heart:{ done: false, msg: "Tahan hatinya sampai 100% dulu ya 💗" },
  sign: { done: false, msg: "Tanda tangan dulu di kotaknya 🖊️" },
};
let cur = 0, maxSeen = 0;

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
  TASKS[key].done = true;
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
pages[0].classList.add("active"); sync();

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
  bgm.play().then(() => { mb.classList.add("on"); mb.textContent = "🎶"; }).catch(() => {});
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
let di = 0, dollPlays = 0;
const bubble = $("#dollBubble"), doll = $("#doll");
function say(txt, cls = "hit") {
  doll.classList.remove("hit", "jump"); void doll.offsetWidth; doll.classList.add(cls);
  bubble.textContent = txt;
  bubble.style.animation = "none"; void bubble.offsetWidth; bubble.style.animation = "";
  if (++dollPlays >= 3) finishTask("doll");
}
doll.addEventListener("click", (e) => {
  di = (di + 1) % DOLL.length; say(DOLL[di]);
  burst(e.clientX, e.clientY, 6, ["💗", "🐧", "✨"]);
});
$$(".chips .chip").forEach(b => b.addEventListener("click", (e) => {
  const k = b.dataset.act, a = ACT[k];
  say(a[(Math.random() * a.length) | 0], "jump");
  if (k === "dandan") { $("#bowtie").setAttribute("opacity", "1"); $("#hat").setAttribute("opacity", "1"); }
  const em = { peluk: ["🤗", "💗"], kasih: ["🍰", "🍩", "✨"], dandan: ["🎀", "✨"], rahasia: ["🤫", "💌"] }[k];
  burst(e.clientX, e.clientY, 11, em);
}));
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

/* ───────── kuis ───────── */
const QUIZ = [
  { q: "Siapa wanita kesayangan Ibah Misbah?", o: ["Sinta Liya 🌹", "Sinta Liya (lagi)", "Ya… Sinta Liya lah"],
    f: "Benar semua. Emang nggak ada opsi lain 😌" },
  { q: "Bunga favoritmu apa hayo?", o: ["Mawar merah 🌹", "Mawar merah tapi banyak", "Mawar merah dari Ibah"],
    f: "Yes! Dan stoknya seumur hidup ❤️" },
  { q: "Seberapa sayang Ibah ke kamu?", o: ["Banyak banget", "Banyak banget ×1000", "Sampai bikin web ini"],
    f: "Jawaban kamu kurang besar. Yang bener: semuanya 🤍" },
  { q: "Kalau kamu ngambek, Ibah harus gimana?", o: ["Minta maaf dulu", "Beliin makanan", "Peluk, terus nggak dilepas"],
    f: "Noted. Akan dilaksanakan seumur hidup 🫡" },
  { q: "Terakhir: mau nggak dicintai Ibah terus-terusan?", o: ["Mau banget ❤️", "Iya dong", "Udah dari dulu"],
    f: "Alhamdulillah. Perjanjian sah 🎉" }
];
let qi = 0;
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
        if (++qi < QUIZ.length) renderQ();
        else {
          $("#qText").textContent = "Skor kamu: 100/100 🏆";
          box.innerHTML = "";
          $("#qFeed").classList.add("big");
          $("#qFeed").textContent = "Sempurna. Ya iyalah, semua jawabannya kamu 😚";
          $("#qProg").textContent = "Lulus dengan predikat: Pacar Teladan";
          burst(innerWidth / 2, innerHeight / 2, 26, ["🏆", "🎉", "❤️"]);
          finishTask("quiz");
        }
      }, 1150);
    });
    box.appendChild(b);
  });
}
renderQ();

/* ───────── tahan hati ───────── */
let pct = 0, holding = false, unlocked = false, raf = null;
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
  finishTask("heart");
  setTimeout(() => go(cur + 1, 1), 1100);
}

/* ───────── sertifikat ───────── */
$("#certDate").textContent = "Ditetapkan pada " + new Date().toLocaleDateString("id-ID",
  { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " • Dibuat dengan sepenuh hati";

const pad = $("#sigPad"), px = pad.getContext("2d");
let drawing = false, signed = false, last = null, ink = 0;
function fitPad() {
  const r = pad.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  if (!r.width) return;
  const img = signed ? pad.toDataURL() : null;
  pad.width = r.width * dpr; pad.height = r.height * dpr;
  px.setTransform(dpr, 0, 0, dpr, 0, 0);
  px.lineCap = "round"; px.lineJoin = "round"; px.strokeStyle = "#8a0d3a";
  if (img) { const i = new Image(); i.onload = () => px.drawImage(i, 0, 0, r.width, r.height); i.src = img; }
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
["pointerup", "pointercancel", "pointerleave"].forEach(t => pad.addEventListener(t, () => drawing = false));

$("#clearSig").addEventListener("click", () => {
  px.clearRect(0, 0, pad.width, pad.height); signed = false; ink = 0;
  $("#padHint").style.display = ""; $("#wax").classList.remove("on");
  $("#certStatus").textContent = "Belum ditandatangani…";
});
$("#sigImg").addEventListener("error", function () {
  const w = document.createElement("div");
  w.style.cssText = 'font-family:"Caveat",cursive;font-size:2.3rem;color:#8a0d3a;transform:rotate(-7deg)';
  w.textContent = CONFIG.aku;
  this.replaceWith(w);
});

$("#saveCert").addEventListener("click", async () => {
  if (!signed) {
    $("#certStatus").textContent = "Eits… tanda tangan dulu dong di kotaknya 🖊️";
    pad.animate([{ transform: "translateX(0)" }, { transform: "translateX(-9px)" },
      { transform: "translateX(9px)" }, { transform: "translateX(0)" }], { duration: 340 });
    return;
  }
  $("#wax").classList.add("on"); $("#cert").classList.add("sealed");
  $("#certStatus").textContent = "Menyiapkan sertifikat…";
  try {
    if (!window.html2canvas) await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
    const cv = await html2canvas($("#cert"), { backgroundColor: "#fffaf2", scale: 2, useCORS: true });
    const a = document.createElement("a");
    a.download = "Sertifikat-My-Girl-Day-Sinta-Liya.png";
    a.href = cv.toDataURL("image/png"); a.click();
    $("#certStatus").textContent = "Tersimpan! Simpan baik-baik ya, itu sah seumur hidup 😌";
  } catch {
    $("#certStatus").textContent = "Gagal simpan otomatis — screenshot aja ya, tetap sah kok 😄";
  }
  setTimeout(() => go(cur + 1, 1), 900);
});

/* ───────── penutup ───────── */
const LOVE = ["Aku tahu 😌 tapi seneng banget dengernya.", "Ulangi lagi dong, aku suka 🥺",
  "Kamu yang terbaik, Sinta. Beneran. 🤍", "Oke, sekarang aku senyum sendiri. Makasih ya ❤️",
  "Deal: kita tua bareng ya 🌹"];
let li2 = 0;
$("#loveBtn").addEventListener("click", (e) => {
  burst(e.clientX, e.clientY, 22);
  $("#loveMsg").textContent = LOVE[li2++ % LOVE.length];
  flash();
});
$("#againBtn").addEventListener("click", () => location.reload());
