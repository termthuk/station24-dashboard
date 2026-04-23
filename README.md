# 🏋️ Station 24 Fitness — Sales Dashboard

ระบบบันทึกยอดขายพนักงานยิม แยกตามสาขา (ศรีราชา / ศรีสมาน / ศรีนครินทร์) พร้อมกราฟสรุปและฟอร์มบันทึกรายการขาย  
Static site — HTML + CSS + Vanilla JS + Chart.js

---

## ✨ ฟีเจอร์

- 🔀 **เมนู 3 สาขา**: ศรีราชา · ศรีสมาน · ศรีนครินทร์ — ข้อมูลแยกกันสมบูรณ์
- 📊 **KPI Cards**: ยอดขายรวม, ค่าคอมมิชชั่น, จำนวนรายการ, ยอดเฉลี่ย
- ➕ **ฟอร์มบันทึกรายการขาย** พร้อมช่องเลือกพนักงาน ประเภท ช่องทางชำระ
- 📈 **กราฟ 3 แบบ**: โดนัทตามประเภท · บาร์รายพนักงาน · เส้นรายวัน
- 🔍 **ค้นหา + กรอง** ตารางรายการขาย
- ⬇️ **Export CSV** (รองรับภาษาไทยใน Excel)
- 💾 **Save อัตโนมัติใน browser** ผ่าน localStorage
- 🎨 **ธีมดำ-แดง** ตามอัตลักษณ์แบรนด์ Station 24

---

## 📁 โครงสร้างไฟล์

```
station24-dashboard/
├── index.html      # หน้าเว็บหลัก
├── styles.css      # สไตล์ชีท (ธีมดำ-แดง)
├── app.js          # โลจิกทั้งหมด + Chart.js
├── package.json    # metadata โครงการ
├── vercel.json     # การตั้งค่า Vercel
├── .gitignore
└── README.md       # ไฟล์นี้
```

---

## 🚀 วิธี Deploy ขึ้น GitHub + Vercel (ละเอียด)

### ขั้นตอนที่ 1 — สมัครบัญชี

1. สมัคร **GitHub**: https://github.com/signup
2. สมัคร **Vercel** (ล็อกอินด้วย GitHub ได้เลย): https://vercel.com/signup

---

### ขั้นตอนที่ 2 — สร้าง Repository บน GitHub

**วิธีที่ 1 — ผ่านหน้าเว็บ GitHub (ง่ายที่สุด ไม่ต้องใช้ git)**

1. ไปที่ https://github.com/new
2. กรอก **Repository name**: `station24-dashboard`
3. เลือก **Public** (ถ้าอยากให้คนอื่นเห็น) หรือ **Private**
4. ✅ ติ๊ก **Add a README file** (แล้วลบทีหลังได้)
5. กด **Create repository**
6. ในหน้า repository กด **Add file → Upload files**
7. ลากไฟล์ทุกไฟล์ในโฟลเดอร์ `station24-dashboard` เข้าไป
   (`index.html`, `styles.css`, `app.js`, `package.json`, `vercel.json`, `.gitignore`, `README.md`)
8. กด **Commit changes**

**วิธีที่ 2 — ผ่าน Git CLI** (สำหรับคนที่ใช้ git เป็น)

```bash
cd station24-dashboard
git init
git add .
git commit -m "Initial commit: Station 24 Fitness Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/station24-dashboard.git
git push -u origin main
```

---

### ขั้นตอนที่ 3 — Deploy บน Vercel

1. เข้า https://vercel.com/new
2. เลือก **Import Git Repository**
3. ถ้ายังไม่เชื่อม GitHub ให้กด **Install Vercel on GitHub**  
   → เลือก **All repositories** หรือเฉพาะ `station24-dashboard`
4. กลับมาหน้า Vercel จะเห็นรายชื่อ repository ของคุณ  
   กด **Import** ข้าง `station24-dashboard`
