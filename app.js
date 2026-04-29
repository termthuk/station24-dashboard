/* Station 24 Fitness — Sales Dashboard */

const DEFAULT_BRANCHES = [
  { id: 'sriracha',   name: 'ศรีราชา',     code: 'SR', emoji: '🌊',
    employees: [
      { id: 'EMP-SR01', name: 'สมชาย ใจดี',     position: 'Personal Trainer', photo: '' },
      { id: 'EMP-SR02', name: 'วราภรณ์ ศรีทอง',  position: 'Sale', photo: '' },
      { id: 'EMP-SR03', name: 'ณัฐพล พงศ์ชัย',    position: 'Sale', photo: '' },
    ]},
  { id: 'srisaman',   name: 'ศรีสมาน',     code: 'SS', emoji: '🏙️',
    employees: [
      { id: 'EMP-SS01', name: 'พิมพ์ใจ รุ่งเรือง', position: 'Sale', photo: '' },
      { id: 'EMP-SS02', name: 'ธีระ วิทยา',       position: 'Personal Trainer', photo: '' },
      { id: 'EMP-SS03', name: 'กิตติ อนันต์',     position: 'Sale', photo: '' },
    ]},
  { id: 'srinakarin', name: 'ศรีนครินทร์', code: 'SN', emoji: '🌆',
    employees: [
      { id: 'EMP-SN01', name: 'ปิยะ ภักดี',      position: 'Sale', photo: '' },
      { id: 'EMP-SN02', name: 'ชนิดา มงคล',     position: 'Personal Trainer', photo: '' },
      { id: 'EMP-SN03', name: 'อัญชลี สวัสดี',   position: 'Sale', photo: '' },
    ]},
];

const SEED_DAILY = {
  sriracha: {
    'EMP-SR01': { '2026-04-20':{pt:5000,member:2000,plan:1500},'2026-04-21':{pt:6000,member:0,plan:2000},'2026-04-22':{pt:3500,member:3000,plan:1000} },
    'EMP-SR02': { '2026-04-20':{pt:0,member:8000,plan:2500},'2026-04-21':{pt:0,member:4500,plan:1500},'2026-04-22':{pt:0,member:6000,plan:3000} },
    'EMP-SR03': { '2026-04-20':{pt:0,member:3500,plan:1000},'2026-04-22':{pt:0,member:5500,plan:2000} }
  },
  srisaman: {
    'EMP-SS01': { '2026-04-20':{pt:0,member:12000,plan:3500},'2026-04-21':{pt:0,member:9500,plan:2500} },
    'EMP-SS02': { '2026-04-20':{pt:7000,member:0,plan:1500},'2026-04-21':{pt:4500,member:1500,plan:2000} },
  },
  srinakarin: {
    'EMP-SN01': { '2026-04-20':{pt:0,member:7500,plan:2000} },
    'EMP-SN02': { '2026-04-20':{pt:6500,member:0,plan:1500},'2026-04-21':{pt:5000,member:0,plan:2500} },
  },
};

const STORAGE_BRANCHES = 'station24_branches_v2';
const STORAGE_DAILY = 'station24_daily_v1';
const STORAGE_LOG = 'station24_sales_log_v1';
const STORAGE_COLORS = 'station24_chart_colors_v2';
const STORAGE_BRANCH_COLORS = 'station24_branch_colors_v1';
const STORAGE_USERS = 'station24_users_v1';
const STORAGE_SESSION = 'station24_session_v1';
const STORAGE_VIEW = 'station24_last_view_v1';
const STORAGE_POSITIONS = 'station24_positions_v1';
const DEFAULT_BRANCH_PALETTE = ['#DC2626', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#DB2777'];
const DAILY_QUOTA = 5000;
const KPI_LINES = [
  { value: 85000,  color: '#DC2626', label: '' },
  { value: 150000, color: '#16A34A', label: '' },
];
const KPI_THRESHOLD_MAX = Math.max.apply(null, KPI_LINES.map(k => k.value));
// Per-bar color based on KPI tier achievement
const KPI_TIER_COLORS = { red: '#DC2626', yellow: '#EAB308', green: '#16A34A' };
function kpiBarColor(v) {
  v = +v || 0;
  if (v >= 150000) return KPI_TIER_COLORS.green;
  if (v >= 85000)  return KPI_TIER_COLORS.yellow;
  return KPI_TIER_COLORS.red;
}

// 3-branch comparison chart: branch → "team" mapping (A/B/C)
const THREE_BRANCH_TEAMS = [
  { id: 'srinakarin', team: 'A', emoji: '🅰', label: 'ทีม A · ศรีนครินทร์', cardBg: '#FEF3C7', cardBorder: '#F59E0B', color: '#92400E', zoneRgba: 'rgba(245,158,11,0.08)' },
  { id: 'sriracha',   team: 'B', emoji: '🅱', label: 'ทีม B · ศรีราชา',     cardBg: '#DBEAFE', cardBorder: '#2563EB', color: '#1E40AF', zoneRgba: 'rgba(37,99,235,0.08)'  },
  { id: 'srisaman',   team: 'C', emoji: '🅲', label: 'ทีม C · ศรีสมาน',     cardBg: '#D1FAE5', cardBorder: '#16A34A', color: '#065F46', zoneRgba: 'rgba(22,163,74,0.08)'  },
];

// CHART_COLORS = bar colors for the 3-branch comparison chart
//   a = ศรีนครินทร์ (THREE_BRANCH_TEAMS[0])
//   b = ศรีราชา     (THREE_BRANCH_TEAMS[1])
//   c = ศรีสมาน    (THREE_BRANCH_TEAMS[2])
const PLAN_BAR_COLOR = '#9CA3AF';
const DEFAULT_CHART_COLORS = { a: '#F59E0B', b: '#2563EB', c: '#16A34A' };
const CHART_COLOR_PRESETS = [
  { id: 'default', name: 'มาตรฐาน (เหลือง-น้ำเงิน-เขียว)', a: '#F59E0B', b: '#2563EB', c: '#16A34A' },
  { id: 'station', name: 'แดง-ดำ-ส้ม (Station 24)',        a: '#DC2626', b: '#1F1F1F', c: '#D97706' },
  { id: 'ocean',   name: 'ฟ้า-น้ำเงิน-คราม',                a: '#0EA5E9', b: '#1E40AF', c: '#6366F1' },
  { id: 'forest',  name: 'เขียว-มะกอก-เขียวเข้ม',           a: '#16A34A', b: '#065F46', c: '#84CC16' },
  { id: 'sunset',  name: 'ส้ม-ชมพู-ม่วง',                   a: '#F97316', b: '#EC4899', c: '#9333EA' },
  { id: 'mono',    name: 'ขาว-ดำ (Monochrome)',             a: '#111827', b: '#6B7280', c: '#D1D5DB' },
  { id: 'candy',   name: 'พาสเทลหวาน',                      a: '#F472B6', b: '#60A5FA', c: '#FBBF24' },
  { id: 'neon',    name: 'นีออน',                           a: '#EF4444', b: '#06B6D4', c: '#A855F7' },
];

// ===== Supabase cloud sync =====
const SUPABASE_URL = 'https://qabbbdcllvkpqlppswkw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYmJiZGNsbHZrcHFscHBzd2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzQ0MDEsImV4cCI6MjA5MjgxMDQwMX0.2fIr_sRUFFlxNRiK4bcD3DTiWNdL8HxO106hYttunDc';
const SYNC_KEYS = [
  'station24_branches_v2',
  'station24_daily_v1',
  'station24_sales_log_v1',
  'station24_chart_colors_v2',
  'station24_branch_colors_v1',
  'station24_users_v1',
  'station24_positions_v1'
];
let supabaseClient = null;
let _suppressSync = false;
let _pendingPush = {};
let _pushTimer = null;

// === Thai timezone helpers (Asia/Bangkok, UTC+7) ===
// Use these everywhere "today" matters, so the dashboard agrees with Thailand's
// calendar regardless of the device timezone (e.g. avoids the 00:00–07:00 gap
// when toISOString() would still report yesterday's UTC date).
function todayBKK() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
}
function nowBKK() {
  // Returns a Date whose LOCAL fields (getFullYear/getMonth/getDate/getHours/getMinutes)
  // reflect Bangkok wall-clock time. Safe for calendar arithmetic via setDate/getDate;
  // do NOT use .getTime()/UTC fields — those won't match real time.
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t).value;
  return new Date(+g('year'), +g('month')-1, +g('day'), +g('hour'), +g('minute'), +g('second'));
}

function loadJSON(key, fb) { try { const r = localStorage.getItem(key); if (r) return JSON.parse(r); } catch(e){} return JSON.parse(JSON.stringify(fb)); }
function saveJSON(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch(e){}
  if (!_suppressSync && supabaseClient && SYNC_KEYS.indexOf(key) >= 0) {
    _pendingPush[key] = v;
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(flushPush, 250);
  }
}
function flushPush() {
  if (!supabaseClient) return;
  const rows = Object.keys(_pendingPush).map(k => ({ key: k, value: _pendingPush[k], updated_at: new Date().toISOString() }));
  _pendingPush = {};
  if (!rows.length) return;
  supabaseClient.from('app_state').upsert(rows).then(r => {
    if (r.error) console.warn('☁ sync fail:', r.error.message);
  });
}
function saveBranches() { saveJSON(STORAGE_BRANCHES, BRANCHES); }
function saveDaily()    { saveJSON(STORAGE_DAILY, DAILY); }
function saveLog()      { saveJSON(STORAGE_LOG, LOG); }
function nowHHMM() {
  const d = nowBKK(); const p = n => String(n).padStart(2,'0');
  return p(d.getHours()) + ':' + p(d.getMinutes());
}
function logSale(bid, eid, date, pt, m, pl, train) {
  LOG.push({ id: 'L' + Date.now() + Math.random().toString(36).slice(2,7),
    branchId: bid, empId: eid, date: date, time: nowHHMM(),
    pt: +pt || 0, member: +m || 0, plan: +pl || 0, train: +train || 0 });
  saveLog();
}

let BRANCHES = loadJSON(STORAGE_BRANCHES, DEFAULT_BRANCHES);
let DAILY    = loadJSON(STORAGE_DAILY, SEED_DAILY);
let LOG      = loadJSON(STORAGE_LOG, []);
// One-time backfill: reconstruct LOG entries from any pre-existing DAILY data
if (LOG.length === 0) {
  for (const bid in DAILY) {
    for (const eid in DAILY[bid] || {}) {
      for (const date in DAILY[bid][eid] || {}) {
        const e = DAILY[bid][eid][date] || {};
        const pt = +e.pt || 0, m = +e.member || 0, pl = +e.plan || 0;
        if (pt || m || pl) {
          LOG.push({ id: 'L' + date + '-' + eid, branchId: bid, empId: eid, date: date, time: '00:00', pt: pt, member: m, plan: pl });
        }
      }
    }
  }
  if (LOG.length) saveJSON(STORAGE_LOG, LOG);
}
let CHART_COLORS = loadJSON(STORAGE_COLORS, DEFAULT_CHART_COLORS);
(function normalizeColors(){
  ['a','b','c'].forEach(k => { if (!CHART_COLORS[k]) CHART_COLORS[k] = DEFAULT_CHART_COLORS[k]; });
})();
function saveChartColors() { saveJSON(STORAGE_COLORS, CHART_COLORS); }

// ===== Employee positions (admin-managed) =====
const DEFAULT_POSITIONS = [
  { name: 'Personal Trainer', icon: '💪', short: 'PT', hasTraining: true },
  { name: 'Sale', icon: '💼', short: 'Sale', hasTraining: false }
];
let POSITIONS = loadJSON(STORAGE_POSITIONS, DEFAULT_POSITIONS);
function savePositions() { saveJSON(STORAGE_POSITIONS, POSITIONS); }
function getPos(name) { return POSITIONS.find(p => p.name === name); }
function posIcon(name) { const p = getPos(name); return p ? p.icon : '💼'; }
function posShort(name) { const p = getPos(name); return p ? (p.short || p.name) : (name || 'Sale'); }
function isPosPT(name) { const p = getPos(name); return p ? !!p.hasTraining : (name === 'Personal Trainer'); }
function posChipClass(name) { return isPosPT(name) ? 'pt-pos' : 'sale-pos'; }
function posOptionsHTML(currentValue, useShort) {
  return POSITIONS.map(p => {
    const label = p.icon + ' ' + (useShort ? (p.short || p.name) : p.name);
    return '<option value="' + p.name + '"' + (p.name === currentValue ? ' selected' : '') + '>' + label + '</option>';
  }).join('');
}

// chartjs-plugin-datalabels: register globally + sensible defaults so every chart shows numbers
if (typeof Chart !== 'undefined') {
  if (typeof ChartDataLabels !== 'undefined') {
    try { Chart.register(ChartDataLabels); } catch(e) {}
  }
  Chart.defaults.set('plugins.datalabels', {
    display: ctx => {
      const v = ctx.dataset.data[ctx.dataIndex];
      const n = typeof v === 'object' && v !== null ? v.y : v;
      return typeof n === 'number' && n > 0;
    },
    color: '#1F1F1F',
    font: { size: 10, weight: 700 },
    anchor: ctx => ctx.chart.options.indexAxis === 'y' ? 'end' : 'end',
    align:  ctx => ctx.chart.options.indexAxis === 'y' ? 'right' : 'top',
    offset: 4,
    clamp: true,
    formatter: v => {
      const n = typeof v === 'object' && v !== null ? v.y : v;
      if (typeof n !== 'number' || !n) return '';
      return '฿' + (typeof fmtShort === 'function' ? fmtShort(n) : n);
    }
  });
}

let BRANCH_COLORS = loadJSON(STORAGE_BRANCH_COLORS, {});
function branchColor(bid) {
  if (BRANCH_COLORS[bid]) return BRANCH_COLORS[bid];
  const idx = BRANCHES.findIndex(b => b.id === bid);
  return DEFAULT_BRANCH_PALETTE[(idx >= 0 ? idx : 0) % DEFAULT_BRANCH_PALETTE.length];
}
function setBranchColor(bid, hex) { BRANCH_COLORS[bid] = hex; saveJSON(STORAGE_BRANCH_COLORS, BRANCH_COLORS); }
function resetBranchColors() { BRANCH_COLORS = {}; saveJSON(STORAGE_BRANCH_COLORS, BRANCH_COLORS); }

// ===== Auth / Users =====
const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', branchId: null, displayName: 'ผู้ดูแลระบบ' }
];
let USERS = loadJSON(STORAGE_USERS, DEFAULT_USERS);
if (!USERS.some(u => u.role === 'admin')) USERS.unshift(DEFAULT_USERS[0]);
function saveUsers() { saveJSON(STORAGE_USERS, USERS); }

let currentUser = null;
function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_SESSION) || 'null');
    if (s && s.username) {
      const u = USERS.find(x => x.username === s.username);
      if (u) currentUser = u;
    }
  } catch(e){}
}
function saveSession() {
  if (currentUser) localStorage.setItem(STORAGE_SESSION, JSON.stringify({ username: currentUser.username }));
  else localStorage.removeItem(STORAGE_SESSION);
}
function login(username, password) {
  const u = USERS.find(x => x.username === username && x.password === password);
  if (!u) return false;
  currentUser = u; saveSession(); return true;
}
function logout() { currentUser = null; saveSession(); }
function isAdmin() { return currentUser && currentUser.role === 'admin'; }
function isEditor() { return currentUser && currentUser.role === 'editor'; }
function isViewer() { return currentUser && currentUser.role === 'viewer'; }
function canSeeBranch(bid) { return isAdmin() || isViewer() || (isEditor() && currentUser.branchId === bid); }
function canEditBranch(bid) { return isAdmin() || (isEditor() && currentUser.branchId === bid); }
function canManage() { return isAdmin() || isEditor(); }

function normalizeData() {
  BRANCHES.forEach(b => b.employees.forEach(e => { if (!e.position) e.position = 'Sale'; if (!('photo' in e)) e.photo = ''; if (!e.team) e.team = 'A'; }));
  BRANCHES.forEach(b => { if (!DAILY[b.id]) DAILY[b.id] = {}; });
}
normalizeData();

let currentView = 'branch';
let activeBranch = 'sriracha';
let globalBranchFilter = ''; // '' = ทุกสาขา, otherwise branch.id

function filteredBranches() {
  if (isEditor() && currentUser && currentUser.branchId) return BRANCHES.filter(b => b.id === currentUser.branchId);
  if (!globalBranchFilter) return BRANCHES;
  const found = BRANCHES.filter(b => b.id === globalBranchFilter);
  return found.length ? found : BRANCHES;
}
let activeEmployee = null;
let activeDailyEmp = null;
let activeEditEmp = null;
let editEmpPhotoBase64 = '';
let empMiniCharts = {};
let indivChart = null;
let indivTotalChart = null;

const AVATAR_COLORS = [
  'linear-gradient(135deg,#DC2626,#991B1B)','linear-gradient(135deg,#1F1F1F,#4B5563)',
  'linear-gradient(135deg,#B91C1C,#7F1D1D)','linear-gradient(135deg,#374151,#1F2937)',
  'linear-gradient(135deg,#DC2626,#1F1F1F)','linear-gradient(135deg,#991B1B,#4B5563)',
  'linear-gradient(135deg,#EF4444,#DC2626)',
];

const fmt0 = n => new Intl.NumberFormat('th-TH').format(Math.round(n || 0));
const fmtInt = n => new Intl.NumberFormat('th-TH').format(n || 0);
const fmtShort = n => { n = +n || 0; if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'')+'M'; if (n >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'')+'K'; return n.toLocaleString('th-TH'); };

