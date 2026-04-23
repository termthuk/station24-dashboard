/* =========================================================
   Station 24 Fitness — Sales Dashboard
   Uses localStorage to persist sales data across sessions
   ========================================================= */

// ============ BRANCHES & EMPLOYEES ============
const BRANCHES = [
  { id: 'sriracha',   name: 'ศรีราชา',     code: 'SR', emoji: '🌊',
    employees: [
      { id: 'EMP-SR01', name: 'สมชาย ใจดี' },
      { id: 'EMP-SR02', name: 'วราภรณ์ ศรีทอง' },
      { id: 'EMP-SR03', name: 'ณัฐพล พงศ์ชัย' },
    ]
  },
  { id: 'srisaman',   name: 'ศรีสมาน',     code: 'SS', emoji: '🏙️',
    employees: [
      { id: 'EMP-SS01', name: 'พิมพ์ใจ รุ่งเรือง' },
      { id: 'EMP-SS02', name: 'ธีระ วิทยา' },
      { id: 'EMP-SS03', name: 'กิตติ อนันต์' },
    ]
  },
  { id: 'srinakarin', name: 'ศรีนครินทร์', code: 'SN', emoji: '🌆',
    employees: [
      { id: 'EMP-SN01', name: 'ปิยะ ภักดี' },
      { id: 'EMP-SN02', name: 'ชนิดา มงคล' },
      { id: 'EMP-SN03', name: 'อัญชลี สวัสดี' },
    ]
  },
];

// ============ Sample/seed data ============
const SEED_SALES = {
  sriracha: [
    { date:'2026-04-01', emp:'EMP-SR01', type:'สมาชิกรายปี',     item:'Package Gold 12 เดือน', qty:1, price:18000, comm:5,  pay:'เงินสด' },
    { date:'2026-04-02', emp:'EMP-SR02', type:'Personal Trainer', item:'PT Package 10 ครั้ง',   qty:1, price:8500,  comm:10, pay:'โอน' },
    { date:'2026-04-03', emp:'EMP-SR01', type:'อาหารเสริม',       item:'Whey Protein 2lb',      qty:2, price:1290,  comm:8,  pay:'บัตรเครดิต' },
    { date:'2026-04-04', emp:'EMP-SR03', type:'สมาชิกรายเดือน',   item:'Monthly Pass',          qty:3, price:1500,  comm:5,  pay:'เงินสด' },
    { date:'2026-04-05', emp:'EMP-SR02', type:'คลาสกลุ่ม',         item:'Yoga 8 ครั้ง',          qty:1, price:2400,  comm:7,  pay:'โอน' },
    { date:'2026-04-06', emp:'EMP-SR01', type:'สมาชิกรายปี',     item:'Package Silver',        qty:1, price:12000, comm:5,  pay:'บัตรเครดิต' },
  ],
  srisaman: [
    { date:'2026-04-01', emp:'EMP-SS01', type:'สมาชิกรายปี',     item:'Package Platinum',      qty:1, price:24000, comm:5,  pay:'บัตรเครดิต' },
    { date:'2026-04-02', emp:'EMP-SS02', type:'Personal Trainer', item:'PT Package 20 ครั้ง',   qty:1, price:16000, comm:10, pay:'โอน' },
    { date:'2026-04-03', emp:'EMP-SS01', type:'เครื่องดื่ม',       item:'Protein Shake',         qty:5, price:120,   comm:5,  pay:'เงินสด' },
    { date:'2026-04-04', emp:'EMP-SS03', type:'สมาชิกรายเดือน',   item:'Monthly Pass',          qty:2, price:1800,  comm:5,  pay:'เงินสด' },
    { date:'2026-04-05', emp:'EMP-SS02', type:'คลาสกลุ่ม',         item:'Boxing Class',          qty:1, price:3500,  comm:7,  pay:'โอน' },
  ],
  srinakarin: [
    { date:'2026-04-01', emp:'EMP-SN01', type:'สมาชิกรายปี',     item:'Package Gold',          qty:1, price:18000, comm:5,  pay:'โอน' },
    { date:'2026-04-02', emp:'EMP-SN02', type:'Personal Trainer', item:'PT Package 10 ครั้ง',   qty:1, price:9000,  comm:10, pay:'บัตรเครดิต' },
    { date:'2026-04-03', emp:'EMP-SN02', type:'อาหารเสริม',       item:'Creatine 500g',         qty:3, price:890,   comm:8,  pay:'เงินสด' },
    { date:'2026-04-04', emp:'EMP-SN01', type:'คลาสกลุ่ม',         item:'Muay Thai Class',       qty:4, price:500,   comm:7,  pay:'โอน' },
    { date:'2026-04-05', emp:'EMP-SN03', type:'สมาชิกรายเดือน',   item:'Monthly Pass',          qty:2, price:1600,  comm:5,  pay:'เงินสด' },
    { date:'2026-04-06', emp:'EMP-SN03', type:'เครื่องดื่ม',       item:'Pre-workout Drink',     qty:8, price:150,   comm:5,  pay:'QR Code' },
  ],
};

