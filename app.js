/* Station 24 Fitness — Sales Dashboard */

const DEFAULT_BRANCHES = [
  { id: 'sriracha',   name: 'ศรีราชา',     code: 'SR', emoji: '🌊',
    employees: [
      { id: 'EMP-SR01', name: 'สมชาย ใจดี',     position: 'Personal Trainer' },
      { id: 'EMP-SR02', name: 'วราภรณ์ ศรีทอง',  position: 'Sale' },
      { id: 'EMP-SR03', name: 'ณัฐพล พงศ์ชัย',    position: 'Sale' },
    ]},
  { id: 'srisaman',   name: 'ศรีสมาน',     code: 'SS', emoji: '🏙️',
    employees: [
      { id: 'EMP-SS01', name: 'พิมพ์ใจ รุ่งเรือง', position: 'Sale' },
      { id: 'EMP-SS02', name: 'ธีระ วิทยา',       position: 'Personal Trainer' },
      { id: 'EMP-SS03', name: 'กิตติ อนันต์',     position: 'Sale' },
    ]},
  { id: 'srinakarin', name: 'ศรีนครินทร์', code: 'SN', emoji: '🌆',
    employees: [
      { id: 'EMP-SN01', name: 'ปิยะ ภักดี',      position: 'Sale' },
      { id: 'EMP-SN02', name: 'ชนิดา มงคล',     position: 'Personal Trainer' },
      { id: 'EMP-SN03', name: 'อัญชลี สวัสดี',   position: 'Sale' },
    ]},
];

const SEED_SALES = {
  sriracha: [
    { date:'2026-04-01', emp:'EMP-SR01', type:'สมาชิกรายปี',     detail:'Package Gold 12 เดือน', price:18000, sale:18000, pay:'เงินสด' },
    { date:'2026-04-02', emp:'EMP-SR02', type:'Personal Trainer', detail:'PT Package 10 ครั้ง',   price:8500,  sale:8000,  pay:'โอน' },
    { date:'2026-04-03', emp:'EMP-SR01', type:'อาหารเสริม',       detail:'Whey Protein 2lb',      price:1290,  sale:1290,  pay:'บัตรเครดิต' },
  ],
  srisaman: [
    { date:'2026-04-01', emp:'EMP-SS01', type:'สมาชิกรายปี',     detail:'Package Platinum',      price:24000, sale:24000, pay:'บัตรเครดิต' },
  ],
  srinakarin: [
    { date:'2026-04-01', emp:'EMP-SN01', type:'สมาชิกรายปี',     detail:'Package Gold',          price:18000, sale:18000, pay:'โอน' },
  ],
};

const SEED_DAILY = {
  sriracha: {
    'EMP-SR01': {
      '2026-04-20': { pt: 5000, member: 2000, plan: 1500 },
      '2026-04-21': { pt: 6000, member: 0,    plan: 2000 },
      '2026-04-22': { pt: 3500, member: 3000, plan: 1000 },
    },
    'EMP-SR02': {
      '2026-04-20': { pt: 0, member: 8000, plan: 2500 },
      '2026-04-21': { pt: 0, member: 4500, plan: 1500 },
      '2026-04-22': { pt: 0, member: 6000, plan: 3000 },
    },
    'EMP-SR03': {
      '2026-04-20': { pt: 0, member: 3500, plan: 1000 },
      '2026-04-22': { pt: 0, member: 5500, plan: 2000 },
    }
  },
  srisaman: {
    'EMP-SS01': {
      '2026-04-20': { pt: 0, member: 12000, plan: 3500 },
      '2026-04-21': { pt: 0, member: 9500,  plan: 2500 },
    },
    'EMP-SS02': {
      '2026-04-20': { pt: 7000, member: 0,    plan: 1500 },
      '2026-04-21': { pt: 4500, member: 1500, plan: 2000 },
    },
  },
  srinakarin: {
    'EMP-SN01': { '2026-04-20': { pt: 0, member: 7500, plan: 2000 } },
    'EMP-SN02': {
      '2026-04-20': { pt: 6500, member: 0, plan: 1500 },
      '2026-04-21': { pt: 5000, member: 0, plan: 2500 },
    },
  },
};