function getBranch(id) { return BRANCHES.find(b => b.id === id); }
function empById(id)   { for (const b of BRANCHES) for (const e of b.employees) if (e.id === id) return e; return null; }
function empName(id)   { const e = empById(id); return e ? e.name : id; }
function newEmpId(branchId) {
  const br = getBranch(branchId); const prefix = 'EMP-' + br.code; let max = 0;
  br.employees.forEach(e => { const m = e.id.match(new RegExp('^'+prefix+'(\\d+)$')); if (m) max = Math.max(max, +m[1]); });
  return prefix + String(max + 1).padStart(2, '0');
}
function avatarInitials(name) {
  const c = (name || '').trim().replace(/\s+/g, ' '); const p = c.split(' ');
  return p.length >= 2 ? p[0].slice(0,1) + p[1].slice(0,1) : c.slice(0,2);
}
function avatarColor(s) {
  let h = 0; for (const c of (s || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function avatarHTML(e, cls) {
  cls = cls || 'emp-avatar';
  const imgCls = cls === 'emp-avatar' ? 'emp-avatar-img'
              : cls === 'emp-mini-avatar' ? 'emp-mini-avatar-img'
              : cls === 'ranking-avatar' ? 'ranking-avatar-img'
              : 'top-emp-avatar-img';
  if (e.photo) return '<img class="' + imgCls + '" src="' + e.photo + '" alt="">';
  return '<div class="' + cls + '" style="background:' + avatarColor(e.id) + '">' + avatarInitials(e.name) + '</div>';
}

// Cumulative monthly KPI: starts at DAILY_QUOTA on day 1, +DAILY_QUOTA every day,
// caps at 30 × DAILY_QUOTA, resets on the 1st of each month.
function monthlyKPITarget(dateStr) {
  const day = parseInt(dateStr.slice(8, 10), 10) || 1;
  return Math.min(day, 30) * DAILY_QUOTA;
}
function empMTDPTMem(bid, eid, asOfDate) {
  const entries = (DAILY[bid] && DAILY[bid][eid]) || {};
  const mk = asOfDate.slice(0, 7);
  let pt = 0, mem = 0;
  for (const d in entries) {
    if (d.slice(0, 7) !== mk) continue;
    if (d > asOfDate) continue;
    pt += +entries[d].pt || 0;
    mem += +entries[d].member || 0;
  }
  return pt + mem;
}

function empDailyTotals(bid, eid) {
  const entries = DAILY[bid] && DAILY[bid][eid] ? DAILY[bid][eid] : {};
  let pt=0, member=0, plan=0, train=0, days=0;
  for (const d in entries) {
    pt += +entries[d].pt||0; member += +entries[d].member||0; plan += +entries[d].plan||0;
    train += +entries[d].train||0;
    days++;
  }
  return { pt, member, plan, train, days, total: pt+member+plan };
}
function branchDailyTotals(bid) {
  const br = getBranch(bid); let pt=0, member=0, plan=0;
  br.employees.forEach(e => { const t = empDailyTotals(bid, e.id); pt += t.pt; member += t.member; plan += t.plan; });
  return { pt, member, plan, total: pt+member+plan };
}

function compressImage(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = c.height = 240;
        const x = c.getContext('2d'); const md = Math.min(img.width, img.height);
        x.drawImage(img, (img.width-md)/2, (img.height-md)/2, md, md, 0, 0, 240, 240);
        res(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = rej; img.src = e.target.result;
    };
    r.onerror = rej; r.readAsDataURL(file);
  });
}

function setView(v) {
  currentView = v;
  if(document.getElementById('branchView'))document.getElementById('branchView').style.display = v === 'branch' ? 'block' : 'none';
  if(document.getElementById('overviewView'))document.getElementById('overviewView').style.display = v === 'overview' ? 'block' : 'none';
  if(document.getElementById('recordSalesView'))document.getElementById('recordSalesView').style.display = v === 'recordsales' ? 'block' : 'none';
  if(document.getElementById('summaryChartView'))document.getElementById('summaryChartView').style.display = v === 'summarychart' ? 'block' : 'none';
  if(document.getElementById('yearSalesView'))document.getElementById('yearSalesView').style.display = v === 'yearsales' ? 'block' : 'none';
  if(document.getElementById('yearTrainView'))document.getElementById('yearTrainView').style.display = v === 'yeartrain' ? 'block' : 'none';
  if(document.getElementById('historyView'))document.getElementById('historyView').style.display = v === 'history' ? 'block' : 'none';
  if(document.getElementById('rankingView'))document.getElementById('rankingView').style.display = v === 'ranking' ? 'block' : 'none';
  if(document.getElementById('rankingAllView'))document.getElementById('rankingAllView').style.display = v === 'rankingall' ? 'block' : 'none';
  if(document.getElementById('rankingTrainerView'))document.getElementById('rankingTrainerView').style.display = v === 'rankingtrainer' ? 'block' : 'none';
  if(document.getElementById('usersView'))document.getElementById('usersView').style.display = v === 'users' ? 'block' : 'none';
  if(document.getElementById('branchListSection'))document.getElementById('branchListSection').style.display = 'block';
  // Editors are restricted to their branch view only
  if (isEditor() && v !== 'branch') {
    activeBranch = currentUser.branchId;
    v = 'branch';
    currentView = v;
    if(document.getElementById('branchView'))document.getElementById('branchView').style.display = 'block';
    ['overviewView','recordSalesView','summaryChartView','yearSalesView','yearTrainView','historyView','rankingView','rankingAllView','rankingTrainerView','usersView'].forEach(id => {
      const el = document.getElementById(id); if (el) el.style.display = 'none';
    });
  }
  // Non-admin trying to access users view → redirect to overview
  if (v === 'users' && !isAdmin()) { setView('overview'); return; }
  try { localStorage.setItem(STORAGE_VIEW, JSON.stringify({ view: v, branchId: activeBranch })); } catch(e){}
  renderMenuNav();
  if (v === 'branch') renderBranchView();
  else if (v === 'overview') renderOverviewView();
  else if (v === 'recordsales') renderRecordSalesView();
  else if (v === 'summarychart') renderSummaryChartView();
  else if (v === 'yearsales') renderYearSalesView();
  else if (v === 'yeartrain') renderYearTrainView();
  else if (v === 'history') renderHistoryView();
  else if (v === 'ranking') renderRankingView();
  else if (v === 'rankingall') renderRankingAllView();
  else if (v === 'rankingtrainer') renderRankingTrainerView();
  else if (v === 'users') renderUsersView();
}

function renderMenuNav() {
  const nav = document.getElementById('menuNav');
  if (!nav) return;
  if (isEditor()) {
    // Editor sees only their branch view — no menu items
    nav.innerHTML = '';
    nav.style.display = 'none';
    return;
  }
  nav.style.display = '';
  let html =
    '<button class="menu-item ' + (currentView==='overview'?'active':'') + '" data-view="overview"><span class="menu-item-icon">📊</span><span>ภาพรวม</span></button>' +
    '<button class="menu-item ' + (currentView==='summarychart'?'active':'') + '" data-view="summarychart"><span class="menu-item-icon">📊</span><span>กราฟสรุปยอดขาย</span></button>' +
    '<button class="menu-item ' + (currentView==='ranking'?'active':'') + '" data-view="ranking"><span class="menu-item-icon">🏆</span><span>จัดอันดับยอดขาย</span></button>' +
    '<button class="menu-item ' + (currentView==='rankingtrainer'?'active':'') + '" data-view="rankingtrainer"><span class="menu-item-icon">🏋</span><span>จัดอันดับเทรนเนอร์</span></button>' +
    '<button class="menu-item ' + (currentView==='history'?'active':'') + '" data-view="history"><span class="menu-item-icon">📅</span><span>ประวัติการขาย</span></button>';
  if (isAdmin()) {
    html += '<button class="menu-item ' + (currentView==='users'?'active':'') + '" data-view="users"><span class="menu-item-icon">👥</span><span>จัดการผู้ใช้/สาขา</span></button>';
  }
  // Cumulative / all-branch ranking group — bottom of menu
  html +=
    '<button class="menu-item ' + (currentView==='yearsales'?'active':'') + '" data-view="yearsales"><span class="menu-item-icon">📅</span><span>ยอดขายสะสม 1 ปี</span></button>' +
    '<button class="menu-item ' + (currentView==='yeartrain'?'active':'') + '" data-view="yeartrain"><span class="menu-item-icon">🏋</span><span>ยอดเทรนสะสม 1 ปี</span></button>' +
    '<button class="menu-item ' + (currentView==='rankingall'?'active':'') + '" data-view="rankingall"><span class="menu-item-icon">🏅</span><span>จัดอันดับพนักงานทุกสาขา</span></button>';
  nav.innerHTML = html;
  nav.querySelectorAll('.menu-item').forEach(b => b.onclick = () => setView(b.dataset.view));
}

function renderSidebar() {
  const visibleBranches = BRANCHES.filter(b => canSeeBranch(b.id));
  // Global branch filter (hidden for editors, who are pinned to one branch)
  const filterSec = document.getElementById('globalFilterSection');
  const filterSel = document.getElementById('globalBranchFilter');
  if (filterSec && filterSel) {
    if (isEditor()) {
      filterSec.style.display = 'none';
    } else {
      filterSec.style.display = 'block';
      const cur = globalBranchFilter;
      filterSel.innerHTML = '<option value="">🏢 ทุกสาขา</option>' +
        visibleBranches.map(b => '<option value="' + b.id + '">' + b.emoji + ' สาขา' + b.name + '</option>').join('');
      filterSel.value = cur;
      if (!filterSel.dataset.bound) {
        filterSel.dataset.bound = '1';
        filterSel.onchange = () => {
          globalBranchFilter = filterSel.value;
          reRenderCurrentView();
        };
      }
    }
  }
  const addSec = document.getElementById('addBranchSection');
  if (addSec) addSec.style.display = isAdmin() ? 'block' : 'none';
  if (isAdmin()) {
    const tBtn = document.getElementById('toggleAddBranchBtn');
    const panel = document.getElementById('addBranchPanel');
    if (tBtn && !tBtn.dataset.bound) {
      tBtn.dataset.bound = '1';
      tBtn.onclick = () => {
        const open = panel.style.display !== 'none';
        panel.style.display = open ? 'none' : 'block';
        tBtn.textContent = open ? '➕ เพิ่มสาขา' : '✕ ปิด';
      };
    }
    const addBtn = document.getElementById('sbAddBranchBtn');
    if (addBtn && !addBtn.dataset.bound) {
      addBtn.dataset.bound = '1';
      addBtn.onclick = () => {
        const emoji = (document.getElementById('sbBranchEmoji').value || '').trim() || '🏢';
        const code = (document.getElementById('sbBranchCode').value || '').trim().toUpperCase();
        const name = (document.getElementById('sbBranchName').value || '').trim();
        if (!code || !name) { showToast('⚠ กรอกรหัสและชื่อสาขา', true); return; }
        if (BRANCHES.some(b => b.code === code || b.id === 'br-' + code.toLowerCase())) { showToast('⚠ รหัสซ้ำ', true); return; }
        const bid = 'br-' + code.toLowerCase();
        BRANCHES.push({ id: bid, code: code, name: name, emoji: emoji, employees: [] });
        DAILY[bid] = {};
        saveBranches(); saveDaily();
        document.getElementById('sbBranchEmoji').value = '';
        document.getElementById('sbBranchCode').value = '';
        document.getElementById('sbBranchName').value = '';
        panel.style.display = 'none';
        document.getElementById('toggleAddBranchBtn').textContent = '➕ เพิ่มสาขา';
        activeBranch = bid;
        setView('branch');
        showToast('✓ เพิ่มสาขา ' + name);
      };
    }
  }
  if(document.getElementById('branchNav'))document.getElementById('branchNav').innerHTML = visibleBranches.map(b => {
    const t = branchDailyTotals(b.id);
    return '<button class="branch-item ' + (b.id===activeBranch?'active':'') + '" data-id="' + b.id + '">' +
      '<span class="branch-item-icon">' + b.emoji + '</span>' +
      '<span class="branch-item-body">' +
      '<span class="branch-item-name">สาขา' + b.name + '</span>' +
      '<span class="branch-item-sub">' + b.code + ' · ฿' + fmtShort(t.total) + ' · ' + b.employees.length + ' คน</span>' +
      '</span></button>';
  }).join('');
  document.querySelectorAll('#branchNav .branch-item').forEach(btn => btn.onclick = () => {
    activeBranch = btn.dataset.id; activeEmployee = null;
    if (document.getElementById('sidebar')) document.getElementById('sidebar').classList.remove('open');
    if (document.getElementById('sidebarBackdrop')) document.getElementById('sidebarBackdrop').classList.remove('show');
    setView('branch');
  });
}

function renderMainTitle() {
  const br = getBranch(activeBranch);
  if(document.getElementById('mainBranchEmoji'))document.getElementById('mainBranchEmoji').textContent = br.emoji;
  if(document.getElementById('mainBranchName'))document.getElementById('mainBranchName').textContent = br.name;
  const banner = document.getElementById('empFilterBanner');
  if (activeEmployee) {
    if(document.getElementById('empFilterName'))document.getElementById('empFilterName').textContent = empName(activeEmployee);
    banner.style.display = 'flex';
  } else banner.style.display = 'none';
}

function renderKPIs() {
  const bd = activeEmployee ? empDailyTotals(activeBranch, activeEmployee) : branchDailyTotals(activeBranch);
  const scope = activeEmployee ? empName(activeEmployee) : getBranch(activeBranch).name;
  if(document.getElementById('kpiGrid'))document.getElementById('kpiGrid').innerHTML =
    '<div class="kpi-card pt"><div class="kpi-icon">💪</div><div class="kpi-label">ยอดขาย PT (' + scope + ')</div><div class="kpi-value">฿' + fmt0(bd.pt) + '</div><div class="kpi-sub">Personal Trainer</div></div>' +
    '<div class="kpi-card member"><div class="kpi-icon">🎫</div><div class="kpi-label">ยอดขาย MEMBER</div><div class="kpi-value">฿' + fmt0(bd.member) + '</div><div class="kpi-sub">Membership</div></div>' +
    '<div class="kpi-card plan"><div class="kpi-icon">📋</div><div class="kpi-label">ยอด Plan SETUP</div><div class="kpi-value">฿' + fmt0(bd.plan) + '</div><div class="kpi-sub">Plan setup</div></div>' +
    '<div class="kpi-card total"><div class="kpi-icon">💰</div><div class="kpi-label">รวม 3 หมวด</div><div class="kpi-value">฿' + fmt0(bd.total) + '</div><div class="kpi-sub">PT + MEMBER + PLAN</div></div>';
}

function renderEmployeeCards() {
  const branch = getBranch(activeBranch);
  const grid = document.getElementById('employeesGrid');
  const stats = {}; let maxTotal = 0;
  branch.employees.forEach(e => { const t = empDailyTotals(activeBranch, e.id); stats[e.id] = t; if (t.total > maxTotal) maxTotal = t.total; });
  if (!branch.employees.length) { grid.innerHTML = '<div class="emp-card empty-state-card">ยังไม่มีพนักงาน — กด "⚙️ จัดการพนักงาน"</div>'; return; }

  grid.innerHTML = branch.employees.map(e => {
    const s = stats[e.id]; const pct = maxTotal ? Math.round(s.total/maxTotal*100) : 0;
    const top = maxTotal > 0 && s.total === maxTotal && s.total > 0;
    const pos = e.position || 'Sale'; const pc = posChipClass(pos);
    const pi = posIcon(pos);
    return '<div class="emp-card ' + (top?'top-seller':'') + '" data-emp-id="' + e.id + '">' +
      '<span class="emp-card-rank">🏆 TOP</span>' +
      '<button class="emp-card-edit" data-emp-edit="' + e.id + '" title="แก้ไข">✎</button>' +
      '<button class="emp-card-delete" data-emp-del="' + e.id + '" title="ลบ">✕</button>' +
      '<div class="emp-card-header">' + avatarHTML(e) +
      '<div class="emp-card-info"><div class="emp-card-name">' + e.name + '</div>' +
      '<div class="emp-card-position ' + pc + '">' + pi + ' ' + pos + '</div>' +
      '<div class="emp-card-id">' + e.id + '</div></div></div>' +
      '<div class="emp-card-categories">' +
      '<div class="emp-cat pt"><div class="emp-cat-label">💪 PT</div><div class="emp-cat-value">฿' + fmtShort(s.pt) + '</div></div>' +
      '<div class="emp-cat member"><div class="emp-cat-label">🎫 MEMBER</div><div class="emp-cat-value">฿' + fmtShort(s.member) + '</div></div>' +
      '<div class="emp-cat plan"><div class="emp-cat-label">📋 PLAN</div><div class="emp-cat-value">฿' + fmtShort(s.plan) + '</div></div></div>' +
      '<div class="emp-card-total"><span class="emp-card-total-label">รวม ' + s.days + ' วัน</span>' +
      '<span class="emp-card-total-value">฿' + fmt0(s.total) + '</span></div>' +
      '<div class="emp-card-bar-wrap"><div class="emp-card-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="emp-card-actions">' +
      '<button type="button" class="emp-card-btn primary" data-emp-daily="' + e.id + '">+ ยอดรายวัน</button>' +
      '</div></div>';
  }).join('');

  grid.querySelectorAll('[data-emp-daily]').forEach(b => b.onclick = e => { e.stopPropagation(); openDailyModal(b.dataset.empDaily); });
  grid.querySelectorAll('[data-emp-edit]').forEach(b => b.onclick = e => { e.stopPropagation(); openEditEmpModal(b.dataset.empEdit); });
  grid.querySelectorAll('[data-emp-del]').forEach(b => b.onclick = e => {
    e.stopPropagation(); const id = b.dataset.empDel; const name = empName(id);
    if (confirm('ลบพนักงาน "' + name + '"?')) {
      const br = getBranch(activeBranch); br.employees = br.employees.filter(x => x.id !== id);
      saveBranches(); if (activeEmployee === id) activeEmployee = null;
      renderBranchView(); showToast('🗑 ลบ ' + name);
    }
  });
}

function renderEmpMiniCharts() {
  const br = getBranch(activeBranch);
  const grid = document.getElementById('empChartsGrid');
  if (!grid) return;
  Object.values(empMiniCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  empMiniCharts = {};
  if (!br.employees.length) { grid.innerHTML = '<div class="empty-state">ไม่มีพนักงานในสาขานี้</div>'; return; }
  grid.innerHTML = br.employees.map(e => {
    const t = empDailyTotals(activeBranch, e.id);
    const av = e.photo ? '<img class="emp-mini-avatar-img" src="' + e.photo + '">' : '<div class="emp-mini-avatar" style="background:' + avatarColor(e.id) + '">' + avatarInitials(e.name) + '</div>';
    const pos = e.position || 'Sale'; const pi = posIcon(pos);
    return '<div class="emp-mini-chart-card">' +
      '<div class="emp-mini-chart-header">' + av +
      '<div class="emp-mini-chart-info"><div class="emp-mini-chart-name">' + e.name + '</div>' +
      '<div class="emp-mini-chart-pos">' + pi + ' ' + pos + ' · ' + e.id + '</div></div></div>' +
      '<div class="emp-mini-chart-stats">' +
      '<div class="emp-mini-stat-block total"><div class="emp-mini-stat-label">💰 ยอดขายรวม</div><div class="emp-mini-stat-value">฿' + fmt0(t.total) + '</div></div>' +
      '<div class="emp-mini-stat-block setup"><div class="emp-mini-stat-label">📋 Plan Setup</div><div class="emp-mini-stat-value">฿' + fmt0(t.plan) + '</div></div></div>' +
      '<div class="emp-mini-chart-wrap" id="emp-mini-wrap-' + e.id + '"><canvas id="empMiniChart_' + e.id + '"></canvas></div></div>';
  }).join('');
  br.employees.forEach(e => {
    const entries = (DAILY[activeBranch] && DAILY[activeBranch][e.id]) || {};
    const dates = Object.keys(entries).sort();
    const wrap = document.getElementById('emp-mini-wrap-' + e.id);
    if (!dates.length) { if (wrap) wrap.innerHTML = '<div class="emp-mini-chart-empty">ยังไม่มีข้อมูลรายวัน</div>'; return; }
    const totalData = dates.map(d => (+entries[d].pt||0) + (+entries[d].member||0) + (+entries[d].plan||0));
    const planData = dates.map(d => +entries[d].plan || 0);
    const ctx = document.getElementById('empMiniChart_' + e.id); if (!ctx) return;
    empMiniCharts[e.id] = new Chart(ctx, {
      type: 'line',
      data: { labels: dates.map(d => d.slice(5)), datasets: [
        { label: '💰 ยอดขายรวม', data: totalData, borderColor: '#DC2626', backgroundColor: 'rgba(220,38,38,0.12)', borderWidth: 2.5, fill: true, tension: 0.3, pointBackgroundColor: '#DC2626', pointRadius: 3, pointHoverRadius: 5 },
        { label: '📋 Plan Setup', data: planData, borderColor: '#D97706', backgroundColor: 'rgba(217,119,6,0.12)', borderWidth: 2.5, fill: true, tension: 0.3, pointBackgroundColor: '#D97706', pointRadius: 3, pointHoverRadius: 5, borderDash: [4, 3] }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        layout: { padding: { top: 18 } },
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 6, boxWidth: 12 } },
          tooltip: { callbacks: { label: c => c.dataset.label + ': ฿' + fmt0(c.raw) } },
          datalabels: { font: { size: 8, weight: 700 }, offset: 4, color: ctx => ctx.dataset.borderColor }
        },
        scales: { y: { beginAtZero: true, ticks: { callback: v => '฿' + fmtShort(v), font: { size: 9 }, color: '#6B7280' }, grid: { color: '#F3F4F6' } },
          x: { ticks: { font: { size: 9 }, color: '#6B7280', maxRotation: 0 }, grid: { display: false } } }
      }
    });
  });
}

function renderBranchView() {
  renderSidebar();
  renderMainTitle();
  renderBranchInline();
}

function renderBranchInline() {
  const br = getBranch(activeBranch);
  const today = todayBKK();
  const container = document.getElementById('branchEmpsContainer');
  if (!container) return;

  let html = '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:12px;border-bottom:2px solid var(--red);margin-bottom:14px">' +
    '<h3 style="margin:0;border:none;padding:0"><span>📝</span> บันทึกยอดขาย — สาขา' + br.name + ' <span style="font-size:11px;color:var(--gray-text);font-weight:400;margin-left:6px">(' + br.employees.length + ' คน)</span></h3>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
    (isAdmin() ? '<button type="button" id="resetBranchSalesBtn" style="padding:7px 14px;border:1px solid #DC2626;background:#fff;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:#DC2626" title="ล้างยอดขายทั้งหมดของสาขานี้ (Admin)">🔄 รีเซตยอด</button>' : '') +
    (canEditBranch(br.id) ? '<button type="button" id="toggleAddEmp" style="padding:7px 14px;border:1px solid var(--gray-line);background:#fff;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;color:var(--red-dark)">⚙️ จัดการพนักงาน</button>' : '') +
    '</div></div>' +
    '<div id="addEmpPanelInline" style="display:none;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px;margin-bottom:14px">' +
    '<div style="font-size:13px;font-weight:700;color:var(--red-dark);margin-bottom:10px">เพิ่มพนักงานใหม่เข้าสาขา' + br.name + '</div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
    '<input type="text" id="newEmpNameInline" placeholder="ชื่อพนักงาน" style="flex:1;min-width:140px;padding:9px 12px;border:1px solid var(--gray-line);border-radius:8px;font-family:inherit;font-size:13px;background:#fff">' +
    '<select id="newEmpPosInline" style="flex:0 0 150px;padding:9px 12px;border:1px solid var(--gray-line);border-radius:8px;font-family:inherit;font-size:13px;background:#fff">' +
    posOptionsHTML(POSITIONS[0] && POSITIONS[0].name, false) +
    '</select>' +
    '<button type="button" id="addEmpBtnInline" style="padding:9px 18px;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:var(--red);color:#fff">+ เพิ่มพนักงาน</button>' +
    '</div>' +
    '<div style="font-size:11px;color:var(--gray-text);margin-top:8px;font-style:italic">💡 กดปุ่ม ✕ มุมขวาบนของการ์ดพนักงานเพื่อลบ</div>' +
    '</div>';

  if (!br.employees.length) {
    html += '<div class="empty-state">ยังไม่มีพนักงาน — กด "⚙️ จัดการพนักงาน" เพื่อเพิ่ม</div>';
  } else {
    const renderEmpCard = e => {
      const t = empDailyTotals(br.id, e.id);
      const pos = e.position || 'Sale';
      const pc = posChipClass(pos);
      const team = e.team || 'A';
      const teamColor = team === 'A' ? { bg:'#FEF3C7', text:'#92400E' } : { bg:'#DBEAFE', text:'#1E40AF' };
      const isPT = isPosPT(pos);
      const todayEntry = (DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][today]) || {pt:0,member:0,plan:0,train:0};
      const todayPT = +todayEntry.pt || 0, todayMEM = +todayEntry.member || 0, todayPLAN = +todayEntry.plan || 0;
      const todayTrain = +todayEntry.train || 0;
      const todayTotal = todayPT + todayMEM + todayPLAN;
      const mtdPTMem = empMTDPTMem(br.id, e.id, today);
      const kpiTarget = monthlyKPITarget(today);
      const belowQuota = mtdPTMem < kpiTarget;
      const cardStyle = belowQuota
        ? 'position:relative;border:2px solid #DC2626;box-shadow:0 0 0 2px rgba(220,38,38,0.08)'
        : 'position:relative';
      const nameStyle = belowQuota
        ? 'padding-right:60px;color:#9CA3AF'
        : 'padding-right:60px';
      const nameTitle = belowQuota
        ? ' title="ยอดสะสมเดือนนี้ยังไม่ถึง KPI (ต้องการ ฿' + fmt0(kpiTarget) + ' · ทำได้ ฿' + fmt0(mtdPTMem) + ')"'
        : ' title="ถึง KPI แล้ว · ต้องการ ฿' + fmt0(kpiTarget) + ' · ทำได้ ฿' + fmt0(mtdPTMem) + '"';
      const shortfall = Math.max(kpiTarget - mtdPTMem, 0);
      const quotaBadge = belowQuota
        ? '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 9px;background:#FEE2E2;border:1px solid #FCA5A5;border-radius:6px;font-size:11px;margin:0 0 6px"><span style="color:#991B1B;font-weight:700">⚠ ยอดขายขาด</span><span style="color:#7F1D1D;font-weight:800">' + fmt0(shortfall) + '/' + fmt0(kpiTarget) + '</span></div>'
        : '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 9px;background:#DCFCE7;border:1px solid #86EFAC;border-radius:6px;font-size:11px;margin:0 0 6px"><span style="color:#166534;font-weight:700">✅ ถึง KPI ฿' + fmt0(kpiTarget) + '</span><span style="color:#14532D;font-weight:800">เดือนนี้ ฿' + fmt0(mtdPTMem) + '</span></div>';
      const todayBadge = todayTotal > 0
        ? '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 9px;background:#EEF2FF;border:1px solid #C7D2FE;border-radius:6px;font-size:11px;margin:0 0 6px"><span style="color:#3730A3;font-weight:700">📌 วันนี้บันทึกแล้ว</span><span style="color:#1E1B4B;font-weight:800">฿' + fmt0(todayTotal) + '</span></div>'
        : '';
      const trainBadge = isPT && todayTrain > 0
        ? '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 9px;background:#FEF3C7;border:1px solid #FCD34D;border-radius:6px;font-size:11px;margin:0 0 6px"><span style="color:#92400E;font-weight:700">🏋 จำนวนเทรนวันนี้</span><span style="color:#78350F;font-weight:800">' + fmtInt(todayTrain) + ' ครั้ง</span></div>'
        : '';
      const canEdit = canEditBranch(br.id);
      const teamCtl = canEdit
        ? '<select class="inline-team-select" data-eid="' + e.id + '" style="padding:5px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid var(--gray-line);background:' + teamColor.bg + ';color:' + teamColor.text + ';cursor:pointer">' +
            '<option value="A"' + (team==='A'?' selected':'') + '>🅰 ทีม A</option>' +
            '<option value="B"' + (team==='B'?' selected':'') + '>🅱 ทีม B</option>' +
          '</select>'
        : '<span style="display:inline-block;padding:5px 10px;border-radius:8px;font-size:11px;font-weight:700;background:' + teamColor.bg + ';color:' + teamColor.text + '">' + (team === 'A' ? '🅰 ทีม A' : '🅱 ทีม B') + '</span>';
      const posCtl = canEdit
        ? '<select class="inline-pos-select ' + pc + '" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
            posOptionsHTML(pos, true) +
          '</select>'
        : '<span class="pos-chip ' + pc + '">' + posIcon(pos) + ' ' + posShort(pos) + '</span>';
      const editBtns = canEdit
        ? '<button class="emp-card-edit" data-emp-edit="' + e.id + '" title="แก้ไข ' + e.name + '" style="position:absolute;top:8px;right:40px;width:26px;height:26px;border-radius:50%;background:#DBEAFE;color:#1E40AF;border:none;cursor:pointer;font-size:13px;font-weight:700;z-index:5">✎</button>' +
          '<button class="emp-card-delete" data-emp-del="' + e.id + '" title="ลบ ' + e.name + '" style="position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;background:#FEE2E2;color:#991B1B;border:none;cursor:pointer;font-size:13px;font-weight:700;z-index:5">✕</button>'
        : '';
      const trainInputRow = isPT
        ? '<div class="inline-input-row"><span class="inline-label" style="background:#FEF3C7;color:#92400E">🏋 เทรน</span><input type="number" class="inline-train" placeholder="0" min="0" step="1"></div>'
        : '';
      const salesForm = canEdit
        ? '<div class="inline-sales-form" data-bid="' + br.id + '" data-eid="' + e.id + '" data-ispt="' + (isPT ? '1' : '0') + '">' +
            '<div class="inline-date-row"><label>📅</label><input type="date" class="inline-date" value="' + today + '"></div>' +
            quotaBadge + todayBadge + trainBadge +
            '<div class="inline-input-row"><span class="inline-label pt">💪 PT</span><input type="number" class="inline-pt" placeholder="0" min="0"></div>' +
            '<div class="inline-input-row"><span class="inline-label member">🎫 MEM</span><input type="number" class="inline-member" placeholder="0" min="0"></div>' +
            '<div class="inline-input-row"><span class="inline-label plan">📋 PLAN</span><input type="number" class="inline-plan" placeholder="0" min="0"></div>' +
            trainInputRow +
            '<button type="button" class="emp-card-btn inline-save-btn">💾 เพิ่มยอดขาย</button>' +
          '</div>'
        : (quotaBadge + todayBadge + trainBadge);
      return '<div class="emp-card" style="' + cardStyle + '">' +
        editBtns +
        '<div class="emp-card-header">' + avatarHTML(e) +
        '<div class="emp-card-info">' +
        '<div class="emp-card-name" style="' + nameStyle + '"' + nameTitle + '>' + e.name + '</div>' +
        '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
        posCtl + teamCtl +
        '</div>' +
        '<div class="emp-card-id">' + e.id + '</div></div></div>' +
        '<div class="emp-card-categories">' +
        '<div class="emp-cat pt"><div class="emp-cat-label">💪 PT</div><div class="emp-cat-value">฿' + fmtShort(t.pt) + '</div></div>' +
        '<div class="emp-cat member"><div class="emp-cat-label">🎫 MEM</div><div class="emp-cat-value">฿' + fmtShort(t.member) + '</div></div>' +
        '<div class="emp-cat plan"><div class="emp-cat-label">📋 PLAN</div><div class="emp-cat-value">฿' + fmtShort(t.plan) + '</div></div></div>' +
        '<div class="emp-card-total">' +
        '<span class="emp-card-total-label">รวม PT+MEM · ' + t.days + ' วัน</span>' +
        '<span class="emp-card-total-value">฿' + fmt0(t.pt + t.member) + '</span></div>' +
        (isPT
          ? '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;margin-top:6px;font-size:12px"><span style="color:#92400E;font-weight:700">🏋 จำนวนเทรนรวม</span><span style="color:#78350F;font-weight:800">' + fmtInt(t.train) + ' ครั้ง</span></div>'
          : '') +
        salesForm +
        '</div>';
    };

    const sectionHeader = (icon, label, count, color) =>
      '<div style="display:flex;align-items:center;gap:10px;margin:6px 0 12px;padding:10px 14px;background:' + color.bg + ';border-left:4px solid ' + color.bar + ';border-radius:8px">' +
      '<span style="font-size:18px">' + icon + '</span>' +
      '<span style="font-size:14px;font-weight:800;color:' + color.text + '">' + label + '</span>' +
      '<span style="font-size:11px;font-weight:700;color:' + color.text + ';background:#fff;padding:3px 10px;border-radius:999px">' + count + ' คน</span>' +
      '</div>';
    const sectionColor = pos => isPosPT(pos.name)
      ? { bg:'#FEF2F2', bar:'#DC2626', text:'#991B1B' }
      : { bg:'#EFF6FF', bar:'#2563EB', text:'#1E3A8A' };

    POSITIONS.forEach(p => {
      const list = br.employees.filter(e => (e.position || 'Sale') === p.name);
      if (!list.length) return;
      html += sectionHeader(p.icon, p.name, list.length, sectionColor(p));
      html += '<div class="employees-grid" style="margin-bottom:18px">' + list.map(renderEmpCard).join('') + '</div>';
    });
    // Catch-all for employees with positions no longer in the list
    const orphanEmps = br.employees.filter(e => !POSITIONS.some(p => p.name === (e.position || 'Sale')));
    if (orphanEmps.length) {
      html += sectionHeader('❓', 'ตำแหน่งอื่น', orphanEmps.length, { bg:'#F3F4F6', bar:'#6B7280', text:'#1F2937' });
      html += '<div class="employees-grid" style="margin-bottom:18px">' + orphanEmps.map(renderEmpCard).join('') + '</div>';
    }
  }

  html += '</div>';
  container.innerHTML = html;

  const toggleBtn = document.getElementById('toggleAddEmp');
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      const p = document.getElementById('addEmpPanelInline');
      const open = p.style.display !== 'none';
      p.style.display = open ? 'none' : 'block';
      toggleBtn.textContent = open ? '⚙️ จัดการพนักงาน' : '✕ ปิด';
    };
  }

  const resetBtn = document.getElementById('resetBranchSalesBtn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (!isAdmin()) { showToast('⚠ เฉพาะ Admin เท่านั้น', true); return; }
      const cnt = Object.values(DAILY[br.id] || {}).reduce((n, days) => n + Object.keys(days || {}).length, 0);
      if (!cnt) { showToast('⚠ ไม่มียอดให้รีเซต', true); return; }
      const ans = prompt('⚠ จะลบยอดขายทั้งหมดของสาขา' + br.name + ' (' + cnt + ' รายการ) ออกถาวร\nการทำนี้ย้อนกลับไม่ได้\n\nพิมพ์ "RESET" เพื่อยืนยัน:');
      if (ans !== 'RESET') { showToast('ยกเลิกการรีเซต', true); return; }
      DAILY[br.id] = {};
      saveDaily();
      renderBranchView();
      showToast('🔄 รีเซตยอด สาขา' + br.name + ' (' + cnt + ' รายการ)');
    };
  }

  const addBtn = document.getElementById('addEmpBtnInline');
  if (addBtn) {
    addBtn.onclick = () => {
      const input = document.getElementById('newEmpNameInline');
      const name = input.value.trim();
      const position = document.getElementById('newEmpPosInline').value;
      if (!name) { input.focus(); return; }
      if (br.employees.some(e => e.name === name)) { showToast('⚠ มีชื่อนี้แล้ว', true); return; }
      br.employees.push({ id: newEmpId(activeBranch), name: name, position: position, photo: '', team: 'A' });
      saveBranches();
      renderBranchView();
      showToast('✓ เพิ่ม ' + name);
    };
    const nameInput = document.getElementById('newEmpNameInline');
    if (nameInput) nameInput.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); addBtn.click(); } };
  }

  container.querySelectorAll('.inline-pos-select').forEach(sel => {
    sel.onchange = () => {
      const emp = br.employees.find(x => x.id === sel.dataset.eid);
      if (emp) { emp.position = sel.value; saveBranches(); renderBranchView(); showToast('✓ อัปเดตตำแหน่ง ' + emp.name); }
    };
  });

  container.querySelectorAll('[data-emp-edit]').forEach(btn => {
    btn.onclick = ev => { ev.stopPropagation(); openEditEmpModal(btn.dataset.empEdit); };
  });

  container.querySelectorAll('.inline-team-select').forEach(sel => {
    sel.onchange = () => {
      const emp = br.employees.find(x => x.id === sel.dataset.eid);
      if (emp) { emp.team = sel.value; saveBranches(); renderBranchView(); showToast('✓ ' + emp.name + ' → ทีม ' + sel.value); }
    };
  });

  container.querySelectorAll('[data-emp-del]').forEach(btn => {
    btn.onclick = ev => {
      ev.stopPropagation();
      const id = btn.dataset.empDel;
      const name = empName(id);
      if (confirm('ลบพนักงาน "' + name + '" ออกจากสาขา' + br.name + '?\n(ยอดที่บันทึกไว้จะยังอยู่)')) {
        br.employees = br.employees.filter(x => x.id !== id);
        saveBranches();
        renderBranchView();
        showToast('🗑 ลบพนักงาน ' + name);
      }
    };
  });

  container.querySelectorAll('.inline-save-btn').forEach(btn => {
    btn.onclick = () => {
      const form = btn.closest('.inline-sales-form');
      const bid = form.dataset.bid, eid = form.dataset.eid;
      const isPT = form.dataset.ispt === '1';
      const date = form.querySelector('.inline-date').value;
      if (!date) { showToast('⚠ เลือกวันที่', true); return; }
      const pt = +form.querySelector('.inline-pt').value || 0;
      const m  = +form.querySelector('.inline-member').value || 0;
      const pl = +form.querySelector('.inline-plan').value || 0;
      const trainEl = form.querySelector('.inline-train');
      const tr = isPT && trainEl ? (+trainEl.value || 0) : 0;
      if (!pt && !m && !pl && !tr) { showToast('⚠ ยังไม่ได้กรอกยอด', true); return; }
      if (!DAILY[bid]) DAILY[bid] = {};
      if (!DAILY[bid][eid]) DAILY[bid][eid] = {};
      const prev = DAILY[bid][eid][date] || { pt: 0, member: 0, plan: 0, train: 0 };
      DAILY[bid][eid][date] = {
        pt: (+prev.pt || 0) + pt,
        member: (+prev.member || 0) + m,
        plan: (+prev.plan || 0) + pl,
        train: (+prev.train || 0) + tr
      };
      saveDaily();
      logSale(bid, eid, date, pt, m, pl, tr);
      renderBranchView();
      const msg = (pt + m + pl) > 0
        ? '✓ เพิ่มยอด ฿' + fmt0(pt + m + pl) + (tr ? ' · 🏋 ' + tr + ' ครั้ง' : '') + ' · ' + empName(eid) + ' (' + date + ')'
        : '✓ เพิ่มเทรน ' + tr + ' ครั้ง · ' + empName(eid) + ' (' + date + ')';
      showToast(msg);
    };
  });
}

