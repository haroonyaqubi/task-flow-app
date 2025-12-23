# Task Flow - Task Management Application

## 🚀 Live Deployment
- **Frontend:** https://task-flow-frontend.onrender.com
- **Backend API:** https://task-flow-backend.onrender.com/api/
- **Admin Panel:** https://task-flow-backend.onrender.com/admin/

## 📦 Quick Deployment (Render)
This project is configured for easy deployment on Render.com:

### Backend Deployment:
1. Connect GitHub repository to Render
2. Select "Web Service"
3. Use Python environment
4. Build Command: `./build.sh`
5. Start Command: `gunicorn complice_taches.wsgi:application`

### Frontend Deployment:
1. Select "Static Site"
2. Build Command: `npm install && npm run build`
3. Publish Directory: `build`

## 🔧 Environment Variables
See `.env.example` for required variables