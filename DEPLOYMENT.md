# 🚀 UniSync Deployment Guide

Follow these steps to deploy the UniSync Campus Operating System to production.

---

## 🛠️ Step 1: Database Setup (Supabase)

UniSync uses **Supabase PostgreSQL** as its primary database.

1. Go to [Supabase](https://supabase.com) and sign in.
2. Click **New Project** and choose an organization, project name, database password, and region.
3. Once the database is provisioned, go to the **SQL Editor** tab in the sidebar menu.
4. Click **New Query** to create a blank query sheet.
5. Copy the contents of the database migration file:
   - [database/migration.sql](file:///c:/Users/Naveen/.gemini/antigravity-ide/scratch/unisync/database/migration.sql)
6. Paste the query inside the SQL editor and click **Run**. This will:
   - Enable the `uuid-ossp` and PG `vector` extensions.
   - Set up the table schemas (`users`, `students`, `staff`, `admins`, `opportunities`, `complaints`, etc.).
   - Configure Row-Level Security (RLS) policies.
   - Seed initial admin, student (`Alex Mercer`), and staff accounts.
7. Go to **Project Settings** -> **API** and copy:
   - **Project URL**
   - **API Key** (under `anon` public key).

---

## 💻 Step 2: Backend Deployment (Render)

We use **Render Blueprint** infrastructure-as-code configuration to deploy the Node.js Express server.

1. Go to [Render](https://render.com) and log in.
2. Click the **New** button in the dashboard and select **Blueprint**.
3. Link your GitHub repository: `https://github.com/Naveenkumar3327/UniSync.git`.
4. Render will automatically read the `render.yaml` file in the root directory.
5. Enter values for the two placeholder variables:
   - `SUPABASE_URL`: Paste the Supabase Project URL.
   - `SUPABASE_ANON_KEY`: Paste the Supabase anon/public key.
6. Click **Apply**. Render will automatically:
   - Install dependencies.
   - Build the backend code with TypeScript.
   - Spin up the web service on a secure host port.
7. Once deployment completes, copy your Render Web Service URL (e.g. `https://unisync-backend.onrender.com`).

---

## 🎨 Step 3: Frontend Static Hosting (Vercel)

The React client is hosted as a static single-page application on Vercel.

1. Go to [Vercel](https://vercel.com) and log in.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure the project settings:
   - **Framework Preset**: select **Vite** (if not auto-selected).
   - **Root Directory**: edit and set to `frontend`.
5. Open the **Environment Variables** dropdown and add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key.
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key.
   - `VITE_API_URL`: Your Render Web Service URL (e.g., `https://unisync-backend.onrender.com`).
   - `VITE_SOCKET_URL`: Your Render Web Service URL (e.g., `https://unisync-backend.onrender.com`).
6. Click **Deploy**. Vercel will build the React bundles and host the application at a custom `.vercel.app` URL.

---

## ⚡ Step 4: Verification & Smoke Test

1. Visit your Vercel deployment URL.
2. Try logging in using the seeded test accounts:
   - **Student**: `alex.mercer@university.edu` (Role: Student)
   - **Staff**: `sarah.connor@university.edu` (Role: Staff)
   - **Admin**: `admin.chief@university.edu` (Role: Admin)
3. Navigate to **Profile** to verify that locked records match the database.
4. Try modifying editable preferences and saving them to confirm the API connection is active.
