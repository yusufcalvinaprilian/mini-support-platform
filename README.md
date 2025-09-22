# Support Platform

Mini support platform seperti Saweria untuk menerima donasi dan support dari pengguna.

## Struktur Project

```
Support Platform/
├── backend/
│   ├── config/
│   │   ├── database.js      # Konfigurasi MongoDB
│   │   └── env.js          # Konfigurasi environment
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point server
├── frontend/              # Frontend application
├── docs/                  # Dokumentasi
└── package.json
```

## Setup Development

1. Install dependencies:

```bash
npm install
```

2. Setup environment variables:

```bash
# File .env sudah dibuat dengan konfigurasi default
# Untuk MongoDB Atlas, edit file .env dan ganti MONGODB_URI dengan connection string Anda
```

3. Setup MongoDB Atlas (Recommended):

```bash
# 1. Dapatkan IP address Anda
node scripts/get-ip.js

# 2. Tambahkan IP ke MongoDB Atlas Network Access
#    - Buka MongoDB Atlas Dashboard
#    - Klik "Network Access"
#    - Klik "Add IP Address"
#    - Masukkan IP yang didapat dari step 1

# 3. Test koneksi
node scripts/test-connection.js
```

**Atau gunakan Local MongoDB:**

```bash
# Install dan jalankan MongoDB lokal
brew install mongodb-community
brew services start mongodb-community
```

4. Jalankan server development:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5001`

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check

## Tech Stack

- **Backend**: Express.js, MongoDB, Mongoose
- **Security**: Helmet, CORS
- **Development**: Nodemon, Morgan (logging)
- **Authentication**: JWT (akan ditambahkan)
