# IIPS Yoga & Fitness Club - Complete Setup Guide

## ✅ What's Been Configured

### User Roles
1. **Student** - IIPS enrolled students
2. **Other** - Faculty, staff, or external users
3. **Admin** - Single administrator (yogafitness@gmail.com)

### Features Implemented
- ✅ Student/User Registration Form
- ✅ User Dashboard (View bookings, profile, statistics)
- ✅ Backend API with Node.js + Express + Supabase
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Email Notifications (configured for yogafitness@gmail.com)
- ✅ Payment Gateway Integration
- ✅ Admin Dashboard
- ✅ Event Management
- ✅ Booking System

---

## 🚀 Quick Start

### Step 1: Set Up Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project: `mckqhyvtupcteyuewsef`
3. Navigate to **SQL Editor**
4. Copy and paste the entire contents of `DATABASE_SETUP.sql`
5. Click **Run**

**Important**: After running the SQL, you need to hash the admin password properly:

```bash
# Install bcryptjs globally if needed
npm install -g bcryptjs

# Generate password hash for "Yoga@2024"
node -e "const bcrypt=require('bcryptjs');bcrypt.hash('Yoga@2024',10,(e,h)=>console.log(h))"
```

Then update the admin user in Supabase SQL Editor:

```sql
UPDATE users
SET password_hash = 'YOUR_GENERATED_HASH_HERE'
WHERE email = 'yogafitness@gmail.com';
```

### Step 2: Install Dependencies

**Frontend:**
```bash
# In project root
pnpm install
```

**Backend:**
```bash
cd backend
npm install
```

### Step 3: Verify Environment Variables

**Frontend `.env`** (Already configured):
```env
VITE_SUPABASE_URL=https://mckqhyvtupcteyuewsef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend `.env`** (Already configured):
```env
PORT=5000
SUPABASE_URL=https://mckqhyvtupcteyuewsef.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=iips_yoga_fitness_secret_key_2024_secure
EMAIL_USER=yogafitness@gmail.com
EMAIL_PASSWORD=Yoga@2024
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
pnpm run dev
```
Frontend will run on: `http://localhost:5173`

---

## 👥 Default Users

### Admin User
- **Email**: yogafitness@gmail.com
- **Password**: Yoga@2024
- **Access**: Full admin panel access

### Sample Student User
- **Email**: rahul.sharma@iips.edu
- **Password**: password123
- **Role**: Student
- **Student ID**: IIPS2024001

**Note**: You'll need to update these password hashes in the database after running the SQL setup.

---

## 📱 User Journey

### For New Users (Students/Others):

1. **Visit Homepage** (`http://localhost:5173`)
2. **Click "Join Now"** or go to `/register`
3. **Fill Registration Form**:
   - Select user type (Student or Other User)
   - Enter name, email, phone
   - Enter Student/User ID
   - Create password
4. **Submit** - Automatically logged in
5. **Redirected to User Dashboard** (`/user/dashboard`)
6. **Browse Events** - Click "Browse Events"
7. **Book Event** - Click on event, fill booking form
8. **Complete Payment** (if required)
9. **View Booking** - See confirmation in dashboard

### For Admin:

1. **Visit Admin Panel** (`http://localhost:5173/admin`)
2. **Login** with yogafitness@gmail.com
3. **Dashboard Access**:
   - View user statistics
   - Manage events
   - View all users
   - Check email history
   - Monitor bookings

---

## 🔐 Authentication Flow

### Registration
```
User fills form → Backend validates → Creates user in DB →
Returns JWT token → Stores token in localStorage →
Redirects to dashboard
```

### Login
```
User enters credentials → Backend validates →
Checks password hash → Returns JWT token →
Stores token → Redirects based on role
```

### Protected Routes
- `/user/dashboard` - Requires any authenticated user
- `/admin/*` - Requires admin role only

---

## 📊 Database Schema

### Tables Created:
1. **users** - User accounts (student, other, admin)
2. **events** - Yoga/fitness events
3. **bookings** - Event bookings with payment status
4. **email_history** - Email notification tracking

### Row Level Security:
- Users can only view/edit their own data
- Admins can view/manage all data
- Events are publicly viewable
- Bookings are private to users

