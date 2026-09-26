'use strict';
/* =========================================================
   A.K.T.A. – 5. akta – Robotzsaru Adattár (telefonra tervezve)
   Minden szereplő, név, cég és adat kitalált.
   ========================================================= */

/* ---------- Beállítások ---------- */
const CASE_NO = '01110/1847/2025.bü.';
const STORE = 'akta5_state_v2';
const CASE_YEAR = 2025;
const PLUSH_IMG = 'img/pluss.jpg';           // ezt a képet cseréld le a saját plüss-fotódra
const PLUSH_FILENAME = 'IMG_20250316_142207.jpg';
const SHOW_LILI_REPLIES = true;              // false: a DM-ben csak a Lilinek címzett (Dani által küldött) üzenetek látszanak

/* ---------- Segédfüggvények ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const deacc = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const norm = s => deacc(s).replace(/\s+/g, '').replace(/\.+$/, '');
const DAYS = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
function weekday(d) { const [y, m, dd] = d.split('.').map(Number); return DAYS[new Date(y, m - 1, dd).getDay()]; }
const fmtDate = d => `${d}. ${weekday(d)}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const defaultState = () => ({
  auth: false,
  clues: { kerulet: false, foglalkozas: false, keszulek: false, kor: false },
  recovered: [], timelineDone: false, dataRequested: false, solved: false
});
let S = loadState();
function loadState() { try { const r = localStorage.getItem(STORE); if (r) return Object.assign(defaultState(), JSON.parse(r)); } catch (e) { } return defaultState(); }
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { } }
const clueCount = () => Object.values(S.clues).filter(Boolean).length;
function addClue(k) { if (S.clues[k]) return; S.clues[k] = true; save(); toast(`Új adat került az elkövetői profilba (${clueCount()}/4)`); }

let toastT;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 3200); }
function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').hidden = false; $('.modal-box').scrollTop = 0; }
function closeModal() { $('#modal').hidden = true; $('#modal-body').innerHTML = ''; }
$('.modal-close').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });

/* ---------- Blokkos avatar ---------- */
function avatar(c) {
  return `<svg viewBox="0 0 60 80" aria-hidden="true">
    <rect x="18" y="4" width="24" height="22" rx="3" fill="${c[0]}"/>
    <rect x="24" y="12" width="3" height="4" fill="#222"/><rect x="33" y="12" width="3" height="4" fill="#222"/>
    <rect x="25" y="19" width="10" height="2" fill="#222"/>
    <rect x="16" y="2" width="28" height="7" fill="${c[1]}"/>
    <rect x="16" y="28" width="28" height="26" fill="${c[2]}"/>
    <rect x="4" y="28" width="11" height="24" fill="${c[0]}"/><rect x="45" y="28" width="11" height="24" fill="${c[0]}"/>
    <rect x="16" y="55" width="13" height="23" fill="${c[3]}"/><rect x="31" y="55" width="13" height="23" fill="${c[3]}"/></svg>`;
}

/* =========================================================
   ROBLOX – barátok és beszélgetések
   ========================================================= */
const LILI_AV = ['#f3c9a5', '#6b3f1f', '#e46fb0', '#3d4a8a'];
const BLOX = [
  { id: 'bogi', user: 'bogi_macska', name: 'Bogi', av: ['#e9b98f', '#c9912f', '#7b61ff', '#5a5a5a'], joined: '2022.12.24.', friends: 38, bio: '🐱🐱🐱 7.b', games: 'Adopt Me, Grow a Garden',
    chat: [['2025.02.10', '19:20', 'o', 'holnap matekdoga 😭 tanultál?'], ['2025.02.10', '19:22', 'me', 'valamennyit... gyere be grow a gardenbe'], ['2025.02.10', '19:22', 'o', 'oks 5 perc'],
      ['2025.03.20', '18:02', 'o', 'miért vagy mostanában mindig discordon?'], ['2025.03.20', '18:05', 'me', 'semmi, csak beszélgetek valakivel'], ['2025.03.20', '18:05', 'o', 'kivel?'], ['2025.03.20', '18:09', 'me', 'majd elmondom']] },
  { id: 'peti', user: 'pixelpeti', name: 'Peti', av: ['#d9a47a', '#8a4b22', '#ff9f1a', '#27496d'], joined: '2021.08.02.', friends: 64, bio: 'obby pro 😎', games: 'Obby Mania, Tower of Hell',
    chat: [['2025.03.19', '16:15', 'o', 'obby ma 6kor?'], ['2025.03.19', '16:20', 'me', 'ja, 6 után jó'], ['2025.03.19', '18:03', 'o', 'invitelek']] },
  { id: 'zsombi', user: 'zsombi_2012', name: 'Zsombi', av: ['#f0c19a', '#3a2a1a', '#e03b3b', '#222'], joined: '2023.03.11.', friends: 51, bio: 'GAG trader 🌻', games: 'Grow a Garden',
    chat: [['2025.03.17', '17:40', 'o', 'grow a garden trade? adok 2 napraforgót a kaktuszodért'], ['2025.03.17', '17:42', 'me', 'deal'], ['2025.03.17', '17:42', 'o', 'online vagy most?'], ['2025.03.17', '17:43', 'me', 'igen, gyere']] },
  { id: 'emma', user: 'emma_xoxo', name: 'Emma', av: ['#f7d4b5', '#f2d15b', '#ff7eb6', '#7a8cff'], joined: '2023.10.05.', friends: 29, bio: '🌸 adopt me + GAG 🌸', games: 'Adopt Me, Grow a Garden',
    chat: [['2025.03.14', '15:30', 'o', 'láttad az új frissítést?? 😱'], ['2025.03.14', '15:31', 'me', 'igen!! van új mag'], ['2025.03.14', '15:31', 'o', 'holnap együtt?'], ['2025.03.14', '15:35', 'me', 'oks']] },
  { id: 'kristof', user: 'kristof_gamer', name: 'Kristóf', av: ['#e2b08a', '#111', '#2a9df4', '#333'], joined: '2020.06.19.', friends: 120, bio: 'bedwars | obby', games: 'BedWars',
    chat: [['2025.03.11', '18:50', 'o', 'gyere bedwarsra, kell még egy ember'], ['2025.03.11', '18:52', 'me', 'most nem tudok, vacsi'], ['2025.03.11', '18:52', 'o', 'oké majd holnap']] },
  { id: 'anna', user: 'anna_bunny', name: 'Anna', av: ['#f5cfae', '#9b5a2e', '#b0e0a8', '#5b5b8f'], joined: '2022.09.01.', friends: 44, bio: '🐰 7.b', games: 'Adopt Me',
    chat: [['2025.03.09', '20:10', 'o', 'megcsináltad a töri házit?'], ['2025.03.09', '20:14', 'me', 'nem 😭'], ['2025.03.09', '20:15', 'o', 'átküldöm, de írd át!!']] },
  { id: 'levi', user: 'levi.ninja', name: 'Levi', av: ['#d8a27c', '#222', '#444', '#111'], joined: '2021.02.14.', friends: 88, bio: 'ninja 🥷', games: 'BedWars, Ninja Legends',
    chat: [['2025.03.02', '11:05', 'o', 'bedwars?'], ['2025.03.02', '11:30', 'me', 'nem most, bocsi']] },
  { id: 'hanna', user: 'hanna_12', name: 'Hanna', av: ['#f3c7a0', '#e8c170', '#c77dff', '#3d3d6b'], joined: '2022.05.30.', friends: 33, bio: 'lovak 🐴', games: 'Adopt Me, Horse Life',
    chat: [['2025.02.27', '17:00', 'o', 'adopt me-ben van egy neon unikornisom, cserélünk?'], ['2025.02.27', '17:03', 'me', 'mit kérsz érte?'], ['2025.02.27', '17:04', 'o', 'majd megbeszéljük suliban']] },
  { id: 'mate', user: 'mate_obby', name: 'Máté', av: ['#e7b48e', '#5b3a1d', '#1db954', '#2d2d2d'], joined: '2021.11.21.', friends: 70, bio: 'obby speedrun', games: 'Obby Mania',
    chat: [['2025.02.24', '21:02', 'o', 'gyere 1v1'], ['2025.02.24', '21:10', 'me', 'késő van már, holnap']] },
  { id: 'dani', user: 'Dani_15', name: 'Dani', av: ['#f0c19a', '#1f1f1f', '#2f9e58', '#2b2b2b'], joined: '2019.06.11.', friends: 212, bio: '15 | Bp | dc: dani_15 🎮 írj ha unatkozol', games: 'Grow a Garden, Obby Mania',
    chat: [
      ['2025.02.08', '16:42', 'o', 'szia! láttam a kertedet grow a gardenben, nagyon szép lett 😄'],
      ['2025.02.08', '16:44', 'me', 'köszi! sokat dolgoztam rajta'],
      ['2025.02.08', '16:45', 'o', 'látszik, a répasorok tök jók. mióta játszol?'],
      ['2025.02.08', '16:46', 'me', 'kb karácsony óta'],
      ['2025.02.08', '16:47', 'o', 'én régebb óta. ha akarod, adok tippeket, hogy gyorsabban nőjenek'],
      ['2025.02.08', '16:47', 'me', 'ok :)'],
      ['2025.02.11', '17:20', 'o', 'bent vagy ma? van egy ritka magom, odaadom neked'],
      ['2025.02.11', '17:25', 'me', 'tényleg? köszi!!'],
      ['2025.02.14', '17:05', 'sys', 'Dani_15 ajándékot küldött neked: 400 Robux'],
      ['2025.02.14', '17:06', 'me', 'úristen köszi!!!'],
      ['2025.02.14', '17:06', 'o', 'semmiség, megérdemled 😊 a te kerted a legszebb a szerveren'],
      ['2025.02.17', '18:30', 'o', 'hány éves vagy amúgy?'],
      ['2025.02.17', '18:31', 'me', '13'],
      ['2025.02.17', '18:31', 'o', 'én 15, szóval majdnem egyidősek vagyunk 😄'],
      ['2025.02.19', '18:10', 'o', 'honnan vagy?'],
      ['2025.02.19', '18:12', 'me', 'zugló'],
      ['2025.02.19', '18:12', 'o', 'én a XIII. kerben lakok, egész közel vagyunk 😄'],
      ['2025.02.21', '17:30', 'o', 'itt folyton figyelik a chatet és kitakarják a szavakat. gyere át discordra, ott nyugisabb. ott is dani_15 vagyok, van egy szerverünk, blox kuckó'],
      ['2025.02.21', '17:33', 'me', 'okés, holnap']] },
  { id: 'csenge', user: 'csenge_panda', name: 'Csenge', av: ['#f6d0b1', '#2b1b10', '#fff', '#111'], joined: '2023.01.08.', friends: 25, bio: '🐼', games: 'Adopt Me, Grow a Garden',
    chat: [['2025.02.18', '19:00', 'o', 'holnap ugye jössz edzésre?'], ['2025.02.18', '19:05', 'me', 'persze']] },
  { id: 'nora', user: 'nora_kitty', name: 'Nóra', av: ['#f4caa5', '#a0522d', '#ffb3c6', '#6a6a9a'], joined: '2024.09.02.', friends: 17, bio: '7.a 🐈', games: 'Grow a Garden',
    chat: [['2025.01.28', '16:00', 'o', 'szia! hozzáadtalak, a suliból vagyok, 7.a'], ['2025.01.28', '16:10', 'me', 'szia :)']] }
];
const lastDate = f => f.chat.at(-1)[0] + f.chat.at(-1)[1];

