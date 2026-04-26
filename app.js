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
const STORAGE_COLORS = 'station24_chart_colors_v1';
const STORAGE_BRANCH_COLORS = 'station24_branch_colors_v1';
const STORAGE_USERS = 'station24_users_v1';
const STORAGE_SESSION = 'station24_session_v1';
const DEFAULT_BRANCH_PALETTE = ['#DC2626', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#DB2777'];

const DEFAULT_CHART_COLORS = { pt: '#DC2626', member: '#1F1F1F', plan: '#D97706' };
const CHART_COLOR_PRESETS = [
  { id: 'default', name: 'แดง-ดำ-ส้ม (Station 24)', pt: '#DC2626', member: '#1F1F1F', plan: '#D97706' },
  { id: 'ocean',   name: 'ฟ้า-น้ำเงิน-คราม',        pt: '#0EA5E9', member: '#1E40AF', plan: '#6366F1' },
  { id: 'forest',  name: 'เขียว-มะกอก-เขียวเข้ม',   pt: '#16A34A', member: '#065F46', plan: '#84CC16' },
  { id: 'sunset',  name: 'ส้ม-ชมพู-ม่วง',           pt: '#F97316', member: '#EC4899', plan: '#9333EA' },
  { id: 'mono',    name: 'ขาว-ดำ (Monochrome)',     pt: '#111827', member: '#6B7280', plan: '#D1D5DB' },
  { id: 'candy',   name: 'พาสเทลหวาน',              pt: '#F472B6', member: '#60A5FA', plan: '#FBBF24' },
  { id: 'neon',    name: 'นีออน',                   pt: '#EF4444', member: '#06B6D4', plan: '#A855F7' },
];

function loadJSON(key, fb) { try { const r = localStorage.getItem(key); if (r) return JSON.parse(r); } catch(e){} return JSON.parse(JSON.stringify(fb)); }
function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch(e){} }
function saveBranches() { saveJSON(STORAGE_BRANCHES, BRANCHES); }
function saveDaily()    { saveJSON(STORAGE_DAILY, DAILY); }

let BRANCHES = loadJSON(STORAGE_BRANCHES, DEFAULT_BRANCHES);
let DAILY    = loadJSON(STORAGE_DAILY, SEED_DAILY);
let CHART_COLORS = loadJSON(STORAGE_COLORS, DEFAULT_CHART_COLORS);
(function normalizeColors(){
  ['pt','member','plan'].forEach(k => { if (!CHART_COLORS[k]) CHART_COLORS[k] = DEFAULT_CHART_COLORS[k]; });
})();
function saveChartColors() { saveJSON(STORAGE_COLORS, CHART_COLORS); }

