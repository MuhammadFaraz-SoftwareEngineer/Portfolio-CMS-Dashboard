# Muhammad Faraz Khan — Portfolio CMS Dashboard

A full stack **Content Management System (CMS)** built with the MERN Stack — an upgrade of the Week 2 Portfolio Management System. Adds a real-time activity feed, project image uploads, and a live portfolio preview that refreshes on demand, all behind a secure login-protected admin interface.

---

## What's New in Week 3

- **Recent Activity Feed** — every skill/project/profile change is logged and shown on the dashboard home
- **Project Image Upload** — add a thumbnail image to any project (base64, stored in MongoDB)
- **Live Portfolio Preview** — My Portfolio page with a one-click refresh to instantly reflect the latest dashboard changes
- **Responsive Dashboard** — fully tested across mobile, tablet, and desktop

---

## What This System Does

A fully private admin dashboard — no public access, login required for everything. Once authenticated, manage all portfolio content and preview the result instantly from the My Portfolio page.

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
│   │   │   └── dashboard/
│   │   │       ├── AboutManager.jsx
│   │   │       ├── DashboardHome.jsx / .css
│   │   │       ├── Messages.jsx / .css
│   │   │       ├── MyPortfolio.jsx / .css
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

## Authentication Flow

```
Open app → /login (always, no public access)
        ↓
New user? → /register → fill name, title, roles, bio, location + credentials
        ↓
Registered → /login → enter email + password
        ↓
Authenticated → /dashboard (session lasts until logout)
```

> Registration is blocked after the first account is created. This is a single-admin system.

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create admin account (blocked after first) |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get logged-in user |

### Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/profile` | Protected | Get profile |
| PUT | `/api/users/profile` | Protected | Update profile / about / roles / facts |
| PUT | `/api/users/profile/image` | Protected | Upload profile image (base64) |
| DELETE | `/api/users/profile/image` | Protected | Remove profile image |

### Skills
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/skills` | Protected | Get all skills |
| GET | `/api/skills/stats` | Protected | Skills count + categories |
| POST | `/api/skills` | Protected | Add skill |
| PUT | `/api/skills/:id` | Protected | Edit skill |
| DELETE | `/api/skills/:id` | Protected | Delete skill |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Protected | Get all projects (`?search=&category=`) |
| GET | `/api/projects/stats` | Protected | Projects count + categories |
| GET | `/api/projects/:id` | Protected | Get single project |
| POST | `/api/projects` | Protected | Add project with optional image |
| PUT | `/api/projects/:id` | Protected | Edit project |
| DELETE | `/api/projects/:id` | Protected | Delete project |

### Contact
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Submit form → saved to DB + email sent |
| GET | `/api/contact` | Protected | View all messages |

### Activities
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/activities` | Protected | Get 10 most recent activities |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | Protected | Stats + recent activities combined |

---

## How the Activity Feed Works

```
User adds a skill → skill.service.js logs the action
        ↓
Activity saved to MongoDB (activities collection)
        ↓
Dashboard home fetches latest 8 activities on load
        ↓
Feed shows: "Added skill — React · 2m ago"
```

Actions logged: Added / Updated / Deleted for skills, projects, and profile updates.

---

## How the Contact System Works

```
Visitor fills contact form → clicks Send Message
        ↓
POST /api/contact
        ↓
✅ Message saved to MongoDB (contacts collection)
✅ Formatted email sent to Gmail inbox
✅ Reply-To set to visitor's email
```

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