/* =========================================================
   DISCORD – szerver és privát üzenetek
   ========================================================= */
const CD_COLORS = {
  'Admin_Robi': '#f23f43', 'KuckóBot': '#747f8d', 'Dani_15': '#3ba55d', 'lili_csillag': '#e46fb0', 'mazsi_12': '#faa61a', 'noe.2011': '#5865f2',
  'kitti.rblx': '#eb459e', 'pixelpeti': '#ff9f1a', 'zsombi_2012': '#e67e22', 'emma_xoxo': '#ff7eb6', 'hanna_12': '#9b59b6', 'levi.ninja': '#607d8b',
  'bence.gg': '#1abc9c', 'luca_rblx': '#e91e63', 'marci_obby': '#2ecc71'
};
const CD_GROUPS = [
  { name: 'INFORMÁCIÓ', ch: [{ id: 'szabalyok', n: 'szabályok' }, { id: 'bejelentesek', n: 'bejelentések' }] },
  { name: 'KÖZÖSSÉG', ch: [{ id: 'bemutatkozas', n: 'bemutatkozás' }, { id: 'altalanos', n: 'általános' }, { id: 'gag', n: 'grow-a-garden' }, { id: 'kereskedes', n: 'kereskedés' }, { id: 'kepek', n: 'képek' }] },
  { name: 'HANGCSATORNÁK', voice: true, ch: [{ id: 'v1', n: 'Társalgó' }, { id: 'v2', n: 'Játékszoba' }] }
];
const CHAN = Object.fromEntries(CD_GROUPS.flatMap(g => g.ch).map(c => [c.id, c.n]));
// [csatorna, szerző, dátum, idő, szöveg, extra]
const M = (ch, a, d, t, x, ex = {}) => ({ ch, a, d, t, x, ...ex });
const CD_MSGS = [
  M('szabalyok', 'KuckóBot', '2024.11.02', '12:00', '1. Legyél kedves mindenkivel.\n2. Ne ossz meg személyes adatot (cím, telefonszám, iskola).\n3. Ha valaki kellemetlenül viselkedik, szólj egy adminnak.\n4. Csalás és spam = kitiltás.'),
  M('bejelentesek', 'Admin_Robi', '2024.12.01', '18:00', 'Üdv a Blox Kuckóban! 🎉 Mutatkozzatok be a #bemutatkozás csatornán!'),
  M('bejelentesek', 'Admin_Robi', '2025.02.01', '17:30', 'Új csatorna: #kereskedés! Senkinek ne adjátok meg a jelszavatokat, akármit ígér!'),

  M('bemutatkozas', 'Admin_Robi', '2024.12.03', '17:00', 'Itt mutatkozzatok be! Név, kor, kedvenc játék 😊'),
  M('bemutatkozas', 'pixelpeti', '2024.12.04', '16:12', 'Peti, 13, obby meg grow a garden 😎'),
  M('bemutatkozas', 'zsombi_2012', '2024.12.10', '18:40', 'Zsombi vagyok, 12 éves, Pestről, a GAG a kedvencem 🌻'),
  M('bemutatkozas', 'emma_xoxo', '2024.12.19', '15:05', 'sziasztok, Emma vagyok, 11 😊 adopt me és grow a garden 🌸'),
  M('bemutatkozas', 'Dani_15', '2025.01.06', '19:20', 'Dani, 15, Bp 🎮 grow a garden meg bármi. írjatok nyugodtan dm-ben, szívesen segítek bárkinek 😎'),
  M('bemutatkozas', 'levi.ninja', '2025.01.12', '14:30', 'Levi, 12, bedwars main 🥷'),
  M('bemutatkozas', 'hanna_12', '2025.01.20', '17:45', 'Hanna vagyok, 12 és fél 😄 lovas játékok + adopt me 🐴'),
  M('bemutatkozas', 'mazsi_12', '2025.02.03', '16:20', 'Mazsi vagyok, 12, szeretem a macskákat meg a grow a gardent 🐱'),
  M('bemutatkozas', 'Dani_15', '2025.02.03', '16:24', '@mazsi_12 szia mazsi! nézd a dm-et 😉', { reply: 'mazsi_12' }),
  M('bemutatkozas', 'bence.gg', '2025.02.09', '20:02', 'Bence, 14, fortnite + roblox'),
  M('bemutatkozas', 'noe.2011', '2025.02.15', '11:10', 'Noé, 13, most kezdtem a grow a gardent, van tipp? 🥕'),
  M('bemutatkozas', 'Dani_15', '2025.02.15', '11:13', '@noe.2011 küldtem dm-et, nézd meg 😄', { reply: 'noe.2011' }),
  M('bemutatkozas', 'lili_csillag', '2025.02.22', '17:04', 'sziasztok! Lili vagyok, 13, grow a garden 🥕🌻'),
  M('bemutatkozas', 'Dani_15', '2025.02.22', '17:05', '@lili_csillag végre itt vagy 😄 nézd a dm-et', { reply: 'lili_csillag' }),
  M('bemutatkozas', 'luca_rblx', '2025.02.26', '15:50', 'Luca, 11, adopt me 💖'),
  M('bemutatkozas', 'kitti.rblx', '2025.03.04', '10:40', 'Kitti vagyok, 12, sziasztok 💜'),
  M('bemutatkozas', 'Dani_15', '2025.03.04', '10:47', '@kitti.rblx szia kitti, küldtem valamit dm-ben 😉', { reply: 'kitti.rblx' }),
  M('bemutatkozas', 'marci_obby', '2025.03.09', '12:15', 'Marci, 13, obby és tower of hell'),

  M('altalanos', 'pixelpeti', '2025.02.20', '16:30', 'ki jön ma este obbyzni?'),
  M('altalanos', 'zsombi_2012', '2025.02.20', '16:34', 'én!'),
  M('altalanos', 'lili_csillag', '2025.02.22', '17:02', '', { sys: 'lili_csillag csatlakozott a szerverhez.' }),
  M('altalanos', 'Dani_15', '2025.02.25', '10:14', 'valaki online? unatkozom 😴'),
  M('altalanos', 'Admin_Robi', '2025.02.25', '15:20', '@Dani_15 te nem vagy suliban? 😂'),
  M('altalanos', 'Dani_15', '2025.02.25', '15:22', 'lyukasóra volt 😅'),
  M('altalanos', 'emma_xoxo', '2025.03.06', '16:00', 'holnap nincs suli!!! 🎉'),
  M('altalanos', 'bence.gg', '2025.03.06', '16:05', 'nálunk van 😭'),
  M('altalanos', 'Dani_15', '2025.03.13', '11:48', 'ki van fent? 😎'),

  M('gag', 'noe.2011', '2025.02.27', '17:12', 'hogy lehet gyorsabban pénzt szerezni?'),
  M('gag', 'zsombi_2012', '2025.02.27', '17:15', 'répa + locsoló, és ne add el azonnal'),
  M('gag', 'Dani_15', '2025.03.06', '11:32', 'aki kér ritka magot, írjon dm-et 😉'),
  M('gag', 'emma_xoxo', '2025.03.10', '16:40', 'az új eseményes mag nagyon ütős'),

  M('kereskedes', 'hanna_12', '2025.02.28', '18:00', 'neon unikornis cserébe? 🦄'),
  M('kereskedes', 'levi.ninja', '2025.03.01', '12:20', 'veszek napraforgót, 1k/db'),
  M('kereskedes', 'zsombi_2012', '2025.03.01', '12:22', '@levi.ninja van 5 db, gyere'),

  M('kepek', 'pixelpeti', '2025.03.01', '18:22', 'új rekord 🏆 3:12 a tower of hellen'),
  M('kepek', 'emma_xoxo', '2025.03.11', '16:45', 'az én kertem 🌸', { garden: 'small' })
];
const CD_DM = [
  { a: 'Dani_15', d: '2025.03.03', t: '16:20', x: 'na végre itt is beszélhetünk 😄' },
  { a: 'lili_csillag', d: '2025.03.03', t: '16:21', x: 'hali' },
  { a: 'Dani_15', d: '2025.03.03', t: '16:22', x: 'itt sokkal jobb, itt nem figyel senki' },
  { a: 'Dani_15', d: '2025.03.05', t: '17:10', x: 'nézd, ma ezt szereztem grow a gardenben 😄 arany gyümölcs!!', shot: true },
  { a: 'lili_csillag', d: '2025.03.05', t: '17:14', x: 'wow arany?! 😱 nekem még egy sincs' },
  { a: 'Dani_15', d: '2025.03.05', t: '17:15', x: 'ha akarod, egyszer neked adom 😊' },
  { a: 'Dani_15', d: '2025.03.07', t: '17:45', x: 'te sokkal érettebb vagy, mint a korodbeliek, veled tényleg lehet beszélgetni' },
  { a: 'lili_csillag', d: '2025.03.07', t: '17:47', x: 'köszi :)' },
  { a: 'Dani_15', d: '2025.03.10', t: '18:20', x: 'mi volt ma a suliban?' },
  { a: 'lili_csillag', d: '2025.03.10', t: '18:26', x: 'semmi, anya megint kiabált, hogy túl sokat vagyok a tableten' },
  { a: 'Dani_15', d: '2025.03.10', t: '18:30', x: 'a szüleid úgyse értenék, mennyit beszélünk. ők nem figyelnek rád annyira, mint én' },
  { a: 'Dani_15', d: '2025.03.12', t: '10:21', x: 'unatkozom 😴 te suliban vagy?' },
  { a: 'lili_csillag', d: '2025.03.12', t: '15:30', x: 'igen, most értem haza' },
  { a: 'Dani_15', d: '2025.03.15', t: '19:02', del: 'DEL-7715' },
  { a: 'lili_csillag', d: '2025.03.15', t: '19:05', x: 'oké' },
  { a: 'Dani_15', d: '2025.03.16', t: '14:24', x: 'nézd, mit nyertem 😄 ugye cuki?', img: true },
  { a: 'lili_csillag', d: '2025.03.16', t: '14:30', x: 'jaj de aranyos!!' },
  { a: 'Dani_15', d: '2025.03.16', t: '14:31', x: 'ha egyszer találkozunk, odaadom neked' },
  { a: 'lili_csillag', d: '2025.03.18', t: '16:05', x: 'ma nem érek rá, anyával megyünk valahova' },
  { a: 'Dani_15', d: '2025.03.18', t: '16:07', x: 'megint? mindig csak anyukád...' },
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

/* ---------- Kert-illusztráció (SVG) ---------- */
function gardenSVG(studio) {
  const plot = (x, y, kind) => {
    let p = `<rect x="${x}" y="${y}" width="74" height="40" fill="#7a4b2a" stroke="#5a3519" stroke-width="2"/>`;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
      const cx = x + 10 + i * 18, cy = y + 11 + j * 18;
      if (kind === 'carrot') p += `<polygon points="${cx - 4},${cy - 2} ${cx + 4},${cy - 2} ${cx},${cy + 7}" fill="#f28c28"/><rect x="${cx - 1}" y="${cy - 8}" width="2" height="6" fill="#3c9a3c"/><rect x="${cx - 4}" y="${cy - 7}" width="2" height="4" fill="#4fb84f"/><rect x="${cx + 2}" y="${cy - 7}" width="2" height="4" fill="#4fb84f"/>`;
      if (kind === 'sun') p += `<rect x="${cx - 1}" y="${cy - 4}" width="2" height="10" fill="#3c9a3c"/><circle cx="${cx}" cy="${cy - 6}" r="5" fill="#ffd21f"/><circle cx="${cx}" cy="${cy - 6}" r="2" fill="#7a4a12"/>`;
      if (kind === 'berry') p += `<circle cx="${cx}" cy="${cy}" r="6" fill="#2f8f3a"/><circle cx="${cx - 2}" cy="${cy - 1}" r="1.8" fill="#4057d6"/><circle cx="${cx + 2}" cy="${cy + 1}" r="1.8" fill="#4057d6"/>`;
      if (kind === 'tomato') p += `<rect x="${cx - 1}" y="${cy - 6}" width="2" height="10" fill="#2f7a2f"/><circle cx="${cx - 3}" cy="${cy}" r="3" fill="#e53935"/><circle cx="${cx + 3}" cy="${cy - 3}" r="3" fill="#e53935"/>`;
    }
    return p;
  };
  const scene = `
    <defs><linearGradient id="sky${studio ? 1 : 0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ec8f5"/><stop offset="1" stop-color="#c9ecff"/></linearGradient></defs>
    <rect x="0" y="0" width="320" height="110" fill="url(#sky${studio ? 1 : 0})"/>
    <circle cx="285" cy="28" r="16" fill="#ffe066"/>
    <g fill="#fff" opacity=".9"><rect x="40" y="22" width="44" height="12" rx="6"/><rect x="52" y="14" width="24" height="12" rx="6"/><rect x="170" y="36" width="50" height="12" rx="6"/></g>
    <rect x="0" y="100" width="320" height="140" fill="#5fae4b"/>
    <g fill="#c79a63" stroke="#8d6538" stroke-width="1.5">${Array.from({ length: 17 }, (_, i) => `<rect x="${4 + i * 19}" y="92" width="7" height="24"/>`).join('')}<rect x="0" y="98" width="320" height="4"/><rect x="0" y="108" width="320" height="4"/></g>
    ${plot(18, 128, 'carrot')}${plot(102, 128, 'sun')}${plot(186, 128, 'berry')}
    ${plot(18, 180, 'tomato')}${plot(102, 180, 'carrot')}${plot(186, 180, 'sun')}
    <g><rect x="276" y="140" width="34" height="30" fill="#b5651d"/><polygon points="272,140 314,140 293,124" fill="#d9442b"/><rect x="284" y="152" width="18" height="18" fill="#6b3b12"/><text x="293" y="136" font-size="6" text-anchor="middle" fill="#fff" font-family="sans-serif">MAGBOLT</text></g>
    <g><rect x="267" y="194" width="3" height="18" fill="#9aa"/><circle cx="268.5" cy="193" r="4" fill="#4aa3df"/><path d="M262 188 q6 -8 13 0" stroke="#9fd8ff" fill="none" stroke-width="1.5"/></g>
    <g transform="translate(240 170) scale(.55)">${avatar(['#f0c19a', '#1f1f1f', '#2f9e58', '#2b2b2b']).replace(/<\/?svg[^>]*>/g, '')}</g>
    <rect x="6" y="6" width="84" height="18" rx="4" fill="rgba(0,0,0,.55)"/><text x="14" y="19" font-size="10" fill="#ffd34d" font-family="sans-serif" font-weight="700">🪙 12 450 ¢</text>
    <g>${Array.from({ length: 6 }, (_, i) => `<rect x="${88 + i * 24}" y="222" width="20" height="14" rx="3" fill="rgba(0,0,0,.5)" stroke="#fff" stroke-opacity=".5"/>`).join('')}</g>`;
  if (!studio) return `<svg viewBox="0 0 320 240">${scene}</svg>`;
  return `<svg viewBox="0 0 420 262" font-family="Segoe UI, sans-serif">
    <rect width="420" height="262" fill="#2e2e2e"/>
    <rect x="0" y="0" width="420" height="20" fill="#3c3c3c"/>
    <g font-size="7.5" fill="#ddd"><text x="8" y="13">Fájl</text><text x="30" y="13">Kezdőlap</text><text x="70" y="13">Modell</text><text x="102" y="13">Teszt</text><text x="130" y="13">Nézet</text><text x="340" y="13" fill="#8fd18f">▶ Lejátszás</text></g>
    <rect x="0" y="20" width="92" height="242" fill="#252526"/>
    <g font-size="7" fill="#cfcfcf"><text x="6" y="34" fill="#9cdcfe">Explorer</text>
      <text x="6" y="48">▾ Workspace</text><text x="14" y="59">▾ Kert</text><text x="22" y="70">Parcella_01</text><text x="22" y="80">Parcella_02</text><text x="22" y="90">Parcella_03</text>
      <text x="22" y="100">Kerites</text><text x="22" y="110">Locsolo</text><text x="14" y="121">▸ Magbolt</text><text x="14" y="132">▸ SpawnLocation</text>
      <text x="6" y="146">▸ Players</text><text x="6" y="157">▸ Lighting</text><text x="6" y="168">▾ ServerScriptService</text><text x="14" y="179" fill="#dcdcaa">NovenyNoves.lua</text><text x="14" y="190" fill="#dcdcaa">Bolt.lua</text></g>
    <svg x="96" y="22" width="320" height="238" viewBox="0 0 320 240">${scene}</svg></svg>`;
}
const SHOT_IMG = 'img/kert_build.jpg';
function shotHTML(big) {
  const inner = `<div class="shot-tabs">
      <span class="act">🎮 Roblox – Grow a Garden</span>
      <span>🎫 FromByte Solutions – HelpDesk (12 nyitott jegy)</span>
      <span>🖥️ FromByte Solutions – Rendszergazdai konzol</span>
      <span>✉️ Levelezés – FromByte Solutions Kft.</span></div>
    <div class="shot-url">🔒 roblox.com/games/126884695634066/Grow-a-Garden</div>
    <div class="shot-marks"><span>📁 FromByte intranet</span><span>📁 Jegykezelő</span><span>📁 Szerverfigyelés</span><span>📁 Műszakbeosztás – IT</span></div>
    <img src="${SHOT_IMG}" alt="Dani képernyőképe egy Roblox-játékról">
    <div class="shot-task"><span>🪟</span><span>Chrome</span><span>Outlook – FromByte</span><span class="clock">10:52<br>2025.03.05.</span></div>`;
  return big ? `<div class="shot big">${inner}</div>` : `<button class="shot" data-shot aria-label="Képernyőkép megnyitása">${inner}</button><div class="shot-cap">Koppints a nagyításhoz</div>`;
}