// chartjs-plugin-datalabels: enable on every chart with sensible defaults
if (typeof Chart !== 'undefined') {
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
function canSeeBranch(bid) { return isAdmin() || (isEditor() && currentUser.branchId === bid); }
function canEditBranch(bid) { return isAdmin() || (isEditor() && currentUser.branchId === bid); }

BRANCHES.forEach(b => b.employees.forEach(e => { if (!e.position) e.position = 'Sale'; if (!('photo' in e)) e.photo = ''; if (!e.team) e.team = 'A'; }));
BRANCHES.forEach(b => { if (!DAILY[b.id]) DAILY[b.id] = {}; });

let currentView = 'branch';
let activeBranch = 'sriracha';
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

function empDailyTotals(bid, eid) {
  const entries = DAILY[bid] && DAILY[bid][eid] ? DAILY[bid][eid] : {};
  let pt=0, member=0, plan=0, days=0;
  for (const d in entries) {
    pt += +entries[d].pt||0; member += +entries[d].member||0; plan += +entries[d].plan||0; days++;
  }
  return { pt, member, plan, days, total: pt+member+plan };
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
  if(document.getElementById('historyView'))document.getElementById('historyView').style.display = v === 'history' ? 'block' : 'none';
  if(document.getElementById('rankingView'))document.getElementById('rankingView').style.display = v === 'ranking' ? 'block' : 'none';
  if(document.getElementById('rankingAllView'))document.getElementById('rankingAllView').style.display = v === 'rankingall' ? 'block' : 'none';
  if(document.getElementById('usersView'))document.getElementById('usersView').style.display = v === 'users' ? 'block' : 'none';
  if(document.getElementById('branchListSection'))document.getElementById('branchListSection').style.display = 'block';
  // Editors are restricted to their branch view only
  if (isEditor() && v !== 'branch') {
    activeBranch = currentUser.branchId;
    v = 'branch';
    currentView = v;
    if(document.getElementById('branchView'))document.getElementById('branchView').style.display = 'block';
    ['overviewView','recordSalesView','summaryChartView','historyView','rankingView','rankingAllView','usersView'].forEach(id => {
      const el = document.getElementById(id); if (el) el.style.display = 'none';
    });
  }
  // Non-admin trying to access users view → redirect to overview
  if (v === 'users' && !isAdmin()) { setView('overview'); return; }
  renderMenuNav();
  if (v === 'branch') renderBranchView();
  else if (v === 'overview') renderOverviewView();
  else if (v === 'recordsales') renderRecordSalesView();
  else if (v === 'summarychart') renderSummaryChartView();
  else if (v === 'history') renderHistoryView();
  else if (v === 'ranking') renderRankingView();
  else if (v === 'rankingall') renderRankingAllView();
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
    '<button class="menu-item ' + (currentView==='rankingall'?'active':'') + '" data-view="rankingall"><span class="menu-item-icon">🏅</span><span>จัดอันดับยอดขาย (รวมทุกสาขา)</span></button>' +
    '<button class="menu-item ' + (currentView==='history'?'active':'') + '" data-view="history"><span class="menu-item-icon">📅</span><span>ประวัติการขาย</span></button>';
  if (isAdmin()) {
    html += '<button class="menu-item ' + (currentView==='users'?'active':'') + '" data-view="users"><span class="menu-item-icon">👥</span><span>จัดการผู้ใช้/สาขา</span></button>';
  }
  nav.innerHTML = html;
  nav.querySelectorAll('.menu-item').forEach(b => b.onclick = () => setView(b.dataset.view));
}

function renderSidebar() {
  const visibleBranches = BRANCHES.filter(b => canSeeBranch(b.id));
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
    const pos = e.position || 'Sale'; const pc = pos === 'Personal Trainer' ? 'pt-pos' : 'sale-pos';
    const pi = pos === 'Personal Trainer' ? '💪' : '💼';
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
    const pos = e.position || 'Sale'; const pi = pos === 'Personal Trainer' ? '💪' : '💼';
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
        plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 6, boxWidth: 12 } }, tooltip: { callbacks: { label: c => c.dataset.label + ': ฿' + fmt0(c.raw) } } },
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
  const today = new Date().toISOString().slice(0,10);
  const container = document.getElementById('branchEmpsContainer');
  if (!container) return;

  let html = '<div class="card">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:12px;border-bottom:2px solid var(--red);margin-bottom:14px">' +
    '<h3 style="margin:0;border:none;padding:0"><span>📝</span> บันทึกยอดขาย — สาขา' + br.name + ' <span style="font-size:11px;color:var(--gray-text);font-weight:400;margin-left:6px">(' + br.employees.length + ' คน)</span></h3>' +
    '<button type="button" id="toggleAddEmp" style="padding:7px 14px;border:1px solid var(--gray-line);background:#fff;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;color:var(--red-dark)">⚙️ จัดการพนักงาน</button>' +
    '</div>' +
    '<div id="addEmpPanelInline" style="display:none;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px;margin-bottom:14px">' +
    '<div style="font-size:13px;font-weight:700;color:var(--red-dark);margin-bottom:10px">เพิ่มพนักงานใหม่เข้าสาขา' + br.name + '</div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
    '<input type="text" id="newEmpNameInline" placeholder="ชื่อพนักงาน" style="flex:1;min-width:140px;padding:9px 12px;border:1px solid var(--gray-line);border-radius:8px;font-family:inherit;font-size:13px;background:#fff">' +
    '<select id="newEmpPosInline" style="flex:0 0 150px;padding:9px 12px;border:1px solid var(--gray-line);border-radius:8px;font-family:inherit;font-size:13px;background:#fff">' +
    '<option value="Personal Trainer">💪 Personal Trainer</option>' +
    '<option value="Sale">💼 Sale</option>' +
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
      const pc = pos === 'Personal Trainer' ? 'pt-pos' : 'sale-pos';
      const team = e.team || 'A';
      const teamColor = team === 'A' ? { bg:'#FEF3C7', text:'#92400E' } : { bg:'#DBEAFE', text:'#1E40AF' };
      const todayEntry = (DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][today]) || {pt:'',member:'',plan:''};
      return '<div class="emp-card" style="position:relative">' +
        '<button class="emp-card-edit" data-emp-edit="' + e.id + '" title="แก้ไข ' + e.name + '" style="position:absolute;top:8px;right:40px;width:26px;height:26px;border-radius:50%;background:#DBEAFE;color:#1E40AF;border:none;cursor:pointer;font-size:13px;font-weight:700;z-index:5">✎</button>' +
        '<button class="emp-card-delete" data-emp-del="' + e.id + '" title="ลบ ' + e.name + '" style="position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;background:#FEE2E2;color:#991B1B;border:none;cursor:pointer;font-size:13px;font-weight:700;z-index:5">✕</button>' +
        '<div class="emp-card-header">' + avatarHTML(e) +
        '<div class="emp-card-info">' +
        '<div class="emp-card-name" style="padding-right:60px">' + e.name + '</div>' +
        '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
        '<select class="inline-pos-select ' + pc + '" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
        '<option value="Personal Trainer"' + (pos==='Personal Trainer'?' selected':'') + '>💪 PT</option>' +
        '<option value="Sale"' + (pos==='Sale'?' selected':'') + '>💼 Sale</option>' +
        '</select>' +
        '<select class="inline-team-select" data-eid="' + e.id + '" style="padding:5px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid var(--gray-line);background:' + teamColor.bg + ';color:' + teamColor.text + ';cursor:pointer">' +
        '<option value="A"' + (team==='A'?' selected':'') + '>🅰 ทีม A</option>' +
        '<option value="B"' + (team==='B'?' selected':'') + '>🅱 ทีม B</option>' +
        '</select>' +
        '</div>' +
        '<div class="emp-card-id">' + e.id + '</div></div></div>' +
        '<div class="emp-card-categories">' +
        '<div class="emp-cat pt"><div class="emp-cat-label">💪 PT</div><div class="emp-cat-value">฿' + fmtShort(t.pt) + '</div></div>' +
        '<div class="emp-cat member"><div class="emp-cat-label">🎫 MEM</div><div class="emp-cat-value">฿' + fmtShort(t.member) + '</div></div>' +
        '<div class="emp-cat plan"><div class="emp-cat-label">📋 PLAN</div><div class="emp-cat-value">฿' + fmtShort(t.plan) + '</div></div></div>' +
        '<div class="emp-card-total">' +
        '<span class="emp-card-total-label">รวม PT+MEM · ' + t.days + ' วัน</span>' +
        '<span class="emp-card-total-value">฿' + fmt0(t.pt + t.member) + '</span></div>' +
        '<div class="inline-sales-form" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
        '<div class="inline-date-row"><label>📅</label><input type="date" class="inline-date" value="' + today + '"></div>' +
        '<div class="inline-input-row"><span class="inline-label pt">💪 PT</span><input type="number" class="inline-pt" placeholder="0" min="0" value="' + (todayEntry.pt||'') + '"></div>' +
        '<div class="inline-input-row"><span class="inline-label member">🎫 MEM</span><input type="number" class="inline-member" placeholder="0" min="0" value="' + (todayEntry.member||'') + '"></div>' +
        '<div class="inline-input-row"><span class="inline-label plan">📋 PLAN</span><input type="number" class="inline-plan" placeholder="0" min="0" value="' + (todayEntry.plan||'') + '"></div>' +
        '<button type="button" class="emp-card-btn inline-save-btn">💾 บันทึกยอดวันนี้</button>' +
        '</div></div>';
    };

    const ptEmps = br.employees.filter(e => (e.position || 'Sale') === 'Personal Trainer');
    const saleEmps = br.employees.filter(e => (e.position || 'Sale') === 'Sale');

    const sectionHeader = (icon, label, count, color) =>
      '<div style="display:flex;align-items:center;gap:10px;margin:6px 0 12px;padding:10px 14px;background:' + color.bg + ';border-left:4px solid ' + color.bar + ';border-radius:8px">' +
      '<span style="font-size:18px">' + icon + '</span>' +
      '<span style="font-size:14px;font-weight:800;color:' + color.text + '">' + label + '</span>' +
      '<span style="font-size:11px;font-weight:700;color:' + color.text + ';background:#fff;padding:3px 10px;border-radius:999px">' + count + ' คน</span>' +
      '</div>';

    if (ptEmps.length) {
      html += sectionHeader('💪', 'Personal Trainer', ptEmps.length, { bg:'#FEF2F2', bar:'#DC2626', text:'#991B1B' });
      html += '<div class="employees-grid" style="margin-bottom:18px">' + ptEmps.map(renderEmpCard).join('') + '</div>';
    }
    if (saleEmps.length) {
      html += sectionHeader('💼', 'Sale', saleEmps.length, { bg:'#EFF6FF', bar:'#2563EB', text:'#1E3A8A' });
      html += '<div class="employees-grid">' + saleEmps.map(renderEmpCard).join('') + '</div>';
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
      const date = form.querySelector('.inline-date').value;
      if (!date) { showToast('⚠ เลือกวันที่', true); return; }
      const pt = +form.querySelector('.inline-pt').value||0;
      const m = +form.querySelector('.inline-member').value||0;
      const pl = +form.querySelector('.inline-plan').value||0;
      if (!DAILY[bid]) DAILY[bid] = {};
      if (!DAILY[bid][eid]) DAILY[bid][eid] = {};
      DAILY[bid][eid][date] = { pt: pt, member: m, plan: pl };
      saveDaily();
      renderBranchView();
      showToast('✓ บันทึก ' + empName(eid) + ' วันที่ ' + date);
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
      plugins: { legend: { position: 'bottom', labels: { padding: 14, font: { weight: 600 } } },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ฿' + fmt0(c.raw) } } },
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
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '฿' + fmt0(c.raw) } } },
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
  container.innerHTML = BRANCHES.map(br => {
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
        const posIcon = pos === 'Personal Trainer' ? '💪' : '💼';
        const av = r.emp.photo
          ? '<img class="ranking-avatar-img" src="' + r.emp.photo + '">'
          : '<div class="ranking-avatar" style="background:' + avatarColor(r.emp.id) + '">' + avatarInitials(r.emp.name) + '</div>';
        return '<div class="ranking-row ' + rankClass + '" style="position:relative">' +
          '<div class="ranking-rank-badge">' + medal + '</div>' + av +
          '<div class="ranking-info">' +
          '<div class="ranking-name">' + r.emp.name + '</div>' +
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
  BRANCHES.forEach(br => br.employees.forEach(e => {
    const t = empDailyTotals(br.id, e.id);
    all.push({ branch: br, emp: e, pt: t.pt, member: t.member, plan: t.plan, days: t.days, total: t.pt + t.member });
  }));
  all.sort((a, b) => b.total - a.total);

  const grandTotal = all.reduce((s, r) => s + r.total, 0);
  const maxTotal = Math.max(...all.map(r => r.total), 1);
  const ptCount = all.filter(r => (r.emp.position || 'Sale') === 'Personal Trainer').length;
  const saleCount = all.length - ptCount;

  let html = '<div class="kpi-grid" style="margin-bottom:18px">' +
    '<div class="kpi-card total"><div class="kpi-icon">💰</div><div class="kpi-label">ยอดรวมทั้งหมด</div><div class="kpi-value">฿' + fmt0(grandTotal) + '</div><div class="kpi-sub">ทุกสาขา ทุกคน</div></div>' +
    '<div class="kpi-card pt"><div class="kpi-icon">👥</div><div class="kpi-label">พนักงานทั้งหมด</div><div class="kpi-value">' + all.length + '</div><div class="kpi-sub">PT ' + ptCount + ' · Sale ' + saleCount + '</div></div>' +
    '<div class="kpi-card member"><div class="kpi-icon">🏢</div><div class="kpi-label">จำนวนสาขา</div><div class="kpi-value">' + BRANCHES.length + '</div><div class="kpi-sub">รวมทั้งหมด</div></div>' +
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
      const posIcon = pos === 'Personal Trainer' ? '💪' : '💼';
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

function openDailyModal(empId) {
  activeDailyEmp = empId; const e = empById(empId);
  if(document.getElementById('dailyModalEmpName'))document.getElementById('dailyModalEmpName').textContent = e.name + ' · ' + (e.position||'Sale');
  const today = new Date().toISOString().slice(0,10);
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
  DAILY[activeBranch][activeDailyEmp][date] = { pt: pt, member: m, plan: p };
  saveDaily(); renderDailyHistory(activeDailyEmp);
  if (currentView === 'branch') renderBranchView();
  else if (currentView === 'individual') renderIndividualView();
  else if (currentView === 'ranking') renderRankingView();
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
      showToast('🗑 ลบ ' + b.dataset.dailyDel);
    }
  });
}

