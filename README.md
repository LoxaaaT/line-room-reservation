# Room Reservation — Web Frontend

Static LIFF pages deployed on Vercel.
Backend (Sheets + LINE webhook) ยังอยู่ที่ Google Apps Script — frontend เรียกผ่าน `fetch()`.

## โครงสร้าง

```
web/
├── index.html         # redirect to /booking
├── booking.html       # หน้าจองเตียง
├── register.html      # หน้าลงทะเบียน
├── my-bookings.html   # หน้าเตียงของฉัน
├── dashboard.html     # หน้าตารางเตียงทั้งหมด
├── common.js          # LIFF init + API client (rpc)
├── styles.css         # CSS shared
├── config.js          # LIFF_ID + GAS_API_URL (แก้ก่อน deploy)
├── vercel.json        # Vercel routing
└── package.json
```

## ตั้งค่าก่อน deploy

แก้ [config.js](config.js):

```js
window.CONFIG = {
  LIFF_ID:     '2010083948-zyPvBi6b',
  GAS_API_URL: 'https://script.google.com/macros/s/AKfy.../exec'
};
```

- `LIFF_ID` — จาก LINE Developers Console → LIFF tab
- `GAS_API_URL` — Web App URL ของ Apps Script (Deploy → Manage deployments → ดู URL ที่ลงท้าย `/exec`)

## Deploy

```bash
# ใน folder web/
npx vercel
# หรือ push ไป GitHub แล้ว import ใน Vercel dashboard
```

## ทดสอบ local

```bash
npx serve .
# เปิด http://localhost:3000/booking
# (LIFF จะ redirect ไป LINE login — ต้องใช้ liff.line.me/{LIFF_ID}/booking จาก LINE app เพื่อทดสอบเต็มรูปแบบ)
```

## หลัง deploy แล้ว

1. คัดลอก Vercel URL เช่น `https://room-reservation-xxx.vercel.app`
2. ไป LINE Developers Console → LIFF app → **Endpoint URL** → เปลี่ยนเป็น URL ใหม่
3. อัปเดต Rich Menu links ใช้ sub-path:
   - จองเตียง → `https://liff.line.me/{LIFF_ID}/booking`
   - ลงทะเบียน → `https://liff.line.me/{LIFF_ID}/register`
   - เตียงของฉัน → `https://liff.line.me/{LIFF_ID}/my-bookings`
   - Dashboard → `https://liff.line.me/{LIFF_ID}/dashboard`
