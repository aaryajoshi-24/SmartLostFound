# Smart Lost & Found System 📌
> A full-stack web application designed for reporting, searching, and managing lost and found belongings across a college or community campus.

---

## 🎨 Unique UI Concept: The Digital Campus Corkboard

Unlike generic SaaS dashboard templates, this application is crafted around a **physical community noticeboard / corkboard metaphor**:
- **Pinned Notecards & Polaroids:** Notices appear with organic micro-tilts, authentic 3D red/brass pushpin heads, and polaroid photo frames that straighten on hover.
- **Color-Coded Tags:** Warm amber/red paper notices for **Lost** items, soft emerald/sage paper for **Found** items.
- **Physical Dispatch Forms:** Report forms styled like filling out a physical campus property tag with punch holes and ruled notepad lines.
- **Stamped Statuses:** Notices receive ink-stamped badges (`ACTIVE`, `CLAIMED`, `RESOLVED`).
- **Chalkboard Tally Sheet:** The dashboard presents statistics as an authentic community tally slate with stamped counters and category distribution bars.

---

## 🛠 Tech Stack

- **Frontend:** React.js (Functional components, Hooks, React Router v6)
- **Backend:** Node.js + Express.js (Clean, readable REST API)
- **Database:** MongoDB (Mongoose ODM with schemas for User, Item, Claim)
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing
- **HTTP Client:** Axios with bearer token request/response interceptors

---

## 📁 Repository Structure

```
smart-lost-found/
├── .gitignore
├── README.md
├── server/
│   ├── index.js              # Express app entry & Mongo connection
│   ├── seed.js               # Sample data generator (users + items + claims)
│   ├── .env.example          # Environment variables template
│   ├── .env                  # Environment configuration
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── User.js           # Mongoose User schema
│   │   ├── Item.js           # Mongoose Item schema (Lost/Found)
│   │   └── Claim.js          # Mongoose Claim schema
│   ├── routes/
│   │   ├── auth.js           # /api/auth (register, login, me)
│   │   ├── items.js          # /api/items (CRUD, search, filter, status)
│   │   ├── claims.js         # /api/claims (submit, approve, reject)
│   │   └── dashboard.js      # /api/dashboard (tally counts & activity)
│   └── uploads/              # Uploaded item photo storage
└── client/
    ├── index.html            # Loads Google Fonts (Patrick Hand, Caveat, Plus Jakarta Sans)
    ├── vite.config.js        # Vite config with /api proxy to port 5000
    └── src/
        ├── api/axios.js      # Axios instance with Bearer token interceptor
        ├── context/AuthContext.jsx # Global user auth & session state
        ├── components/
        │   ├── Navbar.jsx    # Wooden trim header with pinned navigation
        │   ├── NoticeCard.jsx # Polaroid / pinned flyer with pushpins & tilts
        │   ├── FilterBar.jsx # Sticky-tab multi-filter drawer
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── NoticeBoard.jsx  # Main corkboard with live search & filters
        │   ├── ItemDetail.jsx   # Flyer view with ownership verification claim form
        │   ├── ReportLost.jsx   # Lost notice dispatch form
        │   ├── ReportFound.jsx  # Found notice dispatch form
        │   ├── EditItem.jsx     # Edit notice details & update status
        │   ├── MyReports.jsx    # User folder for my notices & claim tracker
        │   ├── Dashboard.jsx    # Chalkboard tally sheet with live counts
        │   ├── Login.jsx        # Pass card sign-in with 1-click demo accounts
        │   └── Register.jsx     # Pass card registration with validation
        ├── App.jsx
        ├── main.jsx
        └── index.css         # Corkboard textures, pushpins & paper styles
```

---

## 🚀 Step-by-Step Setup & How to Run

### 1. Prerequisites
- **Node.js** (v18 or higher installed)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) OR a free cloud connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

### 2. Backend Setup (`/server`)

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or edit `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/smart_lost_found
   JWT_SECRET=lost_and_found_secret_key_2026_super_secure
   ```
   *(If using MongoDB Atlas, replace `MONGO_URI` with your connection string).*

4. (Optional) Seed demo items, claims, and users:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

---

### 3. Frontend Setup (`/client`)

1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 👤 Quick Demo Accounts

When you run `npm run seed`, the database is populated with ready-to-test accounts:

| Role | Email | Password | What to test |
| :--- | :--- | :--- | :--- |
| **Alice (Reporter)** | `alice@campus.edu` | `password123` | Reported AirPods and Keys. Can approve or reject incoming claims. |
| **Bob (Claimant)** | `bob@campus.edu` | `password123` | Submitted a claim on Alice's AirPods. Can report new items. |
| **Charlie (Student)** | `charlie@campus.edu` | `password123` | Reported a Student ID card. |

*(The Login page also has 1-click demo login buttons for convenience).*

---

## 🔑 End-to-End Workflow Walkthrough

1. **Register & Login:** Register a new user or click "Alice (Reporter)" on the Login page.
2. **Post a Lost Notice:** Click "+ Pin Lost Notice", fill out the physical dispatch form, attach an image, and submit. The item appears instantly on the board.
3. **Post a Found Notice:** Switch to another user or report an item found in the campus library.
4. **Search & Multi-Filter:**
   - Filter by type (Lost / Found / All)
   - Filter by Category (Electronics, Keys, Bags, etc.)
   - Search by keyword (e.g., "AirPods", "Hydro Flask")
   - Filter by status (Active, Claimed, Resolved)
5. **Submit a Claim:**
   - Sign in as Bob, open the found AirPods flyer.
   - Fill out the "Describe Your Proof of Ownership" box and click submit.
6. **Approve / Reject Claim:**
   - Sign in as Alice (the finder), open the AirPods notice or go to **My Reports**.
   - Review Bob's proof message and click **Approve**.
   - Notice automatically changes to **CLAIMED**, and any other pending claims on this item are rejected.
7. **View Chalkboard Tally:**
   - Go to **Tally Board** to see live counts for Total Lost, Total Found, Active Reports, and Reunited items.