function openEditEmpModal(empId) {
  const e = empById(empId); if (!e) return;
  activeEditEmp = empId; editEmpPhotoBase64 = e.photo || '';
  if(document.getElementById('editEmpSubtitle'))document.getElementById('editEmpSubtitle').textContent = e.name + ' · ' + e.id;
  if(document.getElementById('editEmpName'))document.getElementById('editEmpName').value = e.name;
  if(document.getElementById('editEmpPosition'))document.getElementById('editEmpPosition').value = e.position || 'Sale';
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
  XLSX.writeFile(wb, 'Station24_Sales_' + new Date().toISOString().slice(0,10) + '.xlsx');
  showToast('✓ ดาวน์โหลด Excel');
});

if(document.getElementById('dateBadge'))document.getElementById('dateBadge').textContent = '📅 ' + new Date().toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});

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
  const fmt = d => d ? new Date(d).toLocaleDateString('th-TH', {year:'numeric', month:'short', day:'numeric'}) : '';
  if (r.from && r.to) return fmt(r.from) + ' — ' + fmt(r.to);
  if (r.from) return 'ตั้งแต่ ' + fmt(r.from);
  return 'ถึง ' + fmt(r.to);
}
function renderOverviewView() {
  renderSidebar();
  const r = ovRange();
  if(document.getElementById('ovRangeBadge'))document.getElementById('ovRangeBadge').innerHTML = '🎯 ช่วงที่ดู: <strong style="margin-left:4px">' + ovRangeLabel(r) + '</strong>';

  // Aggregate across all branches in range
  const byDate = {};
  let gP = 0, gM = 0, gPl = 0;
  const branchTotals = {};
  BRANCHES.forEach(b => {
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
    BRANCHES.forEach(b => {
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
  BRANCHES.forEach(b => { branchDailyByDate[b.id] = {}; days.forEach(d => { branchDailyByDate[b.id][d] = 0; }); });
  BRANCHES.forEach(b => b.employees.forEach(e => {
    const es = (DAILY[b.id] && DAILY[b.id][e.id]) || {};
    for (const d in es) {
      if (!inDateRange(d, r.from, r.to)) continue;
      const tot = (+es[d].pt||0) + (+es[d].member||0) + (+es[d].plan||0);
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
    data: { labels: days, datasets: BRANCHES.map(b => ({
      label: b.emoji + ' สาขา' + b.name,
      data: days.map(d => branchDailyByDate[b.id][d] || 0),
      backgroundColor: branchColor(b.id),
      borderRadius: 4
    }))},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend: { position:'bottom', labels: { padding:10, font:{ size:11, weight:600 } } },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ฿' + fmt0(c.raw) } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#1F1F1F' } },
        y: { beginAtZero: true, ticks: { callback: v => '฿'+fmtInt(v), font: { size: 10 } }, grid: { color:'#F3F4F6' } }
      }
    }
  });

}


// ===== Overview event handlers =====
document.getElementById('ovFrom')?.addEventListener('change', renderOverviewView);
document.getElementById('ovTo')?.addEventListener('change', renderOverviewView);
document.getElementById('ovPreset')?.addEventListener('change', ev => {
  const v = ev.target.value; if (!v) return;
  const t = new Date(); const p = n => String(n).padStart(2,'0');
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
  const t = new Date(); const p = n => String(n).padStart(2,'0');
  const first = t.getFullYear() + '-' + p(t.getMonth()+1) + '-01';
  const last = t.getFullYear() + '-' + p(t.getMonth()+1) + '-' + p(new Date(t.getFullYear(), t.getMonth()+1, 0).getDate());
  if(document.getElementById('ovFrom'))document.getElementById('ovFrom').value = first;
  if(document.getElementById('ovTo'))document.getElementById('ovTo').value = last;
})();


// ===== Employees view (formerly Add Sales) with inline input + position dropdown =====
function renderAddSalesView() {
  renderSidebar();
  const today = new Date().toISOString().slice(0,10);
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
        const pc = pos === 'Personal Trainer' ? 'pt-pos' : 'sale-pos';
        const pi = pos === 'Personal Trainer' ? '💪' : '💼';
        const todayEntry = (DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][today]) || {pt:'', member:'', plan:''};
        return '<div class="emp-card">' +
          '<div class="emp-card-header">' + avatarHTML(e) +
          '<div class="emp-card-info">' +
          '<div class="emp-card-name">' + e.name + '</div>' +
          '<select class="inline-pos-select ' + pc + '" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
          '<option value="Personal Trainer"' + (pos==='Personal Trainer'?' selected':'') + '>💪 PT</option>' +
          '<option value="Sale"' + (pos==='Sale'?' selected':'') + '>💼 Sale</option>' +
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

  // Color customizer
  html += '<div class="card" style="margin-bottom:16px;padding:12px 16px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
    '<div style="font-size:13px;font-weight:700"><span>🎨</span> ปรับสีแท่งกราฟ</div>' +
    '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
    '<label style="font-size:11px;color:var(--gray-text);font-weight:600">ชุดสีสำเร็จ:</label>' +
    '<select id="scColorPreset" class="search-box" style="min-width:180px;padding:6px 10px;font-size:12px">' +
    CHART_COLOR_PRESETS.map(p => '<option value="' + p.id + '">' + p.name + '</option>').join('') +
    '</select>' +
    '<button type="button" id="scColorReset" style="padding:6px 12px;border:1px solid var(--gray-line);background:#fff;border-radius:7px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700">↺ รีเซ็ต</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--black);background:#FAFAFA;padding:6px 12px;border-radius:8px;border:1px solid var(--gray-line)">' +
    '💪 PT <input type="color" id="scColorPT" value="' + CHART_COLORS.pt + '" style="width:34px;height:26px;border:none;cursor:pointer;padding:0;background:transparent">' +
    '<span style="font-family:monospace;font-size:11px;color:var(--gray-text)" id="scColorPTHex">' + CHART_COLORS.pt + '</span></label>' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--black);background:#FAFAFA;padding:6px 12px;border-radius:8px;border:1px solid var(--gray-line)">' +
    '🎫 MEMBER <input type="color" id="scColorMember" value="' + CHART_COLORS.member + '" style="width:34px;height:26px;border:none;cursor:pointer;padding:0;background:transparent">' +
    '<span style="font-family:monospace;font-size:11px;color:var(--gray-text)" id="scColorMemberHex">' + CHART_COLORS.member + '</span></label>' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--black);background:#FAFAFA;padding:6px 12px;border-radius:8px;border:1px solid var(--gray-line)">' +
    '📋 PLAN <input type="color" id="scColorPlan" value="' + CHART_COLORS.plan + '" style="width:34px;height:26px;border:none;cursor:pointer;padding:0;background:transparent">' +
    '<span style="font-family:monospace;font-size:11px;color:var(--gray-text)" id="scColorPlanHex">' + CHART_COLORS.plan + '</span></label>' +
    '</div></div>';

  // Download all
  html += '<div class="card" style="margin-bottom:16px;padding:12px 16px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
    '<div style="font-size:13px;font-weight:700"><span>💾</span> บันทึกกราฟเป็นไฟล์ภาพ</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<button type="button" class="sc-save-all" data-fmt="png" style="padding:7px 14px;border:1px solid var(--red);background:#fff;color:var(--red-dark);border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700">🖼 ดาวน์โหลดทั้งหมด (.png)</button>' +
    '<button type="button" class="sc-save-all" data-fmt="jpg" style="padding:7px 14px;border:1px solid var(--red);background:var(--red);color:#fff;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700">📷 ดาวน์โหลดทั้งหมด (.jpg)</button>' +
    '</div></div></div>';

  BRANCHES.forEach(br => {
    const empsA = br.employees.filter(e => (e.team || 'A') === 'A')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, ...t }; })
      .sort((a, b) => b.total - a.total);
    const empsB = br.employees.filter(e => (e.team || 'A') === 'B')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, ...t }; })
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
      '<div style="font-size:11px;font-weight:700;color:#92400E">🅰 ทีม A · ' + empsA.length + ' คน</div>' +
      '<div style="font-size:18px;font-weight:800;color:#92400E;margin-top:2px">฿' + fmt0(totA) + '</div></div>' +
      '<div style="flex:1;min-width:180px;padding:10px 14px;background:#DBEAFE;border-left:4px solid #2563EB;border-radius:8px">' +
      '<div style="font-size:11px;font-weight:700;color:#1E40AF">🅱 ทีม B · ' + empsB.length + ' คน</div>' +
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
      // Team A zone (left)
      if (cnt > 0) {
        const rightEdge = cnt < tot
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.right;
        ctx.fillStyle = 'rgba(245,158,11,0.08)';
        ctx.fillRect(chartArea.left, chartArea.top, rightEdge - chartArea.left, chartArea.bottom - chartArea.top);
      }
      // Team B zone (right)
      if (cnt < tot) {
        const leftEdge = cnt > 0
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.left;
        ctx.fillStyle = 'rgba(37,99,235,0.08)';
        ctx.fillRect(leftEdge, chartArea.top, chartArea.right - leftEdge, chartArea.bottom - chartArea.top);
        // Divider line
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
      // Team labels at top
      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 12px "Segoe UI","Noto Sans Thai",Arial,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      if (cnt > 0) {
        const aMid = (chartArea.left + (cnt < tot
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.right)) / 2;
        ctx.fillText('🅰 ทีม A', aMid, chartArea.top + 2);
      }
      if (cnt < tot) {
        ctx.fillStyle = '#1E40AF';
        const bLeft = cnt > 0
          ? (xScale.getPixelForValue(cnt - 1) + xScale.getPixelForValue(cnt)) / 2
          : chartArea.left;
        const bMid = (bLeft + chartArea.right) / 2;
        ctx.fillText('🅱 ทีม B', bMid, chartArea.top + 2);
      }
      ctx.restore();
    }
  };

  BRANCHES.forEach(br => {
    const empsA = br.employees.filter(e => (e.team || 'A') === 'A')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, team: 'A', ...t }; })
      .sort((a, b) => b.total - a.total);
    const empsB = br.employees.filter(e => (e.team || 'A') === 'B')
      .map(e => { const t = empDailyTotals(br.id, e.id); return { emp: e, team: 'B', ...t }; })
      .sort((a, b) => b.total - a.total);
    const all = empsA.concat(empsB);
    if (!all.length) return;

    const ctx = document.getElementById('scCombined_' + br.id);
    if (!ctx) return;

    const labels = all.map(x => x.emp.name);
    scBranchCharts['c_' + br.id] = new Chart(ctx, {
      type: 'bar',
      data: { labels: labels, datasets: [
        { label: '💪 PT', data: all.map(x => x.pt), backgroundColor: CHART_COLORS.pt, borderRadius: 4 },
        { label: '🎫 MEMBER', data: all.map(x => x.member), backgroundColor: CHART_COLORS.member, borderRadius: 4 },
        { label: '📋 PLAN', data: all.map(x => x.plan), backgroundColor: CHART_COLORS.plan, borderRadius: 4 }
      ]},
      options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
        layout: { padding: { top: 30 } },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 10, font: { size: 11, weight: 600 } } },
          tooltip: { callbacks: {
            title: items => {
              if (!items.length) return '';
              const i = items[0].dataIndex;
              return all[i].emp.name + ' · ทีม ' + all[i].team;
            },
            label: c => c.dataset.label + ': ฿' + fmt0(c.raw)
          } },
          datalabels: {
            display: ctx => (ctx.dataset.data[ctx.dataIndex] || 0) > 0,
            anchor: 'end', align: 'end', offset: 2,
            color: '#1F1F1F', font: { size: 9, weight: 700 },
            formatter: v => '฿' + fmtShort(v)
          },
          teamZones: { aCount: empsA.length, totalCount: all.length }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#1F1F1F', font: { weight: 600, size: 10 } } },
          y: { beginAtZero: true, ticks: { callback: v => '฿' + fmtInt(v), font: { size: 10 } }, grid: { color: '#F3F4F6' } }
        }
      },
      plugins: [teamZonePlugin]
    });
  });

  container.querySelectorAll('.sc-save-btn').forEach(btn => {
    btn.onclick = () => saveBranchChart(btn.dataset.bid, btn.dataset.fmt);
  });
  container.querySelectorAll('.sc-save-all').forEach(btn => {
    btn.onclick = () => {
      const fmt = btn.dataset.fmt;
      let saved = 0;
      BRANCHES.forEach(br => { if (saveBranchChart(br.id, fmt, true)) saved++; });
      showToast(saved ? '✓ ดาวน์โหลด ' + saved + ' ไฟล์ .' + fmt : '⚠ ไม่มีกราฟ', !saved);
    };
  });

  function applyColorsLive() {
    Object.keys(scBranchCharts).forEach(k => {
      const ch = scBranchCharts[k];
      if (!ch || !ch.data || !ch.data.datasets) return;
      if (k.startsWith('t_')) {
        const ds = ch.data.datasets[0];
        if (ds && Array.isArray(ds.data)) {
          const mx = Math.max(...ds.data, 0);
          ds.backgroundColor = ds.data.map(v => v === mx && v > 0 ? CHART_COLORS.pt : CHART_COLORS.member);
        }
      } else {
        if (ch.data.datasets[0]) ch.data.datasets[0].backgroundColor = CHART_COLORS.pt;
        if (ch.data.datasets[1]) ch.data.datasets[1].backgroundColor = CHART_COLORS.member;
        if (ch.data.datasets[2]) ch.data.datasets[2].backgroundColor = CHART_COLORS.plan;
      }
      ch.update('none');
    });
    const ptHex = document.getElementById('scColorPTHex');
    const memHex = document.getElementById('scColorMemberHex');
    const plHex = document.getElementById('scColorPlanHex');
    if (ptHex) ptHex.textContent = CHART_COLORS.pt.toUpperCase();
    if (memHex) memHex.textContent = CHART_COLORS.member.toUpperCase();
    if (plHex) plHex.textContent = CHART_COLORS.plan.toUpperCase();
    const ptIn = document.getElementById('scColorPT');
    const memIn = document.getElementById('scColorMember');
    const plIn = document.getElementById('scColorPlan');
    if (ptIn) ptIn.value = CHART_COLORS.pt;
    if (memIn) memIn.value = CHART_COLORS.member;
    if (plIn) plIn.value = CHART_COLORS.plan;
  }

  const ptInput = document.getElementById('scColorPT');
  if (ptInput) ptInput.oninput = e => { CHART_COLORS.pt = e.target.value; saveChartColors(); applyColorsLive(); };
  const memInput = document.getElementById('scColorMember');
  if (memInput) memInput.oninput = e => { CHART_COLORS.member = e.target.value; saveChartColors(); applyColorsLive(); };
  const plInput = document.getElementById('scColorPlan');
  if (plInput) plInput.oninput = e => { CHART_COLORS.plan = e.target.value; saveChartColors(); applyColorsLive(); };

  const presetSel = document.getElementById('scColorPreset');
  if (presetSel) {
    const cur = CHART_COLOR_PRESETS.find(p => p.pt === CHART_COLORS.pt && p.member === CHART_COLORS.member && p.plan === CHART_COLORS.plan);
    presetSel.value = cur ? cur.id : 'default';
    presetSel.onchange = () => {
      const p = CHART_COLOR_PRESETS.find(x => x.id === presetSel.value);
      if (!p) return;
      CHART_COLORS.pt = p.pt; CHART_COLORS.member = p.member; CHART_COLORS.plan = p.plan;
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

// ===== Record Sales view (all employees with inline forms) =====
function renderRecordSalesView() {
  renderSidebar();
  const today = new Date().toISOString().slice(0,10);
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
        const pc = pos === 'Personal Trainer' ? 'pt-pos' : 'sale-pos';
        const todayEntry = (DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][today]) || {pt:'',member:'',plan:''};
        return '<div class="emp-card">' +
          '<div class="emp-card-header">' + avatarHTML(e) +
          '<div class="emp-card-info">' +
          '<div class="emp-card-name">' + e.name + '</div>' +
          '<select class="inline-pos-select ' + pc + '" data-bid="' + br.id + '" data-eid="' + e.id + '">' +
          '<option value="Personal Trainer"' + (pos==='Personal Trainer'?' selected':'') + '>💪 PT</option>' +
          '<option value="Sale"' + (pos==='Sale'?' selected':'') + '>💼 Sale</option>' +
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

  const filename = 'Station24_Sales_' + new Date().toISOString().slice(0,10) + '.xlsx';
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
    if ((e.team || 'A') === 'A') totA += t.total; else totB += t.total;
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
  ctx.fillText('🅰 ทีม A: ฿' + fmt0(totA), pad, 82);
  ctx.fillStyle = '#1E40AF';
  ctx.fillText('🅱 ทีม B: ฿' + fmt0(totB), pad + 200, 82);
  ctx.fillStyle = '#991B1B';
  ctx.fillText('💰 รวม: ฿' + fmt0(totA + totB), pad + 400, 82);

  const cx = Math.round((W - src.width) / 2);
  ctx.drawImage(src, cx, headerH);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '11px "Segoe UI", "Noto Sans Thai", Arial, sans-serif';
  const dateStr = new Date().toLocaleDateString('th-TH', {year:'numeric', month:'long', day:'numeric'});
  ctx.fillText('© Station 24 Fitness · บันทึก ' + dateStr, pad, H - footerH + 12);
  ctx.textAlign = 'right';
  ctx.fillText('station24-dashboard', W - pad, H - footerH + 12);
  ctx.textAlign = 'left';

  const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
  const ext = fmt === 'jpg' ? 'jpg' : 'png';
  const dataURL = out.toDataURL(mime, fmt === 'jpg' ? 0.92 : 1.0);
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'Station24_Chart_' + br.name + '_' + new Date().toISOString().slice(0,10) + '.' + ext;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  if (!silent) showToast('✓ ดาวน์โหลด ' + br.name + '.' + ext);
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
  const fmt = d => new Date(d).toLocaleDateString('th-TH', {year:'numeric', month:'short', day:'numeric'});
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
  BRANCHES.forEach(br => {
    if (branchFilter && br.id !== branchFilter) return;
    br.employees.forEach(e => {
      const es = (DAILY[br.id] && DAILY[br.id][e.id]) || {};
      for (const d in es) {
        if (r.from && d < r.from) continue;
        if (r.to && d > r.to) continue;
        const pt = +es[d].pt||0, m = +es[d].member||0, pl = +es[d].plan||0;
        rows.push({ date: d, branchId: br.id, branchName: br.name, branchEmoji: br.emoji,
          empId: e.id, empName: e.name, position: e.position || 'Sale',
          pt: pt, member: m, plan: pl, total: pt + m + pl });
      }
    });
  });
  rows.sort((a, b) => {
    if (a.date !== b.date) return b.date < a.date ? -1 : 1;
    if (a.branchName !== b.branchName) return a.branchName < b.branchName ? -1 : 1;
    return a.empName < b.empName ? -1 : 1;
  });
  return rows;
}

function renderHistoryView() {
  renderSidebar();

  const bSel = document.getElementById('hsBranch');
  if (bSel && bSel.dataset.populated !== '1') {
    const cur = bSel.value;
    bSel.innerHTML = '<option value="">🏢 ทุกสาขา</option>' +
      BRANCHES.map(b => '<option value="' + b.id + '">' + b.emoji + ' สาขา' + b.name + '</option>').join('');
    bSel.value = cur;
    bSel.dataset.populated = '1';
  }

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
    const brRows = (byBranch[b.id] || []).slice().sort((a, c) => a.date < c.date ? 1 : a.date > c.date ? -1 : (a.empName < c.empName ? -1 : 1));
    let sP=0, sM=0, sPl=0;
    brRows.forEach(x => { sP+=x.pt; sM+=x.member; sPl+=x.plan; });
    const sT = sP + sM + sPl;

    const tableHtml = !brRows.length
      ? '<div style="text-align:center;padding:32px;color:var(--gray-text);font-size:12px">— ไม่มีข้อมูลในสาขานี้ —</div>'
      : '<div class="history-table-wrap">' +
        '<table class="history-table">' +
        '<thead><tr>' +
        '<th>วันที่</th>' +
        '<th>พนักงาน</th>' +
        '<th>ตำแหน่ง</th>' +
        '<th>ทีม</th>' +
        '<th class="num">💪 PT</th>' +
        '<th class="num">🎫 MEMBER</th>' +
        '<th class="num">📋 PLAN</th>' +
        '<th class="num">💰 รวม</th>' +
        '<th></th>' +
        '</tr></thead>' +
        '<tbody>' +
        brRows.map(x => {
          const posIcon = x.position === 'Personal Trainer' ? '💪' : '💼';
          const team = (x.team || (empById(x.empId) || {}).team || 'A');
          const teamBg = team === 'A' ? '#FEF3C7' : '#DBEAFE';
          const teamFg = team === 'A' ? '#92400E' : '#1E40AF';
          return '<tr>' +
            '<td><strong>' + x.date + '</strong></td>' +
            '<td>' + x.empName + '</td>' +
            '<td><span class="pos-chip ' + (x.position==='Personal Trainer'?'pt-pos':'sale-pos') + '">' + posIcon + ' ' + x.position + '</span></td>' +
            '<td><span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;background:' + teamBg + ';color:' + teamFg + '">' + (team === 'A' ? '🅰' : '🅱') + ' ' + team + '</span></td>' +
            '<td class="num" style="color:#DC2626">฿' + fmt0(x.pt) + '</td>' +
            '<td class="num">฿' + fmt0(x.member) + '</td>' +
            '<td class="num" style="color:#D97706">฿' + fmt0(x.plan) + '</td>' +
            '<td class="num"><strong>฿' + fmt0(x.total) + '</strong></td>' +
            '<td><button class="hs-del" data-bid="' + x.branchId + '" data-eid="' + x.empId + '" data-date="' + x.date + '" title="ลบ" style="background:#FEE2E2;color:#991B1B;border:none;width:30px;height:30px;border-radius:6px;cursor:pointer">🗑</button></td>' +
            '</tr>';
        }).join('') +
        '<tr style="background:#FAFAFA;font-weight:800">' +
        '<td colspan="4" style="text-align:right">รวมสาขา' + b.name + '</td>' +
        '<td class="num" style="color:#DC2626">฿' + fmt0(sP) + '</td>' +
        '<td class="num">฿' + fmt0(sM) + '</td>' +
        '<td class="num" style="color:#D97706">฿' + fmt0(sPl) + '</td>' +
        '<td class="num">฿' + fmt0(sT) + '</td>' +
        '<td></td>' +
        '</tr>' +
        '</tbody></table></div>';

    return '<div class="card" style="margin-bottom:18px;border-left:5px solid ' + accent + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:10px;border-bottom:1px dashed var(--gray-line);margin-bottom:12px">' +
      '<h3 style="margin:0;border:none;padding:0;color:' + accent + '"><span>' + b.emoji + '</span> สาขา' + b.name +
      ' <span style="font-size:11px;color:var(--gray-text);font-weight:500;margin-left:6px">(' + brRows.length + ' รายการ)</span></h3>' +
      '<div style="font-size:12px;font-weight:700;color:var(--black)">รวม ฿' + fmt0(sT) + '</div>' +
      '</div>' +
      tableHtml +
      '</div>';
  }).join('');

  container.querySelectorAll('.hs-del').forEach(btn => {
    btn.onclick = () => {
      const bid = btn.dataset.bid, eid = btn.dataset.eid, d = btn.dataset.date;
      if (confirm('ลบยอดของ ' + empName(eid) + ' วันที่ ' + d + '?')) {
        if (DAILY[bid] && DAILY[bid][eid]) delete DAILY[bid][eid][d];
        saveDaily();
        renderHistoryView();
        showToast('🗑 ลบ ' + d);
      }
    };
  });
}

