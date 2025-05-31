# Laravel + React App Setup Guide

This project is a full-stack application using Laravel (API backend) and React (frontend). You can run it using **Docker** or **locally**.

---

## ⚙️ Requirements

- Docker & Docker Compose (for Docker setup)  
OR  
- Node.js (v18+) and npm  
- PHP (8.1+) and Composer  
- SQLite (used as default database)

---

## 🚀 Docker Setup (Recommended)

1. Clone the project

git clone <repo-url>
cd <project-folder>

2. Set up environment

cp .env.example .env
Make sure the .env is configured to use SQLite:

env:
DB_CONNECTION=sqlite
DB_DATABASE=/app/database/database.sqlite

3. Build and run containers

docker compose up --build

4. Run Laravel migrations inside the container

docker exec -it <backend-container-name> php artisan migrate

## 🚀 🛠️ Local Setup (Manual)

1. Backend (Laravel)

cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve

2. Frontend (React)

cd frontend
npm install
npm run dev
