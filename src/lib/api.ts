const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ApiError {
  error: string;
  errors?: Array<{ msg: string; param: string }>;
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  auth = {
    register: (data: {
      name: string;
      email: string;
      phone: string;
      studentId: string;
      password: string;
    }) => this.post<{ user: any; token: string; message: string }>('/auth/register', data),

    login: (data: { email: string; password: string }) =>
      this.post<{ user: any; token: string; message: string }>('/auth/login', data),

    getProfile: () => this.get<{ user: any }>('/auth/profile'),

    updateProfile: (data: { name: string; phone: string }) =>
      this.put<{ user: any; message: string }>('/auth/profile', data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      this.post<{ message: string }>('/auth/change-password', data),
  };

  events = {
    getAll: (type?: 'upcoming' | 'previous') =>
      this.get<{ events: any[] }>(type ? `/events?type=${type}` : '/events'),

    getUpcoming: () => this.get<{ events: any[] }>('/events/upcoming'),

    getPrevious: () => this.get<{ events: any[] }>('/events/previous'),

    getById: (id: string) => this.get<{ event: any }>(`/events/${id}`),

    create: (data: {
      title: string;
      description: string;
      date: string;
      time: string;
      location: string;
      maxParticipants: number;
      price: number;
      image?: string;
      type: 'upcoming' | 'previous';
      instructor: string;
    }) => this.post<{ event: any; message: string }>('/events', data),

    update: (
      id: string,
      data: {
        title: string;
        description: string;
        date: string;
        time: string;
        location: string;
        maxParticipants: number;
        price: number;
        image?: string;
        type: 'upcoming' | 'previous';
        instructor: string;
      }
    ) => this.put<{ event: any; message: string }>(`/events/${id}`, data),

    delete: (id: string) => this.delete<{ message: string }>(`/events/${id}`),
  };

  users = {
    getAll: () => this.get<{ users: any[]; count: number }>('/users'),

    getStats: () =>
      this.get<{
        stats: { totalUsers: number; totalBookings: number; totalEvents: number };
      }>('/users/stats'),

    getById: (id: string) => this.get<{ user: any }>(`/users/${id}`),

    updateRole: (id: string, role: 'student' | 'admin') =>
      this.put<{ user: any; message: string }>(`/users/${id}/role`, { role }),

    delete: (id: string) => this.delete<{ message: string }>(`/users/${id}`),
  };

  bookings = {
    getAll: () => this.get<{ bookings: any[] }>('/bookings/all'),

    getMy: () => this.get<{ bookings: any[] }>('/bookings/my-bookings'),

    getById: (id: string) => this.get<{ booking: any }>(`/bookings/${id}`),

    create: (eventId: string) =>
      this.post<{ booking: any; requiresPayment: boolean; message: string }>(
        '/bookings',
        { eventId }
      ),

    initiatePayment: (bookingId: string) =>
      this.post<{
        success: boolean;
        paymentUrl: string;
        orderId: string;
        transactionId: string;
      }>(`/bookings/${bookingId}/initiate-payment`),

    verifyPayment: (bookingId: string, paymentId: string, orderId: string) =>
      this.post<{ booking: any; message: string }>(
        `/bookings/${bookingId}/verify-payment`,
        { paymentId, orderId }
      ),

    cancel: (id: string) => this.delete<{ message: string }>(`/bookings/${id}`),
  };

  emails = {
    getAll: () => this.get<{ emails: any[] }>('/emails'),

    getMy: () => this.get<{ emails: any[] }>('/emails/my-emails'),

    getById: (id: string) => this.get<{ email: any }>(`/emails/${id}`),
  };
}

export const api = new ApiClient();