function hsExportExcel() {
  if (typeof XLSX === 'undefined') { showToast('⚠ โหลด Excel lib ไม่สำเร็จ', true); return; }
  const rows = hsCollectRows();
  if (!rows.length) { showToast('⚠ ไม่มีข้อมูลในช่วงนี้', true); return; }
  const r = hsGetRange();
  const data = [['วันที่','สาขา','รหัส','ชื่อพนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม']];
  let tP=0, tM=0, tPl=0;
  rows.forEach(x => { data.push([x.date, x.branchName, x.empId, x.empName, x.position, x.pt, x.member, x.plan, x.total]); tP+=x.pt; tM+=x.member; tPl+=x.plan; });
  data.push(['รวม','','','','', tP, tM, tPl, tP+tM+tPl]);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{wch:12},{wch:14},{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:18},{wch:14}];
  XLSX.utils.book_append_sheet(wb, ws, 'ประวัติการขาย');
  const tag = (r.from || 'all') + (r.to && r.to !== r.from ? '_to_' + r.to : '');
  XLSX.writeFile(wb, 'Station24_History_' + tag + '.xlsx');
  showToast('✓ ดาวน์โหลด Excel');
}

(function bindHistory(){
  const today = new Date().toISOString().slice(0,10);
  const dateEl = document.getElementById('hsDate');
  if (dateEl && !dateEl.value) dateEl.value = today;
  const fromEl = document.getElementById('hsFrom');
  const toEl = document.getElementById('hsTo');
  if (fromEl && !fromEl.value) {
    const t = new Date(); const p = n => String(n).padStart(2,'0');
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
    const t = new Date(); const p = n => String(n).padStart(2,'0');
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

  // ---- Users management ----
  html += '<div class="card" style="margin-bottom:18px">' +
    '<h3><span>👥</span> ผู้ใช้ <span style="font-size:11px;color:var(--gray-text);font-weight:500;margin-left:6px">(' + USERS.length + ' คน)</span></h3>' +
    '<div style="overflow-x:auto"><table class="history-table" style="width:100%">' +
    '<thead><tr><th>ชื่อผู้ใช้</th><th>ชื่อแสดง</th><th>Role</th><th>สาขา</th><th>รหัสผ่าน</th><th></th></tr></thead><tbody>' +
    USERS.map((u, i) => {
      const roleBadge = u.role === 'admin'
        ? '<span style="background:#FEE2E2;color:#991B1B;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700">🛡 ADMIN</span>'
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
    saveUsers(); renderUsersView(); showToast('✓ เพิ่มผู้ใช้ ' + u);
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
      if (ic) ic.textContent = isAdmin() ? '🛡' : '✏️';
      if (nm) nm.textContent = currentUser.displayName || currentUser.username;
      if (rl) {
        if (isAdmin()) rl.textContent = 'ADMIN';
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
      setView('overview');
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