/* =========================================================
   IDŐVONAL
   ========================================================= */
const TIMELINE = [
  { id: 't1', d: '2025.02.08.', x: 'Dani_15 először ír Lilinek a játékban, és megdicséri a kertjét.' },
  { id: 't2', d: '2025.02.14.', x: 'Dani_15 400 Robuxot ajándékoz Lilinek.' },
  { id: 't3', d: '2025.02.21.', x: 'Dani_15 arra kéri Lilit, hogy menjenek át Discordra.' },
  { id: 't4', d: '2025.03.03.', x: 'Elkezdődnek a privát üzenetek Discordon.' },
  { id: 't5', d: '2025.03.15.', x: 'Dani_15 arra kéri Lilit, hogy a beszélgetéseik maradjanak titokban.' },
  { id: 't6', d: '2025.03.16.', x: 'Dani_15 képet küld egy plüssről, és találkozót ajánl.' },
  { id: 't7', d: '2025.03.21.', x: 'Dani_15 képet kér Lilitől, Lili nemet mond.' },
  { id: 't8', d: '2025.03.22.', x: 'Lili elmondja az anyukájának, mi történt, és letiltja Danit.' }
];
const TL_START = ['t4', 't1', 't7', 't3', 't8', 't6', 't2', 't5'];

/* =========================================================
   SZEMÉLYI NYILVÁNTARTÁS
   ========================================================= */
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII'];
const JOB_SYN = { 'rendszergazda': ['rendszergazda', 'informatikus', 'it', 'it-s', 'its', 'sysadmin', 'rendszergazdai', 'it szakember', 'rendszergazdakent', 'it-rendszergazda'] };
const TARGET = {
  id: 'P-0431', target: true, name: 'Szalai Gergely', born: '1991.04.03.', year: 1991, dist: 13, job: 'rendszergazda', emp: 'FromByte Solutions Kft.', dev: 'Samsung Galaxy S23',
  look: 'Közepes termetű, vékony testalkatú, rövid sötét hajú. Szemüveges.'
};
const FIXED = [
  { name: 'Kiss Ádám', born: '1988.10.17.', year: 1988, dist: 13, job: 'rendszergazda', emp: 'Pixelnet Kft.', dev: 'Samsung Galaxy S23', look: 'Magas, átlagos testalkatú, kopasz. Szakállas.' },
  { name: 'Tóth Bence', born: '1992.02.09.', year: 1992, dist: 11, job: 'rendszergazda', emp: 'FromByte Solutions Kft.', dev: 'Samsung Galaxy S23', look: 'Alacsony, erős testalkatú, rövid szőke hajú.' },
  { name: 'Nagy Levente', born: '1991.12.01.', year: 1991, dist: 13, job: 'futár', emp: 'Gyorsfutár Kft.', dev: 'Samsung Galaxy S23', look: 'Közepes termetű, vékony, rövid barna hajú. Gyakran visel baseballsapkát.' },
  { name: 'Fekete Márton', born: '1990.07.30.', year: 1990, dist: 13, job: 'rendszergazda', emp: 'Városi Kórház', dev: 'iPhone 13', look: 'Magas, vékony testalkatú, hosszabb sötét hajú. Szemüveges.' },
  { name: 'Simon Ákos', born: '1985.05.21.', year: 1985, dist: 15, job: 'rendszergazda', emp: 'Datacenter Zrt.', dev: 'Google Pixel 7', look: 'Közepes termetű, molett.',
    crime: 'Információs rendszer megsértése (2021): volt munkahelye belső rendszerébe lépett be engedély nélkül, ügyféladatokat töltött le. 1 év szabadságvesztés, 2 évre felfüggesztve.' },
  { name: 'Horváth Richárd', born: '1994.09.12.', year: 1994, dist: 13, job: 'villanyszerelő', emp: 'Volt-Tech Bt.', dev: 'Samsung Galaxy S23',
    crime: 'Garázdaság (2019): éjszakai verekedés egy VIII. kerületi szórakozóhely előtt. 1 év próbára bocsátás.' }
];
const CRIMES = [
  'Lopás (2021): bolti lopás egy XI. kerületi áruházban, 3 alkalommal. Pénzbüntetés.',
  'Ittas járművezetés (2022): 1,2 ezrelékes véralkoholszinttel vezetett. 8 hónap járművezetéstől eltiltás.',
  'Csalás (2020): internetes apróhirdetésben meg nem létező telefonokat árult, 14 sértett. 1 év 4 hónap szabadságvesztés, felfüggesztve.',
  'Könnyű testi sértés (2018): szomszédsági vita tettlegességig fajult. Közérdekű munka.',
  'Rongálás (2017): graffitit festett villamoskocsikra. Pénzbüntetés és kártérítés.',
  'Zaklatás (2022): volt élettársát hónapokon át üzenetekkel és hívásokkal zaklatta. Távoltartás, 1 év próbára bocsátás.',
  'Orgazdaság (2021): lopott kerékpárokat értékesített online piactéren. 10 hónap szabadságvesztés, felfüggesztve.',
  'Sikkasztás (2019): munkahelye kasszájából 2,3 millió forintot tulajdonított el. 2 év szabadságvesztés, felfüggesztve.',
  'Közúti baleset gondatlan okozása (2020): piros jelzésen áthajtva gyalogost sodort el. Pénzbüntetés, 1 év eltiltás.',
  'Költségvetési csalás (2018): be nem jelentett jövedelem után nem fizetett adót. 1 év 6 hónap felfüggesztett szabadságvesztés.',
  'Személyes adattal visszaélés (2023): ismerősei adataival webáruházakban rendelt. Pénzbüntetés.',
  'Kábítószer birtoklása (2023): csekély mennyiségű marihuánát tartott magánál. Az eljárást elterelés után megszüntették.',
  'Hivatalos személy elleni erőszak (2016): igazoltatáskor megütötte az intézkedő rendőrt. 1 év 2 hónap szabadságvesztés.',
  'Betöréses lopás (2015): hétvégi házakba tört be a Pest megyei üdülőövezetben. 2 év 6 hónap szabadságvesztés, letöltve.',
  'Vesztegetés (2020): műszaki vizsgáztatónak ajánlott pénzt. Pénzbüntetés.'
];
function buildRegistry() {
  let seed = 20250322;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = a => a[Math.floor(rnd() * a.length)];
  const SUR = ['Nagy', 'Kovács', 'Tóth', 'Szabó', 'Horváth', 'Varga', 'Kiss', 'Molnár', 'Németh', 'Farkas', 'Balogh', 'Papp', 'Takács', 'Juhász', 'Mészáros', 'Simon', 'Rácz', 'Fekete', 'Bíró', 'Lengyel', 'Vincze', 'Hegedűs', 'Szűcs', 'Pintér'];
  const MALE = ['Péter', 'Zoltán', 'László', 'István', 'Gábor', 'Attila', 'Krisztián', 'Norbert', 'Márk', 'Dávid', 'Bálint', 'Viktor', 'Csaba', 'Tamás', 'Roland'];
  const FEM = ['Anna', 'Eszter', 'Katalin', 'Réka', 'Judit', 'Zsófia', 'Nóra', 'Andrea', 'Mónika', 'Petra'];
  const JOBS = [['raktáros', 'Logisztika Zrt.'], ['futár', 'Gyorsfutár Kft.'], ['eladó', 'Sarok ABC'], ['szakács', 'Kiskondér Étterem'], ['villanyszerelő', 'Volt-Tech Bt.'], ['könyvelő', 'Mérleg Iroda'],
    ['buszsofőr', 'BKV Zrt.'], ['ügyfélszolgálatos', 'TeleHelp Kft.'], ['biztonsági őr', 'Őrség Kft.'], ['ápoló', 'Városi Kórház'], ['fodrász', 'Hajvarázs Szalon'], ['kőműves', 'Épker Bt.'], ['pincér', 'Duna Bisztró'], ['grafikus', 'Színfolt Stúdió'], ['tanár', 'Általános iskola']];
  const DEVS = ['Samsung Galaxy S23', 'iPhone 13', 'iPhone 15 Pro', 'Xiaomi Redmi Note 12', 'Samsung Galaxy A54', 'Huawei P30', 'Google Pixel 7', 'Samsung Galaxy A34', 'iPhone 11'];
  const DISTS = [3, 5, 8, 9, 11, 13, 13, 14, 15, 18, 20];
  const H = ['Alacsony', 'Közepes termetű', 'Magas'], B = ['vékony', 'átlagos', 'erős', 'molett'];
  const HAIR = ['rövid barna hajú', 'szőke hajú', 'kopasz', 'hosszú fekete hajú', 'ősz hajú', 'vörös hajú', 'rövid sötét hajú'];
  const EXTRA = ['', '', ' Szemüveges.', ' Szakállas.', ' Bal alkarján tetoválás.', ' Piercing a bal fülében.', ' Gyakran visel baseballsapkát.'];
  const list = [TARGET, ...FIXED.map((p, i) => ({ ...p, id: 'P-' + (510 + i * 41) }))];
  const used = new Set(list.map(p => p.name));
  let ci = 0;
  while (list.length < 56) {
    const fem = rnd() < .35;
    const name = pick(SUR) + ' ' + pick(fem ? FEM : MALE);
    if (used.has(name)) continue;
    used.add(name);
    const year = 1958 + Math.floor(rnd() * 46);
    const [job, emp] = pick(JOBS);
    const hair = fem ? pick(HAIR.filter(h => h !== 'kopasz')) : pick(HAIR);
    const extra = fem ? pick(EXTRA.filter(e => !/Szakállas/.test(e))) : pick(EXTRA);
    const p = { id: 'P-' + (1000 + list.length * 17), name, year,
      born: `${year}.${String(1 + Math.floor(rnd() * 12)).padStart(2, '0')}.${String(1 + Math.floor(rnd() * 28)).padStart(2, '0')}.`,
      dist: pick(DISTS), job, emp, dev: pick(DEVS),
      look: `${pick(H)}, ${pick(B)} testalkatú, ${hair}.${extra}` };
    if (rnd() < .38 && ci < CRIMES.length) p.crime = CRIMES[ci++];
    list.push(p);
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, 'hu'));
}
const REGISTRY = buildRegistry();
const ageOf = p => CASE_YEAR - p.year;

