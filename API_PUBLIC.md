# Dokumentasi API Publik EvaKu

Dokumen ini mendeskripsikan antarmuka API publik EvaKu yang digunakan oleh Frontend (Web) dan layanan lainnya. Spesifikasi ini disusun berdasarkan skema validasi Zod (`lib/schemas/`) dan kontrak teknis backend (`dokumen_teknis_be.md`).

## Ketentuan Umum

- **Base URL:** API dilayani dari route Next.js (`/api/...`).
- **Format:** Semua request body dan response menggunakan format `application/json`.
- **Batas Request (Rate Limiting):** Endpoint `/api/simulation` dan `/api/route` dibatasi per IP per menit. Melewati batas akan mengembalikan status HTTP `429 Too Many Requests` dengan header `Retry-After`.
- **Response Error:** Semua error terprediksi menggunakan struktur standar berikut (HTTP Status sesuai dengan jenis error, misalnya 400, 401, 404, 500):
  ```json
  {
    "error": {
      "code": "STRING_KODE_ERROR",
      "message": "Pesan error yang informatif"
    }
  }
  ```

---

## 1. Run & Status Sistem

### 1.1 Ambil Run Terbaru
Mendapatkan `run_id` dari simulasi/radar dan prakiraan terbaru yang sudah dipublikasikan (`status = 'published'`).

- **Endpoint:** `GET /api/latest`
- **Cache:** Tag `status` (direvalidasi setiap ada callback pipeline sukses).
- **Response:** `200 OK`
  ```json
  {
    "radar": {
      "run_id": "string",
      "data_time": "2026-10-14T12:00:00Z" // ISO 8601 string
    }, // null jika belum ada data radar
    "forecasts": [
      {
        "run_id": "string",
        "data_time": "2026-10-14T12:00:00Z",
        "horizon_hours": 24 // 24, 48, atau 72
      }
    ]
  }
  ```

---

## 2. Peta & Data Spasial

### 2.1 Status Ruas Jalan per Run
Mendapatkan status jalan dan kedalaman genangan untuk ditampilkan di peta (lapis vektor).

- **Endpoint:** `GET /api/runs/[id]/roads`
- **Parameter Path:** `id` (string) - ID Run
- **Cache:** Immutable per run
- **Response:** `200 OK` (Dikompresi menggunakan gzip secara otomatis oleh Next.js)
  ```json
  [
    {
      "edge_id": 12345,
      "status": 0, // 0: aman, 1: terbatas, 2: putus, 3: belum diketahui
      "depth_cm": 15 // nullable
    }
  ]
  ```

### 2.2 Status Desa per Run
Mendapatkan ringkasan status setiap desa berdasarkan hasil komputasi run tertentu.

- **Endpoint:** `GET /api/runs/[id]/villages`
- **Parameter Path:** `id` (string) - ID Run
- **Query Parameter:** `district` (opsional) - Filter berdasarkan nama kecamatan
- **Cache:** Immutable per run
- **Response:** `200 OK`
  ```json
  [
    {
      "village_id": "string",
      "name": "string",
      "status": "reachable", // "reachable" | "partially_isolated" | "fully_isolated"
      "isolated_population": 100,
      "flooded_population": 50,
      "priority_score": 0.85 // nullable
    }
  ]
  ```

### 2.3 Prakiraan Desa per Run
Mendapatkan hasil prakiraan probabilitas banjir per desa dari run prakiraan.

- **Endpoint:** `GET /api/runs/[id]/forecasts`
- **Parameter Path:** `id` (string) - ID Run (jenis forecast)
- **Cache:** Immutable per run
- **Response:** `200 OK`
  ```json
  [
    {
      "village_id": "string",
      "horizon_hours": 24,
      "probability": 0.75, // 0.0 sampai 1.0
      "cutoff_hour": 48 // jam ke-berapa akses jalan diprediksi putus (nullable)
    }
  ]
  ```

### 2.4 Detail Desa
Mendapatkan informasi detail dan metrik desa, serta tiga opsi evakuasi terbaik.

