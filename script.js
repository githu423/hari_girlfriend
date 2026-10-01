/* Happy My Girl Day — Sinta Liya 🌹  |  by Ibah Misbah */
const $ = (s) => document.querySelector(s);

/* ---------------- kelopak mawar jatuh ---------------- */
(function petals() {
  const c = $("#petals"), x = c.getContext("2d");
  let w, h, P = [];
  const N = window.innerWidth < 600 ? 22 : 40;
  function size() { w = c.width = innerWidth; h = c.height = innerHeight; }
  size(); addEventListener("resize", size);
  const mk = () => ({ x: Math.random() * w, y: Math.random() * -h, r: 5 + Math.random() * 8,
    s: .4 + Math.random() * 1.1, a: Math.random() * 6.28, va: (Math.random() - .5) * .04,
    sw: Math.random() * 1.6, o: .35 + Math.random() * .5 });
  for (let i = 0; i < N; i++) P.push(mk());
  (function loop() {
    x.clearRect(0, 0, w, h);
    for (const p of P) {
      p.y += p.s; p.a += p.va; p.x += Math.sin(p.y / 50) * p.sw * .4;
      if (p.y > h + 20) Object.assign(p, mk(), { y: -20 });
      x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = p.o;
      x.fillStyle = "#ff2e63";
      x.beginPath(); x.ellipse(0, 0, p.r, p.r * .62, 0, 0, 6.3); x.fill();
      x.fillStyle = "rgba(255,255,255,.25)";
      x.beginPath(); x.ellipse(-p.r * .25, 0, p.r * .4, p.r * .3, 0, 0, 6.3); x.fill();
      x.restore();
    }
    requestAnimationFrame(loop);
  })();
})();

/* ---------------- hati terbang ---------------- */
function burst(x, y, n = 8, chars = ["❤️", "💗", "💘", "🌹", "✨"]) {
  for (let i = 0; i < n; i++) {
    const e = document.createElement("span");
    e.className = "fly-heart";
    e.textContent = chars[(Math.random() * chars.length) | 0];
    e.style.left = x + "px"; e.style.top = y + "px";
    e.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    e.style.animationDelay = (i * 40) + "ms";
    $("#hearts").appendChild(e);
    setTimeout(() => e.remove(), 1800);
  }
}
addEventListener("click", (ev) => { if (!ev.target.closest("#sigPad")) burst(ev.clientX, ev.clientY, 3); });

/* ---------------- buka gerbang ---------------- */
$("#openBtn").addEventListener("click", (e) => {
  burst(e.clientX, e.clientY, 26);
  $("#gate").style.transition = "opacity .6s,transform .6s";
  $("#gate").style.opacity = 0; $("#gate").style.transform = "scale(1.06)";
  setTimeout(() => {
    $("#gate").remove(); $("#story").hidden = false;
    io();
    $("#sec-ucapan").scrollIntoView({ behavior: "smooth" });
    typeIt();
  }, 600);
});

/* ---------------- reveal on scroll ---------------- */
function io() {
  const ob = new IntersectionObserver((es) => es.forEach(e => e.isIntersecting && e.target.classList.add("in")),
    { threshold: .14 });
  document.querySelectorAll(".reveal").forEach(el => ob.observe(el));
}

/* ---------------- mesin ketik ---------------- */
const LINES = [
  "Buat kamu, yang paling aku sayang…",
  "Hari ini resmi jadi HARI-NYA KAMU 🎀",
  "Selamat My Girl Day, Sinta Liya ❤️"
];
function typeIt() {
  const el = $("#typed"); let li = 0, ci = 0, del = false;
  (function tick() {
    const t = LINES[li];
    el.textContent = del ? t.slice(0, --ci) : t.slice(0, ++ci);
    let d = del ? 28 : 55;
    if (!del && ci === t.length) { if (li === LINES.length - 1) return; del = true; d = 1500; }
    if (del && ci === 0) { del = false; li++; d = 220; }
    setTimeout(tick, d);
  })();
}

