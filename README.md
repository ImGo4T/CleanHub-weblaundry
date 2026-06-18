# CleanHub — Solusi Laundry Modern

Aplikasi web manajemen laundry yang dibangun dengan Laravel 12 + React 19 + Inertia.js 2 + TypeScript + Tailwind CSS 4 + shadcn/ui.

---

## ✨ Fitur Utama

### Manajemen Order
- Pembuatan order baru dengan item dinamis
- Status pipeline: Diterima → Dicuci → Disetrika → Siap → Diambil → Selesai
- Status timeline dengan riwayat perubahan
- Kalkulasi diskon otomatis berdasarkan membership tier

### Pembayaran
- Multi-payment per order (tunai, transfer, e-wallet)
- Pembayaran tunai auto-verifikasi
- Pembayaran transfer/e-wallet butuh verifikasi manual
- Tracking saldo parsial (partial/paid/unpaid)

### Manajemen Pelanggan
- Pendaftaran pelanggan baru dengan akun user
- Membership tier: Bronze (0%), Silver (5%), Gold (10%)
- Sistem poin loyalty
- Riwayat order per pelanggan

### Master Data Layanan (Admin only)
- CRUD layanan laundry (cuci basah, cuci kering, dry clean, dll)
- Tipe unit: per kg, per item, atau keduanya
- Durasi layanan estimasi

### Dashboard
- Role-aware: Admin/Operator melihat statistik bisnis
- Pelanggan melihat order sendiri
- KPI cards: order hari ini, order aktif, revenue, total pelanggan

### Role-Based Access Control
| Role | Akses |
|------|-------|
| Admin | Semua fitur (orders, customers, services, payments) |
| Operator | Orders, customers, payments |
| Pelanggan | Dashboard (own orders only) |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 12 (PHP 8.2+) |
| Frontend | React 19 + TypeScript |
| SPA Framework | Inertia.js 2 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix Primitives) |
| Database | MySQL |
| Build Tool | Vite 6 |
| Testing | Pest PHP v3 |

---

## 📦 Instalasi

### Prasyarat
- PHP ≥ 8.2
- Composer
- Node.js ≥ 20
- MySQL

### Langkah Instalasi

```bash
# 1. Clone atau copy project
cd e:\BackupAplikasi\WebLaundry

# 2. Install PHP dependencies
composer install

# 3. Install JS dependencies
npm install

# 4. Copy file environment
cp .env.example .env

# 5. Generate app key
php artisan key:generate

# 6. Konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=cleanhub
# DB_USERNAME=root
# DB_PASSWORD=

# 7. Buat database MySQL
mysql -u root -e "CREATE DATABASE cleanhub;"

# 8. Jalankan migrasi + seeder
php artisan migrate:fresh --seed

# 9. Build asset frontend
npm run build

# 10. Jalankan development server
php artisan serve
```

Buka browser: `http://localhost:8000`

---

## 👤 Akun Default (Seeder)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cleanhub.id | password |
| Operator | kasir@cleanhub.id | password |
| Pelanggan | budi@email.com | password |
| Pelanggan | siti@email.com | password |
| Pelanggan | andi@email.com | password |

---

## 📂 Struktur Database

```
users (id, name, email, phone, role, password)
  └── customers (id, user_id, address, membership_tier, points, total_spent)
        └── orders (id, order_code, customer_id, operator_id, service_id, status, ...)
              ├── order_items (id, order_id, item_name, quantity, weight, price)
              ├── order_status_logs (id, order_id, status, changed_by, notes)
              └── payments (id, order_id, amount, method, status, reference)

services (id, name, price_per_kg, price_per_item, unit_type, duration_hours)
```

### Order Code Format
`CLH-YYYYMMDD-XXXX` (contoh: `CLH-20260615-0001`)

---

## 🧪 Testing

```bash
# Jalankan semua test
php artisan test

# Jalankan test spesifik
php artisan test --filter=OrderTest
php artisan test --filter=CustomerTest
php artisan test --filter=PaymentTest

# Dengan coverage (butuh PCOV/Xdebug)
php vendor/bin/pest --coverage
```

### Test Coverage
- **OrderTest**: 14 tests — akses kontrol, create order, diskon membership, update status, cancel
- **CustomerTest**: 10 tests — akses kontrol, CRUD, search, delete
- **PaymentTest**: 11 tests — akses kontrol, record payment, auto-verify cash, partial/full payment

**Total: 35 tests, 84 assertions**

---

## 🔧 Development Commands

```bash
# Development server dengan hot reload
npm run dev    # Vite dev server (terminal 1)
php artisan serve   # Laravel server (terminal 2)

# Production build
npm run build

# Migration
php artisan migrate
php artisan migrate:fresh --seed   # Reset + seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## 📋 Routes

```
GET  /                             Welcome (public)
GET  /dashboard                    Dashboard (auth)

# Orders (auth + admin/operator)
GET  /orders                       Order list
GET  /orders/create                Create form
POST /orders                       Store
GET  /orders/{order}               Detail
DELETE /orders/{order}              Cancel
PATCH /orders/{order}/status        Update status

# Payments (auth + admin/operator)
GET  /orders/{order}/payments      Payment list
POST /payments                     Record payment
PATCH /payments/{payment}/verify    Verify payment

# Customers (auth + admin/operator)
GET  /customers                    Customer list
GET  /customers/create             Create form
POST /customers                    Store
GET  /customers/{customer}         Detail
DELETE /customers/{customer}        Delete

# Services (auth + admin only)
GET  /services                     Service list
GET  /services/create              Create form
POST /services                     Store
GET  /services/{service}/edit      Edit form
PUT  /services/{service}           Update
DELETE /services/{service}          Delete
```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan internal CleanHub.

---

*Built with ❤️ using Laravel + React + Inertia.js*