const STORAGE_SALES = 'station24_sales_v2';
const STORAGE_BRANCHES = 'station24_branches_v2';
const STORAGE_DAILY = 'station24_daily_v1';

function loadJSON(key, fallback) {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch (e) {}
  return JSON.parse(JSON.stringify(fallback));
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}
function saveBranches() { saveJSON(STORAGE_BRANCHES, BRANCHES); }
function saveSales()    { saveJSON(STORAGE_SALES, SALES); }
function saveDaily()    { saveJSON(STORAGE_DAILY, DAILY); }

let BRANCHES = loadJSON(STORAGE_BRANCHES, DEFAULT_BRANCHES);
let SALES    = loadJSON(STORAGE_SALES, SEED_SALES);
let DAILY    = loadJSON(STORAGE_DAILY, SEED_DAILY);

BRANCHES.forEach(b => b.employees.forEach(e => { if (!e.position) e.position = 'Sale'; }));
BRANCHES.forEach(b => { if (!DAILY[b.id]) DAILY[b.id] = {}; });

let activeBranch = 'sriracha';
let activeEmployee = null;
let activeDailyEmp = null;
let searchTerm = '';
let typeFilter = '';
let typeChart, empChart, dayChart;

const AVATAR_COLORS = [
  'linear-gradient(135deg,#DC2626,#991B1B)',
  'linear-gradient(135deg,#1F1F1F,#4B5563)',
  'linear-gradient(135deg,#B91C1C,#7F1D1D)',
  'linear-gradient(135deg,#374151,#1F2937)',
  'linear-gradient(135deg,#DC2626,#1F1F1F)',
  'linear-gradient(135deg,#991B1B,#4B5563)',
  'linear-gradient(135deg,#EF4444,#DC2626)',
];

const fmt    = n => new Intl.NumberFormat('th-TH', { minimumFractionDigits:2, maximumFractionDigits:2 }).format(n || 0);
const fmt0   = n => new Intl.NumberFormat('th-TH').format(Math.round(n || 0));
const fmtInt = n => new Intl.NumberFormat('th-TH').format(n || 0);
const fmtShort = n => {
  n = +n || 0;
  if (n >= 1000000) return (n/1000000).toFixed(1).replace(/\.0$/,'') + 'M';
  if (n >= 1000)    return (n/1000).toFixed(1).replace(/\.0$/,'') + 'K';
  return n.toLocaleString('th-TH');
};

function getBranch(id) { return BRANCHES.find(b => b.id === id); }
function empById(id)   { for (const b of BRANCHES) for (const e of b.employees) if (e.id === id) return e; return null; }
function empName(id)   { const e = empById(id); return e ? e.name : id; }

