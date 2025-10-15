# FHIR Patient Management System

Aplikasi simulasi FHIR (Fast Healthcare Interoperability Resources) untuk manajemen data pasien dengan fitur CRUD lengkap.

![FHIR Patient Management System](ss.png)

## Teknologi yang Digunakan

### Backend
- Node.js + Express.js
- PostgreSQL
- pg (PostgreSQL client)
- Swagger UI (API Documentation)
- CORS (Cross-Origin Resource Sharing)

### Frontend
- React (v18.2.0)
- Axios (HTTP client)
- CSS3

## Cara Setup dan Menjalankan

### 1. Prerequisites

Pastikan sudah terinstall:
- **Node.js** (v14 atau lebih baru) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 atau lebih baru) - [Download](https://www.postgresql.org/download/)
- **npm** atau **yarn**

### 2. Clone atau Download Project

```bash
git clone <repository-url>
cd Tugas-SIK
```

### 3. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Copy file .env.example menjadi .env
copy .env.example .env
# Atau di Linux/Mac: cp .env.example .env

# Edit file .env dan sesuaikan dengan konfigurasi PostgreSQL Anda
# Terutama DB_PASSWORD
```

Contoh isi file `.env`:
```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_anda
DB_NAME=fhir_db
```

### 4. Setup Database

Jalankan perintah berikut secara berurutan:

```bash
# Step 1: Generate database fhir_db
npm run db:generate

# Step 2: Migrate schema (buat tabel, index, trigger)
npm run db:migrate

# Step 3: Seed data (isi 5 data pasien contoh)
npm run db:seed
```

### 5. Setup Frontend

Buka terminal baru:

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install
```

### 6. Menjalankan Aplikasi

#### Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Backend akan berjalan di: **http://localhost:3001**

#### Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Frontend akan otomatis terbuka di browser: **http://localhost:3000**

### 7. Testing API

Anda bisa testing API dengan beberapa cara:

#### A. Menggunakan Swagger UI (Recommended)
1. Buka browser dan kunjungi **http://localhost:3001/api-docs**
2. Pilih endpoint yang ingin ditest
3. Klik "Try it out"
4. Isi parameter atau request body
5. Klik "Execute" untuk menjalankan request
6. Lihat response langsung di browser

#### B. Menggunakan curl atau Postman
```bash
# Get all patients
curl http://localhost:3001/Patient

# Get patient by ID
curl http://localhost:3001/Patient/1

# Create new patient
curl -X POST http://localhost:3001/Patient \
  -H "Content-Type: application/json" \
  -d '{"resourceType":"Patient","name":[{"family":"Doe","given":["Jane"]}],"gender":"female","birthDate":"1990-01-01"}'
```

#### C. Menggunakan Frontend UI
- Akses http://localhost:3000 untuk menggunakan interface user-friendly

## Fitur Utama

### 1. FHIR Compliance
- API mengikuti standar FHIR R4 (Fast Healthcare Interoperability Resources)
- Endpoint `/metadata` menyediakan CapabilityStatement
- Resource type `Patient` dengan format JSON sesuai spesifikasi FHIR
- Support untuk operasi CRUD lengkap pada resource Patient

### 2. Interactive API Documentation
- Swagger UI tersedia di `/api-docs`
- Testing endpoint langsung dari browser
- Schema validation dan contoh request/response

### 3. CRUD Operations:

1. **CREATE** - Tambah pasien baru
   - Isi form dengan data pasien (nama, gender, tanggal lahir, dll)
   - Klik tombol "Add Patient"
   - Data langsung tersimpan ke database

2. **READ** - Lihat daftar pasien
   - Semua pasien ditampilkan dalam bentuk card yang responsive
   - Menampilkan detail lengkap setiap pasien
   - Badge gender dengan warna berbeda
   - Format tanggal otomatis

3. **UPDATE** - Edit data pasien
   - Klik tombol "Edit" pada card pasien
   - Form akan terisi otomatis dengan data pasien (termasuk birth date)
   - Ubah data yang diperlukan
   - Klik "Update Patient" untuk menyimpan
   - Tombol "Cancel" untuk membatalkan

4. **DELETE** - Hapus pasien
   - Klik tombol "Delete" pada card pasien
   - Muncul modal konfirmasi dengan nama pasien
   - Konfirmasi untuk menghapus atau cancel

## API Endpoints

Base URL: `http://localhost:3001`

### Endpoint Utama

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Informasi API dan daftar endpoint |
| GET | `/metadata` | FHIR CapabilityStatement |
| GET | `/api-docs` | Swagger UI Documentation |

### FHIR Patient Resource

Sesuai dengan standar FHIR, semua endpoint pasien menggunakan `/Patient`:

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/Patient` | Ambil semua data pasien |
| GET | `/Patient/:id` | Ambil data pasien berdasarkan ID |
| POST | `/Patient` | Buat data pasien baru |
| PUT | `/Patient/:id` | Update data pasien |
| DELETE | `/Patient/:id` | Hapus data pasien |

### Contoh FHIR Patient Resource (Request Body)

**Format FHIR Standard** (POST/PUT `/Patient`):

```json
{
  "resourceType": "Patient",
  "name": [
    {
      "use": "official",
      "family": "Smith",
      "given": ["John"]
    }
  ],
  "gender": "male",
  "birthDate": "1985-06-15",
  "telecom": [
    {
      "system": "phone",
      "value": "+1-555-0101",
      "use": "mobile"
    },
    {
      "system": "email",
      "value": "john.smith@email.com"
    }
  ],
  "address": [
    {
      "use": "home",
      "line": ["123 Main St"],
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    }
  ]
}
```

**Catatan**: API mendukung format FHIR standar sesuai spesifikasi FHIR R4.

## Database Schema

Tabel `patients` dengan field:
- `id` (SERIAL PRIMARY KEY)
- `family_name` (VARCHAR)
- `given_name` (VARCHAR)
- `gender` (VARCHAR) - male, female, other, unknown
- `birth_date` (DATE)
- `phone` (VARCHAR)
- `email` (VARCHAR)
- `address` (TEXT)
- `city` (VARCHAR)
- `postal_code` (VARCHAR)
- `country` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Struktur Proyek

```
Tugas-SIK/
├── backend/
│   ├── config/
│   │   ├── database.js      # Konfigurasi PostgreSQL
│   │   └── swagger.js        # Konfigurasi Swagger
│   ├── controllers/
│   │   └── patientController.js
│   ├── routes/
│   │   └── patientRoutes.js
│   ├── scripts/
│   │   ├── generate.js       # Script generate database
│   │   ├── migrate.js        # Script migrasi schema
│   │   └── seed.js           # Script seed data
│   ├── utils/
│   │   └── fhirConverter.js  # Converter FHIR format
│   ├── server.js             # Entry point server
│   ├── package.json
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styling
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md
```

## Anggota Kelompok

| NIM | Nama |
|-----|------|
| 18322005 | Prajnagastya Adhyatmika |
| 13522027 | Muhammad Althariq Fairuz |
| 13522067 | Randy Verdian |

---

**EB4007 Sistem Informasi Kesehatan**
**Institut Teknologi Bandung**