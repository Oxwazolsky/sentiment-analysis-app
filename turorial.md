# Walkthrough: Dashboard Prediksi Rating Bintang

Proyek pembuatan **Sistem Prediksi Rating Bintang Aplikasi Game** telah berhasil diselesaikan sesuai dengan rancangan. Sistem ini menggunakan arsitektur modern yang memisahkan Backend API dan Frontend antarmuka pengguna.

## Struktur Direktori
Sistem Anda sekarang memiliki dua folder utama:
1. `backend/`: Berisi API menggunakan FastAPI.
2. `frontend/`: Berisi antarmuka pengguna interaktif menggunakan Next.js.

---

## 1. Backend (FastAPI)

Backend bertugas untuk memproses ulasan (teks atau file CSV), mengaplikasikan pemrosesan bahasa alami (NLP), dan menggunakan model Anda untuk memberikan prediksi rating serta kategori sentimen.

### Cara Menjalankan Backend
1. Buka terminal (Command Prompt/PowerShell) baru.
2. Pindah ke direktori `backend`:
   ```bash
   cd "C:\Users\Lenovo\OneDrive\Documents\Kuliah Informatika\Data Mining\Project-UAS-Data-Mining\backend"
   ```
3. (Opsional namun disarankan) Buat dan aktifkan *Virtual Environment*:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
4. Install dependensi:
   ```bash
   pip install -r requirements.txt
   ```
5. Jalankan server FastAPI:
   ```bash
   uvicorn main:app --reload
   ```
   > API akan berjalan di `http://localhost:8000`

> [!WARNING]
> **Integrasi Model Asli**
> Saat ini, karena file model `.h5` dan `.pickle` belum ada, sistem menggunakan *Mock Model* (data buatan) untuk memberikan prediksi. Jika file model Anda sudah siap, masukkan ke folder `backend/model/` (misalnya `backend/model/model_lstm.h5`), lalu buka file `backend/ml_service.py` dan hapus komentar (uncomment) pada baris kode yang memuat TensorFlow.

---

## 2. Frontend (Next.js)

Frontend telah dirancang dengan antarmuka (UI) yang sangat modern, menggunakan **Glassmorphism**, warna latar belakang bernuansa gaming (Dark Mode dengan aksen ungu dan pink yang vibran), serta animasi menggunakan Framer Motion.

### Fitur Frontend:
- **Single Review Test:** Input teks manual di kotak sebelah kiri, menampilkan langsung hasil rating bintang, sentimen, dan *confidence score*.
- **Batch Processing:** Kotak unggah file (Drag & Drop) di sebelah kanan untuk memproses CSV.
- **Analytics Dashboard:** Jika file CSV diunggah, bagian bawah akan menampilkan:
  - Total ulasan, rata-rata rating, sentimen mayoritas.
  - Grafik Distribusi (Pie Chart).
  - Word Cloud untuk kata yang paling sering muncul di sentimen negatif.
  - Tabel hasil lengkap (maksimal menampilkan 50 baris pertama di UI agar tidak lag).

### Cara Menjalankan Frontend
1. Buka terminal baru.
2. Pindah ke direktori `frontend`:
   ```bash
   cd "C:\Users\Lenovo\OneDrive\Documents\Kuliah Informatika\Data Mining\Project-UAS-Data-Mining\frontend"
   ```
3. Jalankan *development server*:
   ```bash
   npm run dev
   ```
   > Buka browser dan akses `http://localhost:3000`

---

## Langkah Selanjutnya (Deployment)

Karena aplikasi sudah terpisah antara *Frontend* dan *Backend*, Anda bisa melakukan *hosting* dengan sangat mudah:
- **Frontend:** Upload folder `frontend` ke repositori GitHub, lalu hubungkan repositori tersebut ke **Vercel** (semua konfigurasi Next.js akan terdeteksi otomatis).
- **Backend:** Upload folder `backend` ke platform seperti **Render**, **Railway**, atau **Heroku** yang mendukung Python FastAPI. Jangan lupa, jika ukuran model (`.h5`) cukup besar, pastikan platform *hosting* memiliki RAM yang memadai (minimal 512MB - 1GB).

Selamat mencoba dan semoga proyek Tugas Akhir Data Mining Anda sukses!