// ============ Storage (localStorage) ============
const STORAGE_KEY = 'station24_sales_v1';
function loadSales() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn('load fail', e); }
  return JSON.parse(JSON.stringify(SEED_SALES)); // deep clone
}
function saveSales() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(SALES)); }
  catch (e) { console.warn('save fail', e); }
}

// ============ State ============
let SALES = loadSales();
let activeBranch = 'sriracha';
let searchTerm = '';
let typeFilter = '';
let typeChart, empChart, dayChart;

const CHART_COLORS = ['#DC2626','#0F0F0F','#991B1B','#4B5563','#7F1D1D','#1F2937','#B91C1C'];

// ============ Helpers ============
const fmt    = n => new Intl.NumberFormat('th-TH', { minimumFractionDigits:2, maximumFractionDigits:2 }).format(n);
const fmtInt = n => new Intl.NumberFormat('th-TH').format(n);

function getBranch(id) { return BRANCHES.find(b => b.id === id); }
function empName(empId) {
  for (const b of BRANCHES) for (const e of b.employees) if (e.id === empId) return e.name;
  return empId;
}
function typeBadgeClass(t) {
  if (t.includes('สมาชิก'))   return 'membership';
  if (t.includes('Personal')) return 'pt';
  if (t.includes('คลาส'))     return 'class';
  if (t.includes('อาหาร'))    return 'supp';
  if (t.includes('เครื่อง'))  return 'drink';
  return 'other';
}

// ============ Renderers ============
function renderTabs() {
  const el = document.getElementById('branchTabs');
  el.innerHTML = BRANCHES.map(b => `
    <button class="branch-tab ${b.id === activeBranch ? 'active' : ''}" data-id="${b.id}">
      <span class="tab-code">${b.emoji} สาขา ${b.code}</span>
      <span class="tab-name">${b.name}</span>
    </button>
  `).join('');
  el.querySelectorAll('.branch-tab').forEach(btn => {
    btn.onclick = () => { activeBranch = btn.dataset.id; renderAll(); };
  });
}

