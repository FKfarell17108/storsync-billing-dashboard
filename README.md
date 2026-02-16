# StorSync Billing Dashboard

Manajemen billing untuk layanan internet / ISP yang memungkinkan pengelolaan pelanggan, paket, langganan, invoice, dan pembayaran.

Project ini menggunakan:
- Backend: Laravel (PHP)
- Frontend: Next.js
- Database: MySQL
- Local Environment: Laragon

![storsync-billing](docs/images/loading.png)

---

## Key Features

- Dashboard statistik (Total Customers, Active Subscriptions, Pending Invoices, Total Revenue)
- Manajemen Customers
- Manajemen Packages
- Manajemen Subscriptions
- Manajemen Invoices
- Manajemen Payments
- System Status Monitoring
- Authentication (Login / Logout)

---

## Installation & Setup

1. **Clone Repository**
```bash
git clone https://github.com/username/storsync-billing-dashboard.git
cd storsync-billing-dashboard
```
   
2. **Backend Setup**
```bash
cd backend
composer install
```

3. **Copy File Environment**
```bash
cp .env.example .env
```

4. **Konfigurasi Database (.env)**
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=storsync_billing
DB_USERNAME=root
DB_PASSWORD=
```

5. **Generate Key, Migration & Seeder, Jalankan Backend**
```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend akan berjalan di:
```bash
http://127.0.0.1:8000
```

6. **Frontend Setup**
```bash
cd frontend
npm install
```

7. **Buat file .env.local**
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

8. **Jalankan Frontend**
```bash
npm run dev
```
Frontend akan berjalan di:
```bash
http://localhost:3000
```

---

## © 2026 Farell Kurniawan

Copyright © 2026 Farell Kurniawan. All rights reserved.  
Distribution and use of this code is permitted under the terms of the **MIT** license.