function renderIndividualView() {
  renderSidebar();
  const br = getBranch(activeBranch);
  if(document.getElementById('indivBranchName'))document.getElementById('indivBranchName').textContent = 'สาขา' + br.name;
  const emps = br.employees;
  const labels = emps.map(e => e.name);
  const ptData = emps.map(e => empDailyTotals(activeBranch, e.id).pt);
  const memData = emps.map(e => empDailyTotals(activeBranch, e.id).member);
  const planData = emps.map(e => empDailyTotals(activeBranch, e.id).plan);
  const totalData = emps.map(e => empDailyTotals(activeBranch, e.id).total);
  const maxTotal = Math.max(...totalData, 0);

  if (indivChart) indivChart.destroy();
  indivChart = new Chart(document.getElementById('indivChart'), {
    type: 'bar',
    data: { labels: labels, datasets: [
      { label: '💪 PT', data: ptData, backgroundColor: '#DC2626', borderRadius: 4 },
      { label: '🎫 MEMBER', data: memData, backgroundColor: '#1F1F1F', borderRadius: 4 },
      { label: '📋 Plan SETUP', data: planData, backgroundColor: '#D97706', borderRadius: 4 }
    ]},
    options: {
      responsive: true, maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      plugins: { legend: { position: 'bottom', labels: { padding: 14, font: { weight: 600 } } },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ฿' + fmt0(c.raw) } },
        datalabels: { anchor: 'end', align: 'end', offset: 2, font: { size: 9, weight: 700 } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#1F1F1F', font: { weight: 600 } } },
        y: { beginAtZero: true, ticks: { callback: v => '฿' + fmtInt(v), color: '#4B5563' }, grid: { color: '#F3F4F6' } }
      }
    }
  });

  if (indivTotalChart) indivTotalChart.destroy();
  indivTotalChart = new Chart(document.getElementById('indivTotalChart'), {
    type: 'bar',
    data: { labels: labels, datasets: [
      { label: '💰 ยอดรวม', data: totalData,
        backgroundColor: totalData.map(v => v === maxTotal && v > 0 ? 'rgba(220,38,38,0.95)' : 'rgba(31,31,31,0.85)'),
        borderRadius: 6 }
    ]},
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      layout: { padding: { right: 60 } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '฿' + fmt0(c.raw) } },
        datalabels: { anchor: 'end', align: 'right', offset: 4, font: { size: 10, weight: 700 } } },
      scales: {
        x: { beginAtZero: true, ticks: { callback: v => '฿' + fmtInt(v), color: '#4B5563' }, grid: { color: '#F3F4F6' } },
        y: { ticks: { color: '#1F1F1F', font: { weight: 700 } }, grid: { display: false } }
      }
    }
  });
}

function renderRankingView() {
  renderSidebar();
  const container = document.getElementById('rankingContainer');
  container.innerHTML = filteredBranches().map(br => {
    const emps = br.employees.map(e => {
      const t = empDailyTotals(br.id, e.id);
      return { emp: e, pt: t.pt, member: t.member, plan: t.plan, days: t.days, total: t.pt + t.member };
    }).sort((a, b) => b.total - a.total);
    const branchTotal = emps.reduce((s, r) => s + r.total, 0);
    const maxEmpTotal = Math.max(...emps.map(r => r.total), 1);
    let listHtml = '';
    if (!emps.length) {
      listHtml = '<div class="ranking-empty">ยังไม่มีพนักงานในสาขานี้</div>';
    } else {
      listHtml = emps.map((r, i) => {
        const rankClass = i < 3 && r.total > 0 ? 'r' + (i+1) : '';
        const medal = i === 0 && r.total > 0 ? '🥇' : i === 1 && r.total > 0 ? '🥈' : i === 2 && r.total > 0 ? '🥉' : '#' + (i+1);
        const pct = maxEmpTotal ? Math.round(r.total / maxEmpTotal * 100) : 0;
        const pos = r.emp.position || 'Sale';
        const pi = posIcon(pos);
        const av = r.emp.photo
          ? '<img class="ranking-avatar-img" src="' + r.emp.photo + '">'
          : '<div class="ranking-avatar" style="background:' + avatarColor(r.emp.id) + '">' + avatarInitials(r.emp.name) + '</div>';
        return '<div class="ranking-row ' + rankClass + '" style="position:relative">' +
          '<div class="ranking-rank-badge">' + medal + '</div>' + av +
          '<div class="ranking-info">' +
          '<div class="ranking-name">' + r.emp.name + '</div>' +
          '<div class="ranking-meta">' + pi + ' ' + pos + ' · ' + r.emp.id + ' · ' + r.days + ' วัน</div>' +
          '<div class="ranking-breakdown">' +
          '<span class="pt">💪 PT ฿' + fmt0(r.pt) + '</span>' +
          '<span class="mem">🎫 MEM ฿' + fmt0(r.member) + '</span></div>' +
          '<div class="ranking-bar-wrap"><div class="ranking-bar" style="width:' + pct + '%"></div></div>' +
          '</div>' +
          '<div class="ranking-total">฿' + fmt0(r.total) + '</div>' +
          '<button class="ranking-edit-btn" data-rank-edit="' + r.emp.id + '" title="แก้ไข ' + r.emp.name + '" style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:#DBEAFE;color:#1E40AF;border:none;cursor:pointer;font-size:14px;font-weight:700;z-index:5">✎</button>' +
          '</div>';
      }).join('');
    }
    return '<div class="ranking-branch-card">' +
      '<div class="ranking-branch-header">' +
      '<div class="ranking-branch-title"><span class="emoji">' + br.emoji + '</span><span>สาขา' + br.name + '</span></div>' +
      '<div class="ranking-branch-total">ยอดรวม <strong>฿' + fmt0(branchTotal) + '</strong> · ' + emps.length + ' คน</div>' +
      '</div><div class="ranking-list">' + listHtml + '</div></div>';
  }).join('');

  container.querySelectorAll('[data-rank-edit]').forEach(btn => {
    btn.onclick = ev => { ev.stopPropagation(); openEditEmpModal(btn.dataset.rankEdit); };
  });
}

function renderRankingAllView() {
  renderSidebar();
  const container = document.getElementById('rankingAllContainer');
  if (!container) return;

  const all = [];
  filteredBranches().forEach(br => br.employees.forEach(e => {
    const t = empDailyTotals(br.id, e.id);
    all.push({ branch: br, emp: e, pt: t.pt, member: t.member, plan: t.plan, days: t.days, total: t.pt + t.member });
  }));
  all.sort((a, b) => b.total - a.total);

  const grandTotal = all.reduce((s, r) => s + r.total, 0);
  const maxTotal = Math.max(...all.map(r => r.total), 1);
  const ptCount = all.filter(r => isPosPT(r.emp.position)).length;
  const saleCount = all.length - ptCount;

  const fbCount = filteredBranches().length;
  const scopeLabel = globalBranchFilter ? '1 สาขา' : (fbCount + ' สาขา');
  let html = '<div class="kpi-grid" style="margin-bottom:18px">' +
    '<div class="kpi-card total"><div class="kpi-icon">💰</div><div class="kpi-label">ยอดรวมทั้งหมด</div><div class="kpi-value">฿' + fmt0(grandTotal) + '</div><div class="kpi-sub">' + scopeLabel + ' · ' + all.length + ' คน</div></div>' +
    '<div class="kpi-card pt"><div class="kpi-icon">👥</div><div class="kpi-label">พนักงานทั้งหมด</div><div class="kpi-value">' + all.length + '</div><div class="kpi-sub">PT ' + ptCount + ' · Sale ' + saleCount + '</div></div>' +
    '<div class="kpi-card member"><div class="kpi-icon">🏢</div><div class="kpi-label">จำนวนสาขา</div><div class="kpi-value">' + fbCount + '</div><div class="kpi-sub">' + (globalBranchFilter ? 'กรองอยู่' : 'รวมทั้งหมด') + '</div></div>' +
    '<div class="kpi-card plan"><div class="kpi-icon">🥇</div><div class="kpi-label">ยอดสูงสุด</div><div class="kpi-value">฿' + fmt0(all[0] ? all[0].total : 0) + '</div><div class="kpi-sub">' + (all[0] ? all[0].emp.name : '—') + '</div></div>' +
    '</div>';

  html += '<div class="ranking-branch-card"><div class="ranking-branch-header">' +
    '<div class="ranking-branch-title"><span class="emoji">🏅</span><span>อันดับรวมทุกสาขา</span></div>' +
    '<div class="ranking-branch-total">' + all.length + ' คน · ฿' + fmt0(grandTotal) + '</div>' +
    '</div><div class="ranking-list">';

  if (!all.length) {
    html += '<div class="ranking-empty">ยังไม่มีพนักงาน</div>';
  } else {
    html += all.map((r, i) => {
      const rankClass = i < 3 && r.total > 0 ? 'r' + (i+1) : '';
      const medal = i === 0 && r.total > 0 ? '🥇' : i === 1 && r.total > 0 ? '🥈' : i === 2 && r.total > 0 ? '🥉' : '#' + (i+1);
      const pct = maxTotal ? Math.round(r.total / maxTotal * 100) : 0;
      const pos = r.emp.position || 'Sale';
      const pi = posIcon(pos);
      const av = r.emp.photo
        ? '<img class="ranking-avatar-img" src="' + r.emp.photo + '">'
        : '<div class="ranking-avatar" style="background:' + avatarColor(r.emp.id) + '">' + avatarInitials(r.emp.name) + '</div>';
      return '<div class="ranking-row ' + rankClass + '" style="position:relative">' +
        '<div class="ranking-rank-badge">' + medal + '</div>' + av +
        '<div class="ranking-info">' +
        '<div class="ranking-name">' + r.emp.name + ' <span style="font-size:11px;font-weight:600;color:var(--gray-text);margin-left:4px">' + r.branch.emoji + ' ' + r.branch.name + '</span></div>' +
        '<div class="ranking-meta">' + posIcon + ' ' + pos + ' · ' + r.emp.id + ' · ' + r.days + ' วัน</div>' +
        '<div class="ranking-breakdown">' +
        '<span class="pt">💪 PT ฿' + fmt0(r.pt) + '</span>' +
        '<span class="mem">🎫 MEM ฿' + fmt0(r.member) + '</span></div>' +
        '<div class="ranking-bar-wrap"><div class="ranking-bar" style="width:' + pct + '%"></div></div>' +
        '</div>' +
        '<div class="ranking-total">฿' + fmt0(r.total) + '</div>' +
        '<button class="ranking-edit-btn" data-rank-edit="' + r.emp.id + '" title="แก้ไข ' + r.emp.name + '" style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:#DBEAFE;color:#1E40AF;border:none;cursor:pointer;font-size:14px;font-weight:700;z-index:5">✎</button>' +
        '</div>';
    }).join('');
  }
  html += '</div></div>';

  container.innerHTML = html;

  container.querySelectorAll('[data-rank-edit]').forEach(btn => {
    btn.onclick = ev => { ev.stopPropagation(); openEditEmpModal(btn.dataset.rankEdit); };
  });
}

// ===== Trainer ranking — rank Personal Trainers by total training count =====
function renderRankingTrainerView() {
  renderSidebar();
  const container = document.getElementById('rankingTrainerContainer');
  if (!container) return;

  // Per-branch sections
  const branchHtml = filteredBranches().map(br => {
    const trainers = br.employees
      .filter(e => isPosPT(e.position))
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, train: t.train, days: t.days }; })
      .sort((a, b) => b.train - a.train);
    const branchTrainTotal = trainers.reduce((s, r) => s + r.train, 0);
    const maxTrain = Math.max(...trainers.map(r => r.train), 1);
    const accent = branchColor(br.id);

    let listHtml = '';
    if (!trainers.length) {
      listHtml = '<div class="ranking-empty">ยังไม่มีเทรนเนอร์ในสาขานี้</div>';
    } else {
      listHtml = trainers.map((r, i) => {
        const inTop = r.train > 0 && i < 3;
        const rankClass = inTop ? 'r' + (i+1) : '';
        const medal = inTop ? (i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉') : '#' + (i+1);
        const nameMedal = inTop ? ' <span style="font-size:18px;margin-left:4px">' + medal + '</span>' : '';
        const pct = maxTrain ? Math.round(r.train / maxTrain * 100) : 0;
        const av = r.emp.photo
          ? '<img class="ranking-avatar-img" src="' + r.emp.photo + '">'
          : '<div class="ranking-avatar" style="background:' + avatarColor(r.emp.id) + '">' + avatarInitials(r.emp.name) + '</div>';
        return '<div class="ranking-row ' + rankClass + '" style="position:relative">' +
          '<div class="ranking-rank-badge" style="font-size:' + (inTop ? '28px' : '22px') + '">' + medal + '</div>' + av +
          '<div class="ranking-info">' +
          '<div class="ranking-name">' + r.emp.name + nameMedal + '</div>' +
          '<div class="ranking-meta">' + posIcon(r.emp.position) + ' ' + (r.emp.position || 'Sale') + ' · ' + r.emp.id + ' · ' + r.days + ' วัน</div>' +
          '<div class="ranking-bar-wrap"><div class="ranking-bar" style="width:' + pct + '%;background:linear-gradient(90deg,#F59E0B,#92400E)"></div></div>' +
          '</div>' +
          '<div class="ranking-total" style="color:#92400E">🏋 ' + fmtInt(r.train) + '<div style="font-size:10px;font-weight:600;color:var(--gray-text);margin-top:2px">ครั้ง</div></div>' +
          '</div>';
      }).join('');
    }

    return '<div class="ranking-branch-card" style="border-left:5px solid ' + accent + '">' +
      '<div class="ranking-branch-header">' +
      '<div class="ranking-branch-title"><span class="emoji">' + br.emoji + '</span><span>สาขา' + br.name + '</span></div>' +
      '<div class="ranking-branch-total">รวม <strong style="color:#92400E">🏋 ' + fmtInt(branchTrainTotal) + ' ครั้ง</strong> · ' + trainers.length + ' คน</div>' +
      '</div><div class="ranking-list">' + listHtml + '</div></div>';
  }).join('');

  // Combined ranking across all branches (respects global branch filter)
  const all = [];
  filteredBranches().forEach(br => br.employees.forEach(e => {
    if (!isPosPT(e.position)) return;
    const t = empDailyTotals(br.id, e.id);
    all.push({ branch: br, emp: e, train: t.train, days: t.days });
  }));
  all.sort((a, b) => b.train - a.train);

  const grandTrain = all.reduce((s, r) => s + r.train, 0);
  const maxAll = Math.max(...all.map(r => r.train), 1);
  const topName = all[0] && all[0].train > 0 ? all[0].emp.name + ' (' + all[0].branch.emoji + ' ' + all[0].branch.name + ')' : '—';

  let combinedHtml = '<div class="kpi-grid" style="margin-bottom:18px">' +
    '<div class="kpi-card total"><div class="kpi-icon">🏋</div><div class="kpi-label">จำนวนเทรนทั้งหมด</div><div class="kpi-value">' + fmtInt(grandTrain) + '</div><div class="kpi-sub">ทุกสาขา ทุกเทรนเนอร์</div></div>' +
    '<div class="kpi-card pt"><div class="kpi-icon">💪</div><div class="kpi-label">เทรนเนอร์ทั้งหมด</div><div class="kpi-value">' + all.length + '</div><div class="kpi-sub">' + BRANCHES.length + ' สาขา</div></div>' +
    '<div class="kpi-card plan"><div class="kpi-icon">🥇</div><div class="kpi-label">เทรนสูงสุด</div><div class="kpi-value">' + fmtInt(all[0] ? all[0].train : 0) + '</div><div class="kpi-sub">' + topName + '</div></div>' +
    '</div>';

  combinedHtml += '<div class="ranking-branch-card"><div class="ranking-branch-header">' +
    '<div class="ranking-branch-title"><span class="emoji">🏅</span><span>อันดับเทรนเนอร์รวมทุกสาขา</span></div>' +
    '<div class="ranking-branch-total">' + all.length + ' คน · 🏋 ' + fmtInt(grandTrain) + ' ครั้ง</div>' +
    '</div><div class="ranking-list">';

  if (!all.length) {
    combinedHtml += '<div class="ranking-empty">ยังไม่มีเทรนเนอร์</div>';
  } else {
    combinedHtml += all.map((r, i) => {
      const inTop = r.train > 0 && i < 3;
      const rankClass = inTop ? 'r' + (i+1) : '';
      const medal = inTop ? (i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉') : '#' + (i+1);
      const nameMedal = inTop ? ' <span style="font-size:18px;margin-left:4px">' + medal + '</span>' : '';
      const pct = maxAll ? Math.round(r.train / maxAll * 100) : 0;
      const av = r.emp.photo
        ? '<img class="ranking-avatar-img" src="' + r.emp.photo + '">'
        : '<div class="ranking-avatar" style="background:' + avatarColor(r.emp.id) + '">' + avatarInitials(r.emp.name) + '</div>';
      return '<div class="ranking-row ' + rankClass + '" style="position:relative">' +
        '<div class="ranking-rank-badge" style="font-size:' + (inTop ? '28px' : '22px') + '">' + medal + '</div>' + av +
        '<div class="ranking-info">' +
        '<div class="ranking-name">' + r.emp.name + nameMedal + ' <span style="font-size:11px;font-weight:600;color:var(--gray-text);margin-left:4px">' + r.branch.emoji + ' ' + r.branch.name + '</span></div>' +
        '<div class="ranking-meta">' + posIcon(r.emp.position) + ' ' + (r.emp.position || 'Sale') + ' · ' + r.emp.id + ' · ' + r.days + ' วัน</div>' +
        '<div class="ranking-bar-wrap"><div class="ranking-bar" style="width:' + pct + '%;background:linear-gradient(90deg,#F59E0B,#92400E)"></div></div>' +
        '</div>' +
        '<div class="ranking-total" style="color:#92400E">🏋 ' + fmtInt(r.train) + '<div style="font-size:10px;font-weight:600;color:var(--gray-text);margin-top:2px">ครั้ง</div></div>' +
        '</div>';
    }).join('');
  }
  combinedHtml += '</div></div>';

  container.innerHTML =
    '<div style="margin-bottom:8px;padding:10px 14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;font-size:13px;font-weight:700;color:#78350F"><span>🏅</span> รวมทุกสาขา</div>' +
    combinedHtml +
    '<div style="margin:18px 0 8px;padding:10px 14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;font-size:13px;font-weight:700;color:#78350F"><span>🏢</span> แยกตามสาขา</div>' +
    branchHtml;

}

