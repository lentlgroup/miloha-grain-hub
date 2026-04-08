# Miloha Grain Hub

This project now has two parts:

- `frontend/`: React + Vite frontend
- `backend/`: PHP Laravel API prepared for MySQL

## Stack

- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Laravel 11, PHP 8.2+
- Database: MySQL

## Backend setup

1. Start MySQL.
   Example: `brew services start mysql`
2. Create the database.
   Example: `mysql -u root -e 'CREATE DATABASE miloha_grain_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'`
3. Configure Laravel.
   - Copy `backend/.env.example` to `backend/.env`
   - Adjust `DB_USERNAME` and `DB_PASSWORD` if needed
4. Run migrations and seed content.
   - `cd backend`
   - `php artisan migrate --seed`
5. Start the API.
   - `php artisan serve`

Local seeding also prepares RBAC defaults:

- Roles: `super-admin`, `content-manager`, `sales-manager`, `viewer`
- Permissions: `manage-site-content`, `manage-products`, `manage-inquiries`, `manage-users`, `view-admin-dashboard`
- Local admin seed: `admin@miloha.local` with password `password`

## Frontend setup

1. Install dependencies in the frontend folder.
   - `cd frontend`
   - `npm install`
2. Start the frontend.
   - `npm run dev`

The Vite dev server runs on `http://127.0.0.1:8081` and proxies `/api` requests to `http://127.0.0.1:8000`, so when Laravel is running the React app will pull products, FAQs, testimonials, delivery zones, and promo content from the backend instead of the local fallback data.

## API endpoints

- `GET /api/site-content`
- `POST /api/inquiries`
- `GET /api/admin/inquiries`