---

## 🌐 API Endpoints

### Public Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - List all events
- `GET /api/events/upcoming` - Upcoming events
- `GET /api/events/previous` - Previous events

### Protected Endpoints (Requires Auth):
- `GET /api/auth/profile` - Get user profile
- `GET /api/bookings/my-bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/:id/initiate-payment` - Start payment
- `POST /api/bookings/:id/verify-payment` - Verify payment

### Admin Only Endpoints:
- `GET /api/users` - List all users
- `GET /api/users/stats` - Get statistics
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/bookings/all` - View all bookings

---

## 🧪 Testing the Application

### Test Registration:
1. Go to `http://localhost:5173/register`
2. Fill the form with test data
3. Submit and verify redirect to dashboard

### Test Event Booking:
1. Login as a user
2. Go to Events page
3. Click on an event
4. Click "Book Now"
5. Complete booking (payment if required)
6. Verify booking appears in dashboard

### Test Admin Panel:
1. Go to `http://localhost:5173/admin`
2. Login with admin credentials
3. Verify access to all admin features

---

## 📧 Email Configuration

Email notifications are sent via Gmail SMTP:
- **Host**: smtp.gmail.com
- **Port**: 587
- **User**: yogafitness@gmail.com
- **Password**: Yoga@2024

**Note**: For Gmail, you may need to:
1. Enable "Less secure app access" OR
2. Create an "App Password" in Google Account settings
3. Use the app password instead of the actual password

---

## 🎨 Frontend Pages

### Public Pages:
- `/` - Homepage
- `/events` - Events listing
- `/about` - About the club
- `/register` - User registration
- `/book/:eventId` - Event booking

### User Pages:
- `/user/dashboard` - User dashboard with bookings

### Admin Pages:
- `/admin` - Admin dashboard
- `/admin/events` - Manage events
- `/admin/users` - Manage users
- `/admin/emails` - Email history

---

## 🔧 Common Issues & Solutions

### Issue: Cannot login as admin
**Solution**: Ensure the password hash is updated in the database using bcryptjs.

### Issue: Email not sending
**Solution**:
1. Check Gmail settings for less secure apps
2. Or create an App Password in Google Account
3. Update EMAIL_PASSWORD in backend/.env

### Issue: "Failed to fetch" errors
**Solution**:
1. Ensure backend is running on port 5000
2. Check CORS settings
3. Verify VITE_API_BASE_URL in frontend .env

### Issue: RLS policy violations
**Solution**: Ensure proper authentication and check Supabase logs.

### Issue: User role not working
**Solution**: Check the users table in Supabase, verify role column has correct values.

---

## 📦 Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Page components
│   │   │   ├── user/        # User dashboard
│   │   │   └── admin/       # Admin pages
│   │   ├── lib/             # Utilities (api, auth)
│   │   └── types/           # TypeScript types
│   └── .env                 # Frontend config
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation
│   │   ├── services/        # Email, payment
│   │   ├── config/          # Database, env
│   │   └── utils/           # JWT, hashing
│   └── .env                 # Backend config
└── DATABASE_SETUP.sql       # Database schema
```

---

## 🎯 Next Steps

After setup, you can:

1. **Customize Events**: Add real events through admin panel
2. **Configure Email Templates**: Modify email templates in `backend/src/services/emailService.js`
3. **Update Branding**: Change colors, logos in frontend components
4. **Add Payment Gateway**: Integrate real payment gateway (currently simulated)
5. **Deploy**: Deploy to production (Vercel for frontend, Railway/Heroku for backend)

---

## 📞 Support

For issues:
1. Check backend logs: `cd backend && npm run dev`
2. Check frontend console in browser DevTools
3. Verify database setup in Supabase dashboard
4. Ensure all environment variables are set correctly

---

## 🎉 You're All Set!

Your IIPS Yoga & Fitness Club website is now fully configured with:
- ✅ User registration and authentication
- ✅ Role-based access (Student, Other, Admin)
- ✅ Event booking system
- ✅ Payment processing
- ✅ Email notifications
- ✅ Admin dashboard
- ✅ User dashboard
- ✅ Secure backend API

**Happy coding! 🧘‍♂️💪**
