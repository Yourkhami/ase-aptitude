# ASE APTITUDE – Full-Stack Educational Platform & Administration System
**ASE Aptitude – Spoken English & Computer Institute**  
*Building Confidence. Empowering Careers.*

---

## 📌 Project Overview
This repository contains the complete, production-ready full-stack web application and RESTful backend architecture for **ASE APTITUDE**, a premier educational institute located in Andar Bazar, Siwan, Bihar.

The platform provides:
1. **Premium Public Website**: Responsive, high-conversion landing portal showcasing courses, daily class timetables, interactive review carousel, photo gallery, free demo class application form, and contact enquiry system.
2. **RESTful Express API**: High-performance backend handling authentication, admissions, inquiries, course catalogs, student testimonials, and file uploads.
3. **MongoDB Database (Mongoose ODM)**: Structured, validated database schemas for administrators, leads, messages, courses, reviews, and gallery media.
4. **Dedicated Admin Dashboard**: Password-protected, responsive single-page management portal for institute teachers and administrators.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend Runtime** | Node.js (v18+ LTS / v24) |
| **Server Framework** | Express.js |
| **Database & ODM** | MongoDB with Mongoose |
| **Authentication & Security** | JWT (JSON Web Tokens), bcryptjs (12 salt rounds), Helmet, CORS, Request sanitization |
| **Media & File Uploads** | Multer (with image MIME-type & 5MB file-size validation) |
| **Configuration** | dotenv |
| **Frontend Stack** | Pure Vanilla HTML5, Modern CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism), Vanilla JavaScript (ES6+) |
| **Icons & Typography** | Font Awesome 6.5, Google Fonts (*Poppins* & *Inter*) |

---

## 📂 Project Architecture

```
ase-aptitude/
├── backend/
│   ├── server.js               # Express application entry point & route mounting
│   ├── package.json            # Backend dependencies & npm scripts
│   ├── .env.example            # Template for environment variables
│   ├── .env                    # Active local environment variables
│   ├── config/
│   │   └── db.js               # MongoDB connection logic with diagnostic logging
│   ├── models/
│   │   ├── Admin.js            # Admin schema with bcrypt password hashing
│   │   ├── DemoApplication.js  # Free Demo Class applications schema
│   │   ├── ContactMessage.js   # General contact messages schema
│   │   ├── Course.js           # Courses catalog schema with auto-slug
│   │   ├── Review.js           # Student reviews schema with star ratings
│   │   └── GalleryImage.js     # Campus and event gallery schema
│   ├── controllers/
│   │   ├── authController.js   # Login, profile, password change, logout
│   │   ├── demoController.js   # Public submissions & admin CRUD
│   │   ├── contactController.js# Public enquiries & admin message inbox
│   │   ├── courseController.js # Course management & public listing
│   │   ├── reviewController.js # Review moderation & public slider feed
│   │   ├── galleryController.js# Photo uploads via Multer & gallery management
│   │   └── statsController.js  # Real-time dashboard counters
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── demoRoutes.js       # /api/demo-applications endpoints
│   │   ├── contactRoutes.js    # /api/contact endpoints
│   │   ├── courseRoutes.js     # /api/courses endpoints
│   │   ├── reviewRoutes.js     # /api/reviews endpoints
│   │   ├── galleryRoutes.js    # /api/gallery endpoints
│   │   └── statsRoutes.js      # /api/stats endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT authentication verification
│   │   ├── errorMiddleware.js  # Centralized error handler with standard JSON responses
│   │   └── uploadMiddleware.js # Multer disk storage and image validator
│   ├── scripts/
│   │   └── seed.js             # Automated database seeding script
│   └── uploads/                # Local storage for uploaded gallery images
├── admin/
│   ├── index.html              # Admin Dashboard Single Page Application
│   ├── admin.css               # Dashboard styling matching institute brand
│   └── admin.js                # API integration, JWT session management & UI handlers
├── index.html                  # Public student landing page (12 semantic sections)
├── style.css                   # Custom responsive design system
├── script.js                   # Public frontend scripts & API integration
├── images/                     # Institute original logos, building, hero photos
└── README.md                   # Complete documentation
```

---

## 🚀 Quick Start & Installation

### Step 1: Clone or Navigate to Project
```bash
cd C:\Users\Hp\.gemini\antigravity\scratch\ase-aptitude
```

