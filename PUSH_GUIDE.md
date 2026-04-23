# 🚀 วิธี Push ขึ้น GitHub

เนื่องจากระบบนี้ไม่สามารถ login GitHub account ของคุณแทนได้ จึงต้องให้คุณ push เอง แต่ผมเตรียมสคริปต์ให้แล้ว — **ดับเบิลคลิกไฟล์เดียวจบ**

---

## 📋 ขั้นตอน (ครั้งแรก)

### 1. สร้าง Repository บน GitHub
1. ไปที่ https://github.com/new
2. กรอกชื่อ: `station24-dashboard`
3. เลือก **Public** (หรือ Private)
4. ⚠️ **ห้ามติ๊ก** "Add a README" (ต้องเป็น repo ว่าง)
5. กด **Create repository**

### 2. สร้าง Personal Access Token (ใช้แทนรหัสผ่าน)
1. ไปที่ https://github.com/settings/tokens/new
2. **Note**: ใส่ชื่อเช่น "station24-push"
3. **Expiration**: เลือก 90 days (หรือตามสะดวก)
4. **Scopes**: ติ๊ก ✅ `repo`
5. กด **Generate token** ที่ล่างสุด
6. **ก๊อปโทเค็นทันที** (จะเห็นแค่ครั้งเดียว!) — เก็บไว้ใน Notepad ก่อน

### 3. รัน push-to-github.bat
1. เปิดโฟลเดอร์ `C:\Users\FITNESS\station24-dashboard`
2. **ดับเบิลคลิกไฟล์** `push-to-github.bat`
3. กรอก GitHub username
4. ชื่อ repo: Enter (default = station24-dashboard)
5. Commit message: Enter (หรือพิมพ์เอง)
6. เมื่อระบบถาม password → **วาง Personal Access Token**
7. รอสักครู่ → สำเร็จ! 🎉

---

## 🔄 ครั้งต่อไป (แก้ไขแล้ว push ใหม่)

### วิธีที่ 1 — ใช้สคริปต์ .bat อีกรอบ
ถ้า repo มี commit อยู่แล้ว สคริปต์จะ error ตอน push เพราะเป็น init ใหม่
ให้ใช้วิธีที่ 2 แทน

### วิธีที่ 2 — Command line (สะดวกสุด)
เปิด Command Prompt / PowerShell ในโฟลเดอร์ แล้วพิมพ์:

```bash
cd C:\Users\FITNESS\station24-dashboard
git add .
git commit -m "อัพเดท feature XYZ"
git push
```

(หลังจาก push ครั้งแรกผ่านสคริปต์แล้ว ครั้งต่อไปใช้แค่ 3 คำสั่งนี้)

---

## 🌐 หลัง Push เสร็จ — Deploy Vercel

1. เข้า https://vercel.com/new
2. ถ้ายังไม่เชื่อม GitHub กด **Install Vercel on GitHub** → เลือก repo ที่ต้องการ
3. เห็น `station24-dashboard` แล้วกด **Import**
4. Framework Preset: `Other`
5. Build Command: เว้นว่าง
6. กด **Deploy** 🚀

รอ 30 วินาที → ได้ URL `https://station24-dashboard.vercel.app`

**ครั้งต่อไป**: แค่ git push → Vercel auto-deploy ให้เองภายใน 30 วินาที

---

## ❓ ถ้าติดปัญหา

### "Repository not found"
- ยังไม่ได้สร้าง repo บน GitHub → ไปทำตามข้อ 1 ก่อน
- ชื่อ repo ในสคริปต์ไม่ตรงกับที่สร้าง

### "Authentication failed"
- ใช้รหัสผ่าน GitHub แทน Token (ไม่ได้แล้ว ต้องใช้ Token)
- สร้าง Token ใหม่ตามข้อ 2 แล้วใช้ทดแทน

### "rejected - non-fast-forward"
- Repo มี commit อยู่แล้ว (เช่นมี README ที่ GitHub auto-generate)
- ใน command line พิมพ์:
  ```bash
  git pull origin main --allow-unrelated-histories
  git push
  ```
- หรือถ้าไม่สน commit เก่า: `git push -f origin main` (ทับทั้งหมด)

### อื่นๆ
- ลองปิดโปรแกรม antivirus ชั่วคราว
- ลอง restart Terminal/Command Prompt
- ตรวจสอบว่ามี Git ติดตั้ง: https://git-scm.com/download/win
