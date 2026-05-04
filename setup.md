## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

> The admin user is automatically seeded on first server start if no admin exists. Credentials are read from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in  `.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend `.env`:**
```env
PORT=5000
DB_NAME=forms_db
DB_USER=postgres
DB_PASS=postgres
JWT_SECRET=supersecret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Admin Seed Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Dynamic Form Builder
VITE_APP_VERSION=1.0.0
```

---