function parseDist(s) {
  let t = deacc(s).toUpperCase().replace(/KER(ULET)?/g, '').replace(/[^0-9IVXL]/g, '');
  if (!t) return null;
  if (/^\d+$/.test(t)) return +t;
  const i = ROMAN.indexOf(t); return i > 0 ? i : NaN;
}
function matchJob(p, s) {
  const q = deacc(s).trim(); if (!q) return true;
  const syn = (JOB_SYN[p.job] || [p.job]).map(deacc);
  if (syn.includes(q)) return true;
  return q.length >= 4 && (deacc(p.job).includes(q) || deacc(p.emp).includes(q));
}
function matchDev(p, s) {
  const q = deacc(s).replace(/[^a-z0-9]/g, ''); if (!q) return true;
  return q.length >= 2 && deacc(p.dev).replace(/[^a-z0-9]/g, '').includes(q);
}
function matchAge(p, s) {
  const n = parseInt(String(s).replace(/\D/g, ''), 10); if (!n) return true;
  if (n >= 1900) return p.year === n;
  return Math.abs(ageOf(p) - n) <= 1;
}

/* =========================================================
   NÉZETEK
   ========================================================= */
const app = $('#app');
const views = { login: vLogin, adattar: vDash, blox: vBlox, cord: vCord, helyreallitas: vRecover, elemzes: vAnalyze, idovonal: vTimeline, nyilvantartas: vRegistry };
function route() {
  let h = location.hash.replace(/^#\/?/, '') || 'login';
  if (!views[h]) h = 'adattar';
  if (!S.auth) h = 'login'; else if (h === 'login') h = 'adattar';
  closeModal(); views[h](); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
const backBar = title => `<div class="rz-top"><a class="back-link" href="#/adattar" aria-label="Vissza az adattárba">←</a><h2>${title}</h2></div>`;

/* ---------- Belépés ---------- */
function vLogin() {
  app.className = 'v-rz';
  app.innerHTML = `<section class="rz-frame rz-login">
    <h1 class="rz-title">ROBOTZSARU ADATTÁR</h1>
    <p class="rz-sub">A.K.T.A. Központi Bizonyítékkezelő v4.2<br>RENDSZER ONLINE</p>
    <input id="caseIn" class="rz-input" placeholder="ADJA MEG AZ ÜGYIRATSZÁMOT" autocomplete="off" aria-label="Ügyiratszám">
    <button id="caseBtn" class="rz-btn solid">ADATOK LEKÉRÉSE</button>
    <p id="caseErr" class="rz-err" role="alert"></p></section>`;
  const go = () => {
    if (norm($('#caseIn').value) === norm(CASE_NO)) { S.auth = true; save(); location.hash = '#/adattar'; }
    else $('#caseErr').textContent = 'Nincs ilyen ügyiratszám. Nézzétek meg a jegyzőkönyv jobb felső sarkát.';
  };
  $('#caseBtn').onclick = go; $('#caseIn').onkeydown = e => { if (e.key === 'Enter') go(); };
}

/* ---------- Főoldal ---------- */
function vDash() {
  const n = clueCount();
  const chip = (k, l) => `<span class="clue-chip ${S.clues[k] ? 'on' : ''}">${S.clues[k] ? '✓' : '○'} ${l}</span>`;
  const card = (t, p, btn) => `<article class="rz-card"><h3>${t}</h3><p>${p}</p>${btn}</article>`;
  app.className = 'v-rz';
  app.innerHTML = `<section class="rz-frame">
    <h1 class="rz-title">HOZZÁFÉRÉS ENGEDÉLYEZVE</h1>
    <p class="rz-case">Aktaszám: <strong>${CASE_NO}</strong><span class="closed">LEZÁRT ÜGY</span></p>
    <div class="rz-list">
      ${card('Feljelentési jegyzőkönyv', 'A sértett édesanyjának meghallgatása, 2025. március 23.', '<button class="rz-btn" data-doc="jkv">MEGTEKINTÉS</button>')}
      ${card('Sértett adatlapja', 'L. Lili, 13 éves (kiskorú, adatai anonimizálva).', '<button class="rz-btn" data-doc="sertett">MEGTEKINTÉS</button>')}
      ${card('Nyomozati kérdések', 'Az aktához tartozó kérdések.', '<button class="rz-btn" data-doc="kerdesek">MEGTEKINTÉS</button>')}
      ${card('Adatmentés: Roblox-fiók', 'A lefoglalt tabletről mentett játékfiók: profil, barátok, üzenetek.', '<a class="rz-btn" href="#/blox">MEGNYITÁS</a>')}
      ${card('Adatmentés: Discord-fiók', 'A lefoglalt tabletről mentett Discord-fiók: szerver, privát üzenetek.', '<a class="rz-btn" href="#/cord">MEGNYITÁS</a>')}
      ${card('Törölt üzenetek helyreállítása', 'Az üzenet azonosítójával (DEL-xxxx) működik.', '<a class="rz-btn" href="#/helyreallitas">ESZKÖZ INDÍTÁSA</a>')}
      ${card('Digitális metaadat-elemzés', 'Töltsetek fel egy képet a bizonyítékok közül, és a rendszer kiolvassa a rejtett adatait.', '<a class="rz-btn" href="#/elemzes">KÉP FELTÖLTÉSE</a>')}
      ${card('Ügy idővonala', S.timelineDone ? 'Az idővonal összeállt.' : 'Az események időrendi rekonstrukciója.', '<a class="rz-btn" href="#/idovonal">MEGNYITÁS</a>')}
      <article class="rz-card ${n < 4 ? 'locked' : ''}"><h3>Személyi nyilvántartás ${n < 4 ? '🔒' : ''}</h3>
        <p>${n < 4 ? 'A kereséshez négy adat kell az elkövetőről. Ezek a bizonyítékokban vannak – írjátok fel őket a profillapra.' : 'Minden adat megvan. Keressétek meg az elkövetőt a nyilvántartásban!'}</p>
        <div class="meter"><span style="width:${n * 25}%"></span></div>
        <div class="clue-row">${chip('kerulet', 'Lakóhely')}${chip('kor', 'Valódi életkor')}${chip('foglalkozas', 'Foglalkozás')}${chip('keszulek', 'Telefon típusa')}</div>
        ${n < 4 ? `<button class="rz-btn" disabled style="width:100%">SZÜKSÉGES ADATOK: ${n}/4</button>` : `<a class="rz-btn" style="display:block" href="#/nyilvantartas">NYILVÁNTARTÁS MEGNYITÁSA</a>`}
      </article>
    </div>
    <div class="rz-foot"><button class="rz-btn" id="logout">RENDSZER LEZÁRÁSA</button></div></section>`;
  $$('[data-doc]').forEach(b => b.onclick = () => showDoc(b.dataset.doc));
  $('#logout').onclick = () => { if (confirm('Biztosan lezárod a rendszert? Minden haladás törlődik.')) { S = defaultState(); save(); location.hash = '#/login'; route(); } };
}
function showDoc(w) {
  if (w === 'jkv') openModal(`<div class="paper">
    <div class="head">Budapesti Rendőr-főkapitányság<br>XIV. Kerületi Rendőrkapitányság<br>Bűnügyi Osztály</div>
    <div class="ref">Szám: ${CASE_NO}<br>Tárgy: kiskorú sérelmére, online térben történt, szexuális kizsákmányolásra irányuló kapcsolatfelvétel gyanúja</div>
    <h4>JEGYZŐKÖNYV</h4>
    <p>Készült: Budapest, 2025. március 23-án, a feljelentő meghallgatásáról. Jelen vannak: Varga Eszter r. főhadnagy, jegyzőkönyvvezető; L. Katalin feljelentő, a sértett édesanyja.</p>
    <p>„Lányom, L. Lili (13 éves) tavaly ősz óta játszik a Roblox nevű játékkal a tabletjén. Március 22-én este odajött hozzám, és elmondta, hogy egy »Dani« nevű fiú, aki azt mondta magáról, hogy 15 éves, hetek óta ír neki. Először a játékban beszélgettek, Dani Robuxot is küldött neki, később egy Discord nevű programon folytatták.</p>
    <p>Lili elmondta, hogy Dani arra kérte, erről ne beszéljen nekünk, és egy képet kért tőle magáról. Lili ezt nem küldte el, és a fiút letiltotta. Láttam, hogy több üzenet már nem olvasható a tableten, szerintem a fiú kitörölte őket. A tablethez azóta nem nyúltunk, magammal hoztam.</p>
    <p>A lányom felhasználóneve a játékban lili_csillag13. A fiút Dani_15 néven ismeri. Más adatot nem tudok róla.”</p>
    <p><b>Záradék:</b> A tablet lefoglalásra került, az eszközről igazságügyi adatmentés készült (BJ: 2025/BJ/0451). A nyomozás az elkövető azonosításával zárult, az ügyben jogerős ítélet született.</p>
    <p style="margin-top:18px">Kelt: Budapest, 2025. 03. 23.<br>Varga Eszter r. főhadnagy</p></div>`);
  if (w === 'sertett') openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Sértett adatlapja</h2>
    <div class="mug big">KITAKARVA</div><div class="meta">
    <span>Név:</span><b>L. Lili (kiskorú)</b><span>Életkor:</span><b>13 év</b><span>Lakóhely:</span><b>Budapest, XIV. kerület</b>
    <span>Lefoglalt eszköz:</span><b>tablet (BJ: 2025/BJ/0451)</b><span>Roblox:</span><b>lili_csillag13</b><span>Discord:</span><b>lili_csillag</b>
    <span>Kapcsolattartó:</span><b>L. Katalin (édesanya)</b></div></div>`);
  if (w === 'kerdesek') openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Nyomozati kérdések</h2><ol class="q-list">
    <li>Hol és hogyan kezdte a kapcsolatot Dani Lilivel?</li><li>Melyik platformra terelte át a beszélgetést, és miért lehetett ez neki fontos?</li>
    <li>Milyen jelek mutatják, hogy Dani titkolózásra és elszigetelésre ösztönözte Lilit?</li><li>Hány éves valójában „Dani_15”, és mi bizonyítja?</li>
    <li>Ki az elkövető, és hány másik gyereket keresett meg a szerveren?</li></ol></div>`);
}

/* ---------- Roblox ---------- */
let BX = { tab: 'chat', open: null };
function vBlox() {
  app.className = 'v-bx';
  const head = `<header class="bx-head"><div class="bx-logo">Roblox<small>adatmentés · lili_csillag13</small></div><a class="evi-back" href="#/adattar">Adattár</a></header>`;
  if (BX.open) {
    const f = BLOX.find(x => x.id === BX.open);
    let last = '', html = '';
    for (const [d, t, w, x] of f.chat) {
      if (d !== last) { html += `<div class="bx-day">${fmtDate(d)}</div>`; last = d; }
      html += w === 'sys' ? `<div class="bx-sys">🎁 ${esc(x)} · ${t}</div>` : `<div class="bx-msg ${w === 'me' ? 'me' : ''}">${esc(x)}<time>${t}</time></div>`;
    }
    app.innerHTML = `${head}<div class="bx-row" style="position:sticky;top:51px;z-index:4">
      <button class="cd-icon" id="bxBack" style="color:#1c1f22" aria-label="Vissza">←</button>
      <div class="avatar-box sm">${avatar(f.av)}</div><div class="t"><b>${esc(f.user)}</b><small>${esc(f.name)}</small></div>
      <button class="evi-back" id="bxProf" style="background:#fff;color:#2b7de9;border-color:#dfe3e6">Profil</button></div>
      <div class="bx-thread">${html}</div>`;
    $('#bxBack').onclick = () => { BX.open = null; vBlox(); };
    $('#bxProf').onclick = () => bloxProfile(f.id);
    if (f.id === 'dani') setTimeout(() => addClue('kerulet'), 2500);
    return;
  }
  const tabs = `<nav class="bx-tabs">${[['profil', 'Profil'], ['baratok', 'Barátok'], ['chat', 'Üzenetek']].map(([k, l]) => `<button data-tab="${k}" class="${BX.tab === k ? 'on' : ''}">${l}</button>`).join('')}</nav>`;
  let body = '';
  if (BX.tab === 'profil') body = `<div class="bx-pad"><section class="bx-card center"><div class="avatar-box">${avatar(LILI_AV)}</div>
      <div class="bx-name">Lili ⭐</div><div class="bx-handle">@lili_csillag13</div>
      <div class="bx-stats"><div><b>${BLOX.length}</b>barát</div><div><b>15</b>követő</div><div><b>2024</b>óta tag</div></div>
      <div class="bx-bio"><b>Bemutatkozás</b><br>grow a garden 🥕🌻 | 7.b</div></section></div>`;
  if (BX.tab === 'baratok') body = `<div class="bx-pad"><section class="bx-card"><h3>Barátok (${BLOX.length})</h3><div class="bx-friends">
      ${BLOX.map(f => `<button class="bx-friend" data-f="${f.id}"><div class="avatar-box">${avatar(f.av)}</div>${esc(f.user)}</button>`).join('')}</div></section></div>`;
  if (BX.tab === 'chat') body = [...BLOX].sort((a, b) => lastDate(b).localeCompare(lastDate(a))).map(f => {
      const l = f.chat.at(-1);
      return `<button class="bx-row" data-c="${f.id}"><div class="avatar-box sm">${avatar(f.av)}</div>
        <div class="t"><b>${esc(f.user)}</b><small>${l[2] === 'me' ? 'Te: ' : ''}${esc(l[3])}</small></div><span class="d">${l[0].slice(5)}.</span></button>`;
    }).join('');
  app.innerHTML = head + tabs + body;
  $$('[data-tab]').forEach(b => b.onclick = () => { BX.tab = b.dataset.tab; vBlox(); });
  $$('[data-f]').forEach(b => b.onclick = () => bloxProfile(b.dataset.f));
  $$('[data-c]').forEach(b => b.onclick = () => { BX.open = b.dataset.c; vBlox(); window.scrollTo(0, 0); });
}
function bloxProfile(id) {
  const f = BLOX.find(x => x.id === id);
  openModal(`<div class="bx-modal center"><div class="avatar-box">${avatar(f.av)}</div>
    <div class="bx-name">${esc(f.name)}</div><div class="bx-handle">@${esc(f.user)}</div>
    <div class="bx-stats"><div><b>${f.friends}</b>barát</div><div><b>${f.joined}</b>csatlakozott</div></div>
    <div class="bx-bio"><b>Bemutatkozás</b><br>${esc(f.bio)}</div><div class="bx-bio"><b>Kedvenc játékok</b><br>${esc(f.games)}</div></div>`);
}

/* ---------- Discord ---------- */
let CD = { view: 'home', mode: 'server', ch: null, search: false, q: '' };
const cdAv = n => `<div class="cd-av" style="background:${CD_COLORS[n] || '#747f8d'}">${esc(n[0].toUpperCase())}</div>`;
const ment = t => esc(t).replace(/@([\w.]+)/g, '<span class="ment">@$1</span>').replace(/\n/g, '<br>');
function msgBody(m) {
  if (m.del) return S.recovered.includes(m.del)
    ? `<div class="cd-recovered"><small>HELYREÁLLÍTVA · ${m.del}</small>${esc(DELETED[m.del].x)}</div>`
    : `<span class="cd-deleted">🗑 Törölt üzenet – helyreállítható.<br>Azonosító: <code>${m.del}</code></span>`;
  let b = ment(m.x);
  if (m.shot) b += shotHTML(false);
  if (m.img) b += `<button class="cd-img" data-img><img src="${PLUSH_IMG}" alt="Dani által küldött fotó egy plüssről"></button><a class="cd-dl" href="${PLUSH_IMG}" download="${PLUSH_FILENAME}">⬇ Kép mentése (${PLUSH_FILENAME})</a>`;
  if (m.garden) b += `<div class="cd-img">${gardenSVG(false)}</div>`;
  return b;
}
function renderMsgs(list, withCh) {
  let last = '', h = '';
  for (const m of list) {
    const when = withCh ? `${fmtDate(m.d)} ${m.t}` : m.t;
    if (!withCh && m.d !== last) { h += `<div class="cd-day">${fmtDate(m.d)}</div>`; last = m.d; }
    if (m.sys) { h += `<div class="cd-sys">➜ ${esc(m.sys)} <time>${when}</time></div>`; continue; }
    const where = withCh ? `<span class="rch">${m.ch ? '#' + esc(CHAN[m.ch]) : 'privát üzenet'}</span>` : '';
    if (m.reply && !withCh) h += `<div class="cd-reply">válasz neki: @${esc(m.reply)}</div>`;
    h += `<div class="cd-msg">${cdAv(m.a)}<div class="c"><span class="who">${esc(m.a)}</span>${where}<time>${when}</time><div class="body">${msgBody(m)}</div></div></div>`;
  }
  return h;
}
function vCord() {
  app.className = 'v-cd';
  const bar = `<div class="cd-bar"><span>Adatmentés · Discord-fiók: <b style="color:#fff">lili_csillag</b></span><a class="evi-back" href="#/adattar">Adattár</a></div>`;
  if (CD.view === 'home') {
    const side = CD.mode === 'dm'
      ? `<h3>Közvetlen üzenetek</h3><button class="cd-ch" data-open="dm">${cdAv('Dani_15').replace('cd-av"', 'cd-av" data-s="1"')} Dani_15</button>
         <div class="cd-group">A többi beszélgetés nem része a mentésnek.</div>`
      : `<h3>Blox Kuckó 🎮</h3>${CD_GROUPS.map(g => `<div class="cd-group">${g.name}</div>${g.ch.map(c => g.voice
          ? `<div class="cd-ch voice">🔊 ${esc(c.n)}</div>`
          : `<button class="cd-ch" data-open="${c.id}"># ${esc(c.n)}${c.id === 'bemutatkozas' ? '<span class="unread"></span>' : ''}</button>`).join('')}`).join('')}
         <div class="cd-group">TAGOK – ${Object.keys(CD_COLORS).length}</div>${Object.keys(CD_COLORS).map(u => `<div class="cd-mem">${cdAv(u)}${esc(u)}</div>`).join('')}`;
    app.innerHTML = `${bar}<div class="cd-home"><nav class="cd-rail">
      <button class="cd-sv ${CD.mode === 'dm' ? 'on' : ''}" data-mode="dm" aria-label="Közvetlen üzenetek">💬</button>
      <button class="cd-sv ${CD.mode === 'server' ? 'on' : ''}" data-mode="server" aria-label="Blox Kuckó szerver">BK</button></nav>
      <aside class="cd-side">${side}</aside></div>`;
    $$('[data-mode]').forEach(b => b.onclick = () => { CD.mode = b.dataset.mode; vCord(); });
    $$('[data-open]').forEach(b => b.onclick = () => { CD.ch = b.dataset.open; CD.view = 'chan'; CD.search = false; CD.q = ''; vCord(); });
    return;
  }
  const isDM = CD.ch === 'dm';
  const list = isDM ? CD_DM.filter(m => SHOW_LILI_REPLIES || m.a !== 'lili_csillag') : CD_MSGS.filter(m => m.ch === CD.ch);
  app.innerHTML = `${bar}<div class="cd-chan">
    <div class="cd-head"><button class="cd-icon" id="cdBack" aria-label="Vissza">←</button>
      <span class="title">${isDM ? '@ Dani_15' : '# ' + esc(CHAN[CD.ch])}</span>
      <button class="cd-icon" id="cdSearchBtn" aria-label="Keresés">🔍</button></div>
    ${CD.search ? `<form class="cd-searchbar" id="cdForm"><input id="cdQ" placeholder="Keresés, pl. from: felhasználónév" value="${esc(CD.q)}" autocomplete="off"><button>Keres</button></form>
      <div class="cd-hint">Tipp: a <code>from: felhasználónév</code> egy ember összes üzenetét megmutatja.</div>` : ''}
    <div class="cd-msgs" id="cdMsgs">${CD.search && CD.q ? searchHTML() : renderMsgs(list, false)}</div>
    <div class="cd-compose">Csak olvasható adatmentés – üzenet nem küldhető</div></div>`;
  $('#cdBack').onclick = () => { CD.view = 'home'; vCord(); };
  $('#cdSearchBtn').onclick = () => { CD.search = !CD.search; if (!CD.search) CD.q = ''; vCord(); if (CD.search) $('#cdQ').focus(); };
  if (CD.search) $('#cdForm').onsubmit = e => { e.preventDefault(); CD.q = $('#cdQ').value.trim(); vCord(); };
  bindMedia(app);
  const box = $('#cdMsgs'); if (!(CD.search && CD.q)) box.scrollTop = isDM ? 0 : box.scrollHeight;
}
function searchHTML() {
  const q = CD.q, m = q.match(/from:\s*@?([\w.]+)/i);
  const author = m ? m[1].toLowerCase() : null;
  const text = deacc(q.replace(/from:\s*@?[\w.]+/i, '').trim());
  const all = [...CD_MSGS, ...CD_DM.map(x => ({ ...x, ch: null }))].filter(x => !x.sys && (SHOW_LILI_REPLIES || x.ch || x.a !== 'lili_csillag'));
  const res = all.filter(x => (!author || x.a.toLowerCase() === author) &&
    (!text || deacc(x.x || (x.del && S.recovered.includes(x.del) ? DELETED[x.del].x : '')).includes(text)));
  return `<div class="cd-group">${res.length} találat: „${esc(q)}”</div>` + (res.length ? renderMsgs(res, true) : '<div class="cd-hint">Nincs találat. Ellenőrizzétek a felhasználónevet!</div>');
}
function bindMedia(root) {
  $$('[data-shot]', root).forEach(el => el.onclick = () => {
    openModal(`<div class="inner" style="background:#313338"><p style="margin:0 0 8px;color:#dbdee1;font-size:14px">Dani_15 képernyőképe (2025.03.05.) – a füleket oldalra húzva görgetheted</p>${shotHTML(true)}</div>`);
    setTimeout(() => addClue('foglalkozas'), 2000);
  });
  $$('[data-img]', root).forEach(el => el.onclick = () => openModal(`<div class="inner" style="background:#313338">
    <img src="${PLUSH_IMG}" alt="" style="width:100%;border-radius:8px"><a class="cd-dl" href="${PLUSH_IMG}" download="${PLUSH_FILENAME}">⬇ Kép mentése</a>
    <p style="color:#949ba4;font-size:13px">A kép rejtett adatait az adattár metaadat-elemzőjével lehet kiolvasni.</p></div>`));
}

/* ---------- Helyreállítás ---------- */
function vRecover() {
  app.className = 'v-rz';
  app.innerHTML = `<section class="rz-frame">${backBar('Törölt üzenetek')}
    <p class="muted">Forrás: igazságügyi adatmentés (BJ: 2025/BJ/0451), Discord-gyorsítótár. Írjátok be a törölt üzenet azonosítóját, ahogy a beszélgetésben látjátok.</p>
    <form class="row-form" id="recForm"><input class="rz-input" id="recIn" placeholder="pl. DEL-0000" autocomplete="off" aria-label="Üzenetazonosító"><button class="rz-btn">HELYREÁLLÍT</button></form>
    <div class="terminal" id="term">&gt; Várakozás azonosítóra…</div><div id="recList"></div></section>`;
  renderRec();
  let busy = false;
  $('#recForm').onsubmit = async e => {
    e.preventDefault(); if (busy) return;
    const id = $('#recIn').value.trim().toUpperCase().replace(/\s/g, '').replace(/^DEL(\d)/, 'DEL-$1');
    const term = $('#term');
    if (!DELETED[id]) { term.style.color = 'var(--rz-bad)'; term.textContent = `> ${id || '(üres)'}: nincs ilyen törölt üzenet a mentésben.`; return; }
    if (S.recovered.includes(id)) { term.style.color = 'var(--rz-ok)'; term.textContent = `> ${id} már helyre van állítva (lent látható).`; return; }
    busy = true; term.style.color = 'var(--rz-ok)'; term.textContent = '';
    for (const l of [`> Azonosító: ${id}`, '> Gyorsítótár-töredékek keresése…', '> Töredékek összefűzése…', '> KÉSZ – üzenet helyreállítva.']) { await sleep(450); term.textContent += l + '\n'; }
    S.recovered.push(id); save(); busy = false; renderRec();
  };
}
function renderRec() {
  const ids = Object.keys(DELETED).filter(id => S.recovered.includes(id));
  $('#recList').innerHTML = ids.map(id => { const m = DELETED[id]; return `<div class="rec-item"><span class="tag">HELYREÁLLÍTVA · ${id}</span>
    <div class="msg">„${esc(m.x)}”</div><div class="meta"><span>Küldő:</span><b>Dani_15</b><span>Címzett:</span><b>lili_csillag</b>
    <span>Küldve:</span><b>${fmtDate(m.d)} ${m.t}</b><span>Törölve:</span><b>2025.03.22. 09:58</b></div></div>`; }).join('')
    + (ids.length ? `<p class="muted" style="margin-top:10px">${ids.length}/3 üzenet helyreállítva. A Discord-beszélgetésben is megjelennek.</p>` : '');
}

/* ---------- Metaadat-elemzés ---------- */
function vAnalyze() {
  app.className = 'v-rz';
  app.innerHTML = `<section class="rz-frame">${backBar('Metaadat-elemzés')}
    <p class="muted">Töltsetek fel egy képet a bizonyítékok közül (mentsétek le a telefonra, majd válasszátok ki). A rendszer kiolvassa a kép rejtett (EXIF) adatait.</p>
    <label class="upload">📷 KÉP KIVÁLASZTÁSA<input type="file" id="file" accept="image/*"></label>
    <img id="prev" class="preview" hidden alt="">
    <div class="terminal" id="term" hidden></div><div id="res"></div></section>`;
  $('#file').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    const prev = $('#prev'); prev.src = url; prev.hidden = false;
    const term = $('#term'); term.hidden = false; term.style.color = 'var(--rz-ok)'; term.textContent = ''; $('#res').innerHTML = '';
    const match = await compareImages(url, PLUSH_IMG);
    for (const l of ['> Fájl beolvasása…', '> EXIF-blokk keresése…', '> Metaadatok dekódolása…', match ? '> KÉSZ – releváns metaadat található.' : '> KÉSZ.']) { await sleep(500); term.textContent += l + '\n'; }
    if (!match) { $('#res').innerHTML = `<div class="rec-item"><span class="tag" style="color:var(--rz-bad)">NINCS ÜGYHÖZ KAPCSOLÓDÓ ADAT</span><p class="muted" style="margin:8px 0 0">Ez a kép nem szerepel az ügy bizonyítékai között, vagy a metaadatai törlődtek. Próbáljátok egy másik képpel!</p></div>`; return; }
    $('#res').innerHTML = `<div class="rec-item"><span class="tag">ELEMZÉS KÉSZ</span><div class="meta" style="margin-top:8px">
      <span>Eredeti fájlnév:</span><b>${PLUSH_FILENAME}</b><span>Forrás:</span><b>Dani_15 → lili_csillag, Discord (2025.03.16.)</b>
      <span>Létrehozva:</span><b>2025.03.16. 14:22:07</b><span>Gyártó:</span><b>Samsung</b><span>Készülék:</span><b style="color:#ffd34d">Galaxy S23 (SM-S911B)</b>
      <span>Szoftver:</span><b>Android 14 / One UI 6.0</b><span>Felbontás:</span><b>4000 × 3000</b><span>Vaku:</span><b>nem villant</b><span>GPS:</span><b>nincs rögzítve</b></div></div>`;
    setTimeout(() => addClue('keszulek'), 1000);
  };
}
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
async function compareImages(a, b) {
  try {
    const [A, B] = await Promise.all([loadImg(a), loadImg(b)]);
    const sig = img => { const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 16, 16);
      const d = x.getImageData(0, 0, 16, 16).data, g = []; for (let i = 0; i < d.length; i += 4) g.push(.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]); return g; };
    const ga = sig(A), gb = sig(B);
    const diff = ga.reduce((s, v, i) => s + Math.abs(v - gb[i]), 0) / ga.length;
    const ra = A.width / A.height, rb = B.width / B.height;
    return diff < 22 && Math.abs(ra - rb) < .08;
  } catch (e) { return true; } // helyi (file://) megnyitásnál a böngésző nem engedi az összehasonlítást
}

