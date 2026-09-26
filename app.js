'use strict';
/* =========================================================
   A.K.T.A. – 5. akta (grooming) – Robotzsaru Adattár
   Oktatási szimuláció. Minden szereplő és adat kitalált.
   ========================================================= */

/* ---------- Beállítások ---------- */
const CASE_NO = '01110/1847/2025.bü.';
const STORE = 'akta5_state_v1';
const CASE_YEAR = 2025; // az életkorok ehhez az évhez számolva

/* ---------- Segédfüggvények ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).toLowerCase().replace(/\s+/g, '').replace(/ü/g, 'u').replace(/ű/g, 'u').replace(/\.+$/, '');
const DAYS = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
function weekday(d) { const [y, m, dd] = d.split('.').map(Number); return DAYS[new Date(y, m - 1, dd).getDay()]; }

const defaultState = () => ({
  auth: false,
  clues: { kerulet: false, foglalkozas: false, keszulek: false, kor: false },
  recovered: [],
  timelineDone: false,
  solved: false
});
let S = loadState();
function loadState() {
  try { const r = localStorage.getItem(STORE); if (r) return Object.assign(defaultState(), JSON.parse(r)); } catch (e) { }
  return defaultState();
}
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { } }
const clueCount = () => Object.values(S.clues).filter(Boolean).length;
function addClue(k) {
  if (S.clues[k]) return;
  S.clues[k] = true; save();
  toast(`Új adat került az elkövetői profilba (${clueCount()}/4)`);
}

let toastT;
function toast(t) {
  const el = $('#toast'); el.textContent = t; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3200);
}
function openModal(html, cls = '') {
  $('#modal-body').innerHTML = html;
  $('.modal-box').className = 'modal-box ' + cls;
  $('#modal').hidden = false;
  $('.modal-close').focus();
}
function closeModal() { $('#modal').hidden = true; $('#modal-body').innerHTML = ''; }
$('.modal-close').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });

/* ---------- Blokkos avatar (SVG) ---------- */
function avatar(c) {
  return `<svg viewBox="0 0 60 80" aria-hidden="true">
    <rect x="18" y="4" width="24" height="22" rx="3" fill="${c.skin}"/>
    <rect x="24" y="12" width="3" height="4" fill="#222"/><rect x="33" y="12" width="3" height="4" fill="#222"/>
    <rect x="25" y="19" width="10" height="2" fill="#222"/>
    <rect x="16" y="2" width="28" height="7" fill="${c.hair}"/>
    <rect x="16" y="28" width="28" height="26" fill="${c.shirt}"/>
    <rect x="4" y="28" width="11" height="24" fill="${c.skin}"/><rect x="45" y="28" width="11" height="24" fill="${c.skin}"/>
    <rect x="16" y="55" width="13" height="23" fill="${c.pants}"/><rect x="31" y="55" width="13" height="23" fill="${c.pants}"/>
  </svg>`;
}
const AV = {
  lili: { skin: '#f3c9a5', hair: '#6b3f1f', shirt: '#e46fb0', pants: '#3d4a8a' },
  dani: { skin: '#f0c19a', hair: '#1f1f1f', shirt: '#2f9e58', pants: '#2b2b2b' },
  bogi: { skin: '#e9b98f', hair: '#c9912f', shirt: '#7b61ff', pants: '#5a5a5a' },
  peti: { skin: '#d9a47a', hair: '#8a4b22', shirt: '#ff9f1a', pants: '#27496d' }
};

/* =========================================================
   ADATOK – Roblox-mock
   ========================================================= */
const BLOX_FRIENDS = [
  { id: 'dani', user: 'Dani_15', name: 'Dani', av: AV.dani, joined: '2019.06.11.', friends: 212,
    bio: '15 | Bp | dc: dani_15 🎮 írj ha unatkozol', games: 'Tycoon Kuckó, Obby Mania' },
  { id: 'bogi', user: 'bogi_macska', name: 'Bogi', av: AV.bogi, joined: '2022.12.24.', friends: 38,
    bio: '🐱🐱🐱 7.b', games: 'Adopt Me, Tycoon Kuckó' },
  { id: 'peti', user: 'pixelpeti', name: 'Peti', av: AV.peti, joined: '2021.08.02.', friends: 64,
    bio: 'obby pro 😎', games: 'Obby Mania' }
];
const BLOX_CHATS = {
  dani: [
    { d: '2025.02.08', t: '16:42', f: 'o', x: 'szia, láttam hogy te is tycoonozol 😄 nagyon jól építkezel' },
    { d: '2025.02.08', t: '16:44', f: 'me', x: 'köszi :)' },
    { d: '2025.02.08', t: '16:45', f: 'o', x: 'ha akarsz, segítek, én már régóta játszom' },
    { d: '2025.02.14', t: '17:05', sys: 'Dani_15 ajándékot küldött neked: 400 Robux' },
    { d: '2025.02.14', t: '17:06', f: 'me', x: 'úristen köszi!!!' },
    { d: '2025.02.14', t: '17:06', f: 'o', x: 'semmiség, megérdemled 😊' },
    { d: '2025.02.19', t: '18:10', f: 'o', x: 'honnan vagy amúgy?' },
    { d: '2025.02.19', t: '18:12', f: 'me', x: 'zugló' },
    { d: '2025.02.19', t: '18:12', f: 'o', x: 'én a XIII. kerben lakok, egész közel vagyunk 😄', clue: 'kerulet' },
    { d: '2025.02.21', t: '17:30', f: 'o', x: 'itt folyton figyelik a chatet, gyere át discordra, ott nyugisabb. ott is dani_15 vagyok' },
    { d: '2025.02.21', t: '17:33', f: 'me', x: 'okés, holnap' }
  ],
  bogi: [
    { d: '2025.02.10', t: '19:20', f: 'o', x: 'holnap matekdoga 😭 tanultál?' },
    { d: '2025.02.10', t: '19:22', f: 'me', x: 'valamennyit... gyere be tycoonba' },
    { d: '2025.02.10', t: '19:22', f: 'o', x: 'oks 5 perc' },
    { d: '2025.03.20', t: '18:02', f: 'o', x: 'miért vagy mostanában mindig discordon?' },
    { d: '2025.03.20', t: '18:05', f: 'me', x: 'semmi, csak beszélgetek valakivel' },
    { d: '2025.03.20', t: '18:05', f: 'o', x: 'kivel?' },
    { d: '2025.03.20', t: '18:09', f: 'me', x: 'majd elmondom' }
  ],
  peti: [
    { d: '2025.01.30', t: '16:15', f: 'o', x: 'obby ma?' },
    { d: '2025.01.30', t: '16:20', f: 'me', x: 'ja, 6 után' }
  ]
};

