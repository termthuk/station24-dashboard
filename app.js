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
    'EMP-SR01': { '2026-04-20': {pt:5000,member:2000,plan:1500}, '2026-04-21': {pt:6000,member:0,plan:2000}, '2026-04-22': {pt:3500,member:3000,plan:1000} },
    'EMP-SR02': { '2026-04-20': {pt:0,member:8000,plan:2500}, '2026-04-21': {pt:0,member:4500,plan:1500}, '2026-04-22': {pt:0,member:6000,plan:3000} },
    'EMP-SR03': { '2026-04-20': {pt:0,member:3500,plan:1000}, '2026-04-22': {pt:0,member:5500,plan:2000} }
  },
  srisaman: {
    'EMP-SS01': { '2026-04-20': {pt:0,member:12000,plan:3500}, '2026-04-21': {pt:0,member:9500,plan:2500} },
    'EMP-SS02': { '2026-04-20': {pt:7000,member:0,plan:1500}, '2026-04-21': {pt:4500,member:1500,plan:2000} },
  },
  srinakarin: {
    'EMP-SN01': { '2026-04-20': {pt:0,member:7500,plan:2000} },
    'EMP-SN02': { '2026-04-20': {pt:6500,member:0,plan:1500}, '2026-04-21': {pt:5000,member:0,plan:2500} },
  },
};

const STORAGE_SALES = 'station24_sales_v2';
const STORAGE_BRANCHES = 'station24_branches_v2';
const STORAGE_DAILY = 'station24_daily_v1';
const STORAGE_CLOSED = 'station24_closed_v1';

function loadJSON(key, fb) { try { const r = localStorage.getItem(key); if (r) return JSON.parse(r); } catch(e){} return JSON.parse(JSON.stringify(fb)); }
function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch(e){} }
function saveBranches() { saveJSON(STORAGE_BRANCHES, BRANCHES); }
function saveSales()    { saveJSON(STORAGE_SALES, SALES); }
function saveDaily()    { saveJSON(STORAGE_DAILY, DAILY); }
function saveClosed()   { saveJSON(STORAGE_CLOSED, CLOSED); }

let BRANCHES = loadJSON(STORAGE_BRANCHES, DEFAULT_BRANCHES);
let SALES    = loadJSON(STORAGE_SALES, SEED_SALES);
let DAILY    = loadJSON(STORAGE_DAILY, SEED_DAILY);
let CLOSED   = loadJSON(STORAGE_CLOSED, {});

BRANCHES.forEach(b => b.employees.forEach(e => {
  if (!e.position) e.position = 'Sale';
  if (!('photo' in e)) e.photo = '';
}));
BRANCHES.forEach(b => { if (!DAILY[b.id]) DAILY[b.id] = {}; });

let currentView = 'branch'; // 'branch' | 'summary'
let activeBranch = 'sriracha';
let activeEmployee = null;
let activeDailyEmp = null;
let activeEditEmp = null;
let editEmpPhotoBase64 = '';
let searchTerm = '';
let typeFilter = '';
let typeChart, empChart, dayChart, sumBranchChart, sumCategoryChart, sumDailyChart;

const AVATAR_COLORS = [
  'linear-gradient(135deg,#DC2626,#991B1B)','linear-gradient(135deg,#1F1F1F,#4B5563)',
  'linear-gradient(135deg,#B91C1C,#7F1D1D)','linear-gradient(135deg,#374151,#1F2937)',
  'linear-gradient(135deg,#DC2626,#1F1F1F)','linear-gradient(135deg,#991B1B,#4B5563)',
  'linear-gradient(135deg,#EF4444,#DC2626)',
];

const fmt    = n => new Intl.NumberFormat('th-TH', { minimumFractionDigits:2, maximumFractionDigits:2 }).format(n || 0);
const fmt0   = n => new Intl.NumberFormat('th-TH').format(Math.round(n || 0));
const fmtInt = n => new Intl.NumberFormat('th-TH').format(n || 0);
const fmtShort = n => { n = +n || 0; if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'')+'M'; if (n >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'')+'K'; return n.toLocaleString('th-TH'); };

function getBranch(id) { return BRANCHES.find(b => b.id === id); }
function empById(id)   { for (const b of BRANCHES) for (const e of b.employees) if (e.id === id) return e; return null; }
function empName(id)   { const e = empById(id); return e ? e.name : id; }
function empBranchOf(empId) { for (const b of BRANCHES) if (b.employees.some(e => e.id === empId)) return b; return null; }