/* ---------- Idővonal ---------- */
let tlOrder = null;
function vTimeline() {
  app.className = 'v-rz';
  if (S.timelineDone) tlOrder = TIMELINE.map(e => e.id); else if (!tlOrder) tlOrder = [...TL_START];
  const done = S.timelineDone;
  app.innerHTML = `<section class="rz-frame">${backBar('Ügy idővonala')}
    <p class="muted">${done ? 'Az idővonal összeállt.' : 'Tegyétek időrendbe az eseményeket a nyilakkal! A dátumokat az üzenetekben és a jegyzőkönyvben találjátok.'}</p>
    <ol class="tl-list" id="tl">${tlOrder.map(id => { const e = TIMELINE.find(x => x.id === id);
      return `<li class="tl-item ${done ? 'good' : ''}" data-id="${id}"><span class="txt">${done ? `<span class="date">${e.d}</span>` : ''}${esc(e.x)}</span>
      ${done ? '' : '<span class="tl-move"><button data-up aria-label="Feljebb">▲</button><button data-down aria-label="Lejjebb">▼</button></span>'}</li>`; }).join('')}</ol>
    ${done ? '' : '<button class="rz-btn solid" id="tlCheck">SORREND ELLENŐRZÉSE</button>'}
    <div class="tl-res" id="tlRes"></div>
    ${done ? (S.dataRequested ? providerHTML() : '<button class="rz-btn solid" id="req">DISCORD-FIÓK ADATAINAK BEKÉRÉSE</button><div class="terminal" id="term" hidden></div>') : ''}</section>`;
  if (done) {
    const r = $('#req');
    if (r) r.onclick = async () => {
      r.disabled = true; const term = $('#term'); term.hidden = false;
      for (const l of ['> Adatszolgáltatási megkeresés: dani_15', '> Megkeresés továbbítva a szolgáltatónak…', '> Válasz érkezett.']) { await sleep(700); term.textContent += l + '\n'; }
      await sleep(400); S.dataRequested = true; save(); vTimeline(); setTimeout(() => addClue('kor'), 1500);
    };
    return;
  }
  const list = $('#tl');
  const sync = () => { tlOrder = $$('.tl-item', list).map(li => li.dataset.id); $('#tlRes').textContent = ''; };
  $$('[data-up]').forEach(b => b.onclick = () => { const li = b.closest('li'); if (li.previousElementSibling) list.insertBefore(li, li.previousElementSibling); sync(); });
  $$('[data-down]').forEach(b => b.onclick = () => { const li = b.closest('li'); if (li.nextElementSibling) list.insertBefore(li.nextElementSibling, li); sync(); });
  $('#tlCheck').onclick = () => {
    const ok = tlOrder.filter((id, i) => id === TIMELINE[i].id).length;
    if (ok === TIMELINE.length) { S.timelineDone = true; save(); vTimeline(); }
    else $('#tlRes').innerHTML = `<span style="color:var(--rz-bad)">${ok}/${TIMELINE.length} esemény van a helyén. Nézzétek meg újra a dátumokat!</span>`;
  };
}
function providerHTML() {
  return `<div class="provider"><h3>Szolgáltatói adatszolgáltatás – Discord-fiók: dani_15</h3><div class="meta">
    <span>Fiók létrehozása:</span><b>2017.09.12.</b><span>Megadott születési dátum:</span><b>1991.04.03.</b>
    <span>Hitelesített e-mail:</span><b>g.sz••••@••••••.hu</b><span>Kétlépcsős azonosítás:</span><b>bekapcsolva</b>
    <span>Utolsó belépés:</span><b>2025.03.22. 10:01</b></div></div>`;
}

