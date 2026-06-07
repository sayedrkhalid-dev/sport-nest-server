# SportNest — Sports Facility Booking Platform (Server)

## 🏟️ Purpose

This is the **Express.js REST API** backend for SportNest — a sports facility booking platform. It handles all data operations for facilities and bookings. Authentication is managed entirely by **Better Auth** on the Next.js frontend; this server verifies sessions by calling the frontend's session endpoint.

## 🔗 Live URL

| Service | URL |
|---------|-----|
| API Base URL (Render) | _Add your Render URL here_ |
| Frontend (Vercel) | _Add your Vercel URL here_ |

---

## ✨ Features

- **Facilities CRUD** — Create, read, update, delete sports facilities
- **Search** — Search facilities by name using MongoDB `$regex`
- **Filter** — Filter by sport type using MongoDB `$in`
- **Bookings** — Create bookings with automatic slot conflict detection
- **Auto-calculation** — Hours and total price calculated server-side from slot times
- **Owner-only protection** — Only the facility owner can update or delete
- **Session verification** — Validates Better Auth sessions on every protected route
- **booking_count** — Automatically incremented on each successful booking

---

## 🛣️ API Endpoints

### Facilities

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/facilities` | Public | Get all facilities (supports `?search=`, `?facility_type=`, `?location=`) |
| `GET` | `/facilities/:id` | Public | Get a single facility by ID |
| `POST` | `/facilities` | Private | Create a new facility |
| `PUT` | `/facilities/:id` | Private | Update a facility (owner only) |
| `DELETE` | `/facilities/:id` | Private | Delete a facility (owner only) |

### Bookings

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/bookings` | Private | Create a new booking |
| `GET` | `/bookings/my` | Private | Get all bookings for the logged-in user |
| `PATCH` | `/bookings/:id/cancel` | Private | Cancel a booking |

---

## 🔍 Search & Filter (Challenge Requirement)

```
GET /facilities?search=football&facility_type=football,cricket&location=dhaka
```

| Param | MongoDB Operator | Example |
|-------|-----------------|---------|
| `search` | `$regex` (case-insensitive) | `?search=turf` |
| `facility_type` | `$in` (comma-separated) | `?facility_type=football,cricket` |
| `location` | `$regex` (case-insensitive) | `?location=dhaka` |

---

## 🔒 Authentication Flow

Authentication is handled by **Better Auth** on the Next.js frontend. This server verifies sessions by calling the frontend's `/api/auth/get-session` endpoint on every protected request.

```
Client request with session cookie
        ↓
Express protect middleware
        ↓
Calls FRONTEND_URL/api/auth/get-session (forwards cookie)
        ↓
Better Auth returns { user: { id, name, email, image } }
        ↓
req.user populated → route handler proceeds
```

No JWT, no bcrypt — authentication is completely offloaded to Better Auth.

---

## 📦 NPM Packages Used

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable loading |
| `nodemon` | Development auto-restart |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=8080
DB_URL=mongodb://127.0.0.1:27017/sport-nest
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server (with auto-restart)
npm run dev

# Start production server
npm start
```

Server runs on [http://localhost:8080](http://localhost:8080)

---

## 🗂️ Project Structure

```
src/
├── server.js               # Entry point — loads dotenv, connects DB, starts server
├── index.js                # Express app setup — CORS, middleware, routes, error handlers
├── db.js                   # MongoDB connection via Mongoose
├── middleware/
│   └── protect.js          # Better Auth session verification middleware
├── facility/
│   ├── facility.model.js   # Mongoose schema for Facility
│   ├── facility.routes.js  # Route definitions
│   └── facility.controller.js  # Request handlers
└── booking/
    ├── booking.model.js    # Mongoose schema for Booking
    ├── booking.routes.js   # Route definitions
    └── booking.controller.js   # Request handlers
```

---

## 🧩 Database Architecture

### Facilities Collection

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `facility_type` | String | Enum: football, cricket, badminton, basketball, swimming, tennis, volleyball, table tennis |
| `image` | String | URL (from imgbb) |
| `location` | String | Required |
| `price_per_hour` | Number | Min: 0 |
| `capacity` | Number | Min: 1 |
| `available_slots` | Array | `[{ start_time, end_time }]` |
| `description` | String | Required |
| `owner_email` | String | Auto-filled from session |
| `booking_count` | Number | Default: 0, auto-incremented |

### Bookings Collection

| Field | Type | Notes |
|-------|------|-------|
| `facility_id` | ObjectId | Ref: Facility |
| `user_email` | String | Auto-filled from session |
| `booking_date` | String | Format: YYYY-MM-DD |
| `time_slot` | Object | `{ start_time, end_time }` |
| `hours` | Number | Auto-calculated from slot times |
| `total_price` | Number | Auto-calculated: hours × price_per_hour |
| `status` | String | Enum: pending / confirmed / cancelled. Default: pending |

---

## 🛡️ Business Rules

1. **Slot validation** — A booking is rejected if the requested slot doesn't exist in the facility's `available_slots`
2. **Duplicate prevention** — A slot on the same date cannot be double-booked (ignores cancelled bookings)
3. **Owner-only** — Update and delete on facilities checks `owner_email === session.user.email`
4. **Auto-cancel safe** — Cancelled bookings do not block the slot for future bookings
5. **booking_count** — Incremented with `$inc` atomically on each confirmed booking

---

## 🌐 CORS Configuration

Configured to accept requests only from the frontend URL with credentials:

```js
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
})
```

---

## 📋 Sample Requests

### Create a Facility
```json
POST /facilities
{
  "name": "Green Turf Football Ground",
  "facility_type": "football",
  "image": "https://i.ibb.co/example.jpg",
  "location": "Dhaka, Bangladesh",
  "price_per_hour": 50,
  "capacity": 22,
  "available_slots": [
    { "start_time": "08:00", "end_time": "10:00" },
    { "start_time": "16:00", "end_time": "18:00" }
  ],
  "description": "Professional-grade football turf with floodlights."
}
```

### Create a Booking
```json
POST /bookings
{
  "facility_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "booking_date": "2026-06-15",
  "time_slot": {
    "start_time": "08:00",
    "end_time": "10:00"
  }
}
```

### Response shape
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 🚀 Deployment (Render)

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add environment variables in Render dashboard:
   - `DB_URL` — your MongoDB Atlas connection string
   - `FRONTEND_URL` — your Vercel frontend URL
   - `NODE_ENV` — `production`
6. Enable **Auto-Deploy** from main branch

> Make sure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` (all IPs) or Render's IP range.