### Step 2: Install Backend Dependencies
Open your terminal in the `backend/` directory:
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open `backend/.env` and configure your settings:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection (Local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/ase_aptitude

# JWT Secret (Use a long, random string in production)
JWT_SECRET=ase_aptitude_super_secret_jwt_key_2026_secure_key
JWT_EXPIRES_IN=7d

# Initial Admin Credentials (used during 'npm run seed')
ADMIN_NAME=Dir. Sajid Raja
ADMIN_EMAIL=admin@aseaptitude.com
ADMIN_PASSWORD=ase@admin2026
```

### Step 4: Seed Database with Initial Institute Data
Run the seeding script to create the initial admin account, default courses, reviews, and featured gallery photos:
```bash
npm run seed
```

### Step 5: Start the Development Server
```bash
npm run dev
# or for standard production start:
npm start
```

### Step 6: Access the Application
- **Public Student Website**: [http://localhost:5000](http://localhost:5000)
- **Admin Dashboard**: [http://localhost:5000/admin](http://localhost:5000/admin)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Admin Authentication & Credentials

When first seeded, the default administrator account is:

| Field | Default Value |
|---|---|
| **Admin Email** | `admin@aseaptitude.com` |
| **Password** | `ase@admin2026` |

> **Security Note:** You can change this password at any time inside the Admin Dashboard under the **Admin Profile** tab, or update `ADMIN_PASSWORD` in `.env` before running `npm run seed`.

---

## 📡 REST API Documentation

All API responses follow a standard JSON envelope:

**Success Response (HTTP 200/201):**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error Response (HTTP 400/401/403/404/500):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Details regarding the error..."]
}
```

### 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates admin email & password, returns JWT token |
| `POST` | `/api/auth/logout` | Public | Clears session token |
| `GET` | `/api/auth/me` | Protected | Returns current authenticated admin profile |
| `PUT` | `/api/auth/change-password` | Protected | Validates current password and sets new hashed password |

### 2. Free Demo Class Applications (`/api/demo-applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/demo-applications` | Public | Submits a new demo registration (validates 10-digit Indian phone) |
| `GET` | `/api/demo-applications` | Protected | Lists applications with status, course, and search filters |
| `GET` | `/api/demo-applications/:id` | Protected | Retrieves single application details |
| `PUT` | `/api/demo-applications/:id` | Protected | Updates application status (`new`, `contacted`, `admitted`, `rejected`) |
| `DELETE`| `/api/demo-applications/:id` | Protected | Permanently deletes an application |

### 3. Contact Enquiries (`/api/contact`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submits a contact form message |
| `GET` | `/api/contact` | Protected | Lists contact messages with status and search filters |
| `GET` | `/api/contact/:id` | Protected | Retrieves single message and marks as read |
| `PUT` | `/api/contact/:id` | Protected | Updates message status (`new`, `read`, `responded`, `archived`) |
| `DELETE`| `/api/contact/:id` | Protected | Permanently deletes a message |

### 4. Courses (`/api/courses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Public | Retrieves only active courses for public website |
| `GET` | `/api/courses/all` | Protected | Retrieves all courses (active + inactive) for admin |
| `POST` | `/api/courses` | Protected | Creates a new course |
| `PUT` | `/api/courses/:id` | Protected | Updates course details, syllabus points, theme, or status |
| `DELETE`| `/api/courses/:id` | Protected | Deletes a course |

### 5. Student Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reviews` | Public | Retrieves active reviews for public testimonial slider |
| `GET` | `/api/reviews/all` | Protected | Retrieves all reviews for admin management |
| `POST` | `/api/reviews` | Protected | Adds a new student review (1-5 star rating) |
| `PUT` | `/api/reviews/:id` | Protected | Updates review text, student name, or active status |
| `DELETE`| `/api/reviews/:id` | Protected | Deletes a review |

### 6. Gallery & File Uploads (`/api/gallery`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/gallery` | Public | Retrieves active campus and event photos |
| `GET` | `/api/gallery/all` | Protected | Retrieves all gallery items for admin management |
| `POST` | `/api/gallery` | Protected | Multipart upload (`image` field) via Multer, saves to `uploads/` |
| `PUT` | `/api/gallery/:id` | Protected | Updates photo caption, category, or active status |
| `DELETE`| `/api/gallery/:id` | Protected | Removes record and deletes the image file from disk |

### 7. Dashboard Overview Metrics (`/api/stats`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/stats` | Protected | Returns counters for demo applications, enquiries, courses, reviews, and gallery |

---

## 🌐 Production Deployment Guide

### 1. MongoDB Atlas Setup (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free tier cluster.
2. Under **Database Access**, create a user with read/write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
4. Click **Connect** > **Drivers** > Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/ase_aptitude?retryWrites=true&w=majority
   ```
5. Paste this connection string into your hosting service's environment variables as `MONGODB_URI`.

### 2. Deploying Backend to Render / Railway
1. Push your repository to GitHub.
2. In [Render.com](https://render.com) or [Railway.app](https://railway.app), create a new **Web Service**.
3. Set root directory to `backend` (or run `cd backend && npm start`).
4. Set Build Command: `npm install`
5. Set Start Command: `node server.js`
6. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_atlas_connection_string`
   - `JWT_SECRET=your_secure_random_string`
   - `ADMIN_NAME=Dir. Sajid Raja`
   - `ADMIN_EMAIL=admin@aseaptitude.com`
   - `ADMIN_PASSWORD=your_secure_admin_password`
7. Deploy! Your backend will serve both the API and the static frontend smoothly.

### 3. Deploying Frontend Separately to Vercel or Netlify (Optional)
If you prefer hosting the frontend separately on Vercel or Netlify:
1. In `script.js` and `admin/admin.js`, update `API_ENDPOINT` / `API_BASE` to point to your live Render/Railway backend URL:
   ```javascript
   const API_BASE = 'https://your-backend-service.onrender.com/api';
   ```
2. Deploy the root directory to Vercel or Netlify.

---

## 📞 Official Institute Contact
- **Director**: Dir. Sajid Raja
- **Institute**: ASE Aptitude – Spoken English & Computer Institute
- **Phone**: +91 95253 01743
- **Email**: aptitudeinstitute@gmail.com
- **WhatsApp**: [https://wa.me/919525301743](https://wa.me/919525301743)
- **Location**: Near Grameen Bank, Andar Bazar (Andar, Siwan, Bihar)
- **Google Maps**: [https://maps.app.goo.gl/V8j6bwRfqUVmL9sH8](https://maps.app.goo.gl/V8j6bwRfqUVmL9sH8)