- **Endpoint:** `GET /api/villages/[id]`
- **Parameter Path:** `id` (string) - ID Desa
- **Query Parameter:** `run` (wajib) - ID Run yang digunakan untuk konteks status desa
- **Cache:** Immutable per run
- **Response:** `200 OK`
  ```json
  {
    "village_id": "string",
    "name": "string",
    "district": "string",
    "regency": "string",
    "population": 1200, // nullable
    "children_under5": 100, // nullable
    "elderly": 150, // nullable
    "status": "reachable", // "reachable" | "partially_isolated" | "fully_isolated"
    "isolated_population": 0,
    "flooded_population": 0,
    "priority_score": 0.2, // nullable
    "geom": [ [ [ [110.0, -7.0], [110.1, -7.0], ... ] ] ], // GeoJSON MultiPolygon Coordinates
    "score_breakdown": { ... }, // Obyek JSON dinamis (nullable)
    "route": { ... }, // GeoJSON LineString (nullable)
    "boat_point": { ... }, // Drop-off point (nullable)
    "evacuations": [
      // Selalu berisi tepat 3 elemen (diurutkan berdasarkan rank: 1, 2, 3)
      {
        "rank": 1,
        "facility_id": 987,
        "facility_name": "Puskesmas Maju", // nullable
        "distance_m": 1200.5, // nullable
        "walk_minutes": 15.0, // nullable
        "drive_minutes": 5.0, // nullable
        "leave_before_hour": 24, // nullable
        "route": { ... } // GeoJSON LineString rute evakuasi (nullable)
      }
    ]
  }
  ```

---

## 3. Interaksi Layanan Model (AI/ML)

*Catatan: Struktur lengkap model_payload saat ini menunggu `contracts/openapi.json`. Namun `source` dipastikan tersedia pada response sebagai penanda asal data (fastapi / cache / fallback).*

### 3.1 Simulasi
Memicu simulasi banjir berdasarkan parameter ketinggian sungai (atau skenario lain).

- **Endpoint:** `POST /api/simulation`
- **Request Body:**
  ```json
  {
    "river_id": "string",
    "water_level_m": 3.5, // 0-5
    "vehicle": "string",
    "hub_ids": ["string"] // opsional
  }
  ```
- **Cache:** Menggunakan tabel `simulation_cache` per `param_hash`.
- **Response:** `200 OK`
  ```json
  {
    "source": "fastapi", // "fastapi" | "cache" | "fallback"
    "...": "field-field lain menunggu openapi.json"
  }
  ```

### 3.2 Pencarian Rute
Mencari rute terbaik menuju desa menggunakan model/skenario terbaru.

- **Endpoint:** `POST /api/route`
- **Request Body:**
  ```json
  {
    "village_id": "string",
    "vehicle": "string",
    "hub_id": "string", // opsional
    "run_id": "string", // Tepat SATU dari run_id atau param_hash
    "param_hash": "string"
  }
  ```
- **Cache:** Per parameter request.
- **Response:** `200 OK`
  ```json
  {
    "source": "fastapi", // "fastapi" | "cache" | "fallback"
    "...": "field-field lain menunggu openapi.json"
  }
  ```

### 3.3 Kalkulasi Ulang (Recalc) - *Should Have*
Mensimulasikan ulang status dengan memberlakukan koreksi manual ruas jalan.

- **Endpoint:** `POST /api/recalc`
- **Request Body:**
  ```json
  {
    "run_id": "string",
    "corrections": [
      {
        "edge_id": 12345,
        "status": 1
      }
    ]
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "source": "fastapi", // "fastapi" | "cache" | "fallback"
    "...": "field-field lain menunggu openapi.json"
  }
  ```

---

## 4. Webhook & Callback Internal

### 4.1 Telegram Webhook
Endpoint yang digunakan oleh API Bot Telegram untuk meneruskan update chat dari pengguna (perintah mulai, langganan peringatan).

- **Endpoint:** `POST /api/telegram`
- **Header Khusus:** `X-Telegram-Bot-Api-Secret-Token` (Wajib, diverifikasi dengan fungsi waktu konstan)
- **Request Body:** Struktur update standar Telegram Bot API.
- **Response:** `200 OK` (Cepat, dikembalikan tanpa payload berarti agar webhook tidak timeout).

### 4.2 Callback Pipeline Complete
Endpoint untuk menginformasikan Next.js bahwa pipeline AI/ML telah selesai memasukkan data (run baru) ke database, memicu revalidasi cache, dan pengiriman pesan ke Telegram.

- **Endpoint:** `POST /api/pipeline/complete`
- **Header Khusus:** `X-Pipeline-Secret` (Wajib, diverifikasi dengan fungsi waktu konstan)
- **Request Body:**
  ```json
  {
    "run_ids": ["string"] // Daftar run_id yang baru di-publish
  }
  ```
- **Proses:** Memanggil `revalidateTag` untuk refresh status terbaru, dan mengeksekusi `new_alerts()` untuk kirim notifikasi langganan Telegram.
- **Response:** `202 Accepted` (Diproses asinkron di belakang layar untuk mencegah timeout di pihak pemanggil).