function typeBadgeClass(t) {
  if (!t) return 'other';
  if (t.includes('สมาชิก')) return 'membership';
  if (t.includes('Personal')) return 'pt';
  if (t.includes('คลาส')) return 'class';
  if (t.includes('อาหาร')) return 'supp';
  if (t.includes('เครื่อง')) return 'drink';
  return 'other';
}
function newEmpId(branchId) {
  const br = getBranch(branchId);
  const prefix = 'EMP-' + br.code;
  let max = 0;
  br.employees.forEach(e => { const m = e.id.match(new RegExp('^'+prefix+'(\\d+)$')); if (m) max = Math.max(max, +m[1]); });
  return prefix + String(max + 1).padStart(2, '0');
}
function avatarInitials(name) {
  const c = (name || '').trim().replace(/\s+/g, ' ');
  const p = c.split(' ');
  return p.length >= 2 ? p[0].slice(0,1) + p[1].slice(0,1) : c.slice(0,2);
}
function avatarColor(s) {
  let h = 0;
  for (const c of (s || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function avatarHTML(e, sizeClass = 'emp-avatar') {
  if (e.photo) return `<img class="${sizeClass === 'emp-avatar' ? 'emp-avatar-img' : 'top-emp-avatar'}" src="${e.photo}" alt="">`;
  return `<div class="${sizeClass}" style="background:${avatarColor(e.id)}">${avatarInitials(e.name)}</div>`;
}

function empDailyTotals(bid, eid, monthFilter) {
  const entries = DAILY[bid] && DAILY[bid][eid] ? DAILY[bid][eid] : {};
  let pt=0, member=0, plan=0, days=0;
  for (const d in entries) {
    if (monthFilter && !d.startsWith(monthFilter)) continue;
    pt += +entries[d].pt||0;
    member += +entries[d].member||0;
    plan += +entries[d].plan||0;
    days++;
  }
  return { pt, member, plan, days, total: pt+member+plan };
}
function branchDailyTotals(bid, monthFilter) {
  const br = getBranch(bid);
  let pt=0, member=0, plan=0;
  br.employees.forEach(e => { const t = empDailyTotals(bid, e.id, monthFilter); pt += t.pt; member += t.member; plan += t.plan; });
  return { pt, member, plan, total: pt+member+plan };
}
function branchSalesTotal(bid) {
  return (SALES[bid] || []).reduce((s, r) => s + (+r.sale || 0), 0);
}

// ============ Photo upload with resize ============
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 240;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============ View switcher ============
function setView(view) {
  currentView = view;
  document.getElementById('branchView').style.display = view === 'branch' ? 'block' : 'none';
  document.getElementById('summaryView').style.display = view === 'summary' ? 'block' : 'none';
  document.getElementById('branchListSection').style.display = view === 'branch' ? 'block' : 'none';
  renderMenuNav();
  if (view === 'branch') renderBranchView();
  else renderSummaryView();
}

function renderMenuNav() {
  const nav = document.getElementById('menuNav');
  nav.innerHTML = `
    <button class="menu-item ${currentView === 'branch' ? 'active' : ''}" data-view="branch">
      <span class="menu-item-icon">🏢</span><span>หน้าสาขา</span>
    </button>
    <button class="menu-item ${currentView === 'summary' ? 'active' : ''}" data-view="summary">
      <span class="menu-item-icon">📈</span><span>สรุปยอด</span>
    </button>
  `;
  nav.querySelectorAll('.menu-item').forEach(btn => btn.onclick = () => setView(btn.dataset.view));
}

// ============ Branch view ============
function renderSidebar() {
  const nav = document.getElementById('branchNav');
  nav.innerHTML = BRANCHES.map(b => {
    const bd = branchDailyTotals(b.id);
    return `<button class="branch-item ${b.id === activeBranch ? 'active' : ''}" data-id="${b.id}">
      <span class="branch-item-icon">${b.emoji}</span>
      <span class="branch-item-body">
        <span class="branch-item-name">สาขา${b.name}</span>
        <span class="branch-item-sub">${b.code} · ฿${fmtShort(bd.total)} · ${b.employees.length} คน</span>
      </span></button>`;
  }).join('');
  nav.querySelectorAll('.branch-item').forEach(btn => btn.onclick = () => {
    activeBranch = btn.dataset.id;
    activeEmployee = null;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop').classList.remove('show');
    if (currentView === 'branch') renderBranchView(); else setView('branch');
  });

  let gPT=0, gMem=0, gPlan=0;
  BRANCHES.forEach(b => { const t = branchDailyTotals(b.id); gPT+=t.pt; gMem+=t.member; gPlan+=t.plan; });
  document.getElementById('sidebarSummary').innerHTML = `
    <div class="sidebar-stat"><div class="sidebar-stat-label">💪 ยอด PT รวม</div><div class="sidebar-stat-value">฿${fmt0(gPT)}</div></div>
    <div class="sidebar-stat black"><div class="sidebar-stat-label">🎫 ยอด MEMBER รวม</div><div class="sidebar-stat-value">฿${fmt0(gMem)}</div></div>
    <div class="sidebar-stat"><div class="sidebar-stat-label">📋 Plan SETUP รวม</div><div class="sidebar-stat-value" style="color:var(--plan-color)">฿${fmt0(gPlan)}</div></div>`;
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
    <div class="kpi-card pt"><div class="kpi-icon">💪</div><div class="kpi-label">ยอดขาย PT (${scope})</div><div class="kpi-value">฿${fmt0(bd.pt)}</div><div class="kpi-sub">Personal Trainer</div></div>
    <div class="kpi-card member"><div class="kpi-icon">🎫</div><div class="kpi-label">ยอดขาย MEMBER</div><div class="kpi-value">฿${fmt0(bd.member)}</div><div class="kpi-sub">Membership</div></div>
    <div class="kpi-card plan"><div class="kpi-icon">📋</div><div class="kpi-label">ยอด Plan SETUP</div><div class="kpi-value">฿${fmt0(bd.plan)}</div><div class="kpi-sub">Plan setup</div></div>
    <div class="kpi-card total"><div class="kpi-icon">💰</div><div class="kpi-label">รวม 3 หมวด</div><div class="kpi-value">฿${fmt0(bd.total)}</div><div class="kpi-sub">PT + MEMBER + PLAN</div></div>`;
}

function renderEmployeeCards() {
  const branch = getBranch(activeBranch);
  const grid = document.getElementById('employeesGrid');
  const stats = {};
  let maxTotal = 0;
  branch.employees.forEach(e => { const t = empDailyTotals(activeBranch, e.id); stats[e.id] = t; if (t.total > maxTotal) maxTotal = t.total; });

  if (!branch.employees.length) {
    grid.innerHTML = `<div class="emp-card empty-state-card">ยังไม่มีพนักงาน — กด "⚙️ จัดการพนักงาน" เพื่อเพิ่ม</div>`;
    return;
  }

  grid.innerHTML = branch.employees.map(e => {
    const s = stats[e.id];
    const pct = maxTotal ? Math.round(s.total/maxTotal*100) : 0;
    const sel = activeEmployee === e.id;
    const top = maxTotal > 0 && s.total === maxTotal && s.total > 0;
    const pos = e.position || 'Sale';
    const pc = pos === 'Personal Trainer' ? 'pt-pos' : 'sale-pos';
    const pi = pos === 'Personal Trainer' ? '💪' : '💼';
    return `<div class="emp-card clickable ${sel?'selected':''} ${top?'top-seller':''}" data-emp-id="${e.id}">
      <span class="emp-card-rank">🏆 TOP</span>
      <button class="emp-card-edit" data-emp-edit="${e.id}" title="แก้ไข">✎</button>
      <button class="emp-card-delete" data-emp-del="${e.id}" title="ลบ">✕</button>
      <div class="emp-card-header">
        ${avatarHTML(e)}
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
        <button type="button" class="emp-card-btn" data-emp-filter="${e.id}">${sel?'✓ เลือกอยู่':'🎯 ดูยอด'}</button>
      </div>
    </div>`;
  }).join('');

  const filterHandler = id => { activeEmployee = activeEmployee === id ? null : id; renderBranchView(); };
  grid.querySelectorAll('[data-emp-filter]').forEach(btn => btn.onclick = ev => { ev.stopPropagation(); filterHandler(btn.dataset.empFilter); });
  grid.querySelectorAll('.emp-card[data-emp-id]').forEach(card => card.onclick = ev => {
    if (ev.target.closest('[data-emp-daily]') || ev.target.closest('[data-emp-del]') ||
        ev.target.closest('[data-emp-filter]') || ev.target.closest('[data-emp-edit]')) return;
    filterHandler(card.dataset.empId);
  });
  grid.querySelectorAll('[data-emp-daily]').forEach(btn => btn.onclick = ev => { ev.stopPropagation(); openDailyModal(btn.dataset.empDaily); });
  grid.querySelectorAll('[data-emp-edit]').forEach(btn => btn.onclick = ev => { ev.stopPropagation(); openEditEmpModal(btn.dataset.empEdit); });
  grid.querySelectorAll('[data-emp-del]').forEach(btn => btn.onclick = ev => {
    ev.stopPropagation();
    const id = btn.dataset.empDel, name = empName(id);
    if (confirm(`ลบพนักงาน "${name}"?\n(ยอดที่บันทึกไว้จะยังอยู่)`)) {
      const br = getBranch(activeBranch);
      br.employees = br.employees.filter(x => x.id !== id);
      saveBranches();
      if (activeEmployee === id) activeEmployee = null;
      renderBranchView(); renderSidebar();
      showToast('🗑 ลบ ' + name);
    }
  });
}

function renderTable(rows) {
  const body = document.getElementById('salesTableBody');
  document.getElementById('activeBranchLabel').textContent = getBranch(activeBranch).name + (activeEmployee ? ' — ' + empName(activeEmployee) : '');
  if (!rows.length) { body.innerHTML = `<tr><td colspan="8" class="empty-state">ยังไม่มีรายการขาย</td></tr>`; return; }
  body.innerHTML = rows.map((r, i) => `<tr>
    <td>${r.date}</td><td><strong>${empName(r.emp)}</strong></td>
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
      arr.splice(realIdx, 1); saveSales(); renderBranchView();
      showToast('🗑 ลบรายการแล้ว');
    }
  });
}