function openDailyModal(empId) {
  activeDailyEmp = empId; const e = empById(empId);
  if(document.getElementById('dailyModalEmpName'))document.getElementById('dailyModalEmpName').textContent = e.name + ' · ' + (e.position||'Sale');
  const today = todayBKK();
  if(document.getElementById('dailyDate'))document.getElementById('dailyDate').value = today;
  loadDailyIntoForm(empId, today); renderDailyHistory(empId);
  document.getElementById('dailyModal').classList.add('show');
}
function closeDailyModal() { document.getElementById('dailyModal').classList.remove('show'); activeDailyEmp = null; }
function loadDailyIntoForm(empId, date) {
  const entry = DAILY[activeBranch] && DAILY[activeBranch][empId] && DAILY[activeBranch][empId][date];
  if(document.getElementById('dailyPT'))document.getElementById('dailyPT').value = entry ? (entry.pt||'') : '';
  if(document.getElementById('dailyMember'))document.getElementById('dailyMember').value = entry ? (entry.member||'') : '';
  if(document.getElementById('dailyPlan'))document.getElementById('dailyPlan').value = entry ? (entry.plan||'') : '';
  updateDailyPreview();
}
function updateDailyPreview() {
  const pt = +document.getElementById('dailyPT').value||0;
  const m = +document.getElementById('dailyMember').value||0;
  const p = +document.getElementById('dailyPlan').value||0;
  if(document.getElementById('dailyTotalPreview'))document.getElementById('dailyTotalPreview').textContent = '฿' + fmt0(pt+m+p);
}
function saveDailyEntry() {
  if (!activeDailyEmp) return;
  const date = document.getElementById('dailyDate').value;
  if (!date) { showToast('⚠ กรุณาเลือกวันที่', true); return; }
  const pt = +document.getElementById('dailyPT').value||0;
  const m = +document.getElementById('dailyMember').value||0;
  const p = +document.getElementById('dailyPlan').value||0;
  if (pt===0 && m===0 && p===0) { if (!confirm('ยอดทั้ง 3 หมวดเป็น 0 — บันทึก?')) return; }
  if (!DAILY[activeBranch]) DAILY[activeBranch] = {};
  if (!DAILY[activeBranch][activeDailyEmp]) DAILY[activeBranch][activeDailyEmp] = {};
  const prevDE = DAILY[activeBranch][activeDailyEmp][date] || {};
  DAILY[activeBranch][activeDailyEmp][date] = { pt: pt, member: m, plan: p, train: +prevDE.train || 0 };
  saveDaily();
  if (pt || m || p) logSale(activeBranch, activeDailyEmp, date, pt, m, p, 0);
  renderDailyHistory(activeDailyEmp);
  if (currentView === 'branch') renderBranchView();
  else if (currentView === 'individual') renderIndividualView();
  else if (currentView === 'ranking') renderRankingView();
  else if (currentView === 'yearsales') renderYearSalesView();
  else if (currentView === 'yeartrain') renderYearTrainView();
  showToast('✓ บันทึก ' + date);
}
function renderDailyHistory(empId) {
  const entries = (DAILY[activeBranch] && DAILY[activeBranch][empId]) || {};
  const dates = Object.keys(entries).sort().reverse().slice(0, 30);
  const body = document.getElementById('dailyHistoryBody');
  if (!dates.length) { body.innerHTML = '<tr><td colspan="6" class="daily-history-empty">ยังไม่มีบันทึก</td></tr>'; return; }
  body.innerHTML = dates.map(d => {
    const e = entries[d]; const t = (+e.pt||0)+(+e.member||0)+(+e.plan||0);
    return '<tr><td><strong>' + d + '</strong></td>' +
      '<td class="num" style="color:#DC2626">฿' + fmt0(e.pt) + '</td>' +
      '<td class="num">฿' + fmt0(e.member) + '</td>' +
      '<td class="num" style="color:#D97706">฿' + fmt0(e.plan) + '</td>' +
      '<td class="num"><strong>฿' + fmt0(t) + '</strong></td>' +
      '<td><button class="btn-danger" data-edit="' + d + '">✎</button>' +
      '<button class="btn-danger" data-daily-del="' + d + '" style="background:#FEE2E2">🗑</button></td></tr>';
  }).join('');
  body.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => { const d = b.dataset.edit; if(document.getElementById('dailyDate'))document.getElementById('dailyDate').value = d; loadDailyIntoForm(empId, d); });
  body.querySelectorAll('[data-daily-del]').forEach(b => b.onclick = () => {
    if (confirm('ลบ ' + b.dataset.dailyDel + '?')) {
      delete DAILY[activeBranch][empId][b.dataset.dailyDel]; saveDaily(); renderDailyHistory(empId);
      if (currentView === 'branch') renderBranchView();
      else if (currentView === 'ranking') renderRankingView();
      else if (currentView === 'yearsales') renderYearSalesView();
      else if (currentView === 'yeartrain') renderYearTrainView();
      showToast('🗑 ลบ ' + b.dataset.dailyDel);
    }
  });
}

function openEditEmpModal(empId) {
  const e = empById(empId); if (!e) return;
  activeEditEmp = empId; editEmpPhotoBase64 = e.photo || '';
  if(document.getElementById('editEmpSubtitle'))document.getElementById('editEmpSubtitle').textContent = e.name + ' · ' + e.id;
  if(document.getElementById('editEmpName'))document.getElementById('editEmpName').value = e.name;
  const posSel = document.getElementById('editEmpPosition');
  if (posSel) { posSel.innerHTML = posOptionsHTML(e.position || 'Sale', false); posSel.value = e.position || 'Sale'; }
  if(document.getElementById('editEmpTeam'))document.getElementById('editEmpTeam').value = e.team || 'A';
  updateEditEmpPhotoPreview();
  document.getElementById('editEmpModal').classList.add('show');
}
function closeEditEmpModal() {
  document.getElementById('editEmpModal').classList.remove('show');
  activeEditEmp = null; editEmpPhotoBase64 = '';
  if(document.getElementById('editEmpPhotoInput'))document.getElementById('editEmpPhotoInput').value = '';
}
function updateEditEmpPhotoPreview() {
  const img = document.getElementById('editEmpPhotoPreview');
  const ph = document.getElementById('editEmpPhotoPlaceholder');
  if (editEmpPhotoBase64) { img.src = editEmpPhotoBase64; img.style.display = 'block'; ph.style.display = 'none'; }
  else { img.style.display = 'none'; ph.style.display = 'flex'; }
}
function saveEditEmp() {
  if (!activeEditEmp) return;
  const e = empById(activeEditEmp); if (!e) return;
  const name = document.getElementById('editEmpName').value.trim();
  const pos = document.getElementById('editEmpPosition').value;
  const team = (document.getElementById('editEmpTeam') || {}).value || 'A';
  if (!name) { showToast('⚠ กรุณาใส่ชื่อ', true); return; }
  e.name = name; e.position = pos; e.team = team; e.photo = editEmpPhotoBase64;
  saveBranches(); closeEditEmpModal();
  if (currentView === 'branch') renderBranchView();
  else if (currentView === 'individual') renderIndividualView();
  else if (currentView === 'ranking') renderRankingView();
  else if (currentView === 'rankingall') renderRankingAllView();
  else if (currentView === 'summarychart') renderSummaryChartView();
  showToast('✓ อัปเดต ' + name);
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.borderLeftColor = isError ? '#F59E0B' : 'var(--red)';
  t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2400);
}

document.getElementById('dailyModalClose')?.addEventListener('click', closeDailyModal);
document.getElementById('dailyModal')?.addEventListener('click', e => { if (e.target.id === 'dailyModal') closeDailyModal(); });
document.getElementById('dailyForm')?.addEventListener('submit', e => { e.preventDefault(); saveDailyEntry(); });
document.getElementById('dailyDate')?.addEventListener('change', () => { if (activeDailyEmp) loadDailyIntoForm(activeDailyEmp, document.getElementById('dailyDate').value); });
['dailyPT','dailyMember','dailyPlan'].forEach(id => document.getElementById(id).addEventListener('input', updateDailyPreview));
document.getElementById('editEmpClose')?.addEventListener('click', closeEditEmpModal);
document.getElementById('editEmpModal')?.addEventListener('click', e => { if (e.target.id === 'editEmpModal') closeEditEmpModal(); });
document.getElementById('editEmpForm')?.addEventListener('submit', e => { e.preventDefault(); saveEditEmp(); });
document.getElementById('editEmpPhotoBtn')?.addEventListener('click', () => document.getElementById('editEmpPhotoInput').click());
document.getElementById('editEmpPhotoInput')?.addEventListener('change', async ev => {
  const f = ev.target.files && ev.target.files[0]; if (!f) return;
  if (f.size > 10 * 1024 * 1024) { showToast('⚠ ไฟล์ใหญ่เกิน 10MB', true); return; }
  try { editEmpPhotoBase64 = await compressImage(f); updateEditEmpPhotoPreview(); showToast('✓ อัปโหลดรูป'); } catch(e) { showToast('⚠ อัปโหลดไม่ได้', true); }
});
document.getElementById('editEmpPhotoRemove')?.addEventListener('click', () => { editEmpPhotoBase64 = ''; updateEditEmpPhotoPreview(); });

document.getElementById('clearEmpFilter')?.addEventListener('click', () => { activeEmployee = null; renderBranchView(); });
document.getElementById('toggleEmpMgmt')?.addEventListener('click', () => {
  const p = document.getElementById('empPanel'); const b = document.getElementById('toggleEmpMgmt');
  const o = p.style.display !== 'none'; p.style.display = o ? 'none' : 'block';
  b.classList.toggle('active', !o); b.textContent = o ? '⚙️ จัดการพนักงาน' : '✕ ปิด';
});
function addEmployee() {
  const input = document.getElementById('newEmpName'); const name = input.value.trim();
  const position = document.getElementById('newEmpPosition').value;
  if (!name) { input.focus(); return; }
  const br = getBranch(activeBranch);
  if (br.employees.some(e => e.name === name)) { showToast('⚠ มีชื่อนี้แล้ว', true); return; }
  br.employees.push({ id: newEmpId(activeBranch), name: name, position: position, photo: '', team: 'A' });
  saveBranches(); input.value = ''; renderBranchView(); showToast('✓ เพิ่ม ' + name);
}
document.getElementById('addEmpBtn')?.addEventListener('click', addEmployee);
document.getElementById('newEmpName')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addEmployee(); } });
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('show');
});
document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');
});

document.getElementById('exportBtn')?.addEventListener('click', () => {
  if (typeof XLSX === 'undefined') { showToast('⚠ โหลด Excel lib ไม่สำเร็จ', true); return; }
  const wb = XLSX.utils.book_new();
  const summaryRows = [['สาขา','พนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด PLAN','รวม 3 หมวด']];
  let gP=0, gM=0, gPl=0;
  BRANCHES.forEach(br => {
    const data = [['วันที่','รหัส','ชื่อพนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม']];
    let bPT=0, bM=0, bPl=0;
    const allD = new Set();
    br.employees.forEach(e => { const es = (DAILY[br.id] && DAILY[br.id][e.id]) || {}; for (const d in es) allD.add(d); });
    Array.from(allD).sort().forEach(date => br.employees.forEach(e => {
      const en = DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][date];
      if (en) { const pt=+en.pt||0, m=+en.member||0, pl=+en.plan||0; data.push([date, e.id, e.name, e.position||'Sale', pt, m, pl, pt+m+pl]); bPT+=pt; bM+=m; bPl+=pl; }
    }));
    if (data.length > 1) data.push(['','','','รวม', bPT, bM, bPl, bPT+bM+bPl]);
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{wch:12},{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:16},{wch:14}];
    XLSX.utils.book_append_sheet(wb, ws, 'รายวัน-' + br.name);
    br.employees.forEach(e => { const t = empDailyTotals(br.id, e.id); summaryRows.push([br.name, e.name, e.position||'Sale', t.pt, t.member, t.plan, t.total]); });
    gP+=bPT; gM+=bM; gPl+=bPl;
  });
  summaryRows.push(['รวมทั้งหมด','','', gP, gM, gPl, gP+gM+gPl]);
  const wsSum = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSum['!cols'] = [{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:16},{wch:16}];
  XLSX.utils.book_append_sheet(wb, wsSum, 'สรุป');
  wb.SheetNames.unshift(wb.SheetNames.pop());
  XLSX.writeFile(wb, 'Station24_Sales_' + todayBKK() + '.xlsx');
  showToast('✓ ดาวน์โหลด Excel');
});

if(document.getElementById('dateBadge'))document.getElementById('dateBadge').textContent = '📅 ' + new Date().toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Bangkok'});

// ===== Overview view =====
let ovDailyChart = null;
function inDateRange(d, from, to) {
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}
function ovRange() {
  const f = document.getElementById('ovFrom').value;
  const t = document.getElementById('ovTo').value;
  return { from: f || null, to: t || null };
}
function ovRangeLabel(r) {
  if (!r.from && !r.to) return 'ทั้งหมด';
  const fmt = d => d ? new Date(d).toLocaleDateString('th-TH', {year:'numeric', month:'short', day:'numeric', timeZone:'Asia/Bangkok'}) : '';
  if (r.from && r.to) return fmt(r.from) + ' — ' + fmt(r.to);
  if (r.from) return 'ตั้งแต่ ' + fmt(r.from);
  return 'ถึง ' + fmt(r.to);
}
function renderOverviewView() {
  renderSidebar();
  const r = ovRange();
  if(document.getElementById('ovRangeBadge'))document.getElementById('ovRangeBadge').innerHTML = '🎯 ช่วงที่ดู: <strong style="margin-left:4px">' + ovRangeLabel(r) + '</strong>';

  // Aggregate across filtered branches in range
  const branchesView = filteredBranches();
  const byDate = {};
  let gP = 0, gM = 0, gPl = 0;
  const branchTotals = {};
  branchesView.forEach(b => {
    branchTotals[b.id] = { pt: 0, member: 0, plan: 0, total: 0 };
    b.employees.forEach(e => {
      const es = (DAILY[b.id] && DAILY[b.id][e.id]) || {};
      for (const d in es) {
        if (!inDateRange(d, r.from, r.to)) continue;
        if (!byDate[d]) byDate[d] = { pt:0, member:0, plan:0 };
        const pt = +es[d].pt||0, m = +es[d].member||0, pl = +es[d].plan||0;
        byDate[d].pt += pt; byDate[d].member += m; byDate[d].plan += pl;
        gP += pt; gM += m; gPl += pl;
        branchTotals[b.id].pt += pt; branchTotals[b.id].member += m; branchTotals[b.id].plan += pl;
        branchTotals[b.id].total += pt + m + pl;
      }
    });
  });
  const gT = gP + gM + gPl;

  const kpiEl = document.getElementById('ovKpis');
  if (kpiEl) {
    let kpiHtml = '';
    branchesView.forEach(b => {
      const bt = branchTotals[b.id];
      const accent = branchColor(b.id);
      kpiHtml += '<div style="background:#fff;border:1px solid var(--gray-line);border-left:5px solid ' + accent + ';border-radius:12px;padding:14px 16px;box-shadow:0 1px 2px rgba(0,0,0,0.04)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px">' +
        '<div style="font-size:13px;font-weight:800;color:var(--black)"><span style="font-size:16px">' + b.emoji + '</span> สาขา' + b.name + '</div>' +
        '<div style="font-size:14px;font-weight:800;color:' + accent + '" title="PT + MEM">฿' + fmt0(bt.pt + bt.member) + '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
        '<div style="background:#FEF2F2;border-radius:8px;padding:8px 10px"><div style="font-size:10px;font-weight:700;color:#991B1B">💪 PT</div><div style="font-size:13px;font-weight:800;color:#991B1B;margin-top:2px">฿' + fmt0(bt.pt) + '</div></div>' +
        '<div style="background:#F3F4F6;border-radius:8px;padding:8px 10px"><div style="font-size:10px;font-weight:700;color:#1F1F1F">🎫 MEM</div><div style="font-size:13px;font-weight:800;color:#1F1F1F;margin-top:2px">฿' + fmt0(bt.member) + '</div></div>' +
        '<div style="background:#FFFBEB;border-radius:8px;padding:8px 10px"><div style="font-size:10px;font-weight:700;color:#92400E">📋 PLAN</div><div style="font-size:13px;font-weight:800;color:#92400E;margin-top:2px">฿' + fmt0(bt.plan) + '</div></div>' +
        '</div></div>';
    });
    // Grand total card
    kpiHtml += '<div style="background:linear-gradient(135deg,#DC2626,#991B1B);border-radius:12px;padding:14px 16px;color:#fff;box-shadow:0 2px 8px rgba(220,38,38,0.25)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px">' +
      '<div style="font-size:13px;font-weight:800">💰 รวมทั้งหมด</div>' +
      '<div style="font-size:14px;font-weight:800" title="PT + MEM">฿' + fmt0(gP + gM) + '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
      '<div style="background:rgba(255,255,255,0.18);border-radius:8px;padding:8px 10px"><div style="font-size:10px;font-weight:700;opacity:0.9">💪 PT</div><div style="font-size:13px;font-weight:800;margin-top:2px">฿' + fmt0(gP) + '</div></div>' +
      '<div style="background:rgba(255,255,255,0.18);border-radius:8px;padding:8px 10px"><div style="font-size:10px;font-weight:700;opacity:0.9">🎫 MEM</div><div style="font-size:13px;font-weight:800;margin-top:2px">฿' + fmt0(gM) + '</div></div>' +
      '<div style="background:rgba(255,255,255,0.18);border-radius:8px;padding:8px 10px"><div style="font-size:10px;font-weight:700;opacity:0.9">📋 PLAN</div><div style="font-size:13px;font-weight:800;margin-top:2px">฿' + fmt0(gPl) + '</div></div>' +
      '</div></div>';
    kpiEl.innerHTML = kpiHtml;
    kpiEl.style.display = 'grid';
    kpiEl.style.gridTemplateColumns = 'repeat(auto-fit, minmax(260px, 1fr))';
    kpiEl.style.gap = '14px';
    kpiEl.style.marginBottom = '18px';
  }

  // Per-branch daily totals
  const days = Object.keys(byDate).sort();
  const branchDailyByDate = {};
  branchesView.forEach(b => { branchDailyByDate[b.id] = {}; days.forEach(d => { branchDailyByDate[b.id][d] = 0; }); });
  branchesView.forEach(b => b.employees.forEach(e => {
    const es = (DAILY[b.id] && DAILY[b.id][e.id]) || {};
    for (const d in es) {
      if (!inDateRange(d, r.from, r.to)) continue;
      const tot = (+es[d].pt||0) + (+es[d].member||0);
      if (branchDailyByDate[b.id][d] === undefined) branchDailyByDate[b.id][d] = 0;
      branchDailyByDate[b.id][d] += tot;
    }
  }));

  // Render per-branch color picker into the dedicated container
  const colorBox = document.getElementById('ovBranchColors');
  if (colorBox) {
    colorBox.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
      '<div style="font-size:13px;font-weight:700"><span>🎨</span> ปรับสีสาขา (กราฟภาพรวม)</div>' +
      '<button type="button" id="ovColorReset" style="padding:6px 12px;border:1px solid var(--gray-line);background:#fff;border-radius:7px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700">↺ รีเซ็ตสีเริ่มต้น</button>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
      BRANCHES.map(b => {
        const c = branchColor(b.id);
        return '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--black);background:#FAFAFA;padding:6px 12px;border-radius:8px;border:1px solid var(--gray-line)">' +
          b.emoji + ' ' + b.name +
          ' <input type="color" data-ov-bid="' + b.id + '" value="' + c + '" style="width:34px;height:26px;border:none;cursor:pointer;padding:0;background:transparent">' +
          '<span style="font-family:monospace;font-size:11px;color:var(--gray-text)" data-ov-bhex="' + b.id + '">' + c.toUpperCase() + '</span></label>';
      }).join('') +
      '</div>';

    colorBox.querySelectorAll('input[data-ov-bid]').forEach(inp => {
      inp.oninput = e => {
        const bid = inp.dataset.ovBid;
        setBranchColor(bid, e.target.value);
        const hexEl = colorBox.querySelector('[data-ov-bhex="' + bid + '"]');
        if (hexEl) hexEl.textContent = e.target.value.toUpperCase();
        if (ovDailyChart && ovDailyChart.data && ovDailyChart.data.datasets) {
          const idx = BRANCHES.findIndex(b => b.id === bid);
          if (idx >= 0 && ovDailyChart.data.datasets[idx]) {
            ovDailyChart.data.datasets[idx].backgroundColor = e.target.value;
            ovDailyChart.update('none');
          }
        }
      };
    });
    const rstBtn = colorBox.querySelector('#ovColorReset');
    if (rstBtn) rstBtn.onclick = () => { resetBranchColors(); renderOverviewView(); showToast('↺ คืนค่าสีสาขา'); };
  }

  if (ovDailyChart) ovDailyChart.destroy();
  ovDailyChart = new Chart(document.getElementById('ovDailyChart'), {
    type: 'bar',
    data: { labels: days, datasets: branchesView.map(b => ({
      label: b.emoji + ' สาขา' + b.name,
      data: days.map(d => branchDailyByDate[b.id][d] || 0),
      backgroundColor: branchColor(b.id),
      borderRadius: 4
    }))},
    options: { responsive:true, maintainAspectRatio:false,
      layout: { padding: { top: 24 } },
      plugins: { legend: { position:'bottom', labels: { padding:10, font:{ size:11, weight:600 } } },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ฿' + fmt0(c.raw) } },
        datalabels: { anchor: 'end', align: 'end', offset: 2, font: { size: 8, weight: 700 }, rotation: -90 } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#1F1F1F' } },
        y: { beginAtZero: true, ticks: { callback: v => '฿'+fmtInt(v), font: { size: 10 } }, grid: { color:'#F3F4F6' } }
      }
    }
  });

  renderOverviewEmpBreakdown(r);
}

