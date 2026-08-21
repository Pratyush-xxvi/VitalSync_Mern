# VitalSync - MERN Stack Healthcare Platform

VitalSync is a modern healthcare appointment booking system built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- **Patient Portal**: Search doctors, view specialties, book appointments without account restrictions.
- **Admin Portal**: Secure authentication (JWT + Role-based access), dashboard to view, approve, reject, or reschedule appointments.
- **Email System**: Asynchronous patient & admin notifications via Brevo HTTP API.
- **Keep-Alive Endpoint**: Built-in `/api/health` monitoring endpoint.
- **Auto-Seeding**: Automatic default admin (`admin@app.com` / `admin123`) initialization.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Axios, React Router DOM
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ORM), JSON Web Tokens (JWT), Bcrypt.js
- **Email Service**: Brevo HTTP REST API
- **Deployment**: Render (Node.js Web Service + Static Site)

## 💻 Local Setup

### 1. Backend (`server/`)
```bash
cd server
npm install
npm start
```
By default, the server runs on port `8081`.

### 2. Frontend (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```
By default, Vite runs on `http://localhost:5173`.