/* ---------------- boneka ---------------- */
const DOLL = ["Halo Sinta! 🐧", "Hari ini kamu cantik banget 😍", "Ibah titip peluk, katanya 🤗",
  "Jangan lupa makan ya! 🍜", "Aku jagain kamu dari rebahan 😎", "Badtz vibes: nakal tapi sayang 😜",
  "Kamu juara 1 di hatinya dia 🏆", "Kalau dia nyebelin, laporin ke aku 📣"];
let di = 0;
$("#doll").addEventListener("click", (e) => {
  const d = $("#doll"); d.classList.remove("hit"); void d.offsetWidth; d.classList.add("hit");
  di = (di + 1) % DOLL.length;
  const b = $("#dollBubble"); b.textContent = DOLL[di];
  b.style.animation = "none"; void b.offsetWidth; b.style.animation = "";
  burst(e.clientX, e.clientY, 6, ["💗", "🐧", "✨"]);
});

/* ---------------- buket mawar ---------------- */
const ROSES = [
  "Mawar 1 — buat senyummu yang bikin hari aku beres.",
  "Mawar 2 — buat sabarmu yang kebangetan sama aku.",
  "Mawar 3 — buat suaramu, lagu favorit aku.",
  "Mawar 4 — buat matamu, tempat aku paling betah.",
  "Mawar 5 — buat marahmu yang tetep aja lucu 🙈",
  "Mawar 6 — buat kita, yang masih mau jalan bareng.",
  "Mawar 7 — buat besok, lusa, dan seterusnya. Sama kamu."
];
const bq = $("#bouquet"); const picked = new Set();
ROSES.forEach((msg, i) => {
  const b = document.createElement("button");
  b.className = "stalk"; b.setAttribute("aria-label", "Mawar " + (i + 1));
  b.innerHTML = `<svg width="54" height="104" viewBox="0 0 54 104">
    <path d="M27 42v56" stroke="#2f9e44" stroke-width="5" stroke-linecap="round"/>
    <path d="M27 66c-14 0-18-10-18-10s10-6 18 4z" fill="#2f9e44"/>
    <path d="M27 82c14 0 18-10 18-10s-10-6-18 4z" fill="#37b24d"/>
    <g class="head"><circle cx="27" cy="26" r="20" fill="#b3002d"/>
    <circle cx="27" cy="26" r="14" fill="#e01e4f"/>
    <circle cx="27" cy="26" r="8.5" fill="#ff5177"/>
    <circle cx="27" cy="26" r="3.5" fill="#ffd0dc"/></g></svg>`;
  b.addEventListener("click", (e) => {
    b.classList.add("picked"); picked.add(i);
    const m = $("#roseMsg"); m.style.opacity = 0;
    setTimeout(() => { m.textContent = "“" + msg + "”"; m.style.opacity = 1; }, 160);
    $("#roseCount").textContent = `${picked.size} / 7 mawar dipetik`;
    burst(e.clientX, e.clientY, 7, ["🌹", "💖"]);
    if (picked.size === 7) {
      $("#roseCount").textContent = "7 / 7 — buketnya lengkap, semuanya buat kamu 💐";
      burst(innerWidth / 2, innerHeight / 2, 30, ["🌹", "💐", "❤️"]);
    }
  });
  bq.appendChild(b);
});

/* ---------------- kunci hati -> video ---------------- */
let pct = 0, unlocked = false;
const TEASE = ["ayo dong, jangan malu-malu 😳", "nah gitu… lanjut 💗", "setengah jalan, kamu kuat!",
  "dikit lagi sayang 🥺", "WOOO hampir penuh!!"];