/* =========================================================
   ADATOK – Discord-mock
   ========================================================= */
const CD_USERS = {
  'Dani_15': '#3ba55d', 'lili_csillag': '#e46fb0', 'mazsi_12': '#faa61a', 'noe.2011': '#5865f2',
  'kitti.rblx': '#ed4245', 'pixelpeti': '#ff9f1a', 'KuckóBot': '#747f8d'
};
const CD_CHANNELS = [
  { id: 'szabalyok', name: 'szabályok' },
  { id: 'altalanos', name: 'általános' },
  { id: 'roblox', name: 'roblox-csapat' },
  { id: 'kepek', name: 'képek' }
];
const CD_MSGS = [
  { ch: 'szabalyok', a: 'KuckóBot', d: '2024.11.02', t: '12:00', x: '1. Legyél kedves mindenkivel.\n2. Ne küldj senkinek személyes adatot (cím, telefonszám, iskola).\n3. Ha valaki kellemetlenül viselkedik, szólj egy moderátornak.' },
  { ch: 'altalanos', a: 'pixelpeti', d: '2025.02.20', t: '16:30', x: 'ki jön ma este obbyzni?' },
  { ch: 'altalanos', sys: 'lili_csillag csatlakozott a szerverhez.', d: '2025.02.22', t: '17:02' },
  { ch: 'altalanos', a: 'Dani_15', d: '2025.02.22', t: '17:03', x: 'szia lili, örülök hogy itt vagy 😄' },
  { ch: 'altalanos', a: 'Dani_15', d: '2025.02.25', t: '10:14', x: '@mazsi_12 írj rám privátban, küldök valamit 😉' },
  { ch: 'altalanos', a: 'mazsi_12', d: '2025.02.25', t: '15:41', x: 'most értem haza, mit?' },
  { ch: 'altalanos', a: 'Dani_15', d: '2025.03.04', t: '11:02', x: '@noe.2011 kérsz Robuxot? írj dm-et' },
  { ch: 'altalanos', a: 'mazsi_12', d: '2025.03.06', t: '15:40', x: 'hahaha ki van fent' },
  { ch: 'roblox', a: 'noe.2011', d: '2025.02.27', t: '17:12', x: 'valaki tud segíteni a 3. pályán?' },
  { ch: 'roblox', a: 'pixelpeti', d: '2025.02.27', t: '17:15', x: 'ugrás előtt guggolj, úgy megy' },
  { ch: 'roblox', a: 'Dani_15', d: '2025.03.12', t: '09:37', x: '@kitti.rblx de szép a skined, dobj egy üzit privátban' },
  { ch: 'roblox', a: 'kitti.rblx', d: '2025.03.12', t: '15:10', x: 'köszi' },
  { ch: 'kepek', a: 'pixelpeti', d: '2025.03.01', t: '18:22', x: 'új rekord 🏆 (kép)' },
  { ch: 'kepek', a: 'Dani_15', d: '2025.03.08', t: '20:11', x: 'nézzétek az új buildem 🔥', shot: true }
];
const CD_DM = [
  { a: 'Dani_15', d: '2025.03.03', t: '16:20', x: 'na végre itt is beszélhetünk 😄' },
  { a: 'lili_csillag', d: '2025.03.03', t: '16:21', x: 'hali' },
  { a: 'Dani_15', d: '2025.03.07', t: '17:45', x: 'te sokkal érettebb vagy, mint a korodbeliek, veled tényleg lehet beszélgetni' },
  { a: 'lili_csillag', d: '2025.03.07', t: '17:47', x: 'köszi :)' },
  { a: 'Dani_15', d: '2025.03.10', t: '18:30', x: 'a szüleid úgyse értenék, mennyit beszélünk. ők nem figyelnek rád annyira, mint én' },
  { a: 'Dani_15', d: '2025.03.15', t: '19:02', del: 'DEL-7715' },
  { a: 'lili_csillag', d: '2025.03.15', t: '19:05', x: 'oké' },
  { a: 'lili_csillag', d: '2025.03.18', t: '16:05', x: 'ma nem érek rá, anyával megyünk valahova' },
  { a: 'Dani_15', d: '2025.03.21', t: '20:14', del: 'DEL-7720' },
  { a: 'lili_csillag', d: '2025.03.21', t: '20:16', x: 'nem, ezt nem szeretném' },
  { a: 'Dani_15', d: '2025.03.21', t: '20:17', del: 'DEL-7724' },
  { sys: 'lili_csillag letiltotta ezt a felhasználót.', d: '2025.03.22', t: '10:03' }
];
const DELETED = {
  'DEL-7715': { d: '2025.03.15', t: '19:02', x: 'ez maradjon kettőnk között, oké? ha a szüleid megtudják, elveszik a tabletet' },
  'DEL-7720': { d: '2025.03.21', t: '20:14', x: 'küldesz magadról egy képet? csak nekem, senki más nem látja' },
  'DEL-7724': { d: '2025.03.21', t: '20:17', x: 'jó, felejtsd el. de erről ne szólj senkinek, oké?' }
};
const DEL_META = {
  sender: 'Dani_15 (fiókazonosító: 4471 0932 118)',
  deletedAt: '2025.03.22. 09:58',
  device: 'Samsung Galaxy S23 (SM-S911B), Android 14',
  net: 'Otthoni Wi-Fi, IP: 84.2.xx.xx (Budapest)'
};

/* =========================================================
   ADATOK – Idővonal
   ========================================================= */
const TIMELINE = [
  { id: 't1', d: '2025.02.08.', x: 'Dani_15 először ír Lilinek a játékban, és megdicséri az építkezését.' },
  { id: 't2', d: '2025.02.14.', x: 'Dani_15 400 Robuxot ajándékoz Lilinek.' },
  { id: 't3', d: '2025.02.21.', x: 'Dani_15 arra kéri Lilit, hogy menjenek át Discordra.' },
  { id: 't4', d: '2025.03.03.', x: 'Elkezdődnek a privát üzenetek Discordon.' },
  { id: 't5', d: '2025.03.15.', x: 'Dani_15 arra kéri Lilit, hogy a beszélgetéseik maradjanak titokban.' },
  { id: 't6', d: '2025.03.21.', x: 'Dani_15 képet kér Lilitől, Lili nemet mond.' },
  { id: 't7', d: '2025.03.22.', x: 'Lili elmondja az anyukájának, mi történt, és letiltja Danit.' }
];
const TL_START = ['t4', 't1', 't6', 't3', 't7', 't2', 't5'];

