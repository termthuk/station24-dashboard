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

function loadJSON(key, fb) { try { const r = localStorage.getItem(key); if (r) return JSON.parse(r); } catch(e){} return JSON.parse(JSON.stringify(fb)); }
function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch(e){} }
function saveBranches() { saveJSON(STORAGE_BRANCHES, BRANCHES); }
function saveDaily()    { saveJSON(STORAGE_DAILY, DAILY); }

let BRANCHES = loadJSON(STORAGE_BRANCHES, DEFAULT_BRANCHES);
let DAILY    = loadJSON(STORAGE_DAILY, SEED_DAILY);

BRANCHES.forEach(b => b.employees.forEach(e => { if (!e.position) e.position = 'Sale'; if (!('photo' in e)) e.photo = ''; }));
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
  document.getElementById('branchView').style.display     = v === 'branch' ? 'block' : 'none';
  document.getElementById('individualView').style.display = v === 'individual' ? 'block' : 'none';
  document.getElementById('rankingView').style.display    = v === 'ranking' ? 'block' : 'none';
  document.getElementById('branchListSection').style.display = (v === 'branch' || v === 'individual') ? 'block' : 'none';
  renderMenuNav();
  if (v === 'branch') renderBranchView();
  else if (v === 'individual') renderIndividualView();
  else if (v === 'ranking') renderRankingView();
}

function renderMenuNav() {
  document.getElementById('menuNav').innerHTML =
    '<button class="menu-item ' + (currentView==='branch'?'active':'') + '" data-view="branch"><span class="menu-item-icon">🏢</span><span>หน้าสาขา</span></button>' +
    '<button class="menu-item ' + (currentView==='individual'?'active':'') + '" data-view="individual"><span class="menu-item-icon">📊</span><span>กราฟยอดขายรายบุคคล</span></button>' +
    '<button class="menu-item ' + (currentView==='ranking'?'active':'') + '" data-view="ranking"><span class="menu-item-icon">🏆</span><span>อันดับยอดขาย</span></button>';
  document.querySelectorAll('#menuNav .menu-item').forEach(b => b.onclick = () => setView(b.dataset.view));
}

function renderSidebar() {
  document.getElementById('branchNav').innerHTML = BRANCHES.map(b => {
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
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop').classList.remove('show');
    if (currentView === 'branch') renderBranchView();
    else if (currentView === 'individual') renderIndividualView();
    else setView('branch');
  });
  let gP=0, gM=0, gPl=0;
  BRANCHES.forEach(b => { const t = branchDailyTotals(b.id); gP += t.pt; gM += t.member; gPl += t.plan; });
  document.getElementById('sidebarSummary').innerHTML =
    '<div class="sidebar-stat"><div class="sidebar-stat-label">💪 ยอด PT รวม</div><div class="sidebar-stat-value">฿' + fmt0(gP) + '</div></div>' +
    '<div class="sidebar-stat black"><div class="sidebar-stat-label">🎫 ยอด MEMBER รวม</div><div class="sidebar-stat-value">฿' + fmt0(gM) + '</div></div>' +
    '<div class="sidebar-stat"><div class="sidebar-stat-label">📋 Plan SETUP รวม</div><div class="sidebar-stat-value" style="color:var(--plan-color)">฿' + fmt0(gPl) + '</div></div>';
}

function renderMainTitle() {
  const br = getBranch(activeBranch);
  document.getElementById('mainBranchEmoji').textContent = br.emoji;
  document.getElementById('mainBranchName').textContent = br.name;
  const banner = document.getElementById('empFilterBanner');
  if (activeEmployee) {
    document.getElementById('empFilterName').textContent = empName(activeEmployee);
    banner.style.display = 'flex';
  } else banner.style.display = 'none';
}

