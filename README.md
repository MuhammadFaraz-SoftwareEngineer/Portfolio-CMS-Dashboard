# Muhammad Faraz Khan — Portfolio CMS Dashboard

A full stack **Content Management System (CMS)** built with the MERN Stack — an upgrade of the Week 2 Portfolio Management System. Adds a real-time activity feed, project image uploads, a public-facing portfolio page, and a live portfolio preview, all managed through a secure login-protected admin interface.

---

## What's New in Week 3

- **Public Portfolio Page** — fully public at the root URL (`/`), no login required. Shows name, bio, typing animation, about, skills, projects with search/filter, and a working contact form — all driven live from the database. Nothing shows until it's been added through the dashboard
- **Recent Activity Feed** — every skill/project/profile change is logged and shown on the dashboard home in real time
- **Project Image Upload** — add a thumbnail image to any project (base64, stored in MongoDB)
- **Responsive Dashboard** — fully tested across mobile, tablet, and desktop

---

## What This System Does

Two separate experiences from one codebase:

- **`/`** — Public portfolio visible to everyone. Fetches live data from three public API routes. Visitors see your work without any login
- **`/login` → `/dashboard`** — Private admin area. Login required. Manage all content and see changes reflect on the public site instantly

---

## Tech Stack

### Frontend
- React.js + Vite
- React Router DOM
- Axios
- CSS3 (dark theme, electric blue accents)
- Space Grotesk + Space Mono (Google Fonts)

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT + bcryptjs — authentication
- express-validator — request validation
- Nodemailer (Gmail App Password) — contact emails
- REST API — MVC + Service Layer architecture

---

## Project Structure

```
portfolio-cms-week3/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FieldErrorTooltip.jsx / .css
│   │   │   ├── FormField.jsx / .css
│   │   │   ├── PasswordField.jsx / .css
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── dashboard/
│   │   │       ├── DashboardLayout.jsx / .css
│   │   │       ├── Header.jsx / .css
│   │   │       ├── Sidebar.jsx / .css
│   │   │       └── StatCard.jsx / .css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Auth.css
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PublicPortfolio.jsx / .css
│   │   │   └── dashboard/
│   │   │       ├── AboutManager.jsx
│   │   │       ├── DashboardHome.jsx / .css
│   │   │       ├── Messages.jsx / .css
│   │   │       ├── ProfileManager.jsx / .css
│   │   │       ├── ProjectsManager.jsx / .css
│   │   │       └── SkillsManager.jsx / .css
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── message.service.js
│   │   │   ├── profile.service.js
│   │   │   ├── project.service.js
│   │   │   └── skill.service.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── activity.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── contact.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── skill.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── models/
│   │   │   ├── activity.model.js
│   │   │   ├── contact.model.js
│   │   │   ├── project.model.js
│   │   │   ├── skill.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── activity.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── contact.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── skill.routes.js
│   │   │   └── user.routes.js
│   │   ├── services/
│   │   │   ├── activity.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── contact.service.js
│   │   │   ├── project.service.js
│   │   │   ├── skill.service.js
│   │   │   └── user.service.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── generateToken.js
│   │   │   └── seedContent.js
│   │   ├── validations/
│   │   │   ├── auth.validation.js
│   │   │   ├── contact.validation.js
│   │   │   ├── project.validation.js
│   │   │   ├── skill.validation.js
│   │   │   └── user.validation.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Gmail account with App Password enabled

---

### Backend Setup

**1. Create a `.env` file inside the `backend` folder:**

```
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_long_random_secret_key
JWT_EXPIRES_IN=3650d

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173
```

**2. Install and start:**

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`

**3. Optional — seed skills and projects with placeholder data:**

```bash
npm run seed:content
```

> Only run this before adding your own content. It will wipe and re-insert the default data.

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

### Gmail App Password Setup

1. Go to your Google Account → Security
2. Enable 2-Step Verification
3. Search "App Passwords"
4. Generate a password for Mail
5. Paste the 16-character password into `EMAIL_PASS` in your `.env`

---

## Application Flow

```
http://localhost:5173/
        ↓
Public Portfolio — visible to everyone, no login needed
Fetches live data from /api/users/public-profile,
/api/skills/public, /api/projects/public
        ↓
Visitor fills contact form → POST /api/contact
Message saved to MongoDB + email sent to Gmail inbox

─────────────────────────────────────────────────

http://localhost:5173/login
        ↓
Admin login → JWT issued → /dashboard
        ↓
Manage Profile, About, Skills, Projects
Every change logs an activity and reflects
instantly on the public portfolio at /
        ↓
Logout → back to /login
```

> Registration is blocked after the first account is created. This is a single-admin system.

---

## API Endpoints

### Public (no authentication required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/public-profile` | Profile data for the public portfolio page |
| GET | `/api/skills/public` | All skills grouped by category |
| GET | `/api/projects/public` | All projects (supports `?search=&category=`) |
| POST | `/api/contact` | Submit contact form → saved to DB + email sent |

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create admin account (blocked after first) |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get logged-in user |

### Profile (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile / about / roles / facts |
| PUT | `/api/users/profile/image` | Upload profile image (base64) |
| DELETE | `/api/users/profile/image` | Remove profile image |

### Skills (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/skills` | Get all skills |
| GET | `/api/skills/stats` | Skills count + categories |
| POST | `/api/skills` | Add skill |
| PUT | `/api/skills/:id` | Edit skill |
| DELETE | `/api/skills/:id` | Delete skill |

### Projects (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects (`?search=&category=`) |
| GET | `/api/projects/stats` | Projects count + categories |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Add project with optional image |
| PUT | `/api/projects/:id` | Edit project |
| DELETE | `/api/projects/:id` | Delete project |

### Contact (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contact` | View all contact form submissions |

### Activities (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activities` | Get 10 most recent activities |

### Dashboard (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Combined stats + recent activities |

---

## How the Public Portfolio Works

```
Visitor opens http://localhost:5173/
        ↓
GET /api/users/public-profile → name, bio, roles, about, facts, socials
GET /api/skills/public        → skills grouped by category
GET /api/projects/public      → all projects
        ↓
Page renders only what exists in the database.
Nothing is hardcoded. If a section is empty, it is hidden.
        ↓
Visitor sends a message via the contact form
POST /api/contact
✅ Saved to MongoDB contacts collection
✅ Email delivered to Gmail inbox
✅ Reply-To set to visitor's email address
```

---

## How the Activity Feed Works

```
Admin adds a skill in the dashboard
        ↓
skill.service.js automatically logs the action
to the activities MongoDB collection
        ↓
Dashboard home fetches the 8 most recent activities
via GET /api/dashboard/stats
        ↓
Feed shows: "Added skill — React · 2m ago"
```

Actions logged: Added / Updated / Deleted for skills, projects, and profile.

---

## MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | Single admin — profile, about, roles, facts, image |
| `skills` | Skills with name, category, proficiency |
| `projects` | Projects with title, description, category, tech, image, links |
| `contacts` | Contact form submissions |
| `activities` | Action log — what was added, edited, or deleted and when |

---

## Database Setup

No manual collection creation needed. MongoDB creates each collection automatically on first write:

- `users` — on register
- `skills` — on first skill added
- `projects` — on first project added
- `contacts` — on first contact form submission
- `activities` — on first skill/project/profile change