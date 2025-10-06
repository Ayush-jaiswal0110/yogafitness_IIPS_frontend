export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  image: string;
  type: 'previous' | 'upcoming';
  instructor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  registrationDate: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookingDate: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  amount: number;
}

export interface Faculty {
  name: string;
  designation: string;
  image: string;
}