$("#heartBtn").addEventListener("click", (e) => {
  if (unlocked) return;
  pct = Math.min(100, pct + 10);
  $("#fill").setAttribute("y", 110 - (110 * pct / 100));
  $("#heartPct").textContent = pct + "%";
  $("#heartTease").textContent = TEASE[Math.min(TEASE.length - 1, Math.floor(pct / 22))];
  burst(e.clientX, e.clientY, 5);
  if (pct >= 100) {
    unlocked = true;
    $("#heartTease").innerHTML = "<b>Kebuka! Ini video spesial buat kamu 🎬</b>";
    $("#videoWrap").hidden = false;
    burst(innerWidth / 2, innerHeight / 3, 34);
    setTimeout(() => $("#videoWrap").scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  }
});

/* ---------------- tanggal sertifikat ---------------- */
$("#certDate").textContent = "Ditetapkan pada " + new Date().toLocaleDateString("id-ID",
  { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " • Dibuat dengan sepenuh hati";

/* ---------------- signature pad ---------------- */
const pad = $("#sigPad"), px = pad.getContext("2d");
let drawing = false, signed = false, last = null;
function fit() {
  const r = pad.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  const img = signed ? pad.toDataURL() : null;
  pad.width = r.width * dpr; pad.height = r.height * dpr;
  px.setTransform(dpr, 0, 0, dpr, 0, 0);
  px.lineWidth = 2.8; px.lineCap = "round"; px.lineJoin = "round"; px.strokeStyle = "#8a0d3a";
  if (img) { const i = new Image(); i.onload = () => px.drawImage(i, 0, 0, r.width, r.height); i.src = img; }
}
addEventListener("resize", fit); setTimeout(fit, 60);

const pos = (e) => { const r = pad.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e;
  return { x: p.clientX - r.left, y: p.clientY - r.top }; };
function start(e) { e.preventDefault(); drawing = true; last = pos(e); }
function move(e) {
  if (!drawing) return; e.preventDefault();
  const p = pos(e);
  px.beginPath(); px.moveTo(last.x, last.y); px.lineTo(p.x, p.y); px.stroke();
  last = p;
  if (!signed) { signed = true; $("#padHint").style.display = "none"; $("#certStatus").textContent = "Tanda tangan terdeteksi ✨ jangan lupa klik Simpan."; }
}
function end() { drawing = false; }
["mousedown", "touchstart"].forEach(t => pad.addEventListener(t, start, { passive: false }));
["mousemove", "touchmove"].forEach(t => pad.addEventListener(t, move, { passive: false }));
["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(t => pad.addEventListener(t, end));

$("#clearSig").addEventListener("click", () => {
  px.clearRect(0, 0, pad.width, pad.height); signed = false;
  $("#padHint").style.display = ""; $("#certStatus").textContent = "Belum ditandatangani…";
});

/* fallback kalau png ttd belum ada */
$("#sigImg").addEventListener("error", function () {
  const w = document.createElement("div");
  w.style.cssText = "font-family:Georgia,serif;font-style:italic;font-size:1.6rem;color:#8a0d3a;transform:rotate(-6deg)";
  w.textContent = "Ibah Misbah";
  this.replaceWith(w);
});

/* ---------------- simpan sertifikat ---------------- */
$("#saveCert").addEventListener("click", async () => {
  if (!signed) {
    $("#certStatus").textContent = "Eits… tanda tangan dulu dong di kotaknya 🖊️";
    $("#sigPad").animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" }, { transform: "translateX(0)" }], { duration: 320 });
    return;
  }
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
    $("#certStatus").textContent = "Tersimpan! Simpan baik-baik ya, itu sah 😌";
  } catch (err) {
    $("#certStatus").textContent = "Gagal simpan otomatis — screenshot aja ya, tetap sah kok 😄";
  }
  finale();
});

function finale() {
  const f = $("#finale"); f.hidden = false;
  let n = 0;
  const t = setInterval(() => {
    burst(Math.random() * innerWidth, innerHeight * (.3 + Math.random() * .5), 6);
    if (++n > 24) clearInterval(t);
  }, 160);
  f.addEventListener("click", () => f.hidden = true);
  setTimeout(() => f.hidden = true, 6000);
}
