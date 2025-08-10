# 🍽️ Foodie - APAN 5490 Team Project

**Foodie** is a comprehensive full‑stack web application for discovering and sharing delicious recipes, designed to promote healthy eating through community content, smart search, and integrated health features. Built as a course project for Columbia University's APAN 5490.

---

## 👥 Team Members
- **Cungang Zhang** 
- **Xuanshuo Liu** 
- **Liao Fang** 

---

## 🔍 Project Overview

Foodie enables users to:
- Share home‑cooked recipes with ingredients, steps, cuisine, tags, and difficulty
- Search and filter recipes by keyword, cuisine, and difficulty
- Like recipes and view detailed instructions
- Authenticate with email/password and manage profile
- Add reviews and ratings to recipes
- View food safety recalls from FDA
- Access nutrition benchmarks from NHANES
- Delete account with data cleanup
- Seed the database with comprehensive demo data

---

## 💡 Key Features

### 🧾 **Recipe Management**
- Create recipes with ingredients, steps, images, cuisine, tags, servings, and cooking time
- Edit and delete your own recipes
- View detailed recipe information with author details

### 🔍 **Smart Search & Filters**
- Full‑text search on title/description/tags
- Filter by cuisine type (22+ options including custom)
- Filter by difficulty level
- Responsive grid layout with 3 cards per row

### ❤️ **Social Features**
- Like/unlike recipes with real-time updates
- Add reviews and ratings (1-5 stars)
- View recipe ratings and review counts
- Like/unlike comments

### 👤 **User Authentication & Profile**
- Email/password registration & login with JWT
- User profile management
- Delete account with password verification
- Automatic cleanup of user data (recipes, comments)

### 🍎 **Health & Safety Features**
- **Food Safety Recalls**: Real-time FDA food recall data with MongoDB caching
- **Nutrition Benchmarks**: NHANES nutrition data for health comparisons
- Smart cuisine selection with predefined options and custom input

### 🧪 **Database & Data**
- Comprehensive seed data with 10 recipes across multiple cuisines
- 4 sample users with different roles
- 9 sample reviews and ratings
- One‑command database seeding

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | React 18, React Router, Axios, CSS3 |
| Backend      | Node.js, Express.js, JWT, bcryptjs  |
| Database     | MongoDB, Mongoose                    |
| External APIs| OpenFDA (food recalls), NHANES      |
| Tooling      | Nodemon, dotenv, node-fetch         |
| Dev Tools    | Git, GitHub, VS Code, MongoDB Compass|

---

## 📁 Project Structure

```
foodie/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Header, Navigation
│       ├── pages/          # Home, Recipe Detail, Create Recipe, etc.
│       ├── App.js
│       └── ...
├── server/                 # Node + Express backend
│   ├── config/            # Database connection
│   ├── controllers/       # Auth, Recipe, Comment controllers
│   ├── middleware/        # Authentication middleware
│   ├── models/            # User, Recipe, Comment, NHANES models
│   ├── routes/            # API routes
│   ├── server.js
│   └── package.json
├── database/               # Seed scripts & sample data
│   ├── init-db.js         # Database initialization
│   ├── sample-data.js     # Sample users, recipes, comments
│   └── seed/              # NHANES data seeding
│       └── seed_nhanes.js
├── scripts/                # Data processing scripts
│   └── fetch_nhanes_dr1tot.py
└── README.md
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
- Python 3.x (for NHANES data processing)

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
Create `foodie/server/.env`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/foodie
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4) Seed the Database
From `foodie/` directory:
```bash
node database/init-db.js
```

This creates:
- 4 sample users
- 10 recipes across multiple cuisines
- 9 sample reviews and ratings

Sample accounts:
- Admin: `admin@foodie.com` / `password`
- User1: `user1@foodie.com` / `password`
- User2: `user2@foodie.com` / `password`
- User3: `user3@foodie.com` / `password`

### 5) Optional: Add NHANES Data
```bash
# Generate NHANES sample data
python3 scripts/fetch_nhanes_dr1tot.py

# Seed NHANES data to MongoDB
cd server
npm run seed:nhanes
```

### 6) Run the App
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

---

## 🔌 API Endpoints

Base URL: `http://localhost:5001`

### Authentication
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login (returns JWT)
- `GET /api/auth/me` → Get current user profile
- `DELETE /api/auth/delete-account` → Delete user account

### Recipes
- `GET /api/recipes` → List recipes (supports search, cuisine, difficulty, pagination)
- `GET /api/recipes/:id` → Get recipe detail
- `POST /api/recipes` → Create new recipe
- `PUT /api/recipes/:id` → Update recipe (owner only)
- `DELETE /api/recipes/:id` → Delete recipe (owner only)
- `POST /api/recipes/:id/like` → Like/unlike recipe

### Comments & Reviews
- `GET /api/comments/recipe/:recipeId` → Get recipe comments
- `POST /api/comments` → Add comment/review
- `DELETE /api/comments/:id` → Delete comment (owner only)
- `POST /api/comments/:id/like` → Like/unlike comment

### External Data
- `GET /api/recalls` → Get FDA food recalls (cached)
- `GET /api/nhanes/benchmarks` → Get NHANES nutrition data

### Health Check
- `GET /` → API health check

---

## 🗄️ Database Collections

- **`users`** - User accounts and profiles
- **`recipes`** - Recipe data with ingredients, instructions, metadata
- **`comments`** - User reviews and ratings
- **`food_recalls_cache`** - Cached FDA recall data (24h TTL)
- **`nhanes_benchmarks`** - Nutrition benchmark data

---

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Fixed Header**: Navigation stays visible while scrolling
- **Smart Cuisine Selection**: Dropdown with 22+ options + custom input
- **Recipe Cards**: 3-column grid layout with consistent sizing
- **Rating System**: Star ratings for recipes and reviews
- **Real-time Updates**: Likes and comments update immediately

---

## 🔧 Development Notes

### Key Features Implemented
- ✅ User authentication with JWT
- ✅ Recipe CRUD operations
- ✅ Comment and rating system
- ✅ Food safety recalls integration
- ✅ Nutrition benchmarks integration
- ✅ Account deletion with data cleanup
- ✅ Responsive UI design
- ✅ Comprehensive sample data

### Performance Optimizations
- MongoDB caching for external API data
- Efficient database queries with proper indexing
- Frontend state management for real-time updates

### Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- User authorization for protected operations

---

## 🚧 Future Enhancements

- Image upload and food detection
- Barcode-based product lookup
- Advanced health filters
- Recipe recommendations
- Social sharing features
- Mobile app development

---

## 📄 License
MIT (for course purposes) 