/* =========================================================
   ADATOK – Személyi nyilvántartás
   ========================================================= */
const DISTRICTS = ['V.', 'VIII.', 'XI.', 'XIII.', 'XIV.', 'XV.', 'XVIII.'];
const JOBS = ['rendszergazda', 'raktáros', 'futár', 'eladó', 'szakács', 'villanyszerelő', 'könyvelő', 'sofőr', 'ügyfélszolgálatos', 'biztonsági őr'];
const DEVICES = ['Samsung Galaxy S23', 'iPhone 13', 'iPhone 15 Pro', 'Xiaomi Redmi Note 12', 'Samsung Galaxy A54', 'Huawei P30', 'Google Pixel 7'];
const AGE_BANDS = [
  { id: '18-29', label: '18–29 év', min: 18, max: 29 },
  { id: '30-39', label: '30–39 év', min: 30, max: 39 },
  { id: '40-49', label: '40–49 év', min: 40, max: 49 },
  { id: '50+', label: '50 év felett', min: 50, max: 200 }
];
const TARGET = { id: 'P-0431', name: 'Szalai Gergely', born: '1991.04.03.', year: 1991, dist: 'XIII.', job: 'rendszergazda', dev: 'Samsung Galaxy S23', target: true };
const DECOYS = [
  { name: 'Kiss Ádám', born: '1988.10.17.', year: 1988, dist: 'XIII.', job: 'rendszergazda', dev: 'iPhone 13' },
  { name: 'Tóth Bence', born: '1993.02.09.', year: 1993, dist: 'XI.', job: 'rendszergazda', dev: 'Samsung Galaxy S23' },
  { name: 'Fekete Márton', born: '1979.07.30.', year: 1979, dist: 'XIII.', job: 'rendszergazda', dev: 'Samsung Galaxy S23' },
  { name: 'Nagy Levente', born: '1990.12.01.', year: 1990, dist: 'XIII.', job: 'futár', dev: 'Samsung Galaxy S23' }
];
function buildRegistry() {
  let seed = 20250322;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = a => a[Math.floor(rnd() * a.length)];
  const SUR = ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár', 'Németh', 'Farkas', 'Balogh', 'Papp', 'Takács', 'Juhász', 'Mészáros', 'Simon', 'Rácz', 'Fekete', 'Bíró', 'Lengyel'];
  const GIV = ['Péter', 'Zoltán', 'László', 'István', 'Gábor', 'Attila', 'Krisztián', 'Norbert', 'Anna', 'Eszter', 'Katalin', 'Réka', 'Judit', 'Zsófia', 'Márk', 'Dávid', 'Bálint', 'Viktor', 'Nóra', 'Csaba'];
  const list = [TARGET, ...DECOYS.map((p, i) => ({ ...p, id: 'P-' + (512 + i * 37) }))];
  const used = new Set(list.map(p => p.name));
  while (list.length < 48) {
    const name = pick(SUR) + ' ' + pick(GIV);
    if (used.has(name)) continue;
    used.add(name);
    const year = 1960 + Math.floor(rnd() * 45);
    const p = {
      id: 'P-' + (1000 + list.length * 17),
      name, year,
      born: `${year}.${String(1 + Math.floor(rnd() * 12)).padStart(2, '0')}.${String(1 + Math.floor(rnd() * 28)).padStart(2, '0')}.`,
      dist: pick(DISTRICTS), job: pick(JOBS), dev: pick(DEVICES)
    };
    // Csak egyetlen ember felelhet meg mind a 4 feltételnek
    if (p.dist === TARGET.dist && p.job === TARGET.job && p.dev === TARGET.dev && ageBand(p) === '30-39') p.dev = 'iPhone 13';
    list.push(p);
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, 'hu'));
}
function ageOf(p) { return CASE_YEAR - p.year; }
function ageBand(p) { const a = ageOf(p); return (AGE_BANDS.find(b => a >= b.min && a <= b.max) || {}).id; }
const REGISTRY = buildRegistry();

/* =========================================================
   NÉZETEK
   ========================================================= */
