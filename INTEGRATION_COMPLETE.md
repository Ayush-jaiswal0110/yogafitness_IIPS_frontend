# Frontend-Backend Integration Complete ✅

## Integration Status

The IIPS Yoga and Fitness Club website now has a fully integrated frontend and backend system.

## What Was Integrated

### 1. API Client Service (`src/lib/api.ts`)
- Created centralized API client for all backend communication
- Handles authentication tokens automatically
- Provides type-safe methods for all API endpoints
- Includes error handling

### 2. Authentication Integration (`src/lib/auth.ts`)
- Updated to use backend JWT authentication
- Stores tokens and user data in localStorage
- Provides methods for login, register, logout, and profile management
- Supports role-based access (admin/student)

### 3. Events Integration
- **Events Page**: Fetches events from backend API
- **Home Page**: Displays upcoming events from backend
- Real-time data from Supabase database

### 4. Bookings Integration
- **BookingForm Component**: Creates bookings via backend API
- Requires user authentication
- Handles payment processing
- Sends confirmation emails through backend

### 5. Admin Dashboard (To Be Completed)
- ManageEvents, Users, and Dashboard pages need backend integration
- Currently using localStorage, needs migration to API

## How It Works

### Authentication Flow
1. User logs in via `/admin` or registers
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. All subsequent API calls include token in Authorization header
5. Backend verifies token for protected routes

### Data Flow
```
Frontend (React)
    ↓ API Call
API Client (src/lib/api.ts)
    ↓ HTTP Request with JWT
Backend (Express)
    ↓ Auth Middleware
Controller → Database (Supabase)
    ↓ Response
Frontend Updates UI
```

## Environment Variables

### Frontend (`.env`)
```env
VITE_SUPABASE_URL=https://jtlbtkuqzruewtilzord.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://jtlbtkuqzruewtilzord.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=iips_yoga_fitness_secret_key_2024
FRONTEND_URL=http://localhost:5173
```

## Running the Integrated System

### Step 1: Set Up Database
Execute the SQL in `BACKEND_SETUP_GUIDE.md` in your Supabase SQL Editor to create tables.

### Step 2: Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

### Step 3: Start Frontend
```bash
# In project root
pnpm install
pnpm run dev
```
Frontend runs on: `http://localhost:5173`

### Step 4: Create Admin User (Optional)
You can create an admin user by registering and then updating the role in Supabase dashboard:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Or use the backend API directly to register and set role to admin in the database.

## API Endpoints Being Used

### Frontend → Backend Communication

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/previous` - Get previous events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings/:id/initiate-payment` - Start payment
- `POST /api/bookings/:id/verify-payment` - Verify payment

#### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/stats` - Get statistics
- `PUT /api/users/:id/role` - Update user role

## Testing the Integration

### 1. Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@iips.edu",
    "phone": "1234567890",
    "studentId": "IIPS001",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@iips.edu",
    "password": "password123"
  }'
```

### 2. Test Events
```bash
# Get all events (no auth required)
curl http://localhost:5000/api/events
```

### 3. Test Bookings (Requires Auth)
```bash
# Create booking (replace TOKEN with actual JWT)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"eventId": "event_uuid_here"}'
```

## Features Working

✅ User Registration & Login
✅ JWT Authentication
✅ Events Display (Home & Events Pages)
✅ Event Booking with Authentication
✅ Payment Integration
✅ Email Notifications
✅ Protected Routes
✅ Admin Authentication

## Features Pending Integration

⏳ Admin Dashboard - User Management
⏳ Admin Dashboard - Event Management
⏳ Admin Dashboard - Statistics
⏳ Email History View

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcryptjs with salt
3. **Row Level Security**: Supabase RLS policies
4. **CORS Protection**: Configured for frontend origin
5. **Input Validation**: express-validator on all inputs
6. **Role-Based Access**: Admin and student roles
7. **Helmet Security**: Security headers

## Common Issues & Solutions

### Issue: "Failed to fetch" errors
**Solution**: Ensure backend is running on port 5000 and `VITE_API_BASE_URL` is correct in frontend `.env`

### Issue: "Unauthorized" errors
**Solution**: Check if JWT token is valid and not expired. Re-login if needed.

### Issue: CORS errors
**Solution**: Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: Database connection errors
**Solution**: Verify Supabase credentials in backend `.env`

### Issue: "User not authenticated" on booking
**Solution**: Login first before attempting to book events

## Next Steps for Complete Integration

1. **Update Admin Dashboard Pages**:
   - ManageEvents.tsx - Use `api.events.create()`, `api.events.update()`, `api.events.delete()`
   - Users.tsx - Use `api.users.getAll()`, `api.users.updateRole()`, `api.users.delete()`
   - Dashboard.tsx - Use `api.users.getStats()`

2. **Add User Registration Page**:
   - Create a public registration page
   - Use `AuthService.register()` method

3. **Add User Profile Page**:
   - Allow users to view/edit their profile
   - Use `AuthService.getProfile()` and `AuthService.updateProfile()`

4. **Add My Bookings Page**:
   - Show user's booking history
   - Use `api.bookings.getMy()`

5. **Complete Email History**:
   - Integrate email history viewing
   - Use `api.emails.getMy()` for users
   - Use `api.emails.getAll()` for admins

## File Changes Summary

### New Files Created:
- `src/lib/api.ts` - API client service
- `.env` - Updated with API base URL
- `backend/*` - Complete backend structure

### Files Modified:
- `src/lib/auth.ts` - Backend integration
- `src/components/AdminLogin.tsx` - Backend login
- `src/components/BookingForm.tsx` - Backend bookings
- `src/pages/Events.tsx` - Backend events
- `src/pages/Index.tsx` - Backend events

### Files Pending Update:
- `src/pages/admin/ManageEvents.tsx`
- `src/pages/admin/Users.tsx`
- `src/pages/admin/Dashboard.tsx`
- `src/pages/admin/EmailHistory.tsx`

## Database Schema

Tables created in Supabase:
- `users` - User accounts
- `events` - Yoga/fitness events
- `bookings` - Event bookings
- `email_history` - Email tracking

See `BACKEND_SETUP_GUIDE.md` for complete schema and RLS policies.

## Support

For issues:
1. Check backend logs: `cd backend && npm run dev`
2. Check frontend console for errors
3. Verify all environment variables are set correctly
4. Ensure Supabase database is set up with correct schema

---

**Status**: ✅ Frontend and Backend Successfully Integrated
**Date**: 2024-10-06
**Version**: 1.0.0