// Per-employee breakdown grouped by branch (Overview page) — full emp-card style.
// KPI is anchored to today's calendar month: kpi = min(day_of_today, 30) × 5000;
// auto-resets on the 1st of each month. The range filter only affects the
// PT/MEM/PLAN/total numbers shown on the card.
function renderOverviewEmpBreakdown(r) {
  const box = document.getElementById('ovEmpBreakdown');
  if (!box) return;
  const todayDate = todayBKK();
  const kpiTarget = monthlyKPITarget(todayDate);
  let html = '';
  filteredBranches().forEach(b => {
    const rows = b.employees.map(e => {
      const es = (DAILY[b.id] && DAILY[b.id][e.id]) || {};
      let pt = 0, mem = 0, plan = 0, days = 0;
      for (const d in es) {
        if (!inDateRange(d, r.from, r.to)) continue;
        const _pt = +es[d].pt || 0, _m = +es[d].member || 0, _pl = +es[d].plan || 0;
        if (_pt || _m || _pl) days++;
        pt += _pt; mem += _m; plan += _pl;
      }
      const mtd = empMTDPTMem(b.id, e.id, todayDate);
      return { emp: e, pt, mem, plan, days, total: pt + mem, mtd };
    }).sort((a, b) => b.mtd - a.mtd);

    const branchSum = rows.reduce((s, x) => s + x.total, 0);
    const accent = branchColor(b.id);

    html += '<div class="card" style="margin-bottom:12px;border-left:5px solid ' + accent + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:10px;border-bottom:1px solid var(--gray-line);margin-bottom:12px">' +
      '<h3 style="margin:0;border:none;padding:0;font-size:15px"><span>' + b.emoji + '</span> สาขา' + b.name + ' <span style="font-size:11px;color:var(--gray-text);font-weight:500;margin-left:6px">(' + rows.length + ' คน)</span></h3>' +
      '<div style="font-size:13px;font-weight:800;color:' + accent + '">รวม PT+MEM: ฿' + fmt0(branchSum) + '</div>' +
      '</div>';

    if (!rows.length) {
      html += '<div class="empty-state" style="padding:14px">ยังไม่มีพนักงาน</div>';
    } else {
      html += '<div class="employees-grid">';
      rows.forEach((x, i) => {
        const e = x.emp;
        const pos = e.position || 'Sale';
        const pc = posChipClass(pos);
        const pi = posIcon(pos);
        const belowQuota = x.mtd < kpiTarget;
        const shortfall = Math.max(kpiTarget - x.mtd, 0);
        const cardStyle = belowQuota
          ? 'border:2px solid #DC2626;box-shadow:0 0 0 2px rgba(220,38,38,0.08)'
          : '';
        const nameStyle = belowQuota ? 'color:#DC2626' : '';
        const nameTitle = belowQuota
          ? ' title="ยอดสะสมเดือนนี้ยังไม่ถึง KPI (ต้องการ ฿' + fmt0(kpiTarget) + ' · ทำได้ ฿' + fmt0(x.mtd) + ')"'
          : ' title="ถึง KPI แล้ว · ต้องการ ฿' + fmt0(kpiTarget) + ' · ทำได้ ฿' + fmt0(x.mtd) + '"';
        const quotaBadge = belowQuota
          ? '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 9px;background:#FEE2E2;border:1px solid #FCA5A5;border-radius:6px;font-size:11px;margin:0 0 8px"><span style="color:#991B1B;font-weight:700">⚠ ยอดขายขาด</span><span style="color:#7F1D1D;font-weight:800">' + fmt0(shortfall) + '/' + fmt0(kpiTarget) + '</span></div>'
          : '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:5px 9px;background:#DCFCE7;border:1px solid #86EFAC;border-radius:6px;font-size:11px;margin:0 0 8px"><span style="color:#166534;font-weight:700">✅ ถึง KPI ฿' + fmt0(kpiTarget) + '</span><span style="color:#14532D;font-weight:800">เดือนนี้ ฿' + fmt0(x.mtd) + '</span></div>';
        const rankBadge = i === 0 && x.mtd > 0
          ? '<span style="background:#FEF3C7;color:#92400E;font-size:10px;font-weight:800;padding:2px 6px;border-radius:999px;margin-left:6px">🏆 #1</span>'
          : '';
        html += '<div class="emp-card"' + (cardStyle ? ' style="' + cardStyle + '"' : '') + '>' +
          '<div class="emp-card-header">' + avatarHTML(e) +
          '<div class="emp-card-info">' +
          '<div class="emp-card-name"' + (nameStyle ? ' style="' + nameStyle + '"' : '') + nameTitle + '>' + e.name + rankBadge + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:4px">' +
          '<span class="pos-chip ' + pc + '">' + pi + ' ' + pos + '</span>' +
          '</div>' +
          '<div class="emp-card-id">' + e.id + '</div></div></div>' +
          '<div class="emp-card-categories">' +
          '<div class="emp-cat pt"><div class="emp-cat-label">💪 PT</div><div class="emp-cat-value">฿' + fmtShort(x.pt) + '</div></div>' +
          '<div class="emp-cat member"><div class="emp-cat-label">🎫 MEM</div><div class="emp-cat-value">฿' + fmtShort(x.mem) + '</div></div>' +
          '<div class="emp-cat plan"><div class="emp-cat-label">📋 PLAN</div><div class="emp-cat-value">฿' + fmtShort(x.plan) + '</div></div></div>' +
          quotaBadge +
          '<div class="emp-card-total">' +
          '<span class="emp-card-total-label">รวม PT+MEM · ' + x.days + ' วัน</span>' +
          '<span class="emp-card-total-value">฿' + fmt0(x.total) + '</span></div>' +
          '</div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  box.innerHTML = html;
}


// ===== Overview event handlers =====
document.getElementById('ovFrom')?.addEventListener('change', renderOverviewView);
document.getElementById('ovTo')?.addEventListener('change', renderOverviewView);
document.getElementById('ovPreset')?.addEventListener('change', ev => {
  const v = ev.target.value; if (!v) return;
  const t = nowBKK(); const p = n => String(n).padStart(2,'0');
  const iso = d => d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
  let f = '', to = '';
  if (v === 'today') { f = iso(t); to = iso(t); }
  else if (v === 'yesterday') { const y = new Date(t); y.setDate(y.getDate()-1); f = iso(y); to = iso(y); }
  else if (v === 'week') { const w = new Date(t); w.setDate(w.getDate()-6); f = iso(w); to = iso(t); }
  else if (v === 'month') { f = iso(new Date(t.getFullYear(), t.getMonth(), 1)); to = iso(new Date(t.getFullYear(), t.getMonth()+1, 0)); }
  else if (v === 'lastmonth') { f = iso(new Date(t.getFullYear(), t.getMonth()-1, 1)); to = iso(new Date(t.getFullYear(), t.getMonth(), 0)); }
  else if (v === 'all') { f = ''; to = ''; }
  if(document.getElementById('ovFrom'))document.getElementById('ovFrom').value = f;
  if(document.getElementById('ovTo'))document.getElementById('ovTo').value = to;
  renderOverviewView();
  ev.target.value = '';
});

// Default overview date range = current month
(function initOv(){
  const t = nowBKK(); const p = n => String(n).padStart(2,'0');
  const first = t.getFullYear() + '-' + p(t.getMonth()+1) + '-01';
  const last = t.getFullYear() + '-' + p(t.getMonth()+1) + '-' + p(new Date(t.getFullYear(), t.getMonth()+1, 0).getDate());
  if(document.getElementById('ovFrom'))document.getElementById('ovFrom').value = first;
  if(document.getElementById('ovTo'))document.getElementById('ovTo').value = last;
})();


// ===== Employees view (formerly Add Sales) with inline input + position dropdown =====
function renderAddSalesView() {
  renderSidebar();
  const today = todayBKK();
  const container = document.getElementById('addSalesContainer');
  container.innerHTML = BRANCHES.map(br => {
    if (!br.employees.length) {
      return '<div class="card"><h3>' + br.emoji + ' สาขา' + br.name + '</h3><div class="empty-state">ยังไม่มีพนักงาน</div></div>';
    }
    return '<div class="card" style="margin-bottom:20px">' +
      '<h3><span>' + br.emoji + '</span> สาขา' + br.name + ' <span style="font-size:11px;color:var(--gray-text);font-weight:400;margin-left:6px">(' + br.employees.length + ' คน)</span></h3>' +
      '<div class="employees-grid">' +
      br.employees.map(e => {
        const t = empDailyTotals(br.id, e.id);
        const pos = e.position || 'Sale';
        const pc = posChipClass(pos);
        const pi = posIcon(pos);
        const todayEntry = (DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][today]) || {pt:'', member:'', plan:''};
        return '<div class="emp-card">' +
          '<div class="emp-card-header">' + avatarHTML(e) +
          '<div class="emp-card-info">' +
          '<div class="emp-card-name">' + e.name + '</div>' +
          '<select class="inline-pos-select ' + pc + '" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
          posOptionsHTML(pos, true) +
          '</select>' +
          '<div class="emp-card-id">' + e.id + '</div></div></div>' +
          '<div class="emp-card-categories">' +
          '<div class="emp-cat pt"><div class="emp-cat-label">💪 PT</div><div class="emp-cat-value">฿' + fmtShort(t.pt) + '</div></div>' +
          '<div class="emp-cat member"><div class="emp-cat-label">🎫 MEM</div><div class="emp-cat-value">฿' + fmtShort(t.member) + '</div></div>' +
          '<div class="emp-cat plan"><div class="emp-cat-label">📋 PLAN</div><div class="emp-cat-value">฿' + fmtShort(t.plan) + '</div></div></div>' +
          '<div class="emp-card-total">' +
          '<span class="emp-card-total-label">รวม ' + t.days + ' วัน</span>' +
          '<span class="emp-card-total-value">฿' + fmt0(t.total) + '</span></div>' +
          '<div class="inline-sales-form" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
          '<div class="inline-date-row">' +
          '<label>📅</label><input type="date" class="inline-date" value="' + today + '">' +
          '</div>' +
          '<div class="inline-input-row"><span class="inline-label pt">💪 PT</span><input type="number" class="inline-pt" placeholder="0" min="0" value="' + (todayEntry.pt||'') + '"></div>' +
          '<div class="inline-input-row"><span class="inline-label member">🎫 MEM</span><input type="number" class="inline-member" placeholder="0" min="0" value="' + (todayEntry.member||'') + '"></div>' +
          '<div class="inline-input-row"><span class="inline-label plan">📋 PLAN</span><input type="number" class="inline-plan" placeholder="0" min="0" value="' + (todayEntry.plan||'') + '"></div>' +
          '<button type="button" class="emp-card-btn primary inline-save-btn">💾 บันทึกยอดวันนี้</button>' +
          '<button type="button" class="emp-card-btn" style="margin-top:4px;background:transparent;color:var(--red-dark);border:1px solid var(--gray-line)" data-open-modal="' + br.id + '|' + e.id + '">📋 ดูประวัติ / แก้ไขวันอื่น</button>' +
          '</div></div>';
      }).join('') +
      '</div></div>';
  }).join('');

  // Position dropdown change
  container.querySelectorAll('.inline-pos-select').forEach(sel => {
    sel.onchange = () => {
      const bid = sel.dataset.bid;
      const eid = sel.dataset.eid;
      const branch = getBranch(bid);
      const emp = branch.employees.find(x => x.id === eid);
      if (emp) {
        emp.position = sel.value;
        saveBranches();
        showToast('✓ อัปเดตตำแหน่ง ' + emp.name);
        renderAddSalesView();
      }
    };
  });

  // Inline save
  container.querySelectorAll('.inline-save-btn').forEach(btn => {
    btn.onclick = () => {
      const form = btn.closest('.inline-sales-form');
      const bid = form.dataset.bid;
      const eid = form.dataset.eid;
      const date = form.querySelector('.inline-date').value;
      if (!date) { showToast('⚠ เลือกวันที่', true); return; }
      const pt = +form.querySelector('.inline-pt').value||0;
      const m  = +form.querySelector('.inline-member').value||0;
      const pl = +form.querySelector('.inline-plan').value||0;
      if (pt===0 && m===0 && pl===0) { if (!confirm('ยอดทั้ง 3 หมวดเป็น 0 — บันทึก?')) return; }
      if (!DAILY[bid]) DAILY[bid] = {};
      if (!DAILY[bid][eid]) DAILY[bid][eid] = {};
      DAILY[bid][eid][date] = { pt, member: m, plan: pl };
      saveDaily();
      if (pt || m || pl) logSale(bid, eid, date, pt, m, pl);
      renderAddSalesView();
      showToast('✓ บันทึก ' + empName(eid) + ' วันที่ ' + date);
    };
  });

  // Open full modal for history
  container.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.onclick = () => {
      const [bid, eid] = btn.dataset.openModal.split('|');
      activeBranch = bid;
      openDailyModal(eid);
    };
  });
}

// ===== Summary Chart view — split by branch =====
let scBranchCharts = {};
function renderSummaryChartView() {
  renderSidebar();
  const container = document.getElementById('summaryChartView');

  Object.values(scBranchCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  scBranchCharts = {};

  let html = '<div class="main-title-row">' +
    '<h2 class="main-title"><span>📊</span><span>กราฟสรุปยอดขาย (แยกตามสาขา)</span></h2>' +
    '<div style="font-size:12px;color:var(--gray-text)">ดึงจาก "พนักงาน" (DAILY)</div>' +
    '</div>';

  // Color customizer (applies to the 3-branch comparison chart only)
  const branchALbl = (getBranch('srinakarin') || { emoji: '🌆', name: 'ศรีนครินทร์' });
  const branchBLbl = (getBranch('sriracha')   || { emoji: '🌊', name: 'ศรีราชา'   });
  const branchCLbl = (getBranch('srisaman')   || { emoji: '🏙️', name: 'ศรีสมาน'   });
  html += '<div class="card" style="margin-bottom:16px;padding:12px 16px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
    '<div style="font-size:13px;font-weight:700"><span>🎨</span> ปรับสีกราฟเปรียบเทียบยอดรวม</div>' +
    '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
    '<label style="font-size:11px;color:var(--gray-text);font-weight:600">ชุดสีสำเร็จ:</label>' +
    '<select id="scColorPreset" class="search-box" style="min-width:180px;padding:6px 10px;font-size:12px">' +
    CHART_COLOR_PRESETS.map(p => '<option value="' + p.id + '">' + p.name + '</option>').join('') +
    '</select>' +
    '<button type="button" id="scColorReset" style="padding:6px 12px;border:1px solid var(--gray-line);background:#fff;border-radius:7px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700">↺ รีเซ็ต</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--black);background:#FAFAFA;padding:6px 12px;border-radius:8px;border:1px solid var(--gray-line)">' +
    branchALbl.emoji + ' ' + branchALbl.name + ' <input type="color" id="scColorA" value="' + CHART_COLORS.a + '" style="width:34px;height:26px;border:none;cursor:pointer;padding:0;background:transparent">' +
    '<span style="font-family:monospace;font-size:11px;color:var(--gray-text)" id="scColorAHex">' + CHART_COLORS.a + '</span></label>' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--black);background:#FAFAFA;padding:6px 12px;border-radius:8px;border:1px solid var(--gray-line)">' +
    branchBLbl.emoji + ' ' + branchBLbl.name + ' <input type="color" id="scColorB" value="' + CHART_COLORS.b + '" style="width:34px;height:26px;border:none;cursor:pointer;padding:0;background:transparent">' +
    '<span style="font-family:monospace;font-size:11px;color:var(--gray-text)" id="scColorBHex">' + CHART_COLORS.b + '</span></label>' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--black);background:#FAFAFA;padding:6px 12px;border-radius:8px;border:1px solid var(--gray-line)">' +
    branchCLbl.emoji + ' ' + branchCLbl.name + ' <input type="color" id="scColorC" value="' + CHART_COLORS.c + '" style="width:34px;height:26px;border:none;cursor:pointer;padding:0;background:transparent">' +
    '<span style="font-family:monospace;font-size:11px;color:var(--gray-text)" id="scColorCHex">' + CHART_COLORS.c + '</span></label>' +
    '</div></div>';

  // Download all
  html += '<div class="card" style="margin-bottom:16px;padding:12px 16px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
    '<div style="font-size:13px;font-weight:700"><span>💾</span> บันทึกกราฟเป็นไฟล์ภาพ</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<button type="button" class="sc-save-all" data-fmt="png" style="padding:7px 14px;border:1px solid var(--red);background:#fff;color:var(--red-dark);border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700">🖼 ดาวน์โหลดทั้งหมด (.png)</button>' +
    '<button type="button" class="sc-save-all" data-fmt="jpg" style="padding:7px 14px;border:1px solid var(--red);background:var(--red);color:#fff;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700">📷 ดาวน์โหลดทั้งหมด (.jpg)</button>' +
    '</div></div></div>';

  // ===== 3-branch comparison: each branch as team A/B/C, no KPI line =====
  const visibleIds = filteredBranches().map(b => b.id);
  const threeGroups = THREE_BRANCH_TEAMS.map(t => {
    if (visibleIds.indexOf(t.id) < 0) return null;
    const br = getBranch(t.id);
    if (!br) return null;
    const rows = br.employees
      .map(e => { const d = empDailyTotals(br.id, e.id); return { emp: e, branch: br, team: t.team, ...d, total: d.pt + d.member }; })
      .sort((a, b) => b.total - a.total);
    return { team: t, branch: br, rows: rows };
  }).filter(Boolean);
  const has3 = threeGroups.length === THREE_BRANCH_TEAMS.length;

  if (has3) {
    const branchTotals = threeGroups.map(g => g.rows.reduce((s, r) => s + r.pt + r.member, 0));
    const grandTotal = branchTotals.reduce((s, v) => s + v, 0);
    const sumBoxes = threeGroups.map((g, i) => {
      return '<div style="flex:1;min-width:180px;padding:10px 14px;background:' + g.team.cardBg + ';border-left:4px solid ' + g.team.cardBorder + ';border-radius:8px">' +
        '<div style="font-size:11px;font-weight:700;color:' + g.team.color + '">' + g.branch.emoji + ' สาขา' + g.branch.name + ' · ' + g.rows.length + ' คน</div>' +
        '<div style="font-size:18px;font-weight:800;color:' + g.team.color + ';margin-top:2px">฿' + fmt0(branchTotals[i]) + '</div></div>';
    }).join('') +
    '<div style="flex:1;min-width:180px;padding:10px 14px;background:#FEE2E2;border-left:4px solid #DC2626;border-radius:8px">' +
    '<div style="font-size:11px;font-weight:700;color:#991B1B">💰 ยอดรวม</div>' +
    '<div style="font-size:18px;font-weight:800;color:#991B1B;margin-top:2px">฿' + fmt0(grandTotal) + '</div></div>';
    html += '<div class="card" style="margin-bottom:20px" data-sc-card="three">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:10px;border-bottom:2px solid var(--red);margin-bottom:12px">' +
      '<h3 style="margin:0;border:none;padding:0"><span>🏢</span> เปรียบเทียบยอดรวม PT+MEM ของ 3 สาขา</h3>' +
      '<div style="display:flex;gap:6px">' +
      '<button type="button" class="sc-save-three" data-fmt="png" style="padding:6px 12px;border:1px solid var(--gray-line);background:#fff;border-radius:7px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--red-dark)">🖼 .PNG</button>' +
      '<button type="button" class="sc-save-three" data-fmt="jpg" style="padding:6px 12px;border:1px solid var(--gray-line);background:#fff;border-radius:7px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--red-dark)">📷 .JPG</button>' +
      '</div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">' + sumBoxes + '</div>' +
      (grandTotal === 0
        ? '<div style="text-align:center;padding:40px;color:var(--gray-text);font-size:12px">— ยังไม่มียอดขาย —</div>'
        : '<div class="chart-wrap" style="height:380px"><canvas id="scThreeBranch"></canvas></div>'
      ) +
      '</div>';
  }

  filteredBranches().forEach(br => {
    const empsA = br.employees.filter(e => (e.team || 'A') === 'A')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, ...t, total: t.pt + t.member }; })
      .sort((a, b) => b.total - a.total);
    const empsB = br.employees.filter(e => (e.team || 'A') === 'B')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, ...t, total: t.pt + t.member }; })
      .sort((a, b) => b.total - a.total);
    const totA = empsA.reduce((s, r) => s + r.total, 0);
    const totB = empsB.reduce((s, r) => s + r.total, 0);
    const totBr = totA + totB;
    const totalCount = empsA.length + empsB.length;
    const chartH = Math.max(360, totalCount * 32 + 100);

    html += '<div class="card" style="margin-bottom:20px" data-sc-card="' + br.id + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:10px;border-bottom:2px solid var(--red);margin-bottom:12px">' +
      '<h3 style="margin:0;border:none;padding:0"><span>' + br.emoji + '</span> สาขา' + br.name + '</h3>' +
      '<div style="display:flex;gap:6px">' +
      '<button type="button" class="sc-save-btn" data-bid="' + br.id + '" data-fmt="png" style="padding:6px 12px;border:1px solid var(--gray-line);background:#fff;border-radius:7px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--red-dark)">🖼 .PNG</button>' +
      '<button type="button" class="sc-save-btn" data-bid="' + br.id + '" data-fmt="jpg" style="padding:6px 12px;border:1px solid var(--gray-line);background:#fff;border-radius:7px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;color:var(--red-dark)">📷 .JPG</button>' +
      '</div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">' +
      '<div style="flex:1;min-width:180px;padding:10px 14px;background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:8px">' +
      '<div style="font-size:11px;font-weight:700;color:#92400E">A · ' + empsA.length + ' คน</div>' +
      '<div style="font-size:18px;font-weight:800;color:#92400E;margin-top:2px">฿' + fmt0(totA) + '</div></div>' +
      '<div style="flex:1;min-width:180px;padding:10px 14px;background:#DBEAFE;border-left:4px solid #2563EB;border-radius:8px">' +
      '<div style="font-size:11px;font-weight:700;color:#1E40AF">B · ' + empsB.length + ' คน</div>' +
      '<div style="font-size:18px;font-weight:800;color:#1E40AF;margin-top:2px">฿' + fmt0(totB) + '</div></div>' +
      '<div style="flex:1;min-width:180px;padding:10px 14px;background:#FEE2E2;border-left:4px solid #DC2626;border-radius:8px">' +
      '<div style="font-size:11px;font-weight:700;color:#991B1B">💰 รวมทั้งสาขา</div>' +
      '<div style="font-size:18px;font-weight:800;color:#991B1B;margin-top:2px">฿' + fmt0(totBr) + '</div></div>' +
      '</div>' +
      (totalCount === 0
        ? '<div style="text-align:center;padding:40px;color:var(--gray-text);font-size:12px">— ไม่มีพนักงานในสาขานี้ —</div>'
        : '<div class="chart-wrap" style="height:' + chartH + 'px"><canvas id="scCombined_' + br.id + '"></canvas></div>'
      ) +
      '</div>';
  });

  container.innerHTML = html;

  // Plugin to draw one or more KPI threshold lines across the chart
  const kpiLinePlugin = {
    id: 'kpiLine',
    afterDatasetsDraw(chart, _args, opts) {
      const lines = (opts && opts.lines) ? opts.lines
                  : (opts && opts.value) ? [{ value: opts.value, color: '#DC2626', label: 'KPI' }]
                  : null;
      if (!lines || !lines.length) return;
      const { ctx, chartArea, scales } = chart;
      const yScale = scales.y;
      if (!yScale || !chartArea) return;
      ctx.save();
      lines.forEach(line => {
        const y = yScale.getPixelForValue(line.value);
        if (y < chartArea.top || y > chartArea.bottom) return;
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
        const label = '฿' + fmtShort(line.value);
        ctx.font = 'bold 11px "Segoe UI","Noto Sans Thai",Arial,sans-serif';
        const tw = ctx.measureText(label).width;
        const pad = 6;
        const boxX = chartArea.right - tw - pad * 2 - 4;
        const boxY = y - 9;
        ctx.fillStyle = line.color;
        ctx.fillRect(boxX, boxY, tw + pad * 2, 18);
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, boxX + pad, boxY + 9);
      });
      ctx.restore();
    }
  };

  // Plugin to draw team A/B background zones and divider on combined chart
  const teamZonePlugin = {
    id: 'teamZones',
    beforeDraw(chart, _args, opts) {
      const cnt = opts && opts.aCount;
      const tot = opts && opts.totalCount;
      if (!tot || cnt === undefined) return;
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;
      const xScale = scales.x;
      if (!xScale) return;
      ctx.save();
      if (cnt > 0) {
        const rightEdge = cnt < tot
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.right;
        ctx.fillStyle = 'rgba(245,158,11,0.08)';
        ctx.fillRect(chartArea.left, chartArea.top, rightEdge - chartArea.left, chartArea.bottom - chartArea.top);
      }
      if (cnt < tot) {
        const leftEdge = cnt > 0
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.left;
        ctx.fillStyle = 'rgba(37,99,235,0.08)';
        ctx.fillRect(leftEdge, chartArea.top, chartArea.right - leftEdge, chartArea.bottom - chartArea.top);
        if (cnt > 0) {
          ctx.strokeStyle = 'rgba(31,31,31,0.4)';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(leftEdge, chartArea.top);
          ctx.lineTo(leftEdge, chartArea.bottom);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 12px "Segoe UI","Noto Sans Thai",Arial,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      if (cnt > 0) {
        const aMid = (chartArea.left + (cnt < tot
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.right)) / 2;
        ctx.fillText('A', aMid, chartArea.top + 2);
      }
      if (cnt < tot) {
        ctx.fillStyle = '#1E40AF';
        const bLeft = cnt > 0
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.left;
        const bMid = (bLeft + chartArea.right) / 2;
        ctx.fillText('B', bMid, chartArea.top + 2);
      }
      ctx.restore();
    }
  };

  if (has3) {
    const branchTotals = threeGroups.map(g => g.rows.reduce((s, r) => s + r.pt + r.member, 0));
    if (branchTotals.some(v => v > 0)) {
      const ctx3 = document.getElementById('scThreeBranch');
      if (ctx3) {
        const labels = threeGroups.map(g => g.branch.emoji + ' ' + g.branch.name);
        const colors = [CHART_COLORS.a, CHART_COLORS.b, CHART_COLORS.c];
        scBranchCharts['three_combined'] = new Chart(ctx3, {
          type: 'bar',
          data: { labels: labels, datasets: [
            { label: 'ยอดรวม PT + MEMBER', data: branchTotals, backgroundColor: colors, borderRadius: 8, maxBarThickness: 110 }
          ]},
          options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
            layout: { padding: { top: 24 } },
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: {
                title: items => items.length ? threeGroups[items[0].dataIndex].branch.emoji + ' สาขา' + threeGroups[items[0].dataIndex].branch.name : '',
                label: c => 'ยอดรวม PT+MEM: ฿' + fmt0(c.raw)
              } },
              datalabels: {
                display: ctx => (ctx.dataset.data[ctx.dataIndex] || 0) > 0,
                anchor: 'end', align: 'end', offset: 4,
                color: '#1F1F1F', font: { size: 14, weight: 800 },
                formatter: v => '฿' + fmt0(v)
              }
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#1F1F1F', font: { weight: 700, size: 12 } } },
              y: { beginAtZero: true, ticks: { callback: v => '฿' + fmtInt(v), font: { size: 11 } }, grid: { color: '#F3F4F6' } }
            }
          }
        });
      }
    }
  }

  filteredBranches().forEach(br => {
    const empsA = br.employees.filter(e => (e.team || 'A') === 'A')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, team: 'A', ...t, total: t.pt + t.member }; })
      .sort((a, b) => b.total - a.total);
    const empsB = br.employees.filter(e => (e.team || 'A') === 'B')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, team: 'B', ...t, total: t.pt + t.member }; })
      .sort((a, b) => b.total - a.total);
    const all = empsA.concat(empsB);
    if (!all.length) return;

    const ctx = document.getElementById('scCombined_' + br.id);
    if (!ctx) return;

    const labels = all.map(x => x.emp.name);
    const ptData = all.map(x => x.pt);
    const memData = all.map(x => x.member);
    const planData = all.map(x => x.plan);
    scBranchCharts['c_' + br.id] = new Chart(ctx, {
      type: 'bar',
      data: { labels: labels, datasets: [
        { label: '💪 PT', data: ptData, backgroundColor: ptData.map(kpiBarColor), borderRadius: 4 },
        { label: '🎫 MEMBER', data: memData, backgroundColor: memData.map(kpiBarColor), borderRadius: 4 },
        { label: '📋 PLAN', data: planData, backgroundColor: PLAN_BAR_COLOR, borderRadius: 4 }
      ]},
      options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
        layout: { padding: { top: 30 } },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 10, font: { size: 11, weight: 600 },
            generateLabels: () => [
              { text: 'PT/MEM ยังไม่ถึง 85K',  fillStyle: KPI_TIER_COLORS.red,    strokeStyle: KPI_TIER_COLORS.red,    lineWidth: 0, hidden: false },
              { text: 'PT/MEM ถึง 85K',        fillStyle: KPI_TIER_COLORS.yellow, strokeStyle: KPI_TIER_COLORS.yellow, lineWidth: 0, hidden: false },
              { text: 'PT/MEM ถึง 150K',       fillStyle: KPI_TIER_COLORS.green,  strokeStyle: KPI_TIER_COLORS.green,  lineWidth: 0, hidden: false },
              { text: '📋 PLAN',                fillStyle: PLAN_BAR_COLOR,         strokeStyle: PLAN_BAR_COLOR,         lineWidth: 0, hidden: false }
            ]
          }, onClick: () => {} },
          tooltip: { callbacks: {
            title: items => {
              if (!items.length) return '';
              const i = items[0].dataIndex;
              return all[i].emp.name + ' · ' + all[i].team;
            },
            label: c => c.dataset.label + ': ฿' + fmt0(c.raw)
          } },
          datalabels: {
            display: ctx => (ctx.dataset.data[ctx.dataIndex] || 0) > 0,
            anchor: 'end', align: 'end', offset: 2,
            color: '#1F1F1F', font: { size: 9, weight: 700 },
            formatter: v => '฿' + fmtShort(v)
          },
          teamZones: { aCount: empsA.length, totalCount: all.length },
          kpiLine: { lines: KPI_LINES }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#1F1F1F', font: { weight: 600, size: 10 } } },
          y: { beginAtZero: true, suggestedMax: KPI_THRESHOLD_MAX * 1.1, ticks: { callback: v => '฿' + fmtInt(v), font: { size: 10 } }, grid: { color: '#F3F4F6' } }
        }
      },
      plugins: [teamZonePlugin, kpiLinePlugin]
    });
  });

  container.querySelectorAll('.sc-save-btn').forEach(btn => {
    btn.onclick = () => saveBranchChart(btn.dataset.bid, btn.dataset.fmt);
  });
  container.querySelectorAll('.sc-save-three').forEach(btn => {
    btn.onclick = () => saveThreeBranchChart(btn.dataset.fmt);
  });
  container.querySelectorAll('.sc-save-all').forEach(btn => {
    btn.onclick = () => {
      const fmt = btn.dataset.fmt;
      let saved = 0;
      if (saveThreeBranchChart(fmt, true)) saved++;
      BRANCHES.forEach(br => { if (saveBranchChart(br.id, fmt, true)) saved++; });
      showToast(saved ? '✓ ดาวน์โหลด ' + saved + ' ไฟล์ .' + fmt : '⚠ ไม่มีกราฟ', !saved);
    };
  });

  function applyColorsLive() {
    // Color picker now controls ONLY the 3-branch comparison chart.
    const ch = scBranchCharts['three_combined'];
    if (ch && ch.data && ch.data.datasets[0]) {
      ch.data.datasets[0].backgroundColor = [CHART_COLORS.a, CHART_COLORS.b, CHART_COLORS.c];
      ch.update('none');
    }
    ['a','b','c'].forEach(k => {
      const ID = k.toUpperCase();
      const hex = document.getElementById('scColor' + ID + 'Hex');
      if (hex) hex.textContent = CHART_COLORS[k].toUpperCase();
      const inp = document.getElementById('scColor' + ID);
      if (inp) inp.value = CHART_COLORS[k];
    });
  }

  const aInput = document.getElementById('scColorA');
  if (aInput) aInput.oninput = e => { CHART_COLORS.a = e.target.value; saveChartColors(); applyColorsLive(); };
  const bInput = document.getElementById('scColorB');
  if (bInput) bInput.oninput = e => { CHART_COLORS.b = e.target.value; saveChartColors(); applyColorsLive(); };
  const cInput = document.getElementById('scColorC');
  if (cInput) cInput.oninput = e => { CHART_COLORS.c = e.target.value; saveChartColors(); applyColorsLive(); };

  const presetSel = document.getElementById('scColorPreset');
  if (presetSel) {
    const cur = CHART_COLOR_PRESETS.find(p => p.a === CHART_COLORS.a && p.b === CHART_COLORS.b && p.c === CHART_COLORS.c);
    presetSel.value = cur ? cur.id : 'default';
    presetSel.onchange = () => {
      const p = CHART_COLOR_PRESETS.find(x => x.id === presetSel.value);
      if (!p) return;
      CHART_COLORS.a = p.a; CHART_COLORS.b = p.b; CHART_COLORS.c = p.c;
      saveChartColors(); applyColorsLive();
      showToast('🎨 ใช้ชุดสี "' + p.name + '"');
    };
  }

  const resetBtn = document.getElementById('scColorReset');
  if (resetBtn) resetBtn.onclick = () => {
    CHART_COLORS = Object.assign({}, DEFAULT_CHART_COLORS);
    saveChartColors(); applyColorsLive();
    if (presetSel) presetSel.value = 'default';
    showToast('↺ คืนค่าสีเริ่มต้น');
  };
}

