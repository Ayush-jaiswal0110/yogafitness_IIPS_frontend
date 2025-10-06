# IIPS Yoga and Fitness Club - Backend API

## Overview
This is the backend REST API for the IIPS Yoga and Fitness Club website, built with Node.js, Express.js, and Supabase as the database.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer
- **Validation**: express-validator

## Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # Supabase client setup
│   │   └── env.js       # Environment variables config
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── eventsController.js
│   │   ├── usersController.js
│   │   ├── bookingsController.js
│   │   └── emailController.js
│   ├── routes/          # API route definitions
│   │   ├── authRoutes.js
│   │   ├── eventsRoutes.js
│   │   ├── usersRoutes.js
│   │   ├── bookingsRoutes.js
│   │   └── emailRoutes.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # JWT authentication
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── services/        # Business logic
│   │   ├── emailService.js
│   │   └── paymentService.js
│   ├── utils/           # Utility functions
│   │   ├── hashPassword.js
│   │   └── jwt.js
│   └── server.js        # Main application entry point
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Required environment variables:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRES_IN` - Token expiration time
- `FRONTEND_URL` - Frontend application URL
- Email configuration (for Nodemailer)
- Payment gateway configuration

### 3. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server health status.

---

## Authentication Endpoints

### Register a New User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "studentId": "IIPS001",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt_token"
}
```

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  "token": "jwt_token"
}
```

### Get User Profile
```
GET /api/auth/profile
```
*Requires authentication*

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "student_id": "IIPS001",
    "role": "student",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile
```
PUT /api/auth/profile
```
*Requires authentication*

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "0987654321"
}
```

### Change Password
```
POST /api/auth/change-password
```
*Requires authentication*

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## Events Endpoints

### Get All Events
```
GET /api/events
```

**Query Parameters:**
- `type` (optional): Filter by event type (`upcoming` or `previous`)

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Morning Yoga Session",
      "description": "Start your day with energizing yoga poses",
      "date": "2024-09-10",
      "time": "07:00:00",
      "location": "IIPS Yoga Hall",
      "max_participants": 50,
      "current_participants": 15,
      "price": 0,
      "image": "image_url",
      "type": "upcoming",
      "instructor": "Mrs. Manju Suchdeo"
    }
  ]
}
```

### Get Upcoming Events
```
GET /api/events/upcoming
```

### Get Previous Events
```
GET /api/events/previous
```

### Get Event by ID
```
GET /api/events/:id
```

### Create Event
```
POST /api/events
```
*Requires admin authentication*

**Request Body:**
```json
{
  "title": "New Yoga Workshop",
  "description": "Advanced yoga techniques",
  "date": "2024-10-01",
  "time": "08:00",
  "location": "IIPS Yoga Hall",
  "maxParticipants": 30,
  "price": 100,
  "image": "image_url",
  "type": "upcoming",
  "instructor": "Mrs. Manju Suchdeo"
}
```

### Update Event
```
PUT /api/events/:id
```
*Requires admin authentication*

### Delete Event
```
DELETE /api/events/:id
```
*Requires admin authentication*

---

## Users Endpoints

### Get All Users
```
GET /api/users
```
*Requires admin authentication*

**Response:**
```json
{
  "users": [...],
  "count": 25
}
```

### Get User Stats
```
GET /api/users/stats
```
*Requires admin authentication*

**Response:**
```json
{
  "stats": {
    "totalUsers": 100,
    "totalBookings": 250,
    "totalEvents": 15
  }
}
```

### Get User by ID
```
GET /api/users/:id
```
*Requires admin authentication*

### Update User Role
```
PUT /api/users/:id/role
```
*Requires admin authentication*

**Request Body:**
```json
{
  "role": "admin"
}
```

### Delete User
```
DELETE /api/users/:id
```
*Requires admin authentication*

---

## Bookings Endpoints

### Get All Bookings
```
GET /api/bookings/all
```
*Requires admin authentication*

### Get User's Bookings
```
GET /api/bookings/my-bookings
```
*Requires authentication*

**Response:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "event_id": "uuid",
      "booking_date": "2024-09-01T10:00:00.000Z",
      "payment_status": "completed",
      "payment_id": "PAY_123",
      "amount": 100,
      "events": {
        "title": "Morning Yoga Session",
        "date": "2024-09-10",
        "time": "07:00:00"
      }
    }
  ]
}
```

### Get Booking by ID
```
GET /api/bookings/:id
```
*Requires authentication*

### Create Booking
```
POST /api/bookings
```
*Requires authentication*

**Request Body:**
```json
{
  "eventId": "event_uuid"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {...},
  "requiresPayment": true
}
```

### Initiate Payment
```
POST /api/bookings/:bookingId/initiate-payment
```
*Requires authentication*

**Response:**
```json
{
  "message": "Payment initiated",
  "success": true,
  "paymentUrl": "payment_url",
  "orderId": "ORDER_123",
  "transactionId": "TXN_123"
}
```

### Verify Payment
```
POST /api/bookings/:bookingId/verify-payment
```
*Requires authentication*

**Request Body:**
```json
{
  "paymentId": "PAY_123",
  "orderId": "ORDER_123"
}
```

### Cancel Booking
```
DELETE /api/bookings/:id
```
*Requires authentication*

---

## Email Endpoints

### Get Email History
```
GET /api/emails
```
*Requires admin authentication*

### Get User's Email History
```
GET /api/emails/my-emails
```
*Requires authentication*

### Get Email by ID
```
GET /api/emails/:id
```
*Requires authentication*

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Database Schema

### Users Table
- `id` - UUID (Primary Key)
- `name` - Text
- `email` - Text (Unique)
- `phone` - Text
- `student_id` - Text
- `password_hash` - Text
- `role` - Text (student/admin)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Events Table
- `id` - UUID (Primary Key)
- `title` - Text
- `description` - Text
- `date` - Date
- `time` - Time
- `location` - Text
- `max_participants` - Integer
- `current_participants` - Integer
- `price` - Numeric
- `image` - Text
- `type` - Text (upcoming/previous)
- `instructor` - Text
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Bookings Table
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key)
- `event_id` - UUID (Foreign Key)
- `booking_date` - Timestamp
- `payment_status` - Text (pending/completed/failed)
- `payment_id` - Text
- `amount` - Numeric
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Email History Table
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key)
- `booking_id` - UUID (Foreign Key)
- `email_type` - Text
- `recipient_email` - Text
- `subject` - Text
- `body` - Text
- `status` - Text (sent/failed/pending)
- `sent_at` - Timestamp
- `created_at` - Timestamp

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs
2. **JWT Authentication**: Secure token-based authentication
3. **Role-Based Access Control**: Admin and student roles
4. **Input Validation**: Request validation using express-validator
5. **CORS Protection**: Configured CORS for frontend access
6. **Helmet**: Security headers with helmet.js
7. **Row Level Security**: Database-level security with Supabase RLS

---

## Testing the API

You can test the API using tools like:
- **Postman**: Import the endpoints and test
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

Example cURL request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iips.edu","password":"admin123"}'
```

---

## Development Tips

1. Use the default admin credentials for testing:
   - Email: `admin@iips.edu`
   - Password: Set during database initialization

2. Monitor logs in development mode with Morgan

3. All database queries use Supabase RLS for security

4. Email service requires proper SMTP configuration

5. Payment service is simulated for development

---

## Support

For issues or questions, please contact the development team.

---

## License

© 2024 IIPS Yoga and Fitness Club. All rights reserved.
