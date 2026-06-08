# TRUSONHUB-PORTFOLIO

Production-grade full-stack international portfolio and personal brand platform.

## Stack

- Frontend: React, MUI, Bootstrap, React-Bootstrap, Zustand, React Query, Axios, React Router
- Backend: Node.js, Express, MongoDB Atlas, JWT, Nodemailer, Multer, Cloudinary

## Setup

1. Open `.env` and fill real credentials.
2. Install dependencies:
   - `npm install`
3. Run client + API together:
   - `npm run dev`
4. Frontend:
   - `http://localhost:5173`
5. API:
   - `http://localhost:5000/api/health`

## Local Development Mode

- Use local MongoDB with:
  - `MONGODB_URI=mongodb://127.0.0.1:27017/trusonhub_portfolio`
- Leave Cloudinary env values empty to use local file storage fallback.
- Uploaded files are served from:
  - `http://localhost:5000/uploads/...`

## Auth Mode

- Public visitors can browse portfolio content.
- Login and signup are available for account access and dashboard management.

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `GET /api/profile/public`
- `GET /api/profile/me`
- `PUT /api/profile/me`
- `GET /api/projects/public`
- `GET /api/projects/me`
- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/contact`
- `POST /api/uploads/avatar`
- `POST /api/uploads/project-media`
