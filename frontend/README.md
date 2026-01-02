# FavVid Hub - Frontend

This is the frontend application for FavVid Hub, built with React and Vite.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📖 Documentation

For full documentation, setup instructions, and API details, please refer to the [main README](../README.md) in the project root.

## ⚙️ Environment

- The frontend relies on a single build-time environment variable: `VITE_API_BASE_URL`.
- **Set this in Vercel (Production)** to your backend origin including the `/api` prefix (example: `https://your-backend.vercel.app/api`).
- The application uses this variable as the only source for the API base URL — there are no local fallbacks.

