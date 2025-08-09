# 🍽️ Foodie - APAN 5490 Team Project

**Foodie** is a full‑stack web application for discovering and sharing delicious recipes, designed to promote healthy eating through community content, smart search, and extensible health features. Built as a course project for Columbia University's APAN 5490.

---

## 🔍 Project Overview

Foodie enables users to:
- Share home‑cooked recipes with ingredients, steps, cuisine, tags, and difficulty
- Search and filter recipes by keyword, cuisine, and difficulty
- Like recipes and view detailed instructions
- Authenticate with email/password and manage profile
- Seed the database with demo data for quick testing

Planned extensions:
- Detect food items from uploaded images
- Barcode‑based product/recipe lookup
- Health filters (e.g., low‑sodium, high‑protein, calorie ranges)

---

## 💡 Key Features

- 🧾 **Recipe Upload & Tagging**  
  Create recipes with ingredients, steps, images (URL placeholder), cuisine, tags, servings, and cooking time.

- 🔍 **Smart Search & Filters**  
  Full‑text search on title/description/tags, plus cuisine and difficulty filters.

- ❤️ **Likes & Detail View**  
  Like/unlike recipes and view detailed instructions and metadata.

- 👤 **User Auth**  
  Email/password registration & login with JWT; profile endpoint.

- 🧪 **Seed Data**  
  One‑command database seeding with sample users and recipes.

- 📸 **Food Detection** *(coming soon)*

- 🔗 **Barcode Search** *(coming soon)*

- ⚙️ **Health Filters** *(coming soon)*

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | React 18, React Router, Axios        |
| Backend      | Node.js, Express.js                  |
| Database     | MongoDB, Mongoose                    |
| Tooling      | Nodemon, dotenv, bcryptjs, JWT       |
| Dev Tools    | Git, GitHub, VS Code                 |

---

## 📁 Project Structure

```
foodie/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── ...
├── server/                 # Node + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── database/               # Seed scripts & sample data
│   ├── init-db.js
│   └── sample-data.js
└── start.sh                # Convenience start script (optional)
```

---

## 🚀 Getting Started

### 1) Prerequisites
- Node.js 16+ (tested with Node 24)
- MongoDB Community (local) 8.x  
  On macOS (Homebrew):
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb/brew/mongodb-community
  ```

### 2) Clone & Install
```bash
git clone https://github.com/czhan244/APAN-5490-Team-Project---Foodie.git
cd APAN-5490-Team-Project---Foodie/foodie

# Backend deps
cd server
npm install

# Frontend deps
cd ../client
npm install
```

### 3) Configure Environment
Create `foodie/server/.env` (or copy `env.example`):
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/foodie
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4) Seed the Database (optional, recommended)
From `foodie/` directory:
```bash
node database/init-db.js
```
This creates sample users and recipes.

Sample accounts:
- Admin: `admin@foodie.com` / `password`
- User1: `user1@foodie.com` / `password`
- User2: `user2@foodie.com` / `password`

### 5) Run the App
- Start backend (port 5001):
  ```bash
  cd server
  npm run dev
  ```
- Start frontend (port 3000):
  ```bash
  cd ../client
  npm start
  ```

Open:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

If port 3000 is in use, React will prompt to use another port.

---

## 🔌 API Overview (brief)

Base URL: `http://localhost:5001`

- `GET /` → Health check `{ message: "欢迎使用Foodie API" }`
- `POST /api/auth/register` → Register
- `POST /api/auth/login` → Login (returns JWT)
- `GET /api/auth/me` → Current user (requires `Authorization: Bearer <token>`)
- `GET /api/recipes` → List recipes (supports `search`, `cuisine`, `difficulty`, `page`, `limit`)
- `GET /api/recipes/:id` → Recipe detail
- `POST /api/recipes` → Create recipe (auth)
- `PUT /api/recipes/:id` → Update recipe (owner)
- `DELETE /api/recipes/:id` → Delete recipe (owner)
- `POST /api/recipes/:id/like` → Like/unlike (auth)

---

## 🧭 Notes & Tips
- If frontend shows proxy errors, ensure backend is running on `PORT=5001` and `client/package.json` has `"proxy": "http://localhost:5001"`.
- Use `start.sh` for convenience start (may require `chmod +x start.sh`).
- For a clean restart: stop background node processes and restart MongoDB if needed.

---

## 👥 Team
APAN 5490 Team Project — Foodie

---

## 📄 License
MIT (for course purposes) 