// ===== Rolling 1-year window (BKK) =====
// Returns {from, to} as YYYY-MM-DD covering today and the 12 calendar months prior.
function oneYearRangeBKK() {
  const to = todayBKK();
  const d = nowBKK();
  d.setFullYear(d.getFullYear() - 1);
  d.setDate(d.getDate() + 1); // exclusive of "today minus 1 year" → starts the day after
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return { from: y + '-' + m + '-' + day, to: to };
}
function thaiDate(s) {
  if (!s) return '';
  return new Date(s).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' });
}

function renderYearSalesView() {
  renderSidebar();
  const r = oneYearRangeBKK();
  const badge = document.getElementById('ysRangeBadge');
  if (badge) badge.innerHTML = '🗓 ช่วง: <strong style="margin-left:4px">' + thaiDate(r.from) + ' — ' + thaiDate(r.to) + '</strong> <span style="color:var(--gray-text);font-weight:600;margin-left:6px">(ย้อนหลัง 12 เดือน · อัปเดตอัตโนมัติทุกวัน · เฉพาะ PT+MEM)</span>';

  const branchesView = filteredBranches();
  let gPT = 0, gMEM = 0, gDays = 0;
  const branchTotals = branchesView.map(br => {
    let pt = 0, mem = 0, days = 0;
    const empRows = br.employees.map(e => {
      const es = (DAILY[br.id] && DAILY[br.id][e.id]) || {};
      let ept = 0, em = 0, ed = 0;
      for (const d in es) {
        if (d < r.from || d > r.to) continue;
        const x = es[d];
        const a = +x.pt || 0, b = +x.member || 0;
        if (!a && !b) continue;
        ept += a; em += b; ed++;
      }
      pt += ept; mem += em; days += ed;
      return { emp: e, pt: ept, member: em, days: ed, total: ept + em };
    }).sort((a, b) => b.total - a.total);
    return { branch: br, pt: pt, member: mem, days: days, total: pt + mem, emps: empRows };
  });
  branchTotals.forEach(b => { gPT += b.pt; gMEM += b.member; gDays += b.days; });
  const gT = gPT + gMEM;

  let html =
    '<div class="kpi-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:18px">' +
    '<div style="background:linear-gradient(135deg,#DC2626,#991B1B);color:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 2px 10px rgba(220,38,38,0.25)">' +
      '<div style="font-size:12px;font-weight:700;opacity:0.9">💰 ยอดขายสะสมทั้งหมด</div>' +
      '<div style="font-size:26px;font-weight:900;margin-top:4px">฿' + fmt0(gT) + '</div>' +
      '<div style="font-size:11px;opacity:0.85;margin-top:4px">PT + MEMBER · ' + gDays + ' วันที่บันทึก</div>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid var(--gray-line);border-left:5px solid #991B1B;border-radius:12px;padding:16px 18px">' +
      '<div style="font-size:12px;font-weight:700;color:#991B1B">💪 ยอด PT</div>' +
      '<div style="font-size:22px;font-weight:900;color:#991B1B;margin-top:4px">฿' + fmt0(gPT) + '</div>' +
      '<div style="font-size:11px;color:var(--gray-text);margin-top:4px">' + (gT ? Math.round(gPT / gT * 100) : 0) + '% ของยอดรวม</div>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid var(--gray-line);border-left:5px solid #1F1F1F;border-radius:12px;padding:16px 18px">' +
      '<div style="font-size:12px;font-weight:700;color:#1F1F1F">🎫 ยอด MEMBER</div>' +
      '<div style="font-size:22px;font-weight:900;color:#1F1F1F;margin-top:4px">฿' + fmt0(gMEM) + '</div>' +
      '<div style="font-size:11px;color:var(--gray-text);margin-top:4px">' + (gT ? Math.round(gMEM / gT * 100) : 0) + '% ของยอดรวม</div>' +
    '</div>' +
    '</div>';

  // Per-branch cards (only employees who have any PT+MEM in the year)
  branchTotals.forEach(b => {
    const accent = branchColor(b.branch.id);
    const activeEmps = b.emps.filter(e => e.total > 0);
    html += '<div class="card" style="margin-bottom:16px;border-left:5px solid ' + accent + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-bottom:10px;margin-bottom:12px;border-bottom:1px dashed var(--gray-line)">' +
      '<h3 style="margin:0;border:none;padding:0"><span>' + b.branch.emoji + '</span> สาขา' + b.branch.name + '</h3>' +
      '<div style="font-size:18px;font-weight:900;color:' + accent + '">฿' + fmt0(b.total) + '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:12px">' +
      '<div style="background:#FEF2F2;border-radius:8px;padding:10px 12px"><div style="font-size:11px;font-weight:700;color:#991B1B">💪 PT</div><div style="font-size:16px;font-weight:800;color:#991B1B;margin-top:2px">฿' + fmt0(b.pt) + '</div></div>' +
      '<div style="background:#F3F4F6;border-radius:8px;padding:10px 12px"><div style="font-size:11px;font-weight:700;color:#1F1F1F">🎫 MEMBER</div><div style="font-size:16px;font-weight:800;color:#1F1F1F;margin-top:2px">฿' + fmt0(b.member) + '</div></div>' +
      '<div style="background:#FEE2E2;border-radius:8px;padding:10px 12px"><div style="font-size:11px;font-weight:700;color:#991B1B">📅 วันที่บันทึก</div><div style="font-size:16px;font-weight:800;color:#991B1B;margin-top:2px">' + b.days + ' วัน</div></div>' +
      '</div>' +
      (activeEmps.length
        ? '<div style="font-size:12px;font-weight:700;color:var(--gray-text);margin-bottom:6px">🏅 พนักงานที่มียอดขาย (' + activeEmps.length + ' คน)</div>' +
          '<div style="display:flex;flex-direction:column;gap:6px">' +
          activeEmps.map((e, i) => '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;background:#FAFAFA;border-radius:8px">' +
            '<div style="flex:1;min-width:0;font-size:13px;font-weight:600"><span style="display:inline-block;width:24px;font-weight:800;color:' + accent + '">#' + (i+1) + '</span>' + e.emp.name + ' <span style="font-size:11px;color:var(--gray-text);font-weight:500">· ' + (e.emp.position || 'Sale') + ' · PT ฿' + fmt0(e.pt) + ' · MEM ฿' + fmt0(e.member) + ' · ' + e.days + ' วัน</span></div>' +
            '<div style="font-size:13px;font-weight:800;color:' + accent + ';white-space:nowrap">฿' + fmt0(e.total) + '</div>' +
            '<button type="button" class="ys-edit-btn" data-bid="' + b.branch.id + '" data-eid="' + e.emp.id + '" style="padding:5px 12px;border:1px solid ' + accent + ';background:#fff;color:' + accent + ';border-radius:6px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;white-space:nowrap">✎ แก้ไข</button>' +
            '</div>').join('') +
          '</div>'
        : '<div style="text-align:center;color:var(--gray-text);font-size:12px;padding:14px">— ยังไม่มีพนักงานที่มียอดขายในช่วงนี้ —</div>') +
      '</div>';
  });

  const container = document.getElementById('yearSalesContainer');
  container.innerHTML = html;
  container.querySelectorAll('.ys-edit-btn').forEach(btn => {
    btn.onclick = () => {
      activeBranch = btn.dataset.bid;
      openDailyModal(btn.dataset.eid);
    };
  });
}

function renderYearTrainView() {
  renderSidebar();
  const r = oneYearRangeBKK();
  const badge = document.getElementById('ytRangeBadge');
  if (badge) badge.innerHTML = '🗓 ช่วง: <strong style="margin-left:4px">' + thaiDate(r.from) + ' — ' + thaiDate(r.to) + '</strong> <span style="color:var(--gray-text);font-weight:600;margin-left:6px">(ย้อนหลัง 12 เดือน · อัปเดตอัตโนมัติทุกวัน)</span>';

  const branchesView = filteredBranches();
  let gTrain = 0, gTrainers = 0;
  const branchData = branchesView.map(br => {
    const trainers = br.employees.filter(e => isPosPT(e.position));
    const rows = trainers.map(e => {
      const es = (DAILY[br.id] && DAILY[br.id][e.id]) || {};
      let cnt = 0, days = 0;
      for (const d in es) {
        if (d < r.from || d > r.to) continue;
        const t = +es[d].train || 0;
        if (t > 0) { cnt += t; days++; }
      }
      return { emp: e, train: cnt, days: days };
    }).sort((a, b) => b.train - a.train);
    const branchTrain = rows.reduce((s, x) => s + x.train, 0);
    gTrain += branchTrain;
    gTrainers += trainers.length;
    return { branch: br, trainers: trainers.length, train: branchTrain, rows: rows };
  });

  const allRows = branchData.flatMap(b => b.rows.map(r => ({ ...r, branch: b.branch })))
    .sort((a, b) => b.train - a.train);
  const top = allRows.find(x => x.train > 0);
  const topLabel = top ? top.emp.name + ' (' + top.branch.emoji + ' ' + top.branch.name + ')' : '—';

  let html =
    '<div class="kpi-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:18px">' +
    '<div style="background:linear-gradient(135deg,#F59E0B,#92400E);color:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 2px 10px rgba(245,158,11,0.25)">' +
      '<div style="font-size:12px;font-weight:700;opacity:0.9">🏋 จำนวนเทรนรวมทั้งหมด</div>' +
      '<div style="font-size:26px;font-weight:900;margin-top:4px">' + fmtInt(gTrain) + ' <span style="font-size:14px;font-weight:700;opacity:0.9">ครั้ง</span></div>' +
      '<div style="font-size:11px;opacity:0.85;margin-top:4px">รวมทุกสาขา · ' + gTrainers + ' เทรนเนอร์</div>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid var(--gray-line);border-left:5px solid #92400E;border-radius:12px;padding:16px 18px">' +
      '<div style="font-size:12px;font-weight:700;color:#92400E">💪 เทรนเนอร์ทั้งหมด</div>' +
      '<div style="font-size:22px;font-weight:900;color:#92400E;margin-top:4px">' + gTrainers + ' <span style="font-size:14px;font-weight:700;color:var(--gray-text)">คน</span></div>' +
      '<div style="font-size:11px;color:var(--gray-text);margin-top:4px">' + branchesView.length + ' สาขา</div>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid var(--gray-line);border-left:5px solid #92400E;border-radius:12px;padding:16px 18px">' +
      '<div style="font-size:12px;font-weight:700;color:#92400E">🥇 เทรนสูงสุด</div>' +
      '<div style="font-size:22px;font-weight:900;color:#92400E;margin-top:4px">' + fmtInt(top ? top.train : 0) + ' <span style="font-size:14px;font-weight:700;color:var(--gray-text)">ครั้ง</span></div>' +
      '<div style="font-size:11px;color:var(--gray-text);margin-top:4px">' + topLabel + '</div>' +
    '</div>' +
    '<div style="background:#fff;border:1px solid var(--gray-line);border-left:5px solid #92400E;border-radius:12px;padding:16px 18px">' +
      '<div style="font-size:12px;font-weight:700;color:#92400E">📊 เฉลี่ยต่อเทรนเนอร์</div>' +
      '<div style="font-size:22px;font-weight:900;color:#92400E;margin-top:4px">' + fmtInt(gTrainers ? Math.round(gTrain / gTrainers) : 0) + ' <span style="font-size:14px;font-weight:700;color:var(--gray-text)">ครั้ง/คน</span></div>' +
      '<div style="font-size:11px;color:var(--gray-text);margin-top:4px">ตลอด 12 เดือน</div>' +
    '</div>' +
    '</div>';

  // Per-branch cards (only trainers who have any train count in the year)
  const today = todayBKK();
  branchData.forEach(b => {
    const accent = branchColor(b.branch.id);
    const activeRows = b.rows.filter(r => r.train > 0);
    html += '<div class="card" style="margin-bottom:16px;border-left:5px solid ' + accent + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-bottom:10px;margin-bottom:12px;border-bottom:1px dashed var(--gray-line)">' +
      '<h3 style="margin:0;border:none;padding:0"><span>' + b.branch.emoji + '</span> สาขา' + b.branch.name + '</h3>' +
      '<div style="font-size:18px;font-weight:900;color:' + accent + '">🏋 ' + fmtInt(b.train) + ' ครั้ง</div>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--gray-text);margin-bottom:8px">' + b.trainers + ' เทรนเนอร์ · เฉลี่ย ' + (b.trainers ? Math.round(b.train / b.trainers) : 0) + ' ครั้ง/คน</div>' +
      (activeRows.length
        ? '<div style="display:flex;flex-direction:column;gap:6px">' +
          activeRows.map((e, i) => '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 12px;background:#FAFAFA;border-radius:8px">' +
            '<div style="flex:1;min-width:0;font-size:13px;font-weight:600"><span style="display:inline-block;width:24px;font-weight:800;color:' + accent + '">#' + (i+1) + '</span>' + e.emp.name + ' <span style="font-size:11px;color:var(--gray-text);font-weight:500">· ' + e.days + ' วันที่บันทึก</span></div>' +
            '<div style="font-size:13px;font-weight:800;color:' + accent + ';white-space:nowrap">' + fmtInt(e.train) + ' ครั้ง</div>' +
            '<input type="number" class="yt-train-input" data-bid="' + b.branch.id + '" data-eid="' + e.emp.id + '" min="0" step="1" placeholder="+เทรน" style="width:72px;padding:4px 6px;border:1px solid var(--gray-line);border-radius:6px;font-family:inherit;font-size:11px;text-align:right">' +
            '<button type="button" class="yt-add-btn" data-bid="' + b.branch.id + '" data-eid="' + e.emp.id + '" style="padding:5px 12px;border:1px solid ' + accent + ';background:' + accent + ';color:#fff;border-radius:6px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;white-space:nowrap">+ บันทึก</button>' +
            '</div>').join('') +
          '</div>'
        : '<div style="text-align:center;color:var(--gray-text);font-size:12px;padding:14px">— ยังไม่มีเทรนเนอร์ที่มียอดในช่วงนี้ —</div>') +
      '</div>';
  });

  const container = document.getElementById('yearTrainContainer');
  container.innerHTML = html;
  container.querySelectorAll('.yt-add-btn').forEach(btn => {
    btn.onclick = () => {
      const bid = btn.dataset.bid, eid = btn.dataset.eid;
      const input = container.querySelector('.yt-train-input[data-bid="' + bid + '"][data-eid="' + eid + '"]');
      if (!input) return;
      const add = +input.value || 0;
      if (add <= 0) { showToast('⚠ กรอกจำนวนเทรนก่อน', true); return; }
      if (!DAILY[bid]) DAILY[bid] = {};
      if (!DAILY[bid][eid]) DAILY[bid][eid] = {};
      const prev = DAILY[bid][eid][today] || { pt: 0, member: 0, plan: 0, train: 0 };
      DAILY[bid][eid][today] = {
        pt: +prev.pt || 0,
        member: +prev.member || 0,
        plan: +prev.plan || 0,
        train: (+prev.train || 0) + add
      };
      saveDaily();
      logSale(bid, eid, today, 0, 0, 0, add);
      showToast('✓ เพิ่มเทรน ' + add + ' ครั้ง · ' + empName(eid) + ' (' + today + ')');
      renderYearTrainView();
    };
  });
}

