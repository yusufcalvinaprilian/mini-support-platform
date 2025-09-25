# MongoDB Atlas Setup Guide

## 🚨 Masalah yang Ditemukan

Error: `Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.`

## 🔧 Solusi: Whitelist IP Address

### Langkah 1: Buka MongoDB Atlas Dashboard

1. Login ke [MongoDB Atlas](https://cloud.mongodb.com/)
2. Pilih project dan cluster Anda

### Langkah 2: Konfigurasi Network Access

1. Di sidebar kiri, klik **"Network Access"**
2. Klik **"Add IP Address"**
3. Pilih salah satu opsi:
   - **"Add Current IP Address"** (lebih aman)
   - **"Allow Access from Anywhere"** (0.0.0.0/0) - untuk development

### Langkah 3: Tunggu Propagasi

- Perubahan IP whitelist membutuhkan waktu 1-2 menit untuk aktif
- Refresh halaman jika perlu

## 🧪 Test Koneksi

Setelah mengatur IP whitelist, jalankan test:

```bash
# Test koneksi MongoDB
node scripts/test-connection.js

# Jika berhasil, jalankan server
npm run dev
```

## 🔍 Troubleshooting

### Error: Authentication Failed

```bash
# Cek username dan password di .env
echo $MONGODB_URI
```

### Error: Cluster Not Found

```bash
# Pastikan cluster name benar
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
```

### Error: Database Name

```bash
# Pastikan database name ada di connection string
# Contoh: mongodb+srv://...@cluster.mongodb.net/support_platform
```

## 📝 Format Connection String yang Benar

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/support_platform?retryWrites=true&w=majority
```

**Komponen:**

- `username`: Username MongoDB Atlas
- `password`: Password MongoDB Atlas
- `cluster`: Nama cluster Anda
- `support_platform`: Nama database

## ✅ Verifikasi Setup

Setelah mengatur IP whitelist, jalankan:

```bash
# 1. Test koneksi
node scripts/test-connection.js

# 2. Jika berhasil, jalankan server
npm run dev

# 3. Test API endpoints
curl http://localhost:5001/health
```

## 🚀 Next Steps

Setelah koneksi berhasil:

1. Server akan berjalan di `http://localhost:5001`
2. Test CRUD operations dengan API endpoints
3. Database akan otomatis dibuat dengan collections yang diperlukan

