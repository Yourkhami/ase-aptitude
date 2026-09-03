# ASE APTITUDE – Full-Stack Deployment Guide

This repository contains the complete full-stack website, admin dashboard, and REST API for **ASE APTITUDE – Spoken English & Computer Institute**.

All deployment configuration files have been prepared:
- `Procfile` (for Render / Railway / Heroku)
- `render.yaml` (for Render Blueprints)
- `vercel.json` (for Vercel Serverless deployments)
- Root `package.json` (for automated build & start scripts)

---

## 🚀 Recommended Deployment: Render.com (100% Free Full-Stack Web Service)

Render allows you to host the entire website, admin panel, and Express API together on a live public URL with free SSL (`https://...`).

### Step 1: Push Code to your GitHub
1. Create a new repository on [GitHub](https://github.com/new) named `ase-aptitude`.
2. Open PowerShell in `C:\Users\Hp\.gemini\antigravity\scratch\ase-aptitude` and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/Khaami/ase-aptitude.git
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Open [Render.com](https://render.com) and click **Sign In** (use your GitHub account).
2. Click **New +** > **Web Service**.
3. Select your repository `ase-aptitude`.
4. Configure the service settings:
   - **Name**: `ase-aptitude`
   - **Environment**: `Node`
   - **Region**: `Singapore` (or nearest to India)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **Advanced** > **Add Environment Variable**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `JWT_SECRET`: `ase_aptitude_super_secret_jwt_key_2026_secure_key`
   - `ADMIN_NAME`: `Dir. Sajid Raja`
   - `ADMIN_EMAIL`: `admin@aseaptitude.com`
   - `ADMIN_PASSWORD`: `ase@admin2026`
   - `MONGODB_URI`: (Optional: your MongoDB Atlas cluster URI, or leave blank to use the built-in memory store)
6. Click **Create Web Service**.
7. In ~2 minutes, your website is live at:  
   👉 `https://ase-aptitude.onrender.com`

---

## ⚡ Option 2: Deploy to Vercel

1. Open [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** > **Project** and import `ase-aptitude`.
3. Add environment variables (`JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
4. Click **Deploy**. Vercel will build both the frontend and serverless API automatically.

---

## 🗄️ Setting up MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register a free account.
2. Create a Free **M0 Sandbox** cluster.
3. Under **Database Access**, create a user (e.g., `ase_admin`) and set a password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere).
5. Click **Connect** > **Drivers** > copy the connection string:
   ```
   mongodb+srv://ase_admin:<password>@cluster0.mongodb.net/ase_aptitude?retryWrites=true&w=majority
   ```
6. Add this string as `MONGODB_URI` in Render or Vercel.