/* ---------- Nyilvántartás ---------- */
let RF = { dist: '', age: '', job: '', dev: '' };
function vRegistry() {
  app.className = 'v-rz';
  if (clueCount() < 4) { app.innerHTML = `<section class="rz-frame">${backBar('Személyi nyilvántartás 🔒')}<p class="muted">Még ${4 - clueCount()} adat hiányzik az elkövetőről.</p></section>`; return; }
  app.innerHTML = `<section class="rz-frame">${backBar('Személyi nyilvántartás')}
    <p class="muted">Írjátok be a profillapra felírt adatokat, majd szűrjetek. Az életkor ${CASE_YEAR}-ös állapot szerint értendő.</p>
    <form id="rf"><div class="fgrid">
      <label>Lakóhely (kerület)<input data-f="dist" value="${esc(RF.dist)}" placeholder="pl. VIII. vagy 8" autocomplete="off"></label>
      <label>Életkor (év)<input data-f="age" value="${esc(RF.age)}" inputmode="numeric" placeholder="pl. 45" autocomplete="off"></label>
      <label>Foglalkozás / munkahely<input data-f="job" value="${esc(RF.job)}" placeholder="pl. szakács" autocomplete="off"></label>
      <label>Használt telefon<input data-f="dev" value="${esc(RF.dev)}" placeholder="pl. iPhone 13" autocomplete="off"></label></div>
      <button class="rz-btn solid" style="margin-top:4px">SZŰRÉS</button>
      <button type="button" class="rz-btn" id="rfClear" style="width:100%;margin-top:8px">SZŰRŐK TÖRLÉSE</button></form>
    <div class="count" id="cnt"></div><div id="people"></div></section>`;
  $('#rf').onsubmit = e => { e.preventDefault(); $$('[data-f]').forEach(i => RF[i.dataset.f] = i.value); renderPeople(); $('#cnt').scrollIntoView({ behavior: 'smooth' }); };
  $('#rfClear').onclick = () => { RF = { dist: '', age: '', job: '', dev: '' }; vRegistry(); };
  renderPeople();
}
function renderPeople() {
  const dq = RF.dist.trim() ? parseDist(RF.dist) : null;
  const res = REGISTRY.filter(p => (dq === null || p.dist === dq) && matchAge(p, RF.age) && matchJob(p, RF.job) && matchDev(p, RF.dev));
  const active = Object.values(RF).some(v => v.trim());
  $('#cnt').innerHTML = `${active ? 'Találatok' : 'Nyilvántartott személyek'}: <b>${res.length}</b> / ${REGISTRY.length}`;
  const ini = n => n.split(' ').map(w => w[0]).join('');
  $('#people').innerHTML = res.map(p => `<button class="person" data-p="${p.id}"><div class="mug">${ini(p.name)}</div><div class="pd">
    <b>${esc(p.name)}</b><small>Szül.: ${p.born} · Budapest, ${ROMAN[p.dist]}. ker.<br>${esc(p.job)} · ${esc(p.dev)}</small>
    <div class="desc">${p.crime ? '⚖ ' + esc(p.crime) : esc(p.look)}</div></div></button>`).join('')
    || '<p class="muted">Nincs találat. Ellenőrizzétek a beírt adatokat!</p>';
  $$('[data-p]').forEach(b => b.onclick = () => showPerson(REGISTRY.find(p => p.id === b.dataset.p)));
}
function showPerson(p) {
  const base = `<span>Név:</span><b>${esc(p.name)}</b><span>Született:</span><b>${p.born} (${ageOf(p)} év, ${CASE_YEAR})</b>
    <span>Lakóhely:</span><b>Budapest, ${ROMAN[p.dist]}. kerület</b><span>Foglalkozás:</span><b>${esc(p.job)}</b><span>Munkahely:</span><b>${esc(p.emp)}</b>
    <span>Használt telefon:</span><b>${esc(p.dev)}</b><span>Személyleírás:</span><b>${esc(p.look || '–')}</b>`;
  if (!p.target) {
    openModal(`<div class="inner"><h2 style="color:var(--rz-accent);margin-top:0">Személyi adatlap</h2><div class="mug big">${p.name.split(' ').map(w => w[0]).join('')}</div>
      <div class="meta">${base}<span>Előélet:</span><b>${p.crime ? esc(p.crime) : 'büntetlen'}</b></div></div>`);
    return;
  }
  const first = !S.solved; S.solved = true; save();
  openModal(`<div class="inner"><div class="found">✓ TALÁLAT – AZONOSÍTOTTÁTOK AZ ELKÖVETŐT</div>
    <h2 style="color:var(--rz-accent);margin-top:0">Személyi adatlap – ${p.id}</h2><div class="mug big">FOTÓ</div>
    <div class="meta">${base}<span>Online fiókok:</span><b>Dani_15 (Roblox), dani_15 (Discord)</b><span>E-mail:</span><b>g.szalai••••@••••••.hu</b></div>
    <div class="verdict"><h4>Kapcsolódó ügy: ${CASE_NO}</h4>
      <p><b>Bűncselekmények:</b> több rendbeli, gyermekkorú sérelmére elkövetett kiskorú veszélyeztetésének bűntette; gyermekpornográfia bűntettének kísérlete (2 rendbeli).</p>
      <p><b>Sértettek:</b> 4 kiskorú – L. Lili, valamint a Blox Kuckó szerveren megkeresett mazsi_12, noe.2011 és kitti.rblx.</p>
      <p><b>Ítélet:</b> 4 év fegyházban végrehajtandó szabadságvesztés; 5 év közügyektől eltiltás; végleges eltiltás minden olyan foglalkozástól, amely kiskorúakkal való kapcsolattal jár.</p>
      <p><b>Jogerős:</b> 2025. november 14. – az ügy lezárva.</p>
      <p><b>Lefoglalt eszközök:</b> Samsung Galaxy S23 mobiltelefon, laptop.</p></div></div>`);
  if (first) toast('Gratulálunk, megoldottátok az ügyet!');
}

const setVh = () => document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
setVh(); window.addEventListener('resize', setVh); window.addEventListener('orientationchange', setVh);
route();