// ===== Record Sales view (all employees with inline forms) =====
function renderRecordSalesView() {
  renderSidebar();
  const today = todayBKK();
  const container = document.getElementById('recordSalesContainer');
  container.innerHTML = BRANCHES.map(br => {
    if (!br.employees.length) {
      return '<div class="card"><h3>' + br.emoji + ' สาขา' + br.name + '</h3><div class="empty-state">ยังไม่มีพนักงาน</div></div>';
    }
    return '<div class="card" style="margin-bottom:20px">' +
      '<h3><span>' + br.emoji + '</span> สาขา' + br.name + ' <span style="font-size:11px;color:var(--gray-text);font-weight:400;margin-left:6px">(' + br.employees.length + ' คน)</span></h3>' +
      '<div class="employees-grid">' +
      br.employees.map(e => {
        const t = empDailyTotals(br.id, e.id);
        const pos = e.position || 'Sale';
        const pc = posChipClass(pos);
        const todayEntry = (DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][today]) || {pt:'',member:'',plan:''};
        return '<div class="emp-card">' +
          '<div class="emp-card-header">' + avatarHTML(e) +
          '<div class="emp-card-info">' +
          '<div class="emp-card-name">' + e.name + '</div>' +
          '<select class="inline-pos-select ' + pc + '" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
          posOptionsHTML(pos, true) +
          '</select>' +
          '<div class="emp-card-id">' + e.id + '</div></div></div>' +
          '<div class="emp-card-categories">' +
          '<div class="emp-cat pt"><div class="emp-cat-label">💪 PT</div><div class="emp-cat-value">฿' + fmtShort(t.pt) + '</div></div>' +
          '<div class="emp-cat member"><div class="emp-cat-label">🎫 MEM</div><div class="emp-cat-value">฿' + fmtShort(t.member) + '</div></div>' +
          '<div class="emp-cat plan"><div class="emp-cat-label">📋 PLAN</div><div class="emp-cat-value">฿' + fmtShort(t.plan) + '</div></div></div>' +
          '<div class="emp-card-total">' +
          '<span class="emp-card-total-label">รวม ' + t.days + ' วัน</span>' +
          '<span class="emp-card-total-value">฿' + fmt0(t.total) + '</span></div>' +
          '<div class="inline-sales-form" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
          '<div class="inline-date-row"><label>📅</label><input type="date" class="inline-date" value="' + today + '"></div>' +
          '<div class="inline-input-row"><span class="inline-label pt">💪 PT</span><input type="number" class="inline-pt" placeholder="0" min="0" value="' + (todayEntry.pt||'') + '"></div>' +
          '<div class="inline-input-row"><span class="inline-label member">🎫 MEM</span><input type="number" class="inline-member" placeholder="0" min="0" value="' + (todayEntry.member||'') + '"></div>' +
          '<div class="inline-input-row"><span class="inline-label plan">📋 PLAN</span><input type="number" class="inline-plan" placeholder="0" min="0" value="' + (todayEntry.plan||'') + '"></div>' +
          '<button type="button" class="emp-card-btn inline-save-btn">💾 บันทึกยอดวันนี้</button></div></div>';
      }).join('') +
      '</div></div>';
  }).join('');

  container.querySelectorAll('.inline-pos-select').forEach(sel => {
    sel.onchange = () => {
      const br = getBranch(sel.dataset.bid);
      const emp = br.employees.find(x => x.id === sel.dataset.eid);
      emp.position = sel.value; saveBranches();
      showToast('✓ อัปเดตตำแหน่ง ' + emp.name);
      renderRecordSalesView();
    };
  });
  container.querySelectorAll('.inline-save-btn').forEach(btn => {
    btn.onclick = () => {
      const form = btn.closest('.inline-sales-form');
      const bid = form.dataset.bid, eid = form.dataset.eid;
      const date = form.querySelector('.inline-date').value;
      if (!date) { showToast('⚠ เลือกวันที่', true); return; }
      const pt = +form.querySelector('.inline-pt').value||0;
      const m = +form.querySelector('.inline-member').value||0;
      const pl = +form.querySelector('.inline-plan').value||0;
      if (!DAILY[bid]) DAILY[bid] = {};
      if (!DAILY[bid][eid]) DAILY[bid][eid] = {};
      DAILY[bid][eid][date] = { pt, member: m, plan: pl };
      saveDaily();
      if (pt || m || pl) logSale(bid, eid, date, pt, m, pl);
      renderRecordSalesView();
      showToast('✓ บันทึก ' + empName(eid) + ' วันที่ ' + date);
    };
  });
}

// ===== Export to Excel =====
function exportToExcel() {
  if (typeof XLSX === 'undefined') { showToast('⚠ โหลด Excel lib ไม่สำเร็จ', true); return; }
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summary = [['สาขา','พนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม','จำนวนวัน']];
  let gP=0, gM=0, gPl=0;
  BRANCHES.forEach(br => {
    br.employees.forEach(e => {
      const t = empDailyTotals(br.id, e.id);
      summary.push([br.name, e.name, e.position||'Sale', t.pt, t.member, t.plan, t.total, t.days]);
      gP += t.pt; gM += t.member; gPl += t.plan;
    });
  });
  summary.push(['รวมทั้งหมด', '', '', gP, gM, gPl, gP+gM+gPl, '']);
  const wsSum = XLSX.utils.aoa_to_sheet(summary);
  wsSum['!cols'] = [{wch:14},{wch:24},{wch:18},{wch:14},{wch:16},{wch:18},{wch:16},{wch:10}];
  XLSX.utils.book_append_sheet(wb, wsSum, 'สรุปรวม');

  // Per-branch daily sheets
  BRANCHES.forEach(br => {
    const data = [['วันที่','รหัสพนักงาน','ชื่อพนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม']];
    const allDates = new Set();
    br.employees.forEach(e => { const es = (DAILY[br.id] && DAILY[br.id][e.id]) || {}; for (const d in es) allDates.add(d); });
    Array.from(allDates).sort().forEach(date => {
      br.employees.forEach(e => {
        const en = DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][date];
        if (en) {
          const pt = +en.pt||0, m = +en.member||0, pl = +en.plan||0;
          data.push([date, e.id, e.name, e.position||'Sale', pt, m, pl, pt+m+pl]);
        }
      });
    });
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{wch:12},{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:18},{wch:14}];
    XLSX.utils.book_append_sheet(wb, ws, 'รายวัน-' + br.name);
  });

  const filename = 'Station24_Sales_' + todayBKK() + '.xlsx';
  XLSX.writeFile(wb, filename);
  showToast('✓ ดาวน์โหลด Excel เรียบร้อย');
}

// Bind export button (wait for DOM)
(function bindExport(){
  const btn = document.getElementById('exportBtn');
  if (btn) btn.addEventListener('click', exportToExcel);
})();


// ===== saveBranchChart (for Summary view) =====
function saveBranchChart(branchId, fmt, silent) {
  const br = getBranch(branchId);
  if (!br) { if (!silent) showToast('⚠ ไม่พบสาขา', true); return false; }

  const chart = scBranchCharts['c_' + branchId];
  const src = chart && chart.canvas && chart.canvas.width ? chart.canvas : null;
  if (!src) { if (!silent) showToast('⚠ ไม่มีกราฟ', true); return false; }

  let totA = 0, totB = 0;
  br.employees.forEach(e => {
    const t = empDailyTotals(branchId, e.id);
    const sub = t.pt + t.member;
    if ((e.team || 'A') === 'A') totA += sub; else totB += sub;
  });

  const headerH = 130;
  const footerH = 40;
  const pad = 20;
  const W = Math.max(src.width, 900);
  const H = src.height + headerH + footerH;

  const out = document.createElement('canvas');
  out.width = W; out.height = H;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#DC2626'; ctx.fillRect(0, 0, W, 6);

  ctx.fillStyle = '#0F0F0F';
  ctx.font = 'bold 22px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('STATION 24 FITNESS — กราฟสรุปยอดขาย', pad, 20);

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 16px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  ctx.fillText(br.emoji + '  สาขา' + br.name, pad, 52);

  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 14px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  ctx.fillText('A: ฿' + fmt0(totA), pad, 82);
  ctx.fillStyle = '#1E40AF';
  ctx.fillText('B: ฿' + fmt0(totB), pad + 200, 82);
  ctx.fillStyle = '#991B1B';
  ctx.fillText('💰 รวม: ฿' + fmt0(totA + totB), pad + 400, 82);

  const cx = Math.round((W - src.width) / 2);
  ctx.drawImage(src, cx, headerH);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '11px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  const dateStr = new Date().toLocaleDateString('th-TH', {year:'numeric', month:'long', day:'numeric', timeZone:'Asia/Bangkok'});
  ctx.fillText('© Station 24 Fitness · บันทึก ' + dateStr, pad, H - footerH + 12);
  ctx.textAlign = 'right';
  ctx.fillText('station24-dashboard', W - pad, H - footerH + 12);
  ctx.textAlign = 'left';

  const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
  const ext = fmt === 'jpg' ? 'jpg' : 'png';
  const dataURL = out.toDataURL(mime, fmt === 'jpg' ? 0.92 : 1.0);
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'Station24_Chart_' + br.name + '_' + todayBKK() + '.' + ext;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  if (!silent) showToast('✓ ดาวน์โหลด ' + br.name + '.' + ext);
  return true;
}

// ===== saveThreeBranchChart (combined 3-branch comparison) =====
function saveThreeBranchChart(fmt, silent) {
  const chart = scBranchCharts['three_combined'];
  const src = chart && chart.canvas && chart.canvas.width ? chart.canvas : null;
  if (!src) { if (!silent) showToast('⚠ ไม่มีกราฟ', true); return false; }

  const totals = THREE_BRANCH_TEAMS.map(t => {
    const br = getBranch(t.id);
    let sum = 0;
    if (br) br.employees.forEach(e => { const d = empDailyTotals(t.id, e.id); sum += d.pt + d.member; });
    return { team: t, sum: sum };
  });

  const headerH = 130;
  const footerH = 40;
  const pad = 20;
  const W = Math.max(src.width, 900);
  const H = src.height + headerH + footerH;

  const out = document.createElement('canvas');
  out.width = W; out.height = H;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#DC2626'; ctx.fillRect(0, 0, W, 6);

  ctx.fillStyle = '#0F0F0F';
  ctx.font = 'bold 22px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('STATION 24 FITNESS — เปรียบเทียบ 3 สาขา', pad, 20);

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 16px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  ctx.fillText('🏢 เปรียบเทียบยอดรวม PT+MEM ของ 3 สาขา', pad, 52);

  ctx.font = 'bold 14px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  let xOff = pad;
  totals.forEach(t => {
    const br = getBranch(t.team.id);
    ctx.fillStyle = t.team.color;
    const txt = (br ? br.emoji + ' ' + br.name : t.team.id) + ': ฿' + fmt0(t.sum);
    ctx.fillText(txt, xOff, 82);
    xOff += ctx.measureText(txt).width + 24;
  });

  const cx = Math.round((W - src.width) / 2);
  ctx.drawImage(src, cx, headerH);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '11px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  const dateStr = new Date().toLocaleDateString('th-TH', {year:'numeric', month:'long', day:'numeric', timeZone:'Asia/Bangkok'});
  ctx.fillText('© Station 24 Fitness · บันทึก ' + dateStr, pad, H - footerH + 12);
  ctx.textAlign = 'right';
  ctx.fillText('station24-dashboard', W - pad, H - footerH + 12);
  ctx.textAlign = 'left';

  const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
  const ext = fmt === 'jpg' ? 'jpg' : 'png';
  const dataURL = out.toDataURL(mime, fmt === 'jpg' ? 0.92 : 1.0);
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'Station24_Chart_3สาขา_' + todayBKK() + '.' + ext;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  if (!silent) showToast('✓ ดาวน์โหลด 3สาขา.' + ext);
  return true;
}

// ===== History View =====
function hsGetRange() {
  const mode = document.getElementById('hsMode') ? document.getElementById('hsMode').value : 'single';
  if (mode === 'single') {
    const d = document.getElementById('hsDate') ? document.getElementById('hsDate').value : '';
    return { mode: mode, from: d || null, to: d || null };
  }
  const f = document.getElementById('hsFrom') ? document.getElementById('hsFrom').value : '';
  const t = document.getElementById('hsTo') ? document.getElementById('hsTo').value : '';
  return { mode: mode, from: f || null, to: t || null };
}

function hsRangeLabel(r) {
  const fmt = d => new Date(d).toLocaleDateString('th-TH', {year:'numeric', month:'short', day:'numeric', timeZone:'Asia/Bangkok'});
  if (!r.from && !r.to) return 'ทั้งหมด';
  if (r.mode === 'single' && r.from) return fmt(r.from);
  if (r.from && r.to) return fmt(r.from) + ' — ' + fmt(r.to);
  if (r.from) return 'ตั้งแต่ ' + fmt(r.from);
  return 'ถึง ' + fmt(r.to);
}

function hsCollectRows() {
  const r = hsGetRange();
  const branchFilter = document.getElementById('hsBranch') ? document.getElementById('hsBranch').value : '';
  const rows = [];
  LOG.forEach(en => {
    if (branchFilter && en.branchId !== branchFilter) return;
    if (r.from && en.date < r.from) return;
    if (r.to && en.date > r.to) return;
    const br = BRANCHES.find(b => b.id === en.branchId);
    if (!br) return;
    const e = br.employees.find(x => x.id === en.empId) || {};
    const pt = +en.pt || 0, m = +en.member || 0, pl = +en.plan || 0, tr = +en.train || 0;
    rows.push({
      logId: en.id, date: en.date, time: en.time || '',
      branchId: br.id, branchName: br.name, branchEmoji: br.emoji,
      empId: en.empId, empName: e.name || en.empId,
      position: e.position || 'Sale', team: e.team || 'A',
      photo: e.photo || '',
      pt: pt, member: m, plan: pl, train: tr, total: pt + m
    });
  });
  rows.sort((a, b) => (a.logId < b.logId ? 1 : a.logId > b.logId ? -1 : 0));
  return rows;
}

function renderHistoryView() {
  renderSidebar();

  const bSel = document.getElementById('hsBranch');
  if (bSel && bSel.dataset.populated !== '1') {
    bSel.innerHTML = '<option value="">🏢 ทุกสาขา</option>' +
      BRANCHES.map(b => '<option value="' + b.id + '">' + b.emoji + ' สาขา' + b.name + '</option>').join('');
    bSel.dataset.populated = '1';
  }
  // Mirror global filter into history's per-page branch filter
  if (bSel) bSel.value = globalBranchFilter || '';

  const mode = document.getElementById('hsMode') ? document.getElementById('hsMode').value : 'single';
  const sg = document.getElementById('hsSingleGroup');
  const rg = document.getElementById('hsRangeGroup');
  if (sg) sg.style.display = mode === 'single' ? 'flex' : 'none';
  if (rg) rg.style.display = mode === 'range' ? 'flex' : 'none';

  const r = hsGetRange();
  const badge = document.getElementById('hsRangeBadge');
  if (badge) badge.innerHTML = '🎯 กำลังดู: <strong style="margin-left:4px">' + hsRangeLabel(r) + '</strong>' +
    (document.getElementById('hsBranch') && document.getElementById('hsBranch').value ? ' · <strong>สาขา' + getBranch(document.getElementById('hsBranch').value).name + '</strong>' : '');

  const rows = hsCollectRows();
  const container = document.getElementById('hsBranchesContainer');
  if (!container) return;

  const branchFilter = document.getElementById('hsBranch') ? document.getElementById('hsBranch').value : '';

  // Group rows by branch
  const byBranch = {};
  rows.forEach(x => { (byBranch[x.branchId] = byBranch[x.branchId] || []).push(x); });

  const branchesToShow = BRANCHES.filter(b => !branchFilter || b.id === branchFilter);

  if (!rows.length) {
    container.innerHTML = '<div class="card"><div style="text-align:center;padding:48px;color:var(--gray-text)">📭 ไม่มีข้อมูลในช่วงที่เลือก</div></div>';
    return;
  }

  container.innerHTML = branchesToShow.map(b => {
    const accent = branchColor(b.id);
    const brRows = (byBranch[b.id] || []).slice().sort((a, c) => a.logId < c.logId ? 1 : a.logId > c.logId ? -1 : 0);
    let sP=0, sM=0, sPl=0, sTr=0;
    brRows.forEach(x => { sP+=x.pt; sM+=x.member; sPl+=x.plan; sTr+=x.train||0; });
    const sT = sP + sM;

    const tableHtml = !brRows.length
      ? '<div style="text-align:center;padding:32px;color:var(--gray-text);font-size:12px">— ไม่มีข้อมูลในสาขานี้ —</div>'
      : '<div class="history-table-wrap">' +
        '<table class="history-table">' +
        '<thead><tr>' +
        '<th>วันที่</th>' +
        '<th>เวลา</th>' +
        '<th>พนักงาน</th>' +
        '<th>รหัส</th>' +
        '<th>ตำแหน่ง</th>' +
        '<th>ทีม</th>' +
        '<th class="num">💪 PT</th>' +
        '<th class="num">🎫 MEMBER</th>' +
        '<th class="num">📋 PLAN</th>' +
        '<th class="num">🏋 เทรน</th>' +
        '<th class="num" title="PT + MEM (ไม่รวม PLAN)">💰 รวม PT+MEM</th>' +
        '<th></th>' +
        '</tr></thead>' +
        '<tbody>' +
        brRows.map(x => {
          const pi = posIcon(x.position);
          const team = x.team || 'A';
          const teamBg = team === 'A' ? '#FEF3C7' : '#DBEAFE';
          const teamFg = team === 'A' ? '#92400E' : '#1E40AF';
          const av = x.photo
            ? '<img src="' + x.photo + '" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid ' + accent + '">'
            : '<div style="width:32px;height:32px;border-radius:50%;background:' + avatarColor(x.empId) + ';color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800">' + avatarInitials(x.empName) + '</div>';
          return '<tr>' +
            '<td><strong>' + x.date + '</strong></td>' +
            '<td style="font-family:monospace;font-size:12px;color:var(--gray-text)">' + (x.time || '—') + '</td>' +
            '<td><div style="display:flex;align-items:center;gap:8px">' + av + '<span>' + x.empName + '</span></div></td>' +
            '<td style="font-family:monospace;font-size:11px;color:var(--gray-text)">' + x.empId + '</td>' +
            '<td><span class="pos-chip ' + posChipClass(x.position) + '">' + pi + ' ' + x.position + '</span></td>' +
            '<td><span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;background:' + teamBg + ';color:' + teamFg + '">' + (team === 'A' ? '🅰' : '🅱') + ' ' + team + '</span></td>' +
            '<td class="num" style="color:#DC2626">฿' + fmt0(x.pt) + '</td>' +
            '<td class="num">฿' + fmt0(x.member) + '</td>' +
            '<td class="num" style="color:#D97706">฿' + fmt0(x.plan) + '</td>' +
            '<td class="num" style="color:#92400E">' + (isPosPT(x.position) && x.train ? fmtInt(x.train) : '—') + '</td>' +
            '<td class="num"><strong>฿' + fmt0(x.total) + '</strong></td>' +
            (canManage() ? '<td><button class="hs-del" data-logid="' + x.logId + '" title="ลบ" style="background:#FEE2E2;color:#991B1B;border:none;width:30px;height:30px;border-radius:6px;cursor:pointer">🗑</button></td>' : '<td></td>') +
            '</tr>';
        }).join('') +
        '<tr style="background:#FAFAFA;font-weight:800">' +
        '<td colspan="6" style="text-align:right">รวมสาขา' + b.name + '</td>' +
        '<td class="num" style="color:#DC2626">฿' + fmt0(sP) + '</td>' +
        '<td class="num">฿' + fmt0(sM) + '</td>' +
        '<td class="num" style="color:#D97706">฿' + fmt0(sPl) + '</td>' +
        '<td class="num" style="color:#92400E">' + (sTr ? fmtInt(sTr) : '—') + '</td>' +
        '<td class="num">฿' + fmt0(sT) + '</td>' +
        '<td></td>' +
        '</tr>' +
        '</tbody></table></div>';

    return '<div class="card" style="margin-bottom:18px;border-left:5px solid ' + accent + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:10px;border-bottom:1px dashed var(--gray-line);margin-bottom:12px">' +
      '<h3 style="margin:0;border:none;padding:0;color:' + accent + '"><span>' + b.emoji + '</span> สาขา' + b.name +
      ' <span style="font-size:11px;color:var(--gray-text);font-weight:500;margin-left:6px">(' + brRows.length + ' รายการ)</span></h3>' +
      '<div style="font-size:12px;font-weight:700;color:var(--black)" title="PT + MEM">รวม PT+MEM ฿' + fmt0(sT) + '</div>' +
      '</div>' +
      tableHtml +
      '</div>';
  }).join('');

  container.querySelectorAll('.hs-del').forEach(btn => {
    btn.onclick = () => {
      const logId = btn.dataset.logid;
      const idx = LOG.findIndex(x => x.id === logId);
      if (idx < 0) { showToast('⚠ ไม่พบรายการ', true); return; }
      const en = LOG[idx];
      if (!confirm('ลบรายการนี้ของ ' + empName(en.empId) + ' วันที่ ' + en.date + ' (' + (en.time || '—') + ')?\nยอด ฿' + fmt0((+en.pt||0)+(+en.member||0)+(+en.plan||0)) + ' จะถูกหักออกจากยอดรวม')) return;
      LOG.splice(idx, 1); saveLog();
      // Subtract from DAILY aggregate
      if (DAILY[en.branchId] && DAILY[en.branchId][en.empId] && DAILY[en.branchId][en.empId][en.date]) {
        const d = DAILY[en.branchId][en.empId][en.date];
        d.pt = Math.max(0, (+d.pt || 0) - (+en.pt || 0));
        d.member = Math.max(0, (+d.member || 0) - (+en.member || 0));
        d.plan = Math.max(0, (+d.plan || 0) - (+en.plan || 0));
        d.train = Math.max(0, (+d.train || 0) - (+en.train || 0));
        if (!d.pt && !d.member && !d.plan && !d.train) delete DAILY[en.branchId][en.empId][en.date];
        saveDaily();
      }
      renderHistoryView();
      showToast('🗑 ลบรายการแล้ว');
    };
  });
}

function hsExportExcel() {
  if (typeof XLSX === 'undefined') { showToast('⚠ โหลด Excel lib ไม่สำเร็จ', true); return; }
  const rows = hsCollectRows();
  if (!rows.length) { showToast('⚠ ไม่มีข้อมูลในช่วงนี้', true); return; }
  const r = hsGetRange();
  const data = [['วันที่','สาขา','รหัส','ชื่อพนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม PT+MEM']];
  let tP=0, tM=0, tPl=0;
  rows.forEach(x => { data.push([x.date, x.branchName, x.empId, x.empName, x.position, x.pt, x.member, x.plan, x.total]); tP+=x.pt; tM+=x.member; tPl+=x.plan; });
  data.push(['รวม','','','','', tP, tM, tPl, tP+tM]);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{wch:12},{wch:14},{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:18},{wch:14}];
  XLSX.utils.book_append_sheet(wb, ws, 'ประวัติการขาย');
  const tag = (r.from || 'all') + (r.to && r.to !== r.from ? '_to_' + r.to : '');
  XLSX.writeFile(wb, 'Station24_History_' + tag + '.xlsx');
  showToast('✓ ดาวน์โหลด Excel');
}