function renderBranchCharts() {
  const branch = getBranch(activeBranch);
  const byDate = {};
  branch.employees.forEach(e => {
    if (activeEmployee && e.id !== activeEmployee) return;
    const entries = (DAILY[activeBranch] && DAILY[activeBranch][e.id]) || {};
    for (const d in entries) {
      if (!byDate[d]) byDate[d] = { pt:0, member:0, plan:0 };
      byDate[d].pt += +entries[d].pt||0;
      byDate[d].member += +entries[d].member||0;
      byDate[d].plan += +entries[d].plan||0;
    }
  });
  const dates = Object.keys(byDate).sort();

  if (typeChart) typeChart.destroy();
  typeChart = new Chart(document.getElementById('typeChart'), {
    type: 'doughnut',
    data: { labels: ['PT','MEMBER','PLAN SETUP'], datasets: [{
      data: [dates.reduce((s,d)=>s+byDate[d].pt,0), dates.reduce((s,d)=>s+byDate[d].member,0), dates.reduce((s,d)=>s+byDate[d].plan,0)],
      backgroundColor: ['#DC2626','#1F1F1F','#D97706'], borderWidth: 2, borderColor: '#fff' }]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend: { position:'bottom', labels:{ padding:12, color:'#1F1F1F' } }, tooltip: { callbacks: { label: c => c.label+': ฿'+fmt(c.raw) } } }
    }
  });

  const empAgg = {};
  branch.employees.forEach(e => { empAgg[e.id] = empDailyTotals(activeBranch, e.id).total; });
  const empLabels = branch.employees.map(e => e.name);
  const empData = branch.employees.map(e => empAgg[e.id]||0);
  if (empChart) empChart.destroy();
  empChart = new Chart(document.getElementById('empChart'), {
    type: 'bar',
    data: { labels: empLabels, datasets: [{ data: empData, backgroundColor: 'rgba(220,38,38,0.85)', hoverBackgroundColor: '#DC2626', borderRadius: 6, borderSkipped: false }]},
    options: { indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins: { legend:{display:false}, tooltip:{ callbacks:{ label: c => '฿'+fmt(c.raw) } } },
      scales: { x:{ ticks:{callback:v=>'฿'+fmtInt(v),color:'#4B5563'}, grid:{color:'#F3F4F6'} }, y:{ ticks:{color:'#1F1F1F',font:{weight:600}}, grid:{display:false} } }
    }
  });

  if (dayChart) dayChart.destroy();
  dayChart = new Chart(document.getElementById('dayChart'), {
    type: 'bar',
    data: { labels: dates, datasets: [
      { label: '💪 PT',     data: dates.map(d=>byDate[d].pt),     backgroundColor: '#DC2626' },
      { label: '🎫 MEMBER', data: dates.map(d=>byDate[d].member), backgroundColor: '#1F1F1F' },
      { label: '📋 PLAN',   data: dates.map(d=>byDate[d].plan),   backgroundColor: '#D97706' },
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ position:'bottom', labels:{padding:10,color:'#1F1F1F',font:{size:11}} }, tooltip:{ callbacks:{ label: c => c.dataset.label+': ฿'+fmt(c.raw) } } },
      scales: { x:{ stacked:true, ticks:{color:'#4B5563'}, grid:{display:false} }, y:{ stacked:true, ticks:{callback:v=>'฿'+fmtInt(v),color:'#4B5563'}, grid:{color:'#F3F4F6'} } }
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
    return (r.detail||'').toLowerCase().includes(q) || empName(r.emp).toLowerCase().includes(q);
  }).sort((a,b) => b.date.localeCompare(a.date));
}

