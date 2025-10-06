import { Event, User, Booking } from '@/types';

// Simulate database with localStorage
class LocalDatabase {
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Events
  getEvents(): Event[] {
    return this.getFromStorage<Event>('events');
  }

  addEvent(event: Event): void {
    const events = this.getEvents();
    events.push(event);
    this.saveToStorage('events', events);
  }

  updateEvent(eventId: string, updatedEvent: Partial<Event>): void {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent };
      this.saveToStorage('events', events);
    }
  }

  deleteEvent(eventId: string): void {
    const events = this.getEvents().filter(e => e.id !== eventId);
    this.saveToStorage('events', events);
  }

  // Users
  getUsers(): User[] {
    return this.getFromStorage<User>('users');
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveToStorage('users', users);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  // Bookings
  getBookings(): Booking[] {
    return this.getFromStorage<Booking>('bookings');
  }

  addBooking(booking: Booking): void {
    const bookings = this.getBookings();
    bookings.push(booking);
    this.saveToStorage('bookings', bookings);
  }

  updateBooking(bookingId: string, updatedBooking: Partial<Booking>): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updatedBooking };
      this.saveToStorage('bookings', bookings);
    }
  }

  // Initialize with dummy data
  initializeDummyData(): void {
    if (this.getEvents().length === 0) {
      const dummyEvents: Event[] = [
        {
          id: '1',
          title: 'Morning Yoga Session',
          description: 'Start your day with energizing yoga poses and breathing exercises.',
          date: '2024-08-15',
          time: '07:00',
          location: 'IIPS Yoga Hall',
          maxParticipants: 50,
          currentParticipants: 45,
          price: 0,
          image: '/api/placeholder/400/300',
          type: 'previous',
          instructor: 'Mrs. Manju Suchdeo'
        },
        {
          id: '2',
          title: 'Fitness Boot Camp',
          description: 'High-intensity workout session for building strength and endurance.',
          date: '2024-08-20',
          time: '17:00',
          location: 'IIPS Sports Ground',
          maxParticipants: 30,
          currentParticipants: 28,
          price: 100,
          image: '/api/placeholder/400/300',
          type: 'previous',
          instructor: 'Dr. Surendra Malviya'
        },
        {
          id: '3',
          title: 'Meditation Workshop',
          description: 'Learn mindfulness and meditation techniques for stress relief.',
          date: '2024-09-10',
          time: '16:00',
          location: 'IIPS Meditation Center',
          maxParticipants: 40,
          currentParticipants: 15,
          price: 50,
          image: '/api/placeholder/400/300',
          type: 'upcoming',
          instructor: 'Mrs. Manju Suchdeo'
        },
        {
          id: '4',
          title: 'Advanced Yoga Workshop',
          description: 'Advanced yoga poses and techniques for experienced practitioners.',
          date: '2024-09-20',
          time: '08:00',
          location: 'IIPS Yoga Hall',
          maxParticipants: 25,
          currentParticipants: 8,
          price: 150,
          image: '/api/placeholder/400/300',
          type: 'upcoming',
          instructor: 'Mrs. Manju Suchdeo'
        }
      ];
      this.saveToStorage('events', dummyEvents);
    }
  }
}

export const db = new LocalDatabase();