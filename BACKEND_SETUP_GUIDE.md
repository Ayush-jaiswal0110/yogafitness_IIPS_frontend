# IIPS Yoga and Fitness Club - Complete Setup Guide

## Project Overview

This project consists of two main parts:
1. **Frontend**: React + TypeScript + Vite + Shadcn/ui
2. **Backend**: Node.js + Express + Supabase

---

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- Supabase account (already configured)

---

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
# From project root
pnpm install
```

### 2. Environment Variables
The frontend `.env` file is already configured with Supabase credentials:
```env
VITE_SUPABASE_URL=https://jtlbtkuqzruewtilzord.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Start Frontend Development Server
```bash
pnpm run dev
```
The frontend will be available at: `http://localhost:5173`

### 4. Build Frontend for Production
```bash
pnpm run build
```

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

The `backend/.env` file is already created. You may need to add:

**Required:**
- `SUPABASE_SERVICE_ROLE_KEY` - Get this from your Supabase dashboard

**Optional (for email functionality):**
- `EMAIL_HOST` - SMTP server (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (e.g., 587)
- `EMAIL_USER` - Your email address
- `EMAIL_PASSWORD` - Your email password or app-specific password
- `EMAIL_FROM` - Sender email address

**Optional (for payment gateway):**
- `PAYMENT_GATEWAY_KEY` - Your payment gateway key
- `PAYMENT_GATEWAY_SECRET` - Your payment gateway secret

### 4. Start Backend Development Server
```bash
# Development mode with auto-reload
npm run dev
```

Or for production:
```bash
npm start
```

The backend API will be available at: `http://localhost:5000`

---

## Database Setup

The database schema needs to be created in your Supabase project. You can do this in two ways:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL from the migration file below
4. Run the query

### Option 2: Migration SQL

Execute this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  student_id text NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  max_participants integer DEFAULT 50,
  current_participants integer DEFAULT 0,
  price numeric(10, 2) DEFAULT 0,
  image text,
  type text DEFAULT 'upcoming' CHECK (type IN ('previous', 'upcoming')),
  instructor text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  booking_date timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_id text,
  amount numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Create email history table
CREATE TABLE IF NOT EXISTS email_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  email_type text NOT NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_email_history_user_id ON email_history(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS Policies for events
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT TO anon, authenticated USING (true);

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO events (title, description, date, time, location, max_participants, current_participants, price, image, type, instructor)
VALUES
  ('Morning Yoga Session', 'Start your day with energizing yoga poses and breathing exercises.', '2024-08-15', '07:00:00', 'IIPS Yoga Hall', 50, 45, 0, 'https://images.pexels.com/photos/3822647/pexels-photo-3822647.jpeg', 'previous', 'Mrs. Manju Suchdeo'),
  ('Fitness Boot Camp', 'High-intensity workout session for building strength and endurance.', '2024-08-20', '17:00:00', 'IIPS Sports Ground', 30, 28, 100, 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg', 'previous', 'Dr. Surendra Malviya'),
  ('Meditation Workshop', 'Learn mindfulness and meditation techniques for stress relief.', '2024-09-10', '16:00:00', 'IIPS Meditation Center', 40, 15, 50, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'upcoming', 'Mrs. Manju Suchdeo'),
  ('Advanced Yoga Workshop', 'Advanced yoga poses and techniques for experienced practitioners.', '2024-09-20', '08:00:00', 'IIPS Yoga Hall', 25, 8, 150, 'https://images.pexels.com/photos/3822668/pexels-photo-3822668.jpeg', 'upcoming', 'Mrs. Manju Suchdeo')
ON CONFLICT DO NOTHING;
```

---

## Testing the Application

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### 2. Create a Test User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "studentId": "IIPS123",
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Get All Events
```bash
curl http://localhost:5000/api/events
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/previous` - Get previous events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/stats` - Get user statistics (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Bookings
- `GET /api/bookings/all` - Get all bookings (admin only)
- `GET /api/bookings/my-bookings` - Get user's bookings (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)
- `POST /api/bookings` - Create booking (requires auth)
- `POST /api/bookings/:bookingId/initiate-payment` - Initiate payment (requires auth)
- `POST /api/bookings/:bookingId/verify-payment` - Verify payment (requires auth)
- `DELETE /api/bookings/:id` - Cancel booking (requires auth)

### Emails
- `GET /api/emails` - Get all email history (admin only)
- `GET /api/emails/my-emails` - Get user's email history (requires auth)
- `GET /api/emails/:id` - Get email by ID (requires auth)

---

## Project Structure

```
project/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies
│   └── README.md           # Backend documentation
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── .env                    # Frontend environment variables
└── package.json            # Frontend dependencies
```

---

## Development Workflow

### Running Both Frontend and Backend

**Terminal 1 (Frontend):**
```bash
# From project root
pnpm run dev
```

**Terminal 2 (Backend):**
```bash
# From project root
cd backend
npm run dev
```

Now you have:
- Frontend running on: `http://localhost:5173`
- Backend API running on: `http://localhost:5000`

---

## Features Implemented

### Frontend
✅ Modern UI with Shadcn/ui components
✅ Responsive design
✅ Event listing and details
✅ Booking system
✅ Admin dashboard
✅ User authentication
✅ Payment gateway integration
✅ Email notifications

### Backend
✅ RESTful API with Express
✅ JWT authentication
✅ Role-based access control
✅ Supabase database integration
✅ Password hashing with bcryptjs
✅ Input validation
✅ Email service with Nodemailer
✅ Payment gateway integration
✅ Error handling
✅ CORS and security middleware
✅ Comprehensive API documentation

---

## Security Features

1. **Authentication**: JWT-based authentication
2. **Password Security**: Bcrypt hashing
3. **Database Security**: Supabase Row Level Security (RLS)
4. **Input Validation**: Express-validator
5. **CORS Protection**: Configured CORS
6. **Security Headers**: Helmet.js
7. **Role-Based Access**: Admin and student roles

---

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Supabase credentials in `.env`
- Run `npm install` to ensure all dependencies are installed

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL

### Database errors
- Verify Supabase credentials
- Check if tables are created
- Review RLS policies

### Email not sending
- Configure SMTP settings in backend `.env`
- For Gmail, use an app-specific password
- Check firewall/network settings

---

## Production Deployment

### Frontend Deployment
1. Build the frontend: `pnpm run build`
2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)
3. Update environment variables on the hosting platform

### Backend Deployment
1. Choose a hosting service (Heroku, Railway, DigitalOcean, etc.)
2. Set environment variables on the hosting platform
3. Deploy the `backend/` folder
4. Update `FRONTEND_URL` to match your deployed frontend URL

---

## Support and Documentation

- Frontend README: `/README.md`
- Backend README: `/backend/README.md`
- API Documentation: See backend README for complete API reference

---

## License

© 2024 IIPS Yoga and Fitness Club. All rights reserved.