function renderKPIs() {
  const bd = activeEmployee ? empDailyTotals(activeBranch, activeEmployee) : branchDailyTotals(activeBranch);
  const scope = activeEmployee ? empName(activeEmployee) : getBranch(activeBranch).name;
  document.getElementById('kpiGrid').innerHTML =
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
  renderSidebar(); renderMainTitle();
  document.getElementById('empBranchLabel').textContent = getBranch(activeBranch).name;
  renderEmployeeCards(); renderEmpMiniCharts(); renderKPIs();
}

function renderIndividualView() {
  renderSidebar();
  const br = getBranch(activeBranch);
  document.getElementById('indivBranchName').textContent = 'สาขา' + br.name;
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
      return { emp: e, pt: t.pt, member: t.member, plan: t.plan, days: t.days, total: t.total };
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
        return '<div class="ranking-row ' + rankClass + '">' +
          '<div class="ranking-rank-badge">' + medal + '</div>' + av +
          '<div class="ranking-info">' +
          '<div class="ranking-name">' + r.emp.name + '</div>' +
          '<div class="ranking-meta">' + posIcon + ' ' + pos + ' · ' + r.emp.id + ' · ' + r.days + ' วัน</div>' +
          '<div class="ranking-breakdown">' +
          '<span class="pt">💪 PT ฿' + fmt0(r.pt) + '</span>' +
          '<span class="mem">🎫 MEM ฿' + fmt0(r.member) + '</span>' +
          '<span class="pln">📋 PLAN ฿' + fmt0(r.plan) + '</span></div>' +
          '<div class="ranking-bar-wrap"><div class="ranking-bar" style="width:' + pct + '%"></div></div>' +
          '</div>' +
          '<div class="ranking-total">฿' + fmt0(r.total) + '</div></div>';
      }).join('');
    }
    return '<div class="ranking-branch-card">' +
      '<div class="ranking-branch-header">' +
      '<div class="ranking-branch-title"><span class="emoji">' + br.emoji + '</span><span>สาขา' + br.name + '</span></div>' +
      '<div class="ranking-branch-total">ยอดรวม <strong>฿' + fmt0(branchTotal) + '</strong> · ' + emps.length + ' คน</div>' +
      '</div><div class="ranking-list">' + listHtml + '</div></div>';
  }).join('');
}

function openDailyModal(empId) {
  activeDailyEmp = empId; const e = empById(empId);
  document.getElementById('dailyModalEmpName').textContent = e.name + ' · ' + (e.position||'Sale');
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('dailyDate').value = today;
  loadDailyIntoForm(empId, today); renderDailyHistory(empId);
  document.getElementById('dailyModal').classList.add('show');
}
function closeDailyModal() { document.getElementById('dailyModal').classList.remove('show'); activeDailyEmp = null; }
function loadDailyIntoForm(empId, date) {
  const entry = DAILY[activeBranch] && DAILY[activeBranch][empId] && DAILY[activeBranch][empId][date];
  document.getElementById('dailyPT').value = entry ? (entry.pt||'') : '';
  document.getElementById('dailyMember').value = entry ? (entry.member||'') : '';
  document.getElementById('dailyPlan').value = entry ? (entry.plan||'') : '';
  updateDailyPreview();
}
function updateDailyPreview() {
  const pt = +document.getElementById('dailyPT').value||0;
  const m = +document.getElementById('dailyMember').value||0;
  const p = +document.getElementById('dailyPlan').value||0;
  document.getElementById('dailyTotalPreview').textContent = '฿' + fmt0(pt+m+p);
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
  body.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => { const d = b.dataset.edit; document.getElementById('dailyDate').value = d; loadDailyIntoForm(empId, d); });
  body.querySelectorAll('[data-daily-del]').forEach(b => b.onclick = () => {
    if (confirm('ลบ ' + b.dataset.dailyDel + '?')) {
      delete DAILY[activeBranch][empId][b.dataset.dailyDel]; saveDaily(); renderDailyHistory(empId);
      if (currentView === 'branch') renderBranchView();
      else if (currentView === 'individual') renderIndividualView();
      else if (currentView === 'ranking') renderRankingView();
      showToast('🗑 ลบ ' + b.dataset.dailyDel);
    }
  });
}