5. ในหน้า **Configure Project**:
   - **Framework Preset**: `Other` (Vercel จะตรวจว่าเป็น static site ให้อัตโนมัติ)
   - **Root Directory**: `.` (default)
   - **Build Command**: เว้นว่างไว้ (ไม่ต้อง build)
   - **Output Directory**: เว้นว่างไว้
6. กด **Deploy** 🚀
7. รอประมาณ 20-40 วินาที — เสร็จแล้วจะได้ URL แบบ  
   `https://station24-dashboard.vercel.app`

---

### ขั้นตอนที่ 4 — อัปเดตในอนาคต

**แก้ไขผ่าน GitHub:**

1. ไปที่ไฟล์ที่อยากแก้บน GitHub → กดไอคอน ✏️ ดินสอ
2. แก้ไข → กด **Commit changes**
3. Vercel จะ **auto-deploy ใหม่ทันที** ไม่ต้องกดอะไรเพิ่ม

**แก้ไขผ่าน Git CLI:**

```bash
git add .
git commit -m "อัพเดทฟีเจอร์ XYZ"
git push
```

---

## 🌐 Custom Domain (ไม่บังคับ)

ถ้ามีโดเมนของตัวเอง เช่น `station24.com`:

1. ใน Vercel เข้า **Project → Settings → Domains**
2. กด **Add** → ใส่โดเมน
3. ทำตามคำแนะนำเซ็ต DNS ที่ผู้ให้บริการโดเมน (เปลี่ยน A / CNAME record)
4. รอ DNS propagate (ประมาณ 10 นาที ถึง 24 ชั่วโมง)

---

## 💻 รันในเครื่องตัวเอง (Local development)

**วิธีง่ายที่สุด**: ดับเบิลคลิกไฟล์ `index.html` เปิดใน browser ได้เลย

**หรือใช้ local server** (แนะนำถ้าเจอปัญหา CORS):

```bash
# ถ้ามี Node.js
npx serve .

# ถ้ามี Python
python -m http.server 8000
```

แล้วเปิด http://localhost:3000 (serve) หรือ http://localhost:8000 (python)

---

## 🛠️ การปรับแต่ง

### เปลี่ยน/เพิ่มพนักงาน

แก้ไขในไฟล์ `app.js` ที่ตัวแปร `BRANCHES` (ประมาณบรรทัด 8):

```js
const BRANCHES = [
  { id:'sriracha', name:'ศรีราชา', code:'SR', emoji:'🌊',
    employees:[
      { id:'EMP-SR01', name:'สมชาย ใจดี' },
      // เพิ่มคนใหม่ตรงนี้
      { id:'EMP-SR04', name:'พนักงานใหม่' },
    ]
  },
  ...
]
```

### เพิ่ม/ลบสาขา

แก้ไข `BRANCHES` array ในไฟล์เดียวกัน — เพิ่ม/ลบ object ได้เลย

### เปลี่ยนสีธีม

แก้ไขในไฟล์ `styles.css` ที่ `:root` (บรรทัด 1-12):

```css
:root {
  --red:     #DC2626;   /* สีแดงหลัก */
  --red-dark: #991B1B;  /* แดงเข้ม */
  --black:   #0F0F0F;   /* ดำหลัก */
  ...
}
```

### ล้างข้อมูล (ตอนทดสอบ)

เปิด Developer Console ใน browser (F12) แล้วพิมพ์:

```js
localStorage.removeItem('station24_sales_v1');
location.reload();
```

---

## 📝 หมายเหตุ

- ข้อมูลยอดขายเก็บใน **localStorage ของ browser** (แยกตามเครื่อง/browser)
- ถ้าต้องการ **ฐานข้อมูลกลาง** ให้พนักงานหลายเครื่องเห็นข้อมูลเดียวกัน ต้องเพิ่ม backend เช่น Supabase, Firebase หรือ API ของตัวเอง
- ระบบนี้เหมาะกับ **การใช้งานภายในสาขา** หรือเป็น **prototype** ก่อนขยายเป็นระบบเต็ม

---

## 📜 License

MIT © Station 24 Fitness
