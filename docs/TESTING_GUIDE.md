# Testing Guide - Support Platform

## 🧪 Quick Start Testing

```bash
# Jalankan semua test secara otomatis
npm test

# Atau jalankan test individual
npm run get-ip          # Dapatkan IP address
npm run test:connection # Test koneksi MongoDB
npm run test:crud       # Test CRUD operations
```

## 📋 Test Checklist

### ✅ Prerequisites

- [ ] Node.js dan npm terinstall
- [ ] MongoDB Atlas account
- [ ] Connection string di file .env
- [ ] IP address di-whitelist di MongoDB Atlas

### ✅ Step-by-Step Testing

#### 1. Setup Environment

```bash
# Install dependencies
npm install

# Cek file .env
cat .env
```

#### 2. Get Your IP Address

```bash
npm run get-ip
```

**Output yang diharapkan:**

```
📍 Your current IP address: 114.10.78.227
💡 Add this IP to MongoDB Atlas Network Access
```

#### 3. Whitelist IP di MongoDB Atlas

1. Buka [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Klik **"Network Access"** di sidebar
3. Klik **"Add IP Address"**
4. Masukkan IP dari step 2
5. Klik **"Confirm"**
6. Tunggu 1-2 menit

#### 4. Test MongoDB Connection

```bash
npm run test:connection
```

**Output yang diharapkan:**

```
✅ SUCCESS: Connected to MongoDB!
📊 Host: clustermongo-shard-00-00.dg4052i.mongodb.net
📊 Database: support_platform
🎉 Connection test completed successfully!
```

#### 5. Start Server

```bash
npm run dev
```

**Output yang diharapkan:**

```
Server running on port 5001
Environment: development
✅ MongoDB Connected: clustermongo-shard-00-00.dg4052i.mongodb.net
📊 Database: support_platform
🔗 Mongoose connected to MongoDB
```

#### 6. Test CRUD Operations

```bash
npm run test:crud
```

**Output yang diharapkan:**

```
🧪 Testing CRUD Operations...

1️⃣ Testing Health Check...
✅ Health Check: PASSED

2️⃣ Testing User Registration...
✅ User Registration: PASSED

3️⃣ Testing User Login...
✅ User Login: PASSED

4️⃣ Testing Get All Users...
✅ Get Users: PASSED

5️⃣ Testing Get User by Support Link...
✅ Get User by Support Link: PASSED

6️⃣ Testing Update User...
✅ Update User: PASSED

🎉 All CRUD tests completed!
```

## 🔧 Troubleshooting

### Error: IP Not Whitelisted

```bash
# Solusi: Tambahkan IP ke MongoDB Atlas
npm run get-ip
# Ikuti instruksi yang muncul
```

### Error: Authentication Failed

```bash
# Cek connection string di .env
cat .env | grep MONGODB_URI
# Pastikan username dan password benar
```

### Error: Server Not Running

```bash
# Start server terlebih dahulu
npm run dev
# Di terminal lain, jalankan test
npm run test:crud
```

### Error: Port Already in Use

```bash
# Cek port yang digunakan
lsof -i :5001
# Kill process jika perlu
pkill -f nodemon
```

## 📊 Test Results Interpretation

### ✅ Success Indicators

- Health check returns status "OK"
- MongoDB connection successful
- User registration creates new user
- Login returns JWT token
- CRUD operations work without errors

### ❌ Failure Indicators

- Connection timeout errors
- Authentication failed
- Server not responding
- Database connection refused

## 🚀 Next Steps After Testing

Setelah semua test passed:

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Test API Endpoints**

   ```bash
   # Test health
   curl http://localhost:5001/health

   # Test registration
   curl -X POST http://localhost:5001/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@example.com","password":"password123","fullName":"Test User"}'
   ```

3. **Build Frontend**
   - Server backend sudah siap
   - API endpoints berfungsi dengan baik
   - Database terhubung dan siap digunakan

## 📝 Notes

- Test suite akan membuat data dummy untuk testing
- Data testing tidak akan mempengaruhi production
- Semua test dapat dijalankan berulang kali
- Server harus berjalan untuk test CRUD operations
