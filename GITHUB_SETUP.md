# GitHub Setup Instructions

## 🔑 **Personal Access Token Setup**

Untuk mengatasi masalah autentikasi GitHub, ikuti langkah-langkah berikut:

### **Step 1: Buat Personal Access Token**

1. **Buka GitHub.com** dan login ke akun Anda
2. **Klik profil Anda** (pojok kanan atas) → **Settings**
3. **Scroll ke bawah** → **Developer settings** (di sidebar kiri)
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token** → **Generate new token (classic)**
6. **Isi form:**
   - **Note**: "Support Platform Development"
   - **Expiration**: "90 days" (atau sesuai kebutuhan)
   - **Scopes**: Centang **"repo"** (full control of private repositories)
7. **Klik "Generate token"**
8. **COPY TOKEN** (jangan tutup halaman ini!)

### **Step 2: Gunakan Token untuk Push**

Setelah mendapatkan token, jalankan perintah berikut:

```bash
# Ganti YOUR_TOKEN dengan token yang Anda dapatkan
git remote set-url origin https://YOUR_TOKEN@github.com/yusufcalvinaprilian/mini-support-platform.git

# Atau gunakan format ini:
git remote set-url origin https://yusufcalvinaprilian:YOUR_TOKEN@github.com/yusufcalvinaprilian/mini-support-platform.git
```

### **Step 3: Push ke GitHub**

```bash
git push -u origin main
```

## 🔧 **Alternatif: SSH Key Setup**

Jika Anda lebih suka menggunakan SSH:

### **Step 1: Generate SSH Key**

```bash
ssh-keygen -t ed25519 -C "yusufcalvinaprilian@gmail.com"
```

### **Step 2: Add SSH Key to GitHub**

1. **Copy public key:**

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. **GitHub Settings** → **SSH and GPG keys** → **New SSH key**
3. **Paste public key** dan beri nama "MacBook Air"
4. **Add SSH key**

### **Step 3: Change Remote URL**

```bash
git remote set-url origin git@github.com:yusufcalvinaprilian/mini-support-platform.git
```

### **Step 4: Test Connection**

```bash
ssh -T git@github.com
```

## 🚀 **Quick Fix: Use GitHub Desktop**

Jika semua di atas rumit, Anda bisa:

1. **Download GitHub Desktop** dari https://desktop.github.com/
2. **Clone repository** menggunakan GitHub Desktop
3. **Copy semua file** ke folder yang di-clone
4. **Commit dan push** melalui GitHub Desktop

## 📝 **Repository Information**

- **Repository URL**: https://github.com/yusufcalvinaprilian/mini-support-platform
- **Username**: yusufcalvinaprilian
- **Email**: yusufcalvinaprilian@gmail.com

## ✅ **Verification**

Setelah berhasil push, cek di:
https://github.com/yusufcalvinaprilian/mini-support-platform

Repository harus menampilkan semua file project Anda!

