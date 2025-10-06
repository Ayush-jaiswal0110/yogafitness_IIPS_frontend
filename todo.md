# Fitness and Yoga Club Website - Development Plan

## Project Overview
Creating a dynamic website for the Fitness and Yoga Club of International Institute of Professional Studies DAVV Indore with booking system, admin dashboard, and payment integration.

## Core Files to Create/Modify

### 1. Main Layout & Navigation
- **src/components/Layout.tsx** - Main layout with header, navigation, and footer
- **src/components/Navbar.tsx** - Navigation bar with club branding

### 2. Public Pages
- **src/pages/Index.tsx** - Homepage with hero section, vision/mission, faculty info
- **src/pages/Events.tsx** - Events page showing previous and upcoming events
- **src/pages/BookEvent.tsx** - Event booking form with payment integration
- **src/pages/About.tsx** - About page with detailed club information

### 3. Admin Dashboard
- **src/pages/admin/Dashboard.tsx** - Admin dashboard with user stats and overview
- **src/pages/admin/ManageEvents.tsx** - Admin page to add/edit events
- **src/pages/admin/Users.tsx** - User management page

### 4. Components
- **src/components/EventCard.tsx** - Reusable event display component
- **src/components/BookingForm.tsx** - Event booking form component
- **src/components/PaymentGateway.tsx** - PhonePe payment integration component

### 5. Data & State Management
- **src/lib/database.ts** - Local storage database simulation (since Supabase is disabled)
- **src/lib/email.ts** - Email notification simulation
- **src/types/index.ts** - TypeScript interfaces for events, users, bookings

## Features Implementation
1. ✅ Club information display (vision, mission, faculty)
2. ✅ Previous events with dummy images/videos
3. ✅ Upcoming events section
4. ✅ Event booking system with form validation
5. ✅ Local storage for data persistence
6. ✅ Admin dashboard with user count and management
7. ✅ Event management from admin panel
8. ✅ Payment gateway integration (PhonePe simulation)
9. ✅ Email notification simulation
10. ✅ Responsive design with modern UI

## Technical Stack
- React + TypeScript
- Shadcn/ui components
- Tailwind CSS
- Local Storage for data persistence
- React Router for navigation
- Form validation with react-hook-form