const app = $('#app');
const views = { login: vLogin, adattar: vDashboard, blox: vBlox, cord: vCord, helyreallitas: vRecover, idovonal: vTimeline, nyilvantartas: vRegistry };
function route() {
  let h = location.hash.replace(/^#\/?/, '') || 'login';
  if (!views[h]) h = 'adattar';
  if (!S.auth) h = 'login';
  else if (h === 'login') h = 'adattar';
  closeModal();
  views[h]();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* ---------- Belépés ---------- */
function vLogin() {
  app.className = 'v-rz';
  app.innerHTML = `
  <section class="rz-frame rz-login">
    <h1 class="rz-title">ROBOTZSARU ADATTÁR</h1>
    <p class="rz-sub">A.K.T.A. Központi Bizonyítékkezelő v4.2<br>RENDSZER ONLINE</p>
    <label for="caseIn" class="sr" style="position:absolute;left:-9999px">Ügyiratszám</label>
    <input id="caseIn" class="rz-input" placeholder="ADJA MEG AZ ÜGYIRATSZÁMOT" autocomplete="off">
    <button id="caseBtn" class="rz-btn solid">ADATOK LEKÉRÉSE</button>
    <p id="caseErr" class="rz-err" role="alert"></p>
  </section>`;
  const go = () => {
    if (norm($('#caseIn').value) === norm(CASE_NO)) { S.auth = true; save(); location.hash = '#/adattar'; }
    else $('#caseErr').textContent = 'Nincs ilyen ügyiratszám. Ellenőrizd a jegyzőkönyv jobb felső sarkát.';
  };
  $('#caseBtn').onclick = go;
  $('#caseIn').onkeydown = e => { if (e.key === 'Enter') go(); };
  $('#caseIn').focus();
}

/* ---------- Adattár főoldal ---------- */
function vDashboard() {
  const n = clueCount();
  const chip = (k, l) => `<span class="clue-chip ${S.clues[k] ? 'on' : ''}">${S.clues[k] ? '✓' : '○'} ${l}</span>`;
  app.className = 'v-rz';
  app.innerHTML = `
  <div class="rz-wrap"><section class="rz-frame">
    <h1 class="rz-title">HOZZÁFÉRÉS ENGEDÉLYEZVE</h1>
    <p class="rz-case">Aktaszám: <strong>${CASE_NO}</strong><span class="closed">LEZÁRT ÜGY</span><br>
      <small>Jogerősen lezárt ügy, oktatási célra anonimizálva.</small></p>
    <div class="rz-grid">
      <article class="rz-card"><h3>Feljelentési jegyzőkönyv</h3>
        <p>A sértett édesanyjának meghallgatása, 2025. március 23.</p>
        <button class="rz-btn" data-doc="jkv">MEGTEKINTÉS</button></article>
      <article class="rz-card"><h3>Sértett adatlapja</h3>
        <p>L. Lili, 13 éves (kiskorú, adatai anonimizálva).</p>
        <button class="rz-btn" data-doc="sertett">MEGTEKINTÉS</button></article>
      <article class="rz-card"><h3>Adatmentés: Roblox-fiók</h3>
        <p>A lefoglalt tabletről mentett játékfiók: profil, barátok, üzenetek.</p>
        <a class="rz-btn" href="#/blox">MEGNYITÁS</a></article>
      <article class="rz-card"><h3>Adatmentés: Discord-fiók</h3>
        <p>A lefoglalt tabletről mentett Discord-fiók: szerverek, privát üzenetek.</p>
        <a class="rz-btn" href="#/cord">MEGNYITÁS</a></article>
      <article class="rz-card"><h3>Törölt üzenetek helyreállítása</h3>
        <p>Igazságügyi helyreállító eszköz. Az üzenet azonosítójával (DEL-xxxx) működik.</p>
        <a class="rz-btn" href="#/helyreallitas">ESZKÖZ INDÍTÁSA</a></article>
      <article class="rz-card"><h3>Ügy idővonala</h3>
        <p>Az események időrendi rekonstrukciója. ${S.timelineDone ? 'Kész.' : 'Még nincs összeállítva.'}</p>
        <a class="rz-btn" href="#/idovonal">MEGNYITÁS</a></article>
      <article class="rz-card"><h3>Nyomozati kérdések</h3>
        <p>Az aktához tartozó kérdések, amelyekre választ kell találnotok.</p>
        <button class="rz-btn" data-doc="kerdesek">MEGTEKINTÉS</button></article>
      <article class="rz-card wide ${n < 4 ? 'locked' : ''}">
        <h3>Személyi nyilvántartás ${n < 4 ? '🔒' : ''}</h3>
        <p>${n < 4
          ? 'A kereséshez négy adat kell az elkövetőről. Ezek a bizonyítékokban vannak elrejtve – jegyezzétek fel őket az aktában lévő profillapra.'
          : 'Minden adat megvan. Szűrjétek le a nyilvántartást, és azonosítsátok az elkövetőt.'}</p>
        <div class="meter"><span style="width:${n * 25}%"></span></div>
        <div class="clue-row">${chip('kerulet', 'Lakóhely (kerület)')}${chip('kor', 'Valódi életkor')}${chip('foglalkozas', 'Foglalkozás')}${chip('keszulek', 'Telefon típusa')}</div>
        ${n < 4 ? `<button class="rz-btn" disabled>SZŰRÉSHEZ SZÜKSÉGES ADATOK: ${n}/4</button>`
                : `<a class="rz-btn" href="#/nyilvantartas">NYILVÁNTARTÁS MEGNYITÁSA</a>`}
      </article>
    </div>
    <div class="rz-foot"><button class="rz-btn" id="logout">RENDSZER LEZÁRÁSA</button></div>
  </section></div>`;
  $$('[data-doc]').forEach(b => b.onclick = () => showDoc(b.dataset.doc));
  $('#logout').onclick = () => {
    if (confirm('Biztosan lezárod a rendszert? Minden haladás törlődik (a következő csoport tiszta lappal kezd).')) {
      S = defaultState(); save(); location.hash = '#/login'; route();
    }
  };
}

function showDoc(which) {
  if (which === 'jkv') openModal(`
  <div class="paper">
    <div class="head">Budapesti Rendőr-főkapitányság<br>XIV. Kerületi Rendőrkapitányság<br>Bűnügyi Osztály<br><small>(oktatási célra anonimizált másolat)</small></div>
    <div class="ref">Szám: ${CASE_NO}<br>Tárgy: kiskorú sérelmére, online térben történt,<br>szexuális kizsákmányolásra irányuló kapcsolatfelvétel gyanúja</div>
    <h4>JEGYZŐKÖNYV</h4>
    <p>Készült: Budapest, 2025. március 23-án, a feljelentő meghallgatásáról.<br>
    Jelen vannak: Varga Eszter r. főhadnagy, jegyzőkönyvvezető; L. Katalin feljelentő, a sértett édesanyja.</p>
    <p>„Lányom, L. Lili (13 éves) tavaly ősz óta játszik a Roblox nevű játékkal a tabletjén. Március 22-én este odajött hozzám, és elmondta, hogy egy »Dani« nevű fiú, aki azt mondta magáról, hogy 15 éves, hetek óta ír neki. Először a játékban beszélgettek, Dani Robuxot is küldött neki, később egy Discord nevű programon folytatták.</p>
    <p>Lili elmondta, hogy Dani arra kérte, erről ne beszéljen nekünk, és egy képet kért tőle magáról. Lili ezt nem küldte el, és a fiút letiltotta. Láttam, hogy több üzenet már nem olvasható a tableten, szerintem a fiú kitörölte őket. A tablethez azóta nem nyúltunk, magammal hoztam.</p>
    <p>A lányom felhasználóneve a játékban lili_csillag13. A fiút Dani_15 néven ismeri. Más adatot nem tudok róla.”</p>
    <p><b>Záradék:</b> A tablet lefoglalásra került, az eszközről igazságügyi adatmentés készült (BJ: 2025/BJ/0451). A nyomozás az elkövető azonosításával zárult, az ügyben jogerős ítélet született.</p>
    <div class="sign"><span>Kelt: Budapest, 2025. 03. 23.</span><span>Varga Eszter r. főhadnagy</span></div>
  </div>`, 'paper-modal');
  if (which === 'sertett') openModal(`<div class="inner">
    <h2 style="color:var(--rz-accent);margin-top:0">Sértett adatlapja</h2>
    <div class="record"><div class="mug big">KITAKARVA</div>
    <div class="meta">
      <span>Név:</span><b>L. Lili (kiskorú – anonimizálva)</b>
      <span>Életkor az eset idején:</span><b>13 év</b>
      <span>Lakóhely:</span><b>Budapest, XIV. kerület</b>
      <span>Lefoglalt eszköz:</span><b>tablet (BJ: 2025/BJ/0451)</b>
      <span>Roblox:</span><b>lili_csillag13</b>
      <span>Discord:</span><b>lili_csillag</b>
      <span>Kapcsolattartó:</span><b>L. Katalin (édesanya)</b>
    </div></div></div>`);
  if (which === 'kerdesek') openModal(`<div class="inner">
    <h2 style="color:var(--rz-accent);margin-top:0">Nyomozati kérdések</h2>
    <ol class="q-list">
      <li>Hol és hogyan kezdte a kapcsolatot Dani Lilivel?</li>
      <li>Melyik platformra terelte át a beszélgetést, és miért lehetett ez neki fontos?</li>
      <li>Milyen jelek mutatják, hogy Dani titkolózásra és elszigetelésre ösztönözte Lilit?</li>
      <li>Hány éves valójában „Dani_15”, és mi bizonyítja?</li>
      <li>Ki az elkövető, és hány másik gyereket keresett meg a szerveren?</li>
    </ol></div>`);
}

/* ---------- Roblox-mock ---------- */
function vBlox() {
  app.className = 'v-bx';
  app.innerHTML = `
  <header class="bx-top">
    <div class="bx-logo">Roblox<small>(szimuláció)</small></div>
    <div class="note">Adatmentés a lefoglalt tabletről – fiók: <b>lili_csillag13</b> (csak olvasható)</div>
    <a class="evi-back" href="#/adattar">← Vissza az adattárba</a>
  </header>
  <div class="bx-body">
    <div style="display:grid;gap:18px;align-content:start">
      <section class="bx-card bx-profile">
        <div class="avatar-box">${avatar(AV.lili)}</div>
        <div class="name">Lili ⭐</div><div class="handle">@lili_csillag13</div>
        <div class="bx-stats"><div><b>3</b>barát</div><div><b>12</b>követő</div><div><b>2024</b>óta tag</div></div>
      </section>
      <section class="bx-card"><h3>Barátok</h3>
        <div class="bx-friends">${BLOX_FRIENDS.map(f => `
          <button class="bx-friend" data-f="${f.id}"><div class="avatar-box">${avatar(f.av)}</div>${esc(f.user)}</button>`).join('')}
        </div>
        <p style="font-size:12px;color:var(--bx-muted);margin:12px 0 0">Kattints egy barátra a profiljáért.</p>
      </section>
    </div>
    <section class="bx-card bx-chat">
      <div class="bx-convos"><h3>Üzenetek</h3>
        ${BLOX_FRIENDS.map(f => `<button class="bx-convo" data-c="${f.id}">
          <div class="avatar-box sm">${avatar(f.av)}</div><div>${esc(f.user)}<small>${esc(BLOX_CHATS[f.id].at(-1).x || BLOX_CHATS[f.id].at(-1).sys)}</small></div></button>`).join('')}
      </div>
      <div class="bx-thread" id="thread"><div class="bx-empty">Válassz egy beszélgetést a bal oldalon.</div></div>
    </section>
  </div>`;
  $$('.bx-friend').forEach(b => b.onclick = () => bloxProfile(b.dataset.f));
  $$('.bx-convo').forEach(b => b.onclick = () => {
    $$('.bx-convo').forEach(x => x.classList.toggle('active', x === b));
    bloxThread(b.dataset.c);
  });
}
function bloxThread(id) {
  let last = '', html = '';
  for (const m of BLOX_CHATS[id]) {
    if (m.d !== last) { html += `<div class="bx-day">${m.d}. ${weekday(m.d)}</div>`; last = m.d; }
    html += m.sys ? `<div class="bx-sys">🎁 ${esc(m.sys)} · ${m.t}</div>`
      : `<div class="bx-msg ${m.f === 'me' ? 'me' : ''}">${esc(m.x)}<time>${m.t}</time></div>`;
  }
  $('#thread').innerHTML = html;
  if (BLOX_CHATS[id].some(m => m.clue)) setTimeout(() => addClue('kerulet'), 1500);
}
function bloxProfile(id) {
  const f = BLOX_FRIENDS.find(x => x.id === id);
  openModal(`<div class="bx-modal bx-profile">
    <div class="avatar-box">${avatar(f.av)}</div>
    <div class="name">${esc(f.name)}</div><div class="handle">@${esc(f.user)}</div>
    <div class="bx-stats"><div><b>${f.friends}</b>barát</div><div><b>${f.joined}</b>csatlakozott</div></div>
    <div class="bx-bio"><b>Bemutatkozás</b><br>${esc(f.bio)}</div>
    <div class="bx-bio"><b>Kedvenc játékok</b><br>${esc(f.games)}</div>
  </div>`);
}

/* ---------- Discord-mock ---------- */
let CD = { mode: 'server', ch: 'altalanos', q: '' };
function cdAv(name) { return `<div class="cd-av" style="background:${CD_USERS[name] || '#747f8d'}">${esc(name[0].toUpperCase())}</div>`; }
function mentions(t) { return esc(t).replace(/@([\w.]+)/g, '<span class="ment">@$1</span>').replace(/\n/g, '<br>'); }
function shotHTML(big) {
  return `<div class="shot ${big ? 'big' : ''}" ${big ? '' : 'role="button" tabindex="0" data-shot'}>
    <div class="shot-tabs"><span class="act">Roblox Studio – Kuckó_build</span><span>HelpDesk – Nyitott hibajegyek (12)</span><span>Céges levelezés – Rendszergazdai fiók</span></div>
    <div class="shot-url">studio.local/projects/kucko_build</div>
    <div class="shot-body">
      <i style="left:12%;bottom:30%;width:22%;height:28%;background:#c94f4f"></i>
      <i style="left:36%;bottom:30%;width:14%;height:40%;background:#e2c14b"></i>
      <i style="left:55%;bottom:30%;width:26%;height:22%;background:#6d78f7"></i>
      <i style="left:40%;bottom:70%;width:6%;height:10%;background:#fff"></i>
    </div></div>${big ? '' : '<div class="shot-cap">Kattints a nagyításhoz</div>'}`;
}
function renderMsgs(list, withCh) {
  let last = '', html = '';
  for (const m of list) {
    if (!withCh && m.d !== last) { html += `<div class="cd-day">${m.d}. ${weekday(m.d)}</div>`; last = m.d; }
    if (m.sys) { html += `<div class="cd-sys">➜ ${esc(m.sys)} <time>${withCh ? m.d + '. ' + weekday(m.d) + ' ' : ''}${m.t}</time></div>`; continue; }
    let body;
    if (m.del) {
      body = S.recovered.includes(m.del)
        ? `<div class="cd-recovered"><small>HELYREÁLLÍTVA · ${m.del}</small>${esc(DELETED[m.del].x)}</div>`
        : `<span class="cd-deleted">🗑 Törölt üzenet – helyreállítható. Azonosító: <code>${m.del}</code></span>`;
    } else body = mentions(m.x) + (m.shot ? shotHTML(false) : '');
    const chLabel = withCh && m.ch ? `<span class="rch">#${esc(CD_CHANNELS.find(c => c.id === m.ch).name)}</span>` : (withCh ? '<span class="rch">privát üzenet</span>' : '');
    html += `<div class="cd-msg">${cdAv(m.a)}<div><span class="who">${esc(m.a)}</span>${chLabel}
      <time>${withCh ? m.d + '. ' + weekday(m.d) + ' ' : ''}${m.t}</time><div class="body">${body}</div></div></div>`;
  }
  return html;
}
function vCord() {
  app.className = 'v-cd';
  const inDM = CD.mode === 'dm';
  const ch = CD_CHANNELS.find(c => c.id === CD.ch);
  const list = inDM ? CD_DM : CD_MSGS.filter(m => m.ch === CD.ch);
  app.innerHTML = `
  <div class="cd-bar"><span>Adatmentés a lefoglalt tabletről – Discord-fiók: <b style="color:#fff">lili_csillag</b> (csak olvasható)</span>
    <a class="evi-back" href="#/adattar" style="margin-left:auto">← Vissza az adattárba</a></div>
  <div class="cd-app">
    <nav class="cd-servers">
      <button class="cd-sv ${inDM ? 'active' : ''}" id="svDM" title="Közvetlen üzenetek">💬</button>
      <button class="cd-sv ${inDM ? '' : 'active'}" id="svK" title="Blox Kuckó">BK</button>
    </nav>
    <aside class="cd-side">
      ${inDM ? `<h3>Közvetlen üzenetek</h3>
        <button class="cd-ch active"><span class="cd-av" style="flex:0 0 28px;height:28px;font-size:12px;background:${CD_USERS['Dani_15']}">D</span> Dani_15</button>`
      : `<h3>Blox Kuckó 🎮</h3><div class="cd-group">SZÖVEGES CSATORNÁK</div>
        ${CD_CHANNELS.map(c => `<button class="cd-ch ${c.id === CD.ch ? 'active' : ''}" data-ch="${c.id}"># ${esc(c.name)}</button>`).join('')}`}
    </aside>
    <section class="cd-main">
      <div class="cd-head"><span class="title">${inDM ? '@ Dani_15' : '# ' + esc(ch.name)}</span>
        <form class="cd-search" id="cdSearch"><input id="cdQ" placeholder="Keresés (pl. from: felhasználónév)" value="${esc(CD.q)}" aria-label="Keresés"><button>Keresés</button></form>
      </div>
      <div id="cdResults"></div>
      <div class="cd-msgs" id="cdMsgs">${renderMsgs(list, false)}</div>
    </section>
    <aside class="cd-members">${inDM ? '' : `<div class="cd-group">TAGOK – ${Object.keys(CD_USERS).length}</div>
      ${Object.keys(CD_USERS).map(u => `<div class="cd-mem">${cdAv(u)}${esc(u)}</div>`).join('')}`}</aside>
  </div>`;
  $('#svDM').onclick = () => { CD.mode = 'dm'; CD.q = ''; vCord(); };
  $('#svK').onclick = () => { CD.mode = 'server'; CD.q = ''; vCord(); };
  $$('[data-ch]').forEach(b => b.onclick = () => { CD.ch = b.dataset.ch; CD.q = ''; vCord(); });
  $('#cdSearch').onsubmit = e => { e.preventDefault(); CD.q = $('#cdQ').value.trim(); cdSearch(); };
  bindShots(app);
  const box = $('#cdMsgs'); box.scrollTop = box.scrollHeight;
  if (CD.q) cdSearch();
  else $('#cdResults').innerHTML = `<div class="cd-hint">Tipp: a keresőben a <code>from: felhasználónév</code> formával egy ember összes üzenetét megtalálod.</div>`;
}
function cdSearch() {
  const q = CD.q;
  const box = $('#cdResults');
  if (!q) { box.innerHTML = ''; return; }
  const m = q.match(/from:\s*@?([\w.]+)/i);
  const author = m ? m[1].toLowerCase() : null;
  const text = q.replace(/from:\s*@?[\w.]+/i, '').trim().toLowerCase();
  const all = [...CD_MSGS, ...CD_DM.map(x => ({ ...x, ch: null }))].filter(x => !x.sys);
  const res = all.filter(x =>
    (!author || x.a.toLowerCase() === author) &&
    (!text || (x.x || (x.del && S.recovered.includes(x.del) ? DELETED[x.del].x : '') || '').toLowerCase().includes(text)));
  box.innerHTML = `<div class="cd-results"><div class="rhead"><span>${res.length} találat erre: „${esc(q)}”</span><button id="cdClear">Bezárás ✕</button></div>
    ${res.length ? renderMsgs(res, true) : '<div class="cd-hint">Nincs találat. Ellenőrizd a felhasználónevet a tagok listájában.</div>'}</div>`;
  $('#cdClear').onclick = () => { CD.q = ''; vCord(); };
  bindShots(box);
}
function bindShots(root) {
  $$('[data-shot]', root).forEach(el => {
    const open = () => {
      openModal(`<div class="inner" style="background:#313338"><p style="margin-top:0;color:#dbdee1">Dani_15 képernyőképe a #képek csatornából (2025.03.08.)</p>${shotHTML(true)}</div>`);
      setTimeout(() => addClue('foglalkozas'), 1500);
    };
    el.onclick = open;
    el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
  });
}

/* ---------- Helyreállító eszköz ---------- */
function vRecover() {
  app.className = 'v-rz';
  app.innerHTML = `
  <div class="rz-wrap"><section class="rz-frame">
    <div class="rz-top"><h2>Törölt üzenetek helyreállítása</h2><a class="back-link" href="#/adattar">← Vissza az adattárba</a></div>
    <p style="color:var(--rz-muted);margin-top:0">Forrás: igazságügyi adatmentés (BJ: 2025/BJ/0451), Discord-gyorsítótár. Add meg a törölt üzenet azonosítóját, ahogy a beszélgetésben látod.</p>
    <form class="rec-form" id="recForm">
      <input class="rz-input" id="recIn" placeholder="pl. DEL-0000" autocomplete="off" aria-label="Üzenetazonosító">
      <button class="rz-btn">HELYREÁLLÍTÁS</button>
    </form>
    <div class="terminal" id="term">&gt; Várakozás azonosítóra…</div>
    <div id="recList"></div>
  </section></div>`;
  renderRecovered();
  let busy = false;
  $('#recForm').onsubmit = e => {
    e.preventDefault();
    if (busy) return;
    const id = $('#recIn').value.trim().toUpperCase().replace(/\s/g, '').replace(/^DEL(\d)/, 'DEL-$1');
    const term = $('#term');
    if (!DELETED[id]) { term.style.color = 'var(--rz-bad)'; term.textContent = `> ${id || '(üres)'}: nincs ilyen törölt üzenet a mentésben.\n> Nézd meg a Discord-beszélgetésben a törölt üzenetek azonosítóját.`; return; }
    if (S.recovered.includes(id)) { term.style.color = 'var(--rz-ok)'; term.textContent = `> ${id} már helyre van állítva (lent látható).`; return; }
    busy = true; term.style.color = 'var(--rz-ok)'; term.textContent = '';
    const lines = [`> Azonosító: ${id}`, '> Gyorsítótár-töredékek keresése…', '> Töredékek összefűzése…', '> Metaadatok kinyerése…', '> KÉSZ – üzenet helyreállítva.'];
    lines.forEach((l, i) => setTimeout(() => {
      term.textContent += l + '\n';
      if (i === lines.length - 1) {
        S.recovered.push(id); save(); busy = false; renderRecovered();
        setTimeout(() => addClue('keszulek'), 800);
      }
    }, 450 * (i + 1)));
  };
}
function renderRecovered() {
  const ids = Object.keys(DELETED).filter(id => S.recovered.includes(id));
  $('#recList').innerHTML = ids.map(id => {
    const m = DELETED[id];
    return `<div class="rec-item"><span class="tag">HELYREÁLLÍTVA · ${id}</span>
      <div class="msg">„${esc(m.x)}”</div>
      <div class="meta">
        <span>Küldő:</span><b>${DEL_META.sender}</b>
        <span>Címzett:</span><b>lili_csillag</b>
        <span>Küldés ideje:</span><b>${m.d}. ${weekday(m.d)} ${m.t}</b>
        <span>Törlés ideje:</span><b>${DEL_META.deletedAt}</b>
        <span>Küldő eszköz:</span><b class="hl">${DEL_META.device}</b>
        <span>Kapcsolat:</span><b>${DEL_META.net}</b>
      </div></div>`;
  }).join('') + (ids.length ? `<p style="color:var(--rz-muted);font-size:13px;margin-top:12px">${ids.length}/3 törölt üzenet helyreállítva. A helyreállított üzenetek a Discord-beszélgetésben is megjelennek.</p>` : '');
}

/* ---------- Idővonal ---------- */
let tlOrder = null;
function vTimeline() {
  app.className = 'v-rz';
  if (S.timelineDone) tlOrder = TIMELINE.map(e => e.id);
  else if (!tlOrder) tlOrder = [...TL_START];
  const done = S.timelineDone;
  app.innerHTML = `
  <div class="rz-wrap"><section class="rz-frame">
    <div class="rz-top"><h2>Ügy idővonala</h2><a class="back-link" href="#/adattar">← Vissza az adattárba</a></div>
    <p style="color:var(--rz-muted);margin-top:0">${done ? 'Az idővonal összeállt.' :
      'Tegyétek időrendbe az eseményeket! Húzzátok a kártyákat, vagy használjátok a nyilakat. A dátumokat a Roblox- és a Discord-üzenetekben, a helyreállított üzenetekben és a jegyzőkönyvben találjátok.'}</p>
    <ol class="tl-list" id="tl">${tlOrder.map(id => {
      const e = TIMELINE.find(x => x.id === id);
      return `<li class="tl-item ${done ? 'good' : ''}" draggable="${!done}" data-id="${id}">
        <span class="txt">${done ? `<span class="date">${e.d}</span>` : ''}${esc(e.x)}</span>
        ${done ? '' : `<span class="tl-move"><button data-up aria-label="Feljebb">▲</button><button data-down aria-label="Lejjebb">▼</button></span>`}</li>`;
    }).join('')}</ol>
    ${done ? '' : `<button class="rz-btn solid" id="tlCheck" style="max-width:320px">SORREND ELLENŐRZÉSE</button>`}
    <div class="tl-result" id="tlRes"></div>
    ${done ? providerHTML() : ''}
  </section></div>`;
  if (done) return;
  const list = $('#tl');
  const sync = () => { tlOrder = $$('.tl-item', list).map(li => li.dataset.id); $('#tlRes').textContent = ''; };
  $$('[data-up]').forEach(b => b.onclick = () => { const li = b.closest('li'); if (li.previousElementSibling) list.insertBefore(li, li.previousElementSibling); sync(); b.focus(); });
  $$('[data-down]').forEach(b => b.onclick = () => { const li = b.closest('li'); if (li.nextElementSibling) list.insertBefore(li.nextElementSibling, li); sync(); b.focus(); });
  let dragged = null;
  $$('.tl-item', list).forEach(li => {
    li.addEventListener('dragstart', () => { dragged = li; li.classList.add('dragging'); });
    li.addEventListener('dragend', () => { li.classList.remove('dragging'); dragged = null; sync(); });
    li.addEventListener('dragover', e => {
      e.preventDefault();
      if (!dragged || dragged === li) return;
      const r = li.getBoundingClientRect();
      list.insertBefore(dragged, e.clientY < r.top + r.height / 2 ? li : li.nextElementSibling);
    });
  });
  $('#tlCheck').onclick = () => {
    const correct = tlOrder.filter((id, i) => id === TIMELINE[i].id).length;
    if (correct === TIMELINE.length) {
      S.timelineDone = true; save(); vTimeline();
      setTimeout(() => addClue('kor'), 1200);
    } else {
      $('#tlRes').innerHTML = `<span style="color:var(--rz-bad)">${correct}/${TIMELINE.length} esemény van a helyén. Nézzétek meg újra a dátumokat!</span>`;
    }
  };
}
function providerHTML() {
  return `<div class="provider"><h3>Szolgáltatói adatszolgáltatás – Discord-fiók: dani_15</h3>
    <div class="meta">
      <span>Fiók létrehozása:</span><b>2017.09.12.</b>
      <span>Regisztrációkor megadott születési dátum:</span><b class="hl">1991.04.03.</b>
      <span>Hitelesített e-mail-cím:</span><b>g.sz••••@••••••.hu</b>
      <span>Megjegyzés:</span><b>A profilon feltüntetett életkor (15 év) eltér a regisztrációs adatoktól.</b>
    </div>
    <p style="color:var(--rz-muted);font-size:13px;margin:12px 0 0">Számoljátok ki, hány éves volt a fiók tulajdonosa ${CASE_YEAR}-ben!</p></div>`;
}

/* ---------- Személyi nyilvántartás ---------- */
let RF = { dist: '', age: '', job: '', dev: '', name: '' };
function vRegistry() {
  app.className = 'v-rz';
  if (clueCount() < 4) {
    app.innerHTML = `<div class="rz-wrap"><section class="rz-frame">
      <div class="rz-top"><h2>Személyi nyilvántartás 🔒</h2><a class="back-link" href="#/adattar">← Vissza az adattárba</a></div>
      <p>A kereséshez még ${4 - clueCount()} adat hiányzik az elkövetőről.</p></section></div>`;
    return;
  }
  const opt = (arr, cur, lab) => `<option value="">Mind</option>` + arr.map(v => { const val = v.id || v; return `<option value="${esc(val)}" ${cur === val ? 'selected' : ''}>${esc(v.label || v)}</option>`; }).join('');
  app.innerHTML = `
  <div class="rz-wrap"><section class="rz-frame">
    <div class="rz-top"><h2>Személyi nyilvántartás</h2><a class="back-link" href="#/adattar">← Vissza az adattárba</a></div>
    <p style="color:var(--rz-muted);margin-top:0">Használjátok a profillapra felírt adatokat. Az életkor ${CASE_YEAR}-es állapot szerint értendő.</p>
    <div class="filters">
      <label>Lakóhely (kerület)<select data-f="dist">${opt(DISTRICTS, RF.dist)}</select></label>
      <label>Életkor<select data-f="age">${opt(AGE_BANDS, RF.age)}</select></label>
      <label>Foglalkozás<select data-f="job">${opt([...JOBS].sort((a, b) => a.localeCompare(b, 'hu')), RF.job)}</select></label>
      <label>Használt telefon<select data-f="dev">${opt(DEVICES, RF.dev)}</select></label>
      <label>Név<input data-f="name" value="${esc(RF.name)}" placeholder="Keresés névre"></label>
    </div>
    <div class="count" id="cnt"></div>
    <div class="people" id="people"></div>
  </section></div>`;
  $$('[data-f]').forEach(el => el.addEventListener('input', () => { RF[el.dataset.f] = el.value; renderPeople(); }));
  renderPeople();
}
function renderPeople() {
  const res = REGISTRY.filter(p =>
    (!RF.dist || p.dist === RF.dist) && (!RF.age || ageBand(p) === RF.age) &&
    (!RF.job || p.job === RF.job) && (!RF.dev || p.dev === RF.dev) &&
    (!RF.name || p.name.toLowerCase().includes(RF.name.toLowerCase())));
  $('#cnt').innerHTML = `Találatok: <b>${res.length}</b> / ${REGISTRY.length}${res.length > 1 ? ' – szűkítsétek tovább!' : ''}`;
  const initials = n => n.split(' ').map(w => w[0]).join('');
  $('#people').innerHTML = res.map(p => `<button class="person" data-p="${p.id}"><div class="mug">${initials(p.name)}</div>
    <div>${esc(p.name)}<small>${p.born} · ${p.dist} ker.</small></div></button>`).join('') ||
    '<p style="color:var(--rz-muted)">Nincs találat ezekkel a feltételekkel. Ellenőrizzétek a szűrőket!</p>';
  $$('[data-p]').forEach(b => b.onclick = () => showPerson(REGISTRY.find(p => p.id === b.dataset.p)));
}
function showPerson(p) {
  const base = `<span>Név:</span><b>${esc(p.name)}</b>
    <span>Születési dátum:</span><b>${p.born} (${ageOf(p)} év, ${CASE_YEAR})</b>
    <span>Lakóhely:</span><b>Budapest, ${p.dist} kerület</b>
    <span>Foglalkozás:</span><b>${esc(p.job)}</b>
    <span>Használt telefon:</span><b>${esc(p.dev)}</b>`;
  if (!p.target) {
    openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Személyi adatlap</h2>
      <div class="record"><div class="mug big">${p.name.split(' ').map(w => w[0]).join('')}</div>
      <div class="meta">${base}<span>Kapcsolódó ügy:</span><b>nincs</b></div></div></div>`);
    return;
  }
  const first = !S.solved;
  S.solved = true; save();
  openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Személyi adatlap – ${p.id}</h2>
    <div class="record"><div class="mug big">FOTÓ</div>
    <div class="meta">${base}
      <span>Ismert online fiókok:</span><b class="hl">Dani_15 (Roblox), dani_15 (Discord)</b>
      <span>E-mail-cím:</span><b>g.szalai••••@••••••.hu</b>
      <span>Kapcsolódó ügy:</span><b>${CASE_NO}</b>
      <span>Ügy állapota:</span><b style="color:var(--rz-ok)">LEZÁRVA – jogerős ítélet</b>
      <span>Lefoglalt eszköz:</span><b>Samsung Galaxy S23</b>
      <span>Megállapítás:</span><b>A nyomozás L. Lilin kívül további 3 kiskorú (mazsi_12, noe.2011, kitti.rblx) megkeresését tárta fel.</b>
    </div></div>
    <div class="solved">ÜGY MEGOLDVA – AZ ELKÖVETŐ AZONOSÍTVA</div></div>`);
  if (first) toast('Gratulálunk, azonosítottátok az elkövetőt!');
}

/* ---------- Indítás ---------- */
route();