function renderEmployeeSelect() {
  const branch = getBranch(activeBranch);
  const sel = document.getElementById('f_emp');
  sel.innerHTML = branch.employees.length
    ? branch.employees.map(e => `<option value="${e.id}">${e.name} (${e.position||'Sale'})</option>`).join('')
    : `<option value="">— ยังไม่มีพนักงาน —</option>`;
  if (activeEmployee && branch.employees.some(e => e.id === activeEmployee)) sel.value = activeEmployee;
}

function renderBranchView() {
  renderSidebar();
  renderMainTitle();
  renderEmployeeSelect();
  document.getElementById('empBranchLabel').textContent = getBranch(activeBranch).name;
  renderEmployeeCards();
  renderKPIs();
  renderTable(getFilteredRows());
  renderBranchCharts();
}

// ============ Summary view ============
function renderSummaryView() {
  renderSidebar();
  const m = document.getElementById('summaryMonth').value || new Date().toISOString().slice(0,7);

  // Aggregate across all branches for the month
  let gPT=0, gMem=0, gPlan=0, gTrans=0;
  BRANCHES.forEach(b => {
    const bd = branchDailyTotals(b.id, m);
    gPT += bd.pt; gMem += bd.member; gPlan += bd.plan;
    (SALES[b.id]||[]).forEach(r => { if (r.date && r.date.startsWith(m)) gTrans += +r.sale||0; });
  });
  const gTotal = gPT + gMem + gPlan;

  document.getElementById('summaryKpis').innerHTML = `
    <div class="kpi-card pt"><div class="kpi-icon">💪</div><div class="kpi-label">ยอดขาย PT</div><div class="kpi-value">฿${fmt0(gPT)}</div><div class="kpi-sub">ทั้ง 3 สาขา</div></div>
    <div class="kpi-card member"><div class="kpi-icon">🎫</div><div class="kpi-label">ยอดขาย MEMBER</div><div class="kpi-value">฿${fmt0(gMem)}</div><div class="kpi-sub">ทั้ง 3 สาขา</div></div>
    <div class="kpi-card plan"><div class="kpi-icon">📋</div><div class="kpi-label">ยอด Plan SETUP</div><div class="kpi-value">฿${fmt0(gPlan)}</div><div class="kpi-sub">ทั้ง 3 สาขา</div></div>
    <div class="kpi-card total"><div class="kpi-icon">💰</div><div class="kpi-label">รวมทั้งหมด</div><div class="kpi-value">฿${fmt0(gTotal)}</div><div class="kpi-sub">PT + MEMBER + PLAN</div></div>`;

  // Branch comparison chart
  const branchLabels = BRANCHES.map(b => 'สาขา'+b.name);
  const branchPT  = BRANCHES.map(b => branchDailyTotals(b.id, m).pt);
  const branchMem = BRANCHES.map(b => branchDailyTotals(b.id, m).member);
  const branchPlan = BRANCHES.map(b => branchDailyTotals(b.id, m).plan);

  if (sumBranchChart) sumBranchChart.destroy();
  sumBranchChart = new Chart(document.getElementById('sumBranchChart'), {
    type: 'bar',
    data: { labels: branchLabels, datasets: [
      { label: '💪 PT',     data: branchPT,   backgroundColor: '#DC2626', borderRadius: 6 },
      { label: '🎫 MEMBER', data: branchMem,  backgroundColor: '#1F1F1F', borderRadius: 6 },
      { label: '📋 PLAN',   data: branchPlan, backgroundColor: '#D97706', borderRadius: 6 },
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ position:'bottom', labels:{padding:10} }, tooltip:{callbacks:{label:c=>c.dataset.label+': ฿'+fmt(c.raw)}} },
      scales: { x:{ stacked:true, grid:{display:false} }, y:{ stacked:true, ticks:{callback:v=>'฿'+fmtInt(v)}, grid:{color:'#F3F4F6'} } }
    }
  });

  if (sumCategoryChart) sumCategoryChart.destroy();
  sumCategoryChart = new Chart(document.getElementById('sumCategoryChart'), {
    type: 'doughnut',
    data: { labels: ['PT','MEMBER','PLAN SETUP'], datasets: [{
      data: [gPT, gMem, gPlan],
      backgroundColor: ['#DC2626','#1F1F1F','#D97706'], borderWidth:2, borderColor:'#fff' }]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ position:'bottom', labels:{padding:12, color:'#1F1F1F'} }, tooltip:{callbacks:{label:c=>c.label+': ฿'+fmt(c.raw)}} } }
  });

  // Top employees
  const rank = [];
  BRANCHES.forEach(b => b.employees.forEach(e => {
    const t = empDailyTotals(b.id, e.id, m);
    if (t.total > 0) rank.push({ emp: e, branch: b, ...t });
  }));
  rank.sort((a,b) => b.total - a.total);
  const topEl = document.getElementById('topEmpList');
  if (!rank.length) {
    topEl.innerHTML = `<div class="empty-state">ยังไม่มีข้อมูลยอดในเดือน ${m}</div>`;
  } else {
    topEl.innerHTML = `<div class="top-emp-list">${rank.slice(0, 10).map((r, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`;
      const topClass = i < 3 ? `top-${i+1}` : '';
      return `<div class="top-emp-row ${topClass}">
        <div class="top-emp-rank">${medal}</div>
        ${avatarHTML(r.emp, 'top-emp-avatar')}
        <div class="top-emp-info">
          <div class="top-emp-name">${r.emp.name}</div>
          <div class="top-emp-meta">${r.emp.position||'Sale'} · สาขา${r.branch.name} · ${r.days} วัน</div>
        </div>
        <div class="top-emp-val">฿${fmt0(r.total)}</div>
      </div>`;
    }).join('')}</div>`;
  }

  // Daily trend
  const byDate = {};
  BRANCHES.forEach(b => b.employees.forEach(e => {
    const es = (DAILY[b.id] && DAILY[b.id][e.id]) || {};
    for (const d in es) {
      if (!d.startsWith(m)) continue;
      if (!byDate[d]) byDate[d] = { pt:0, member:0, plan:0 };
      byDate[d].pt += +es[d].pt||0;
      byDate[d].member += +es[d].member||0;
      byDate[d].plan += +es[d].plan||0;
    }
  }));
  const days = Object.keys(byDate).sort();
  if (sumDailyChart) sumDailyChart.destroy();
  sumDailyChart = new Chart(document.getElementById('sumDailyChart'), {
    type: 'bar',
    data: { labels: days, datasets: [
      { label: '💪 PT',     data: days.map(d=>byDate[d].pt),     backgroundColor: '#DC2626' },
      { label: '🎫 MEMBER', data: days.map(d=>byDate[d].member), backgroundColor: '#1F1F1F' },
      { label: '📋 PLAN',   data: days.map(d=>byDate[d].plan),   backgroundColor: '#D97706' },
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ position:'bottom', labels:{padding:10} }, tooltip:{callbacks:{label:c=>c.dataset.label+': ฿'+fmt(c.raw)}} },
      scales: { x:{ stacked:true, grid:{display:false} }, y:{ stacked:true, ticks:{callback:v=>'฿'+fmtInt(v)}, grid:{color:'#F3F4F6'} } }
    }
  });

  renderClosedHistory();
}

function renderClosedHistory() {
  const el = document.getElementById('closeoutHistory');
  const months = Object.keys(CLOSED).sort().reverse();
  if (!months.length) {
    el.innerHTML = `<div class="closeout-empty">ยังไม่มีประวัติตัดยอด — กดปุ่ม "✂ ตัดยอดเดือนนี้" เพื่อสร้างรายการแรก</div>`;
    return;
  }
  el.innerHTML = months.map(m => {
    const c = CLOSED[m];
    const date = new Date(c.closedAt).toLocaleDateString('th-TH', {year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    return `<div class="closeout-row">
      <div class="closeout-row-info">
        <div class="closeout-row-month">📅 ${m}</div>
        <div class="closeout-row-meta">ตัดยอดเมื่อ ${date} · PT ฿${fmt0(c.totals.pt)} · MEMBER ฿${fmt0(c.totals.member)} · PLAN ฿${fmt0(c.totals.plan)}</div>
      </div>
      <div class="closeout-row-total">฿${fmt0(c.totals.total)}</div>
      <button class="btn-small" data-re-closeout="${m}">⬇ Excel</button>
      <button class="btn-danger" data-del-closeout="${m}" style="margin-left:4px">🗑</button>
    </div>`;
  }).join('');
  el.querySelectorAll('[data-re-closeout]').forEach(btn => btn.onclick = () => {
    const m = btn.dataset.reCloseout;
    exportCloseoutExcel(m, CLOSED[m]);
  });
  el.querySelectorAll('[data-del-closeout]').forEach(btn => btn.onclick = () => {
    const m = btn.dataset.delCloseout;
    if (confirm(`ลบประวัติตัดยอดเดือน ${m}?`)) {
      delete CLOSED[m]; saveClosed(); renderClosedHistory(); showToast('🗑 ลบประวัติ ' + m);
    }
  });
}

// ============ Monthly Closeout ============
function closeoutMonth(yearMonth) {
  if (!confirm(`ตัดยอดประจำเดือน ${yearMonth}?\n\n• จะสร้าง snapshot เก็บไว้ในประวัติ\n• จะดาวน์โหลดไฟล์ Excel ให้ทันที\n• ข้อมูลรายวันจะยังอยู่ ไม่ได้ถูกลบ`)) return;

  const snapshot = { closedAt: new Date().toISOString(), month: yearMonth, branches: {}, totals: {pt:0,member:0,plan:0,total:0} };

  BRANCHES.forEach(br => {
    const bd = { pt:0, member:0, plan:0, total:0, employees: [] };
    br.employees.forEach(e => {
      const t = empDailyTotals(br.id, e.id, yearMonth);
      bd.pt += t.pt; bd.member += t.member; bd.plan += t.plan; bd.total += t.total;
      bd.employees.push({ id: e.id, name: e.name, position: e.position || 'Sale', ...t });
    });
    snapshot.branches[br.id] = { name: br.name, code: br.code, ...bd };
    snapshot.totals.pt += bd.pt;
    snapshot.totals.member += bd.member;
    snapshot.totals.plan += bd.plan;
    snapshot.totals.total += bd.total;
  });

  CLOSED[yearMonth] = snapshot;
  saveClosed();
  exportCloseoutExcel(yearMonth, snapshot);
  renderClosedHistory();
  showToast('✅ ตัดยอดประจำเดือน ' + yearMonth + ' เรียบร้อย');
}

function exportCloseoutExcel(yearMonth, snapshot) {
  if (typeof XLSX === 'undefined') { showToast('⚠ โหลด Excel lib ไม่สำเร็จ', true); return; }
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const sum = [['ตัดยอดประจำเดือน', yearMonth]];
  sum.push(['วันที่ตัดยอด', new Date(snapshot.closedAt).toLocaleString('th-TH')]);
  sum.push([]);
  sum.push(['สาขา','ยอด PT','ยอด MEMBER','ยอด PLAN','รวม']);
  Object.keys(snapshot.branches).forEach(bid => {
    const b = snapshot.branches[bid];
    sum.push(['สาขา'+b.name, b.pt, b.member, b.plan, b.total]);
  });
  sum.push(['รวมทั้งหมด', snapshot.totals.pt, snapshot.totals.member, snapshot.totals.plan, snapshot.totals.total]);

  const wsSum = XLSX.utils.aoa_to_sheet(sum);
  wsSum['!cols'] = [{wch:22},{wch:16},{wch:16},{wch:16},{wch:18}];
  for (let R = 4; R < sum.length; R++) {
    ['B','C','D','E'].forEach(col => {
      const a = col + (R+1);
      if (wsSum[a] && typeof wsSum[a].v === 'number') wsSum[a].z = '#,##0.00';
    });
  }
  XLSX.utils.book_append_sheet(wb, wsSum, 'สรุป');

  // Per-branch detail
  Object.keys(snapshot.branches).forEach(bid => {
    const b = snapshot.branches[bid];
    const data = [['รหัสพนักงาน','ชื่อพนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด PLAN','รวม','จำนวนวันบันทึก']];
    b.employees.forEach(e => data.push([e.id, e.name, e.position, e.pt, e.member, e.plan, e.total, e.days]));
    data.push(['','','รวม', b.pt, b.member, b.plan, b.total, '']);
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{wch:12},{wch:24},{wch:18},{wch:14},{wch:16},{wch:16},{wch:14},{wch:14}];
    const rng = XLSX.utils.decode_range(ws['!ref']);
    for (let R = 1; R <= rng.e.r; R++) {
      ['D','E','F','G'].forEach(col => {
        const a = col + (R+1);
        if (ws[a] && typeof ws[a].v === 'number') ws[a].z = '#,##0.00';
      });
    }
    XLSX.utils.book_append_sheet(wb, ws, b.name);
  });

  XLSX.writeFile(wb, `Station24_Closeout_${yearMonth}.xlsx`);
}

// ============ Daily Modal ============
function openDailyModal(empId) {
  activeDailyEmp = empId;
  const e = empById(empId);
  document.getElementById('dailyModalEmpName').textContent = `${e.name} · ${e.position||'Sale'}`;
  const today = new Date().toISOString().slice(0,10);
  document.getElementById('dailyDate').value = today;
  loadDailyIntoForm(empId, today);
  renderDailyHistory(empId);
  document.getElementById('dailyModal').classList.add('show');
}
function closeDailyModal() { document.getElementById('dailyModal').classList.remove('show'); activeDailyEmp = null; }
function loadDailyIntoForm(empId, date) {
  const entry = DAILY[activeBranch] && DAILY[activeBranch][empId] && DAILY[activeBranch][empId][date];
  document.getElementById('dailyPT').value     = entry ? (entry.pt||'') : '';
  document.getElementById('dailyMember').value = entry ? (entry.member||'') : '';
  document.getElementById('dailyPlan').value   = entry ? (entry.plan||'') : '';
  updateDailyPreview();
}
function updateDailyPreview() {
  const pt = +document.getElementById('dailyPT').value||0;
  const m = +document.getElementById('dailyMember').value||0;
  const p = +document.getElementById('dailyPlan').value||0;
  document.getElementById('dailyTotalPreview').textContent = '฿'+fmt0(pt+m+p);
}
function saveDailyEntry() {
  if (!activeDailyEmp) return;
  const date = document.getElementById('dailyDate').value;
  if (!date) { showToast('⚠ กรุณาเลือกวันที่', true); return; }
  const pt = +document.getElementById('dailyPT').value||0;
  const m = +document.getElementById('dailyMember').value||0;
  const p = +document.getElementById('dailyPlan').value||0;
  if (pt===0 && m===0 && p===0) { if (!confirm('ยอดทั้ง 3 หมวดเป็น 0 — ต้องการบันทึก?')) return; }
  if (!DAILY[activeBranch]) DAILY[activeBranch] = {};
  if (!DAILY[activeBranch][activeDailyEmp]) DAILY[activeBranch][activeDailyEmp] = {};
  DAILY[activeBranch][activeDailyEmp][date] = { pt, member: m, plan: p };
  saveDaily();
  renderDailyHistory(activeDailyEmp);
  if (currentView === 'branch') renderBranchView(); else renderSummaryView();
  showToast('✓ บันทึก ' + date);
}
function renderDailyHistory(empId) {
  const entries = (DAILY[activeBranch] && DAILY[activeBranch][empId]) || {};
  const dates = Object.keys(entries).sort().reverse().slice(0, 30);
  const body = document.getElementById('dailyHistoryBody');
  if (!dates.length) { body.innerHTML = `<tr><td colspan="6" class="daily-history-empty">ยังไม่มีบันทึก</td></tr>`; return; }
  body.innerHTML = dates.map(d => {
    const e = entries[d]; const t = (+e.pt||0)+(+e.member||0)+(+e.plan||0);
    return `<tr>
      <td><strong>${d}</strong></td>
      <td class="num" style="color:#DC2626">฿${fmt0(e.pt)}</td>
      <td class="num">฿${fmt0(e.member)}</td>
      <td class="num" style="color:#D97706">฿${fmt0(e.plan)}</td>
      <td class="num"><strong>฿${fmt0(t)}</strong></td>
      <td><button class="btn-danger" data-edit="${d}">✎</button>
          <button class="btn-danger" data-daily-del="${d}" style="background:#FEE2E2">🗑</button></td>
    </tr>`;
  }).join('');
  body.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => {
    const d = b.dataset.edit; document.getElementById('dailyDate').value = d; loadDailyIntoForm(empId, d);
  });
  body.querySelectorAll('[data-daily-del]').forEach(b => b.onclick = () => {
    if (confirm('ลบยอด ' + b.dataset.dailyDel + '?')) {
      delete DAILY[activeBranch][empId][b.dataset.dailyDel];
      saveDaily(); renderDailyHistory(empId);
      if (currentView === 'branch') renderBranchView(); else renderSummaryView();
      showToast('🗑 ลบ ' + b.dataset.dailyDel);
    }
  });
}

// ============ Edit Employee Modal ============
function openEditEmpModal(empId) {
  const e = empById(empId);
  if (!e) return;
  activeEditEmp = empId;
  editEmpPhotoBase64 = e.photo || '';
  document.getElementById('editEmpSubtitle').textContent = `${e.name} · ${e.id}`;
  document.getElementById('editEmpName').value = e.name;
  document.getElementById('editEmpPosition').value = e.position || 'Sale';
  updateEditEmpPhotoPreview();
  document.getElementById('editEmpModal').classList.add('show');
}
function closeEditEmpModal() {
  document.getElementById('editEmpModal').classList.remove('show');
  activeEditEmp = null;
  editEmpPhotoBase64 = '';
  document.getElementById('editEmpPhotoInput').value = '';
}
function updateEditEmpPhotoPreview() {
  const img = document.getElementById('editEmpPhotoPreview');
  const ph = document.getElementById('editEmpPhotoPlaceholder');
  if (editEmpPhotoBase64) {
    img.src = editEmpPhotoBase64;
    img.style.display = 'block';
    ph.style.display = 'none';
  } else {
    img.style.display = 'none';
    ph.style.display = 'flex';
  }
}
function saveEditEmp() {
  if (!activeEditEmp) return;
  const e = empById(activeEditEmp);
  if (!e) return;
  const name = document.getElementById('editEmpName').value.trim();
  const pos = document.getElementById('editEmpPosition').value;
  if (!name) { showToast('⚠ กรุณาใส่ชื่อ', true); return; }
  e.name = name;
  e.position = pos;
  e.photo = editEmpPhotoBase64;
  saveBranches();
  closeEditEmpModal();
  if (currentView === 'branch') renderBranchView(); else renderSummaryView();
  showToast('✓ อัปเดตข้อมูล ' + name);
}

// ============ Toast ============
function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderLeftColor = isError ? '#F59E0B' : 'var(--red)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ============ Events ============
document.getElementById('dailyModalClose').addEventListener('click', closeDailyModal);
document.getElementById('dailyModal').addEventListener('click', e => { if (e.target.id === 'dailyModal') closeDailyModal(); });
document.getElementById('dailyForm').addEventListener('submit', e => { e.preventDefault(); saveDailyEntry(); });
document.getElementById('dailyDate').addEventListener('change', () => { if (activeDailyEmp) loadDailyIntoForm(activeDailyEmp, document.getElementById('dailyDate').value); });
['dailyPT','dailyMember','dailyPlan'].forEach(id => document.getElementById(id).addEventListener('input', updateDailyPreview));

// Edit employee modal
document.getElementById('editEmpClose').addEventListener('click', closeEditEmpModal);
document.getElementById('editEmpModal').addEventListener('click', e => { if (e.target.id === 'editEmpModal') closeEditEmpModal(); });
document.getElementById('editEmpForm').addEventListener('submit', e => { e.preventDefault(); saveEditEmp(); });
document.getElementById('editEmpPhotoBtn').addEventListener('click', () => document.getElementById('editEmpPhotoInput').click());
document.getElementById('editEmpPhotoInput').addEventListener('change', async (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) { showToast('⚠ ไฟล์ใหญ่เกิน 10MB', true); return; }
  try {
    editEmpPhotoBase64 = await compressImage(file);
    updateEditEmpPhotoPreview();
    showToast('✓ อัปโหลดรูปเรียบร้อย');
  } catch (err) { showToast('⚠ อัปโหลดรูปไม่สำเร็จ', true); }
});
document.getElementById('editEmpPhotoRemove').addEventListener('click', () => {
  editEmpPhotoBase64 = '';
  updateEditEmpPhotoPreview();
});

// Transaction form
document.getElementById('saleForm').addEventListener('submit', e => {
  e.preventDefault();
  const emp = document.getElementById('f_emp').value;
  if (!emp) { showToast('⚠ กรุณาเพิ่มพนักงานก่อน', true); return; }
  SALES[activeBranch].push({
    date: document.getElementById('f_date').value, emp,
    type: document.getElementById('f_type').value,
    detail: document.getElementById('f_detail').value.trim(),
    price: +document.getElementById('f_price').value||0,
    sale:  +document.getElementById('f_sale').value||0,
    pay: document.getElementById('f_pay').value,
  });
  saveSales();
  e.target.reset();
  document.getElementById('f_date').value = new Date().toISOString().slice(0,10);
  renderBranchView();
  showToast('✓ บันทึกรายการ');
});
document.getElementById('f_price').addEventListener('input', e => {
  const s = document.getElementById('f_sale');
  if (!s.value || s.dataset.auto === '1') { s.value = e.target.value; s.dataset.auto = '1'; }
});
document.getElementById('f_sale').addEventListener('input', e => e.target.dataset.auto = '0');
document.getElementById('searchBox').addEventListener('input', e => { searchTerm = e.target.value; renderTable(getFilteredRows()); });
document.getElementById('typeFilter').addEventListener('change', e => { typeFilter = e.target.value; renderTable(getFilteredRows()); });
document.getElementById('clearEmpFilter').addEventListener('click', () => { activeEmployee = null; renderBranchView(); });

document.getElementById('toggleEmpMgmt').addEventListener('click', () => {
  const panel = document.getElementById('empPanel');
  const btn = document.getElementById('toggleEmpMgmt');
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  btn.classList.toggle('active', !open);
  btn.textContent = open ? '⚙️ จัดการพนักงาน' : '✕ ปิด';
});
function addEmployee() {
  const input = document.getElementById('newEmpName');
  const name = input.value.trim();
  const position = document.getElementById('newEmpPosition').value;
  if (!name) { input.focus(); return; }
  const br = getBranch(activeBranch);
  if (br.employees.some(e => e.name === name)) { showToast('⚠ มีชื่อนี้แล้ว', true); return; }
  br.employees.push({ id: newEmpId(activeBranch), name, position, photo: '' });
  saveBranches();
  input.value = '';
  renderBranchView();
  showToast('✓ เพิ่ม ' + name);
}
document.getElementById('addEmpBtn').addEventListener('click', addEmployee);
document.getElementById('newEmpName').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addEmployee(); } });

// Sidebar toggle mobile
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('show');
});
document.getElementById('sidebarBackdrop').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');
});

// Summary view events
document.getElementById('summaryMonth').addEventListener('change', renderSummaryView);
document.getElementById('closeoutBtn').addEventListener('click', () => {
  const m = document.getElementById('summaryMonth').value;
  if (!m) { showToast('⚠ กรุณาเลือกเดือน', true); return; }
  closeoutMonth(m);
});

// Export Excel (all data)
document.getElementById('exportBtn').addEventListener('click', () => {
  if (typeof XLSX === 'undefined') { showToast('⚠ โหลด Excel lib ไม่สำเร็จ', true); return; }
  const wb = XLSX.utils.book_new();
  const summaryRows = [['สาขา','พนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม 3 หมวด']];
  let gPT=0, gMem=0, gPlan=0;
  BRANCHES.forEach(br => {
    const dailyData = [['วันที่','รหัส','ชื่อพนักงาน','ตำแหน่ง','ยอด PT','ยอด MEMBER','ยอด Plan SETUP','รวม']];
    let bPT=0, bMem=0, bPlan=0;
    const allDates = new Set();
    br.employees.forEach(e => { const es = (DAILY[br.id] && DAILY[br.id][e.id]) || {}; for (const d in es) allDates.add(d); });
    Array.from(allDates).sort().forEach(date => {
      br.employees.forEach(e => {
        const en = DAILY[br.id] && DAILY[br.id][e.id] && DAILY[br.id][e.id][date];
        if (en) {
          const pt = +en.pt||0, m = +en.member||0, pl = +en.plan||0;
          dailyData.push([date, e.id, e.name, e.position||'Sale', pt, m, pl, pt+m+pl]);
          bPT+=pt; bMem+=m; bPlan+=pl;
        }
      });
    });
    if (dailyData.length > 1) dailyData.push(['','','','รวม', bPT, bMem, bPlan, bPT+bMem+bPlan]);
    const ws = XLSX.utils.aoa_to_sheet(dailyData);
    ws['!cols'] = [{wch:12},{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:16},{wch:14}];
    XLSX.utils.book_append_sheet(wb, ws, 'รายวัน-' + br.name);
    br.employees.forEach(e => {
      const t = empDailyTotals(br.id, e.id);
      summaryRows.push([br.name, e.name, e.position||'Sale', t.pt, t.member, t.plan, t.total]);
    });
    gPT+=bPT; gMem+=bMem; gPlan+=bPlan;
  });
  summaryRows.push(['รวมทั้งหมด','','', gPT, gMem, gPlan, gPT+gMem+gPlan]);
  const wsSum = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSum['!cols'] = [{wch:14},{wch:22},{wch:18},{wch:14},{wch:16},{wch:16},{wch:16}];
  XLSX.utils.book_append_sheet(wb, wsSum, 'สรุป');
  wb.SheetNames.unshift(wb.SheetNames.pop());
  XLSX.writeFile(wb, `Station24_Sales_${new Date().toISOString().slice(0,10)}.xlsx`);
  showToast('✓ ดาวน์โหลด Excel');
});

// ============ Init ============
document.getElementById('f_date').value = new Date().toISOString().slice(0,10);
document.getElementById('summaryMonth').value = new Date().toISOString().slice(0,7);
document.getElementById('dateBadge').textContent = '📅 ' + new Date().toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'});
setView('branch');