function renderKPIs(rows) {
  const total = rows.reduce((s, r) => s + r.qty * r.price, 0);
  const comm  = rows.reduce((s, r) => s + r.qty * r.price * r.comm / 100, 0);
  const count = rows.length;
  const avg   = count ? total / count : 0;
  const branch = getBranch(activeBranch);
  document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card sales">
      <div class="kpi-icon">💰</div>
      <div class="kpi-label">ยอดขายรวม (${branch.name})</div>
      <div class="kpi-value">฿${fmt(total)}</div>
      <div class="kpi-sub">เฉพาะสาขานี้</div>
    </div>
    <div class="kpi-card commission">
      <div class="kpi-icon">🎯</div>
      <div class="kpi-label">ค่าคอมมิชชั่นรวม</div>
      <div class="kpi-value">฿${fmt(comm)}</div>
      <div class="kpi-sub">${((comm/total*100)||0).toFixed(1)}% ของยอดขาย</div>
    </div>
    <div class="kpi-card transactions">
      <div class="kpi-icon">🧾</div>
      <div class="kpi-label">จำนวนรายการ</div>
      <div class="kpi-value">${fmtInt(count)}</div>
      <div class="kpi-sub">transactions</div>
    </div>
    <div class="kpi-card avg">
      <div class="kpi-icon">📊</div>
      <div class="kpi-label">ยอดเฉลี่ย/รายการ</div>
      <div class="kpi-value">฿${fmt(avg)}</div>
      <div class="kpi-sub">avg ticket size</div>
    </div>
  `;
}

function renderTable(rows) {
  const body = document.getElementById('salesTableBody');
  document.getElementById('activeBranchLabel').textContent = getBranch(activeBranch).name;
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="10" class="empty-state">ยังไม่มีรายการขายในสาขานี้</td></tr>`;
    return;
  }
  body.innerHTML = rows.map((r, i) => {
    const total = r.qty * r.price;
    const comm  = total * r.comm / 100;
    return `<tr>
      <td>${r.date}</td>
      <td><strong>${empName(r.emp)}</strong><br><small style="color:#9ca3af">${r.emp}</small></td>
      <td><span class="badge ${typeBadgeClass(r.type)}">${r.type}</span></td>
      <td>${r.item}</td>
      <td class="num">${fmtInt(r.qty)}</td>
      <td class="num">${fmt(r.price)}</td>
      <td class="num"><strong style="color:#DC2626">${fmt(total)}</strong></td>
      <td class="num"><strong>${fmt(comm)}</strong></td>
      <td>${r.pay || ''}</td>
      <td><button class="btn-danger" data-del="${i}">ลบ</button></td>
    </tr>`;
  }).join('');
  body.querySelectorAll('[data-del]').forEach(b => {
    b.onclick = () => {
      const idx = parseInt(b.dataset.del);
      const filtered = getFilteredRows();
      const target = filtered[idx];
      const arr = SALES[activeBranch];
      const realIdx = arr.indexOf(target);
      if (realIdx >= 0) { arr.splice(realIdx, 1); saveSales(); renderAll(); showToast('🗑 ลบรายการแล้ว'); }
    };
  });
}

function renderCharts(rows) {
  // 1) Type chart
  const typeAgg = {};
  rows.forEach(r => { typeAgg[r.type] = (typeAgg[r.type] || 0) + r.qty * r.price; });
  const typeLabels = Object.keys(typeAgg);
  const typeData   = typeLabels.map(k => typeAgg[k]);
  if (typeChart) typeChart.destroy();
  typeChart = new Chart(document.getElementById('typeChart'), {
    type: 'doughnut',
    data: {
      labels: typeLabels,
      datasets: [{
        data: typeData,
        backgroundColor: CHART_COLORS,
        borderWidth: 2, borderColor: '#fff',
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'inherit', size: 12 }, padding: 12, color: '#1F1F1F' } },
        tooltip: { callbacks: { label: c => c.label + ': ฿' + fmt(c.raw) } }
      }
    }
  });

  // 2) Employee chart
  const empAgg = {};
  rows.forEach(r => { empAgg[r.emp] = (empAgg[r.emp] || 0) + r.qty * r.price; });
  const empLabels = Object.keys(empAgg).map(empName);
  const empData   = Object.keys(empAgg).map(e => empAgg[e]);
  if (empChart) empChart.destroy();
  empChart = new Chart(document.getElementById('empChart'), {
    type: 'bar',
    data: {
      labels: empLabels,
      datasets: [{
        label: 'ยอดขาย (บาท)', data: empData,
        backgroundColor: 'rgba(220,38,38,0.85)',
        hoverBackgroundColor: '#DC2626',
        borderRadius: 6, borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '฿' + fmt(c.raw) } } },
      scales: {
        x: { ticks: { callback: v => '฿' + fmtInt(v), color: '#4B5563' }, grid: { color: '#F3F4F6' } },
        y: { ticks: { color: '#1F1F1F', font: { weight: 600 } }, grid: { display: false } }
      }
    }
  });

  // 3) Daily chart
  const dayAgg = {};
  rows.forEach(r => { dayAgg[r.date] = (dayAgg[r.date] || 0) + r.qty * r.price; });
  const days = Object.keys(dayAgg).sort();
  if (dayChart) dayChart.destroy();
  dayChart = new Chart(document.getElementById('dayChart'), {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'ยอดขายรายวัน',
        data: days.map(d => dayAgg[d]),
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220,38,38,0.12)',
        borderWidth: 3, fill: true, tension: 0.3,
        pointBackgroundColor: '#0F0F0F',
        pointBorderColor: '#DC2626',
        pointBorderWidth: 2,
        pointRadius: 5, pointHoverRadius: 8,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '฿' + fmt(c.raw) } } },
      scales: {
        y: { ticks: { callback: v => '฿' + fmtInt(v), color: '#4B5563' }, grid: { color: '#F3F4F6' } },
        x: { ticks: { color: '#4B5563' }, grid: { display: false } }
      }
    }
  });
}

