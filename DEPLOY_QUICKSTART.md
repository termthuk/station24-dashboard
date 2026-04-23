# ⚡ Quick Deploy Guide

## สรุปสั้น ๆ (ถ้าอ่านภาษาไทย)

### 1️⃣ GitHub
- ไป https://github.com/new
- ชื่อ repo: `station24-dashboard` → **Create repository**
- **Add file → Upload files** → ลากไฟล์ทั้งโฟลเดอร์เข้าไป → **Commit changes**

### 2️⃣ Vercel
- ไป https://vercel.com/new
- **Import** repo ที่เพิ่งสร้าง
- กด **Deploy** (ไม่ต้องตั้งค่าอะไร)
- รอ 30 วินาที — เสร็จ! 🎉

### 3️⃣ เสร็จแล้ว
URL จะเป็น: `https://station24-dashboard.vercel.app`

---

## Quick Reference — Git CLI

```bash
# ครั้งแรก (initial)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/station24-dashboard.git
git push -u origin main

# ครั้งต่อไป (update)
git add .
git commit -m "อัพเดท"
git push
```

Vercel จะ auto-deploy ทุกครั้งที่ push