(function bindHistory(){
  const today = todayBKK();
  const dateEl = document.getElementById('hsDate');
  if (dateEl && !dateEl.value) dateEl.value = today;
  const fromEl = document.getElementById('hsFrom');
  const toEl = document.getElementById('hsTo');
  if (fromEl && !fromEl.value) {
    const t = nowBKK(); const p = n => String(n).padStart(2,'0');
    fromEl.value = t.getFullYear() + '-' + p(t.getMonth()+1) + '-01';
  }
  if (toEl && !toEl.value) toEl.value = today;

  const add = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('change', fn); };
  add('hsMode', renderHistoryView);
  add('hsDate', renderHistoryView);
  add('hsFrom', renderHistoryView);
  add('hsTo', renderHistoryView);
  add('hsBranch', renderHistoryView);
  const exp = document.getElementById('hsExportBtn');
  if (exp) exp.addEventListener('click', hsExportExcel);

  const preset = document.getElementById('hsPreset');
  if (preset) preset.addEventListener('change', ev => {
    const v = ev.target.value; if (!v) return;
    const t = nowBKK(); const p = n => String(n).padStart(2,'0');
    const iso = d => d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
    const modeEl = document.getElementById('hsMode');
    if (v === 'today' || v === 'yesterday') {
      if (modeEl) modeEl.value = 'single';
      const d = v === 'today' ? t : (() => { const y = new Date(t); y.setDate(y.getDate()-1); return y; })();
      const dateInput = document.getElementById('hsDate'); if (dateInput) dateInput.value = iso(d);
    } else {
      if (modeEl) modeEl.value = 'range';
      let f, to;
      if (v === 'week') { const w = new Date(t); w.setDate(w.getDate()-6); f = iso(w); to = iso(t); }
      else if (v === 'month') { f = iso(new Date(t.getFullYear(), t.getMonth(), 1)); to = iso(new Date(t.getFullYear(), t.getMonth()+1, 0)); }
      else if (v === 'lastmonth') { f = iso(new Date(t.getFullYear(), t.getMonth()-1, 1)); to = iso(new Date(t.getFullYear(), t.getMonth(), 0)); }
      else if (v === 'all') { f = ''; to = ''; }
      const fromI = document.getElementById('hsFrom'); if (fromI) fromI.value = f || '';
      const toI = document.getElementById('hsTo'); if (toI) toI.value = to || '';
    }
    renderHistoryView();
    ev.target.value = '';
  });
})();

// ===== Users / Branches Management View (admin only) =====
function renderUsersView() {
  if (!isAdmin()) return;
  renderSidebar();
  const container = document.getElementById('usersContainer');
  if (!container) return;

  const branchOpts = BRANCHES.map(b => '<option value="' + b.id + '">' + b.emoji + ' ' + b.name + ' (' + b.code + ')</option>').join('');

  let html = '';

  // ---- Branches management ----
  html += '<div class="card" style="margin-bottom:18px">' +
    '<h3><span>🏢</span> สาขา <span style="font-size:11px;color:var(--gray-text);font-weight:500;margin-left:6px">(' + BRANCHES.length + ' สาขา)</span></h3>' +
    '<div style="overflow-x:auto"><table class="history-table" style="width:100%">' +
    '<thead><tr><th>Emoji</th><th>รหัส</th><th>ชื่อสาขา</th><th>พนักงาน</th><th></th></tr></thead><tbody>' +
    BRANCHES.map(b => {
      return '<tr>' +
        '<td style="font-size:18px">' + b.emoji + '</td>' +
        '<td><strong>' + b.code + '</strong></td>' +
        '<td>สาขา' + b.name + '</td>' +
        '<td>' + b.employees.length + ' คน</td>' +
        '<td><button class="br-del" data-bid="' + b.id + '" style="background:#FEE2E2;color:#991B1B;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px">🗑 ลบสาขา</button></td>' +
        '</tr>';
    }).join('') +
    '</tbody></table></div>' +
    '<div style="margin-top:14px;padding:14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px">' +
    '<div style="font-size:13px;font-weight:700;color:#991B1B;margin-bottom:10px">➕ เพิ่มสาขาใหม่</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<input type="text" id="newBranchEmoji" placeholder="🌟" maxlength="3" style="width:70px;padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:18px;text-align:center">' +
    '<input type="text" id="newBranchCode" placeholder="รหัส (เช่น SP)" style="width:140px;padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px;text-transform:uppercase">' +
    '<input type="text" id="newBranchName" placeholder="ชื่อสาขา (เช่น สีลม)" style="flex:1;min-width:160px;padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' +
    '<button type="button" id="addBranchBtn" style="padding:9px 18px;border:none;border-radius:8px;background:var(--red);color:#fff;font-weight:700;cursor:pointer">+ เพิ่มสาขา</button>' +
    '</div></div></div>';

  // ---- Positions management ----
  const positionRows = POSITIONS.map((p, i) => {
    const usedCount = BRANCHES.reduce((s, br) => s + br.employees.filter(e => (e.position || 'Sale') === p.name).length, 0);
    return '<tr>' +
      '<td><input type="text" class="pos-icon" data-idx="' + i + '" value="' + (p.icon || '') + '" maxlength="3" style="width:60px;padding:5px 8px;border:1px solid var(--gray-line);border-radius:6px;font-size:18px;text-align:center"></td>' +
      '<td><strong>' + p.name + '</strong></td>' +
      '<td><input type="text" class="pos-short" data-idx="' + i + '" value="' + (p.short || '') + '" placeholder="ตัวย่อ" style="width:80px;padding:5px 8px;border:1px solid var(--gray-line);border-radius:6px;font-size:12px"></td>' +
      '<td><label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:12px"><input type="checkbox" class="pos-istraining" data-idx="' + i + '"' + (p.hasTraining ? ' checked' : '') + '> 🏋 มีจำนวนเทรน</label></td>' +
      '<td>' + usedCount + ' คน</td>' +
      '<td>' +
      (POSITIONS.length > 1 && usedCount === 0
        ? '<button class="pos-del" data-idx="' + i + '" style="background:#FEE2E2;color:#991B1B;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px">🗑 ลบ</button>'
        : '<span style="font-size:11px;color:var(--gray-text)">' + (usedCount > 0 ? '(มีพนักงานใช้อยู่)' : '(ต้องมีอย่างน้อย 1)') + '</span>') +
      '</td></tr>';
  }).join('');

  html += '<div class="card" style="margin-bottom:18px">' +
    '<h3><span>🏷️</span> ตำแหน่งงาน <span style="font-size:11px;color:var(--gray-text);font-weight:500;margin-left:6px">(' + POSITIONS.length + ' ตำแหน่ง)</span></h3>' +
    '<div style="overflow-x:auto"><table class="history-table" style="width:100%">' +
    '<thead><tr><th>Icon</th><th>ชื่อตำแหน่ง</th><th>ตัวย่อ</th><th>คุณสมบัติ</th><th>พนักงาน</th><th></th></tr></thead><tbody>' +
    positionRows +
    '</tbody></table></div>' +
    '<div style="margin-top:14px;padding:14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px">' +
    '<div style="font-size:13px;font-weight:700;color:#92400E;margin-bottom:10px">➕ เพิ่มตำแหน่งใหม่</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<input type="text" id="newPosIcon" placeholder="🏷" maxlength="3" style="width:70px;padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:18px;text-align:center">' +
    '<input type="text" id="newPosName" placeholder="ชื่อตำแหน่ง (เช่น Manager)" style="flex:1;min-width:160px;padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' +
    '<input type="text" id="newPosShort" placeholder="ตัวย่อ (เช่น MGR)" style="width:140px;padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' +
    '<label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;padding:9px"><input type="checkbox" id="newPosTraining"> 🏋 มีจำนวนเทรน</label>' +
    '<button type="button" id="addPosBtn" style="padding:9px 18px;border:none;border-radius:8px;background:#D97706;color:#fff;font-weight:700;cursor:pointer">+ เพิ่มตำแหน่ง</button>' +
    '</div>' +
    '<div style="font-size:11px;color:var(--gray-text);margin-top:8px;font-style:italic">💡 ลบได้เฉพาะตำแหน่งที่ไม่มีพนักงานใช้อยู่ · ติ๊ก "มีจำนวนเทรน" สำหรับตำแหน่งเทรนเนอร์</div>' +
    '</div></div>';

  // ---- Users management ----
  html += '<div class="card" style="margin-bottom:18px">' +
    '<h3><span>👥</span> ผู้ใช้ <span style="font-size:11px;color:var(--gray-text);font-weight:500;margin-left:6px">(' + USERS.length + ' คน)</span></h3>' +
    '<div style="overflow-x:auto"><table class="history-table" style="width:100%">' +
    '<thead><tr><th>ชื่อผู้ใช้</th><th>ชื่อแสดง</th><th>Role</th><th>สาขา</th><th>รหัสผ่าน</th><th></th></tr></thead><tbody>' +
    USERS.map((u, i) => {
      const roleBadge = u.role === 'admin'
        ? '<span style="background:#FEE2E2;color:#991B1B;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">🛡 ADMIN</span>'
        : u.role === 'viewer'
        ? '<span style="background:#F3F4F6;color:#1F2937;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">👁 VIEWER</span>'
        : '<span style="background:#DBEAFE;color:#1E40AF;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">✏️ EDITOR</span>';
      const br = BRANCHES.find(b => b.id === u.branchId);
      const branchSel = u.role === 'editor'
        ? '<select class="user-branch" data-idx="' + i + '" style="padding:6px 10px;border-radius:6px;border:1px solid var(--gray-line);font-size:12px">' +
          BRANCHES.map(b => '<option value="' + b.id + '"' + (b.id===u.branchId?' selected':'') + '>' + b.emoji + ' ' + b.name + '</option>').join('') +
          '</select>'
        : '<span style="color:var(--gray-text);font-size:12px">— ทุกสาขา —</span>';
      return '<tr>' +
        '<td><strong>' + u.username + '</strong></td>' +
        '<td><input type="text" class="user-display" data-idx="' + i + '" value="' + (u.displayName || '') + '" style="width:140px;padding:5px 8px;border:1px solid var(--gray-line);border-radius:6px;font-size:12px"></td>' +
        '<td>' + roleBadge + '</td>' +
        '<td>' + branchSel + '</td>' +
        '<td><input type="text" class="user-pass" data-idx="' + i + '" value="' + u.password + '" style="width:120px;padding:5px 8px;border:1px solid var(--gray-line);border-radius:6px;font-size:12px;font-family:monospace"></td>' +
        '<td>' +
        (u.username === currentUser.username
          ? '<span style="font-size:11px;color:var(--gray-text)">(ตัวคุณ)</span>'
          : '<button class="user-del" data-idx="' + i + '" style="background:#FEE2E2;color:#991B1B;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px">🗑 ลบ</button>'
        ) +
        '</td></tr>';
    }).join('') +
    '</tbody></table></div>' +
    '<div style="margin-top:14px;padding:14px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px">' +
    '<div style="font-size:13px;font-weight:700;color:#1E40AF;margin-bottom:10px">➕ เพิ่มผู้ใช้ใหม่</div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px">' +
    '<input type="text" id="newUserUsername" placeholder="ชื่อผู้ใช้" style="padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' +
    '<input type="text" id="newUserPassword" placeholder="รหัสผ่าน" style="padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' +
    '<input type="text" id="newUserDisplay" placeholder="ชื่อแสดง" style="padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' +
    '<select id="newUserRole" style="padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' +
    '<option value="editor">✏️ Editor (เฉพาะสาขา)</option>' +
    '<option value="viewer">👁 Viewer (ดูทุกสาขา)</option>' +
    '<option value="admin">🛡 Admin (ทุกสาขา)</option>' +
    '</select>' +
    '<select id="newUserBranch" style="padding:9px;border:1px solid var(--gray-line);border-radius:8px;font-size:13px">' + branchOpts + '</select>' +
    '<button type="button" id="addUserBtn" style="padding:9px;border:none;border-radius:8px;background:#2563EB;color:#fff;font-weight:700;cursor:pointer">+ เพิ่มผู้ใช้</button>' +
    '</div></div></div>';

  container.innerHTML = html;

  // Wire events
  container.querySelectorAll('.br-del').forEach(btn => {
    btn.onclick = () => {
      const bid = btn.dataset.bid;
      const br = BRANCHES.find(b => b.id === bid);
      if (!br) return;
      if (BRANCHES.length <= 1) { showToast('⚠ ต้องมีอย่างน้อย 1 สาขา', true); return; }
      if (!confirm('ลบสาขา "' + br.name + '" และข้อมูลทั้งหมด?\n(ผู้ใช้ Editor ที่ผูกกับสาขานี้จะไม่ login ได้)')) return;
      const idx = BRANCHES.findIndex(b => b.id === bid);
      if (idx >= 0) BRANCHES.splice(idx, 1);
      delete DAILY[bid];
      saveBranches(); saveDaily();
      if (activeBranch === bid) activeBranch = BRANCHES[0] ? BRANCHES[0].id : null;
      renderUsersView(); showToast('🗑 ลบสาขา ' + br.name);
    };
  });

  document.getElementById('addBranchBtn').onclick = () => {
    const emoji = document.getElementById('newBranchEmoji').value.trim() || '🏢';
    const code = document.getElementById('newBranchCode').value.trim().toUpperCase();
    const name = document.getElementById('newBranchName').value.trim();
    if (!code || !name) { showToast('⚠ กรอกรหัสและชื่อสาขา', true); return; }
    if (BRANCHES.some(b => b.code === code || b.id === 'br-' + code.toLowerCase())) { showToast('⚠ รหัสซ้ำ', true); return; }
    const bid = 'br-' + code.toLowerCase();
    BRANCHES.push({ id: bid, code: code, name: name, emoji: emoji, employees: [] });
    DAILY[bid] = {};
    saveBranches(); saveDaily();
    renderUsersView(); showToast('✓ เพิ่มสาขา ' + name);
  };

  container.querySelectorAll('.user-display').forEach(inp => {
    inp.onchange = () => { USERS[+inp.dataset.idx].displayName = inp.value.trim(); saveUsers(); };
  });
  container.querySelectorAll('.user-pass').forEach(inp => {
    inp.onchange = () => { USERS[+inp.dataset.idx].password = inp.value; saveUsers(); showToast('✓ เปลี่ยนรหัสผ่าน'); };
  });
  container.querySelectorAll('.user-branch').forEach(sel => {
    sel.onchange = () => { USERS[+sel.dataset.idx].branchId = sel.value; saveUsers(); };
  });
  container.querySelectorAll('.user-del').forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.dataset.idx;
      const u = USERS[idx];
      if (!u) return;
      if (u.role === 'admin' && USERS.filter(x => x.role === 'admin').length === 1) { showToast('⚠ ต้องมี admin อย่างน้อย 1 คน', true); return; }
      if (!confirm('ลบผู้ใช้ "' + u.username + '"?')) return;
      USERS.splice(idx, 1); saveUsers();
      renderUsersView(); showToast('🗑 ลบผู้ใช้');
    };
  });

  document.getElementById('addUserBtn').onclick = () => {
    const u = document.getElementById('newUserUsername').value.trim();
    const p = document.getElementById('newUserPassword').value;
    const d = document.getElementById('newUserDisplay').value.trim() || u;
    const role = document.getElementById('newUserRole').value;
    const bid = document.getElementById('newUserBranch').value;
    if (!u || !p) { showToast('⚠ กรอกชื่อผู้ใช้และรหัสผ่าน', true); return; }
    if (USERS.some(x => x.username === u)) { showToast('⚠ ชื่อผู้ใช้ซ้ำ', true); return; }
    USERS.push({ username: u, password: p, displayName: d, role: role, branchId: role === 'editor' ? bid : null });
    saveUsers(); renderUsersView(); showToast('✓ เพิ่มผู้ใช้ ' + u + ' (' + role + ')');
  };

  // Positions wiring
  container.querySelectorAll('.pos-icon').forEach(inp => {
    inp.onchange = () => { POSITIONS[+inp.dataset.idx].icon = inp.value.trim() || '🏷'; savePositions(); renderUsersView(); };
  });
  container.querySelectorAll('.pos-short').forEach(inp => {
    inp.onchange = () => { POSITIONS[+inp.dataset.idx].short = inp.value.trim(); savePositions(); };
  });
  container.querySelectorAll('.pos-istraining').forEach(cb => {
    cb.onchange = () => { POSITIONS[+cb.dataset.idx].hasTraining = cb.checked; savePositions(); renderUsersView(); };
  });
  container.querySelectorAll('.pos-del').forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.dataset.idx;
      const p = POSITIONS[idx];
      if (!p) return;
      if (POSITIONS.length <= 1) { showToast('⚠ ต้องมีอย่างน้อย 1 ตำแหน่ง', true); return; }
      if (!confirm('ลบตำแหน่ง "' + p.name + '"?')) return;
      POSITIONS.splice(idx, 1); savePositions();
      renderUsersView(); showToast('🗑 ลบตำแหน่ง ' + p.name);
    };
  });
  document.getElementById('addPosBtn').onclick = () => {
    const icon = document.getElementById('newPosIcon').value.trim() || '🏷';
    const name = document.getElementById('newPosName').value.trim();
    const short = document.getElementById('newPosShort').value.trim();
    const hasTraining = document.getElementById('newPosTraining').checked;
    if (!name) { showToast('⚠ กรอกชื่อตำแหน่ง', true); return; }
    if (POSITIONS.some(p => p.name === name)) { showToast('⚠ ชื่อตำแหน่งซ้ำ', true); return; }
    POSITIONS.push({ name: name, icon: icon, short: short || name, hasTraining: hasTraining });
    savePositions(); renderUsersView(); showToast('✓ เพิ่มตำแหน่ง ' + name);
  };
}

// ===== Login boot =====
function applyAuthUIBoot() {
  const overlay = document.getElementById('loginOverlay');
  const badge = document.getElementById('userBadge');
  const lbtn = document.getElementById('logoutBtn');
  if (currentUser) {
    if (overlay) overlay.style.display = 'none';
    if (badge) {
      badge.style.display = 'inline-flex';
      const ic = document.getElementById('userBadgeIcon');
      const nm = document.getElementById('userBadgeName');
      const rl = document.getElementById('userBadgeRole');
      if (ic) ic.textContent = isAdmin() ? '🛡' : isViewer() ? '👁' : '✏️';
      if (nm) nm.textContent = currentUser.displayName || currentUser.username;
      if (rl) {
        if (isAdmin()) rl.textContent = 'ADMIN';
        else if (isViewer()) rl.textContent = 'VIEWER';
        else if (isEditor()) {
          const br = BRANCHES.find(b => b.id === currentUser.branchId);
          rl.textContent = 'EDITOR · ' + (br ? br.name : '—');
        } else rl.textContent = (currentUser.role || '').toUpperCase();
      }
    }
    if (lbtn) lbtn.style.display = 'inline-flex';
    // Editor: jump straight to their branch
    if (isEditor() && currentUser.branchId) {
      activeBranch = currentUser.branchId;
      setView('branch');
    } else {
      // Restore the last view the user was on (saved by setView)
      let last = null;
      try { last = JSON.parse(localStorage.getItem(STORAGE_VIEW) || 'null'); } catch(e){}
      const validViews = ['branch','overview','recordsales','summarychart','yearsales','yeartrain','history','ranking','rankingall','rankingtrainer','users'];
      const v = last && validViews.indexOf(last.view) >= 0 ? last.view : 'overview';
      if (last && last.branchId && BRANCHES.some(b => b.id === last.branchId)) activeBranch = last.branchId;
      setView(v);
    }
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (badge) badge.style.display = 'none';
    if (lbtn) lbtn.style.display = 'none';
  }
}

document.getElementById('loginForm')?.addEventListener('submit', ev => {
  ev.preventDefault();
  const u = (document.getElementById('loginUsername').value || '').trim();
  const p = document.getElementById('loginPassword').value || '';
  const errEl = document.getElementById('loginError');
  if (!login(u, p)) {
    if (errEl) errEl.textContent = '⚠ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    return;
  }
  if (errEl) errEl.textContent = '';
  document.getElementById('loginPassword').value = '';
  applyAuthUIBoot();
  showToast('✓ ยินดีต้อนรับ ' + (currentUser.displayName || currentUser.username));
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (!confirm('ออกจากระบบ?')) return;
  logout();
  applyAuthUIBoot();
});

loadSession();
applyAuthUIBoot();

// ===== Supabase sync bootstrap =====
function applyKeyToGlobals(key, value) {
  if (key === 'station24_branches_v2') BRANCHES = value;
  else if (key === 'station24_daily_v1') DAILY = value;
  else if (key === 'station24_sales_log_v1') LOG = value;
  else if (key === 'station24_chart_colors_v2') CHART_COLORS = value;
  else if (key === 'station24_branch_colors_v1') BRANCH_COLORS = value;
  else if (key === 'station24_positions_v1') POSITIONS = value;
  else if (key === 'station24_users_v1') {
    USERS = value;
    if (!USERS.some(u => u.role === 'admin')) USERS.unshift(DEFAULT_USERS[0]);
  }
}
function reRenderCurrentView() {
  try {
    if (currentView === 'branch') renderBranchView();
    else if (currentView === 'individual') renderIndividualView();
    else if (currentView === 'ranking') renderRankingView();
    else if (currentView === 'rankingall' && typeof renderRankingAllView === 'function') renderRankingAllView();
    else if (currentView === 'rankingtrainer' && typeof renderRankingTrainerView === 'function') renderRankingTrainerView();
    else if (currentView === 'summarychart') renderSummaryChartView();
    else if (currentView === 'overview') renderOverviewView();
    else if (currentView === 'history' && typeof renderHistoryView === 'function') renderHistoryView();
    else if (currentView === 'addsales' && typeof renderAddSalesView === 'function') renderAddSalesView();
    else if (currentView === 'users' && typeof renderUsersView === 'function') renderUsersView();
  } catch(e) { console.warn('re-render fail:', e); }
}
async function bootstrapSupabase() {
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.warn('☁ Supabase SDK not loaded — running offline');
    return;
  }
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  try {
    const { data, error } = await supabaseClient.from('app_state').select('*');
    if (error) { console.warn('☁ fetch fail:', error.message); return; }

    if (!data || !data.length) {
      console.log('☁ migrating local state to cloud...');
      const rows = [
        { key: 'station24_branches_v2', value: BRANCHES, updated_at: new Date().toISOString() },
        { key: 'station24_daily_v1', value: DAILY, updated_at: new Date().toISOString() },
        { key: 'station24_sales_log_v1', value: LOG, updated_at: new Date().toISOString() },
        { key: 'station24_chart_colors_v2', value: CHART_COLORS, updated_at: new Date().toISOString() },
        { key: 'station24_branch_colors_v1', value: BRANCH_COLORS, updated_at: new Date().toISOString() },
        { key: 'station24_users_v1', value: USERS, updated_at: new Date().toISOString() },
        { key: 'station24_positions_v1', value: POSITIONS, updated_at: new Date().toISOString() }
      ];
      const r = await supabaseClient.from('app_state').upsert(rows);
      if (r.error) console.warn('☁ migrate fail:', r.error.message);
      else console.log('☁ migrated.');
    } else {
      _suppressSync = true;
      data.forEach(row => {
        if (SYNC_KEYS.indexOf(row.key) < 0) return;
        try { localStorage.setItem(row.key, JSON.stringify(row.value)); } catch(e){}
        applyKeyToGlobals(row.key, row.value);
      });
      _suppressSync = false;
      normalizeData();
      reRenderCurrentView();
      console.log('☁ loaded from cloud.');
    }

    supabaseClient.channel('app_state_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, payload => {
        const row = payload.new;
        if (!row || SYNC_KEYS.indexOf(row.key) < 0) return;
        _suppressSync = true;
        try { localStorage.setItem(row.key, JSON.stringify(row.value)); } catch(e){}
        applyKeyToGlobals(row.key, row.value);
        _suppressSync = false;
        normalizeData();
        reRenderCurrentView();
        if (typeof showToast === 'function') showToast('☁ ข้อมูลอัปเดตจากเครื่องอื่น');
      })
      .subscribe();
  } catch (e) {
    console.warn('☁ bootstrap error:', e && e.message);
  }
}
bootstrapSupabase();
