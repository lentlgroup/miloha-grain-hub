# Miloha Grain Hub

A full-stack grain supply management platform for MILOHA Pure Grains, built with:

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Laravel 11 + PHP 8.2+ + MySQL + Sanctum authentication
- **Admin Portal**: Full CRUD dashboard with RBAC (roles & permissions)

---

## Quick Start — Development

### 1. Database setup

```bash
# Start MySQL
brew services start mysql   # macOS, or: sudo systemctl start mysql

# Create the database
mysql -u root -e 'CREATE DATABASE miloha_grain_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
```

### 2. Backend (Laravel)

```bash
cd backend
cp .env.example .env
# Edit .env: set DB_USERNAME, DB_PASSWORD
php artisan key:generate
php artisan migrate --seed
php artisan serve           # Runs on http://localhost:8000
```

Seeding creates:
- **Permissions**: `manage-content`, `manage-products`, `manage-testimonials`, `manage-faqs`, `manage-slider`, `manage-inquiries`, `manage-users`, `manage-roles`, `manage-permissions`, `view-admin-dashboard`
- **Roles**: `super-admin` (all permissions), `content-manager`, `sales-manager`, `viewer`
- **Demo admin**: `admin@miloha.local` / `password` (super-admin)
- All homepage content (products, FAQs, testimonials, trust metrics, hero slides, etc.)

### 3. Frontend (React)

```bash
cd frontend
cp .env.example .env          # Optional: set VITE_BACKEND_URL if Laravel isn't on port 8000
npm install
npm run dev                   # Runs on http://localhost:8081
```

The Vite dev server proxies `/api/*` to the Laravel backend automatically.

---

## Production Deployment

### Architecture
The recommended setup is a single server with **nginx** reverse-proxying both the Laravel API and serving the React build:

```
Client → nginx:443 → /           → React build (dist/)
                   → /api/*      → Laravel (php-fpm, port 9000)
                   → /storage/*  → Laravel public storage
```

### Backend

```bash
cd backend
cp .env.example .env
# Required env vars:
#   APP_KEY=       (php artisan key:generate)
#   APP_ENV=production
#   APP_DEBUG=false
#   APP_URL=https://yourdomain.com
#   DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
#   CORS_ALLOWED_ORIGINS=https://yourdomain.com

php artisan key:generate
php artisan migrate --seed
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend

```bash
cd frontend
npm run build          # Outputs to frontend/dist/
```

Copy `frontend/dist/` to your web server's document root.

---

## Admin Portal

Access the admin portal at `/admin/login`.

| Role | Capabilities |
|---|---|
| `super-admin` | Full access to all sections |
| `content-manager` | Products, FAQs, Testimonials, Hero Slider, Site Content |
| `sales-manager` | Customer Inquiries |
| `viewer` | Dashboard view only |

New accounts registered via `/admin/login → Register` are assigned `viewer` by default. A super-admin can promote them via **Users → Edit**.

---

## API Reference

### Public Endpoints
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/site-content` | Full homepage data (products, FAQs, testimonials, settings) |
| `GET` | `/api/site-search?q=` | Full-text site search |
| `POST` | `/api/inquiries` | Submit a customer quote request |

### Admin Endpoints (require `Authorization: Bearer <token>`)
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Login → returns token |
| `POST` | `/api/admin/register` | Register new account (viewer role) |
| `POST` | `/api/admin/logout` | Revoke token |
| `GET` | `/api/admin/me` | Current user info |
| `GET/POST/PUT/DELETE` | `/api/admin/inquiries` | Manage contact inquiries |
| `GET` | `/api/admin/inquiries/stats` | Inquiry status counts |
| `GET/POST/PUT/DELETE` | `/api/admin/products` | Product catalog CRUD |
| `GET/POST/PUT/DELETE` | `/api/admin/testimonials` | Testimonials CRUD |
| `GET/POST/PUT/DELETE` | `/api/admin/faqs` | FAQ CRUD |
| `GET/PUT` | `/api/admin/site-settings` | Homepage settings (hero slides, trust metrics, etc.) |
| `GET/POST/PUT/DELETE` | `/api/admin/users` | User management |
| `GET/POST/PUT/DELETE` | `/api/admin/roles` | Role management |
| `GET/POST/PUT/DELETE` | `/api/admin/permissions` | Permission management |