function openEditEmpModal(empId) {
  const e = empById(empId); if (!e) return;
  activeEditEmp = empId; editEmpPhotoBase64 = e.photo || '';
  document.getElementById('editEmpSubtitle').textContent = e.name + ' · ' + e.id;
  document.getElementById('editEmpName').value = e.name;
  document.getElementById('editEmpPosition').value = e.position || 'Sale';
  updateEditEmpPhotoPreview();
  document.getElementById('editEmpModal').classList.add('show');
}
function closeEditEmpModal() {
  document.getElementById('editEmpModal').classList.remove('show');
  activeEditEmp = null; editEmpPhotoBase64 = '';
  document.getElementById('editEmpPhotoInput').value = '';
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
  if (!name) { showToast('⚠ กรุณาใส่ชื่อ', true); return; }
  e.name = name; e.position = pos; e.photo = editEmpPhotoBase64;
  saveBranches(); closeEditEmpModal();
  if (currentView === 'branch') renderBranchView();
  else if (currentView === 'individual') renderIndividualView();
  else if (currentView === 'ranking') renderRankingView();
  showToast('✓ อัปเดต ' + name);
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.borderLeftColor = isError ? '#F59E0B' : 'var(--red)';
  t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2400);
}

document.getElementById('dailyModalClose').addEventListener('click', closeDailyModal);
document.getElementById('dailyModal').addEventListener('click', e => { if (e.target.id === 'dailyModal') closeDailyModal(); });
document.getElementById('dailyForm').addEventListener('submit', e => { e.preventDefault(); saveDailyEntry(); });
document.getElementById('dailyDate').addEventListener('change', () => { if (activeDailyEmp) loadDailyIntoForm(activeDailyEmp, document.getElementById('dailyDate').value); });
['dailyPT','dailyMember','dailyPlan'].forEach(id => document.getElementById(id).addEventListener('input', updateDailyPreview));
document.getElementById('editEmpClose').addEventListener('click', closeEditEmpModal);
document.getElementById('editEmpModal').addEventListener('click', e => { if (e.target.id === 'editEmpModal') closeEditEmpModal(); });
document.getElementById('editEmpForm').addEventListener('submit', e => { e.preventDefault(); saveEditEmp(); });
document.getElementById('editEmpPhotoBtn').addEventListener('click', () => document.getElementById('editEmpPhotoInput').click());
document.getElementById('editEmpPhotoInput').addEventListener('change', async ev => {
  const f = ev.target.files && ev.target.files[0]; if (!f) return;
  if (f.size > 10 * 1024 * 1024) { showToast('⚠ ไฟล์ใหญ่เกิน 10MB', true); return; }
  try { editEmpPhotoBase64 = await compressImage(f); updateEditEmpPhotoPreview(); showToast('✓ อัปโหลดรูป'); } catch(e) { showToast('⚠ อัปโหลดไม่ได้', true); }
});
document.getElementById('editEmpPhotoRemove').addEventListener('click', () => { editEmpPhotoBase64 = ''; updateEditEmpPhotoPreview(); });

document.getElementById('clearEmpFilter').addEventListener('click', () => { activeEmployee = null; renderBranchView(); });
document.getElementById('toggleEmpMgmt').addEventListener('click', () => {
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
  br.employees.push({ id: newEmpId(activeBranch), name: name, position: position, photo: '' });
  saveBranches(); input.value = ''; renderBranchView(); showToast('✓ เพิ่ม ' + name);
}
document.getElementById('addEmpBtn').addEventListener('click', addEmployee);
document.getElementById('newEmpName').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addEmployee(); } });
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('show');
});
document.getElementById('sidebarBackdrop').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');
});

document.getElementById('exportBtn').addEventListener('click', () => {
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

document.getElementById('dateBadge').textContent = '📅 ' + new Date().toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});
setView('branch');