function typeBadgeClass(t) {
  if (!t) return 'other';
  if (t.includes('สมาชิก'))   return 'membership';
  if (t.includes('Personal')) return 'pt';
  if (t.includes('คลาส'))     return 'class';
  if (t.includes('อาหาร'))    return 'supp';
  if (t.includes('เครื่อง'))  return 'drink';
  return 'other';
}
function newEmpId(branchId) {
  const br = getBranch(branchId);
  const prefix = 'EMP-' + br.code;
  let max = 0;
  br.employees.forEach(e => {
    const m = e.id.match(new RegExp('^' + prefix + '(\\d+)$'));
    if (m) max = Math.max(max, parseInt(m[1]));
  });
  return prefix + String(max + 1).padStart(2, '0');
}
function avatarInitials(name) {
  const clean = (name || '').trim().replace(/\s+/g, ' ');
  const parts = clean.split(' ');
  if (parts.length >= 2) return parts[0].slice(0, 1) + parts[1].slice(0, 1);
  return clean.slice(0, 2);
}
function avatarColor(str) {
  let hash = 0;
  for (const ch of (str || '')) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function empDailyTotals(branchId, empId) {
  const entries = DAILY[branchId] && DAILY[branchId][empId] ? DAILY[branchId][empId] : {};
  let pt = 0, member = 0, plan = 0, days = 0;
  for (const d in entries) {
    pt += (+entries[d].pt || 0);
    member += (+entries[d].member || 0);
    plan += (+entries[d].plan || 0);
    days += 1;
  }
  return { pt, member, plan, days, total: pt + member + plan };
}
function branchDailyTotals(branchId) {
  const br = getBranch(branchId);
  let pt = 0, member = 0, plan = 0;
  br.employees.forEach(e => {
    const t = empDailyTotals(branchId, e.id);
    pt += t.pt; member += t.member; plan += t.plan;
  });
  return { pt, member, plan, total: pt + member + plan };
}
function branchSalesTotal(branchId) {
  return (SALES[branchId] || []).reduce((s, r) => s + (+r.sale || 0), 0);
}

function renderSidebar() {
  const nav = document.getElementById('branchNav');
  nav.innerHTML = BRANCHES.map(b => {
    const bd = branchDailyTotals(b.id);
    const overall = bd.total + branchSalesTotal(b.id);
    return `
      <button class="branch-item ${b.id === activeBranch ? 'active' : ''}" data-id="${b.id}">
        <span class="branch-item-icon">${b.emoji}</span>
        <span class="branch-item-body">
          <span class="branch-item-name">สาขา${b.name}</span>
          <span class="branch-item-sub">${b.code} · ฿${fmtShort(overall)} · ${b.employees.length} คน</span>
        </span>
      </button>`;
  }).join('');
  nav.querySelectorAll('.branch-item').forEach(btn => {
    btn.onclick = () => {
      activeBranch = btn.dataset.id;
      activeEmployee = null;
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarBackdrop').classList.remove('show');
      renderAll();
    };
  });

  let gPT = 0, gMem = 0, gPlan = 0;
  BRANCHES.forEach(b => {
    const bd = branchDailyTotals(b.id);
    gPT += bd.pt; gMem += bd.member; gPlan += bd.plan;
  });
  document.getElementById('sidebarSummary').innerHTML = `
    <div class="sidebar-stat">
      <div class="sidebar-stat-label">💪 ยอด PT รวม</div>
      <div class="sidebar-stat-value">฿${fmt0(gPT)}</div>
    </div>
    <div class="sidebar-stat black">
      <div class="sidebar-stat-label">🎫 ยอด MEMBER รวม</div>
      <div class="sidebar-stat-value">฿${fmt0(gMem)}</div>
    </div>
    <div class="sidebar-stat">
      <div class="sidebar-stat-label">📋 ยอด Plan SETUP รวม</div>
      <div class="sidebar-stat-value" style="color:var(--plan-color)">฿${fmt0(gPlan)}</div>
    </div>`;
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
  document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card pt">
      <div class="kpi-icon">💪</div>
      <div class="kpi-label">ยอดขาย PT (${scope})</div>
      <div class="kpi-value">฿${fmt0(bd.pt)}</div>
      <div class="kpi-sub">Personal Trainer</div>
    </div>
    <div class="kpi-card member">
      <div class="kpi-icon">🎫</div>
      <div class="kpi-label">ยอดขาย MEMBER</div>
      <div class="kpi-value">฿${fmt0(bd.member)}</div>
      <div class="kpi-sub">Membership</div>
    </div>
    <div class="kpi-card plan">
      <div class="kpi-icon">📋</div>
      <div class="kpi-label">ยอด Plan SETUP</div>
      <div class="kpi-value">฿${fmt0(bd.plan)}</div>
      <div class="kpi-sub">Plan setup</div>
    </div>
    <div class="kpi-card total">
      <div class="kpi-icon">💰</div>
      <div class="kpi-label">รวม 3 หมวด</div>
      <div class="kpi-value">฿${fmt0(bd.total)}</div>
      <div class="kpi-sub">PT + MEMBER + PLAN</div>
    </div>`;
}

function renderEmployeeCards() {
  const branch = getBranch(activeBranch);
  const grid = document.getElementById('employeesGrid');
  const stats = {};
  let maxTotal = 0;
  branch.employees.forEach(e => {
    const t = empDailyTotals(activeBranch, e.id);
    stats[e.id] = t;
    if (t.total > maxTotal) maxTotal = t.total;
  });

  if (!branch.employees.length) {
    grid.innerHTML = `<div class="emp-card empty-state-card">ยังไม่มีพนักงาน — กดปุ่ม "⚙️ จัดการพนักงาน" ด้านบนเพื่อเพิ่ม</div>`;
    return;
  }

  grid.innerHTML = branch.employees.map(e => {
    const s = stats[e.id];
    const pct = maxTotal ? Math.round(s.total / maxTotal * 100) : 0;
    const sel = activeEmployee === e.id;
    const top = maxTotal > 0 && s.total === maxTotal && s.total > 0;
    const pos = e.position || 'Sale';
    const pc = pos === 'Personal Trainer' ? 'pt-pos' : 'sale-pos';
    const pi = pos === 'Personal Trainer' ? '💪' : '💼';
    return `
      <div class="emp-card clickable ${sel ? 'selected' : ''} ${top ? 'top-seller' : ''}" data-emp-id="${e.id}">
        <span class="emp-card-rank">🏆 TOP</span>
        <button class="emp-card-delete" data-emp-del="${e.id}">✕</button>
        <div class="emp-card-header">
          <div class="emp-avatar" style="background:${avatarColor(e.id)}">${avatarInitials(e.name)}</div>
          <div class="emp-card-info">
            <div class="emp-card-name">${e.name}</div>
            <div class="emp-card-position ${pc}">${pi} ${pos}</div>
            <div class="emp-card-id">${e.id}</div>
          </div>
        </div>
        <div class="emp-card-categories">
          <div class="emp-cat pt"><div class="emp-cat-label">💪 PT</div><div class="emp-cat-value">฿${fmtShort(s.pt)}</div></div>
          <div class="emp-cat member"><div class="emp-cat-label">🎫 MEMBER</div><div class="emp-cat-value">฿${fmtShort(s.member)}</div></div>
          <div class="emp-cat plan"><div class="emp-cat-label">📋 PLAN</div><div class="emp-cat-value">฿${fmtShort(s.plan)}</div></div>
        </div>
        <div class="emp-card-total">
          <span class="emp-card-total-label">รวม ${s.days} วัน</span>
          <span class="emp-card-total-value">฿${fmt0(s.total)}</span>
        </div>
        <div class="emp-card-bar-wrap"><div class="emp-card-bar" style="width:${pct}%"></div></div>
        <div class="emp-card-actions">
          <button type="button" class="emp-card-btn primary" data-emp-daily="${e.id}">+ ยอดรายวัน</button>
          <button type="button" class="emp-card-btn" data-emp-filter="${e.id}">${sel ? '✓ กำลังเลือก' : '🎯 ดูยอด'}</button>
        </div>
      </div>`;
  }).join('');

  const filterHandler = id => { activeEmployee = (activeEmployee === id) ? null : id; renderAll(); };
  grid.querySelectorAll('[data-emp-filter]').forEach(btn => btn.onclick = ev => { ev.stopPropagation(); filterHandler(btn.dataset.empFilter); });
  grid.querySelectorAll('.emp-card[data-emp-id]').forEach(card => card.onclick = ev => {
    if (ev.target.closest('[data-emp-daily]') || ev.target.closest('[data-emp-del]') || ev.target.closest('[data-emp-filter]')) return;
    filterHandler(card.dataset.empId);
  });
  grid.querySelectorAll('[data-emp-daily]').forEach(btn => btn.onclick = ev => { ev.stopPropagation(); openDailyModal(btn.dataset.empDaily); });
  grid.querySelectorAll('[data-emp-del]').forEach(btn => btn.onclick = ev => {
    ev.stopPropagation();
    const id = btn.dataset.empDel, name = empName(id);
    if (confirm(`ลบพนักงาน "${name}"?\n(ยอดที่บันทึกไว้จะยังอยู่)`)) {
      const br = getBranch(activeBranch);
      br.employees = br.employees.filter(e => e.id !== id);
      saveBranches();
      if (activeEmployee === id) activeEmployee = null;
      renderAll();
      showToast('🗑 ลบ ' + name);
    }
  });
}

function renderTable(rows) {
  const body = document.getElementById('salesTableBody');
  document.getElementById('activeBranchLabel').textContent = getBranch(activeBranch).name + (activeEmployee ? ' — ' + empName(activeEmployee) : '');
  if (!rows.length) { body.innerHTML = `<tr><td colspan="8" class="empty-state">ยังไม่มีรายการขาย</td></tr>`; return; }
  body.innerHTML = rows.map((r, i) => `
    <tr>
      <td>${r.date}</td>
      <td><strong>${empName(r.emp)}</strong></td>
      <td><span class="badge ${typeBadgeClass(r.type)}">${r.type}</span></td>
      <td>${r.detail || ''}</td>
      <td class="num">${fmt(r.price)}</td>
      <td class="num"><strong style="color:#DC2626">${fmt(r.sale)}</strong></td>
      <td>${r.pay || ''}</td>
      <td><button class="btn-danger" data-del="${i}">ลบ</button></td>
    </tr>`).join('');
  body.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    const idx = parseInt(b.dataset.del);
    const filtered = getFilteredRows();
    const target = filtered[idx];
    const arr = SALES[activeBranch];
    const realIdx = arr.indexOf(target);
    if (realIdx >= 0 && confirm('ยืนยันลบรายการนี้?')) {
      arr.splice(realIdx, 1); saveSales(); renderAll();
      showToast('🗑 ลบรายการแล้ว');
    }
  });
}

function renderCharts() {
  const branch = getBranch(activeBranch);
  const byDate = {};
  branch.employees.forEach(e => {
    if (activeEmployee && e.id !== activeEmployee) return;
    const entries = (DAILY[activeBranch] && DAILY[activeBranch][e.id]) || {};
    for (const d in entries) {
      if (!byDate[d]) byDate[d] = { pt: 0, member: 0, plan: 0 };
      byDate[d].pt += (+entries[d].pt || 0);
      byDate[d].member += (+entries[d].member || 0);
      byDate[d].plan += (+entries[d].plan || 0);
    }
  });
  const dates = Object.keys(byDate).sort();

  if (typeChart) typeChart.destroy();
  typeChart = new Chart(document.getElementById('typeChart'), {
    type: 'doughnut',
    data: { labels: ['PT','MEMBER','PLAN SETUP'], datasets: [{
      data: [
        dates.reduce((s,d)=>s+byDate[d].pt,0),
        dates.reduce((s,d)=>s+byDate[d].member,0),
        dates.reduce((s,d)=>s+byDate[d].plan,0)
      ],
      backgroundColor: ['#DC2626','#1F1F1F','#D97706'], borderWidth: 2, borderColor: '#fff',
    }]},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, color: '#1F1F1F' } },
        tooltip: { callbacks: { label: c => c.label + ': ฿' + fmt(c.raw) } }
      }
    }
  });

  const empAgg = {};
  branch.employees.forEach(e => { empAgg[e.id] = empDailyTotals(activeBranch, e.id).total; });
  const empLabels = branch.employees.map(e => e.name);
  const empData = branch.employees.map(e => empAgg[e.id] || 0);
  if (empChart) empChart.destroy();
  empChart = new Chart(document.getElementById('empChart'), {
    type: 'bar',
    data: { labels: empLabels, datasets: [{
      label: 'ยอดขายรวม', data: empData,
      backgroundColor: 'rgba(220,38,38,0.85)', hoverBackgroundColor: '#DC2626',
      borderRadius: 6, borderSkipped: false,
    }]},
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '฿' + fmt(c.raw) } } },
      scales: {
        x: { ticks: { callback: v => '฿' + fmtInt(v), color: '#4B5563' }, grid: { color: '#F3F4F6' } },
        y: { ticks: { color: '#1F1F1F', font: { weight: 600 } }, grid: { display: false } }
      }
    }
  });

  if (dayChart) dayChart.destroy();
  dayChart = new Chart(document.getElementById('dayChart'), {
    type: 'bar',
    data: { labels: dates, datasets: [
      { label: '💪 PT',     data: dates.map(d => byDate[d].pt),     backgroundColor: '#DC2626' },
      { label: '🎫 MEMBER', data: dates.map(d => byDate[d].member), backgroundColor: '#1F1F1F' },
      { label: '📋 PLAN',   data: dates.map(d => byDate[d].plan),   backgroundColor: '#D97706' },
    ]},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 10, color: '#1F1F1F', font: { size: 11 } } },
        tooltip: { callbacks: { label: c => c.dataset.label + ': ฿' + fmt(c.raw) } }
      },
      scales: {
        x: { stacked: true, ticks: { color: '#4B5563' }, grid: { display: false } },
        y: { stacked: true, ticks: { callback: v => '฿' + fmtInt(v), color: '#4B5563' }, grid: { color: '#F3F4F6' } }
      }
    }
  });
}

function getFilteredRows() {
  const arr = SALES[activeBranch] || [];
  const q = searchTerm.toLowerCase();
  return arr.filter(r => {
    if (activeEmployee && r.emp !== activeEmployee) return false;
    if (typeFilter && r.type !== typeFilter) return false;
    if (!q) return true;
    return (r.detail || '').toLowerCase().includes(q) ||
           empName(r.emp).toLowerCase().includes(q) ||
           (r.emp || '').toLowerCase().includes(q);
  }).sort((a, b) => b.date.localeCompare(a.date));
}

function renderEmployeeSelect() {
  const branch = getBranch(activeBranch);
  const sel = document.getElementById('f_emp');
  if (!branch.employees.length) {
    sel.innerHTML = `<option value="">— ยังไม่มีพนักงาน —</option>`;
    return;
  }
  sel.innerHTML = branch.employees.map(e => `<option value="${e.id}">${e.name} (${e.position || 'Sale'})</option>`).join('');
  if (activeEmployee && branch.employees.some(e => e.id === activeEmployee)) sel.value = activeEmployee;
}

function renderAll() {
  renderSidebar();
  renderMainTitle();
  renderEmployeeSelect();
  document.getElementById('empBranchLabel').textContent = getBranch(activeBranch).name;
  renderEmployeeCards();
  renderKPIs();
  renderTable(getFilteredRows());
  renderCharts();
}

function openDailyModal(empId) {
  activeDailyEmp = empId;
  const e = empById(empId);
  document.getElementById('dailyModalEmpName').textContent = `${e.name} · ${e.position || 'Sale'}`;
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('dailyDate').value = today;
  loadDailyIntoForm(empId, today);
  renderDailyHistory(empId);
  document.getElementById('dailyModal').classList.add('show');
}
function closeDailyModal() {
  document.getElementById('dailyModal').classList.remove('show');
  activeDailyEmp = null;
}
function loadDailyIntoForm(empId, date) {
  const entry = DAILY[activeBranch] && DAILY[activeBranch][empId] && DAILY[activeBranch][empId][date];
  document.getElementById('dailyPT').value     = entry ? (entry.pt || '') : '';
  document.getElementById('dailyMember').value = entry ? (entry.member || '') : '';
  document.getElementById('dailyPlan').value   = entry ? (entry.plan || '') : '';
  updateDailyPreview();
}
function updateDailyPreview() {
  const pt  = parseFloat(document.getElementById('dailyPT').value) || 0;
  const mem = parseFloat(document.getElementById('dailyMember').value) || 0;
  const pln = parseFloat(document.getElementById('dailyPlan').value) || 0;
  document.getElementById('dailyTotalPreview').textContent = '฿' + fmt0(pt + mem + pln);
}
function saveDailyEntry() {
  if (!activeDailyEmp) return;
  const date = document.getElementById('dailyDate').value;
  if (!date) { showToast('⚠ กรุณาเลือกวันที่', true); return; }
  const pt  = parseFloat(document.getElementById('dailyPT').value) || 0;
  const mem = parseFloat(document.getElementById('dailyMember').value) || 0;
  const pln = parseFloat(document.getElementById('dailyPlan').value) || 0;
  if (pt === 0 && mem === 0 && pln === 0) {
    if (!confirm('ยอดทั้ง 3 หมวดเป็น 0 — ต้องการบันทึก?')) return;
  }
  if (!DAILY[activeBranch]) DAILY[activeBranch] = {};
  if (!DAILY[activeBranch][activeDailyEmp]) DAILY[activeBranch][activeDailyEmp] = {};
  DAILY[activeBranch][activeDailyEmp][date] = { pt, member: mem, plan: pln };
  saveDaily();
  renderDailyHistory(activeDailyEmp);
  renderAll();
  showToast('✓ บันทึก ' + date);
}
function deleteDailyEntry(empId, date) {
  if (DAILY[activeBranch] && DAILY[activeBranch][empId] && DAILY[activeBranch][empId][date]) {
    delete DAILY[activeBranch][empId][date];
    saveDaily();
    renderDailyHistory(empId);
    renderAll();
    showToast('🗑 ลบยอด ' + date);
  }
}
function renderDailyHistory(empId) {
  const entries = (DAILY[activeBranch] && DAILY[activeBranch][empId]) || {};
  const dates = Object.keys(entries).sort().reverse().slice(0, 30);
  const body = document.getElementById('dailyHistoryBody');
  if (!dates.length) {
    body.innerHTML = `<tr><td colspan="6" class="daily-history-empty">ยังไม่มีบันทึก</td></tr>`;
    return;
  }
  body.innerHTML = dates.map(d => {
    const e = entries[d];
    const total = (+e.pt || 0) + (+e.member || 0) + (+e.plan || 0);
    return `<tr>
      <td><strong>${d}</strong></td>
      <td class="num" style="color:#DC2626">฿${fmt0(e.pt)}</td>
      <td class="num">฿${fmt0(e.member)}</td>
      <td class="num" style="color:#D97706">฿${fmt0(e.plan)}</td>
      <td class="num"><strong>฿${fmt0(total)}</strong></td>
      <td>
        <button class="btn-danger" data-edit="${d}">✎</button>
        <button class="btn-danger" data-daily-del="${d}" style="background:#FEE2E2">🗑</button>
      </td>
    </tr>`;
  }).join('');
  body.querySelectorAll('[data-edit]').forEach(btn => btn.onclick = () => {
    const date = btn.dataset.edit;
    document.getElementById('dailyDate').value = date;
    loadDailyIntoForm(empId, date);
  });
  body.querySelectorAll('[data-daily-del]').forEach(btn => btn.onclick = () => {
    if (confirm('ลบยอด ' + btn.dataset.dailyDel + '?')) deleteDailyEntry(empId, btn.dataset.dailyDel);
  });
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderLeftColor = isError ? '#F59E0B' : 'var(--red)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

document.getElementById('dailyModalClose').addEventListener('click', closeDailyModal);
document.getElementById('dailyModal').addEventListener('click', e => {
  if (e.target.id === 'dailyModal') closeDailyModal();
});
document.getElementById('dailyForm').addEventListener('submit', e => { e.preventDefault(); saveDailyEntry(); });
document.getElementById('dailyDate').addEventListener('change', () => {
  if (activeDailyEmp) loadDailyIntoForm(activeDailyEmp, document.getElementById('dailyDate').value);
});
['dailyPT','dailyMember','dailyPlan'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateDailyPreview);
});

document.getElementById('saleForm').addEventListener('submit', e => {
  e.preventDefault();
  const emp = document.getElementById('f_emp').value;
  if (!emp) { showToast('⚠ กรุณาเพิ่มพนักงานก่อน', true); return; }
  SALES[activeBranch].push({
    date:   document.getElementById('f_date').value,
    emp, type: document.getElementById('f_type').value,
    detail: document.getElementById('f_detail').value.trim(),
    price:  parseFloat(document.getElementById('f_price').value) || 0,
    sale:   parseFloat(document.getElementById('f_sale').value)  || 0,
    pay:    document.getElementById('f_pay').value,
  });
  saveSales();
  e.target.reset();
  document.getElementById('f_date').value = new Date().toISOString().slice(0, 10);
  renderAll();
  showToast('✓ บันทึกรายการ');
});

document.getElementById('f_price').addEventListener('input', e => {
  const saleInput = document.getElementById('f_sale');
  if (!saleInput.value || saleInput.dataset.auto === '1') {
    saleInput.value = e.target.value;
    saleInput.dataset.auto = '1';
  }
});
document.getElementById('f_sale').addEventListener('input', e => { e.target.dataset.auto = '0'; });

document.getElementById('searchBox').addEventListener('input', e => {
  searchTerm = e.target.value;
  renderTable(getFilteredRows());
});
document.getElementById('typeFilter').addEventListener('change', e => {
  typeFilter = e.target.value;
  renderTable(getFilteredRows());
});
document.getElementById('clearEmpFilter').addEventListener('click', () => { activeEmployee = null; renderAll(); });

document.getElementById('toggleEmpMgmt').addEventListener('click', () => {
  const panel = document.getElementById('empPanel');
  const btn   = document.getElementById('toggleEmpMgmt');
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  btn.classList.toggle('active', !isOpen);
  btn.textContent = isOpen ? '⚙️ จัดการพนักงาน' : '✕ ปิด';
});
function addEmployee() {
  const input = document.getElementById('newEmpName');
  const name = input.value.trim();
  const position = document.getElementById('newEmpPosition').value;
  if (!name) { input.focus(); return; }
  const br = getBranch(activeBranch);
  if (br.employees.some(e => e.name === name)) { showToast('⚠ มีชื่อนี้แล้ว', true); return; }
  br.employees.push({ id: newEmpId(activeBranch), name, position });
  saveBranches();
  input.value = '';
  renderAll();
  showToast('✓ เพิ่ม ' + name);
}
document.getElementById('addEmpBtn').addEventListener('click', addEmployee);
document.getElementById('newEmpName').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); addEmployee(); }
});

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
  const summaryRows = [['สาขา','พนักงาน','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม 3 หมวด']];
  let gPT = 0, gMem = 0, gPlan = 0;
  BRANCHES.forEach(br => {
    const dailyData = [['วันที่','รหัสพนักงาน','ชื่อพนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม']];
    let bPT = 0, bMem = 0, bPlan = 0;
    const allDates = new Set();
    br.employees.forEach(e => {
      const entries = (DAILY[br.id] && DAILY[br.id][e.id]) || {};
      for (const d in entries) allDates.add(d);
    });
    Array.from(allDates).sort().forEach(date => {
      br.employees.forEach(e => {
        const entry = DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][date];
        if (entry) {
          const pt = +entry.pt || 0, mem = +entry.member || 0, pln = +entry.plan || 0;
          dailyData.push([date, e.id, e.name, e.position || 'Sale', pt, mem, pln, pt+mem+pln]);
          bPT += pt; bMem += mem; bPlan += pln;
        }
      });
    });
    if (dailyData.length > 1) dailyData.push(['', '', '', 'รวม', bPT, bMem, bPlan, bPT+bMem+bPlan]);
    const ws = XLSX.utils.aoa_to_sheet(dailyData);
    ws['!cols'] = [{wch:12},{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:16},{wch:14}];
    XLSX.utils.book_append_sheet(wb, ws, 'รายวัน-' + br.name);
    br.employees.forEach(e => {
      const t = empDailyTotals(br.id, e.id);
      summaryRows.push([br.name, e.name, t.pt, t.member, t.plan, t.total]);
    });
    gPT += bPT; gMem += bMem; gPlan += bPlan;
  });
  summaryRows.push(['รวมทั้งหมด', '', gPT, gMem, gPlan, gPT+gMem+gPlan]);
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{wch:14},{wch:22},{wch:14},{wch:16},{wch:16},{wch:16}];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'สรุป');
  wb.SheetNames.unshift(wb.SheetNames.pop());
  XLSX.writeFile(wb, `Station24_Sales_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✓ ดาวน์โหลด Excel');
});

document.getElementById('f_date').value = new Date().toISOString().slice(0, 10);
document.getElementById('dateBadge').textContent = '📅 ' + new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
renderAll();