function getFilteredRows() {
  const arr = SALES[activeBranch] || [];
  const q = searchTerm.toLowerCase();
  return arr.filter(r => {
    if (typeFilter && r.type !== typeFilter) return false;
    if (!q) return true;
    return (
      r.item.toLowerCase().includes(q) ||
      empName(r.emp).toLowerCase().includes(q) ||
      r.emp.toLowerCase().includes(q)
    );
  }).sort((a, b) => b.date.localeCompare(a.date));
}

function renderEmployeeSelect() {
  const branch = getBranch(activeBranch);
  document.getElementById('f_emp').innerHTML =
    branch.employees.map(e => `<option value="${e.id}">${e.name} (${e.id})</option>`).join('');
}

function renderAll() {
  renderTabs();
  renderEmployeeSelect();
  const rows = getFilteredRows();
  renderKPIs(SALES[activeBranch] || []);
  renderTable(rows);
  renderCharts(SALES[activeBranch] || []);
}

// ============ Actions ============
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

document.getElementById('saleForm').addEventListener('submit', e => {
  e.preventDefault();
  const rec = {
    date:  document.getElementById('f_date').value,
    emp:   document.getElementById('f_emp').value,
    type:  document.getElementById('f_type').value,
    item:  document.getElementById('f_item').value,
    qty:   parseInt(document.getElementById('f_qty').value)   || 1,
    price: parseFloat(document.getElementById('f_price').value) || 0,
    comm:  parseFloat(document.getElementById('f_comm').value)  || 0,
    pay:   document.getElementById('f_pay').value,
    note:  document.getElementById('f_note').value,
  };
  SALES[activeBranch].push(rec);
  saveSales();
  e.target.reset();
  document.getElementById('f_date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('f_qty').value  = 1;
  document.getElementById('f_comm').value = 5;
  renderEmployeeSelect();
  renderAll();
  showToast('✓ บันทึกรายการเรียบร้อย — สาขา ' + getBranch(activeBranch).name);
});

document.getElementById('searchBox').addEventListener('input', e => {
  searchTerm = e.target.value;
  renderTable(getFilteredRows());
});
document.getElementById('typeFilter').addEventListener('change', e => {
  typeFilter = e.target.value;
  renderTable(getFilteredRows());
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const rows = SALES[activeBranch] || [];
  const branch = getBranch(activeBranch).name;
  const header = ['วันที่','รหัสพนักงาน','ชื่อพนักงาน','ประเภท','รายการ','จำนวน','ราคา','ยอดขาย','%คอม','คอมฯ','ชำระ'];
  const lines = rows.map(r => {
    const total = r.qty * r.price;
    const comm  = total * r.comm / 100;
    return [r.date, r.emp, empName(r.emp), r.type, r.item, r.qty, r.price, total.toFixed(2), r.comm, comm.toFixed(2), r.pay].join(',');
  });
  const csv = '\ufeff' + header.join(',') + '\n' + lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `Station24_${branch}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('ดาวน์โหลด CSV เรียบร้อย');
});

// ============ Init ============
document.getElementById('f_date').value = new Date().toISOString().slice(0, 10);
document.getElementById('dateBadge').textContent = '📅 ' + new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' });
renderAll();
