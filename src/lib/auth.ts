import { api } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  student_id?: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly USER_KEY = 'user';

  static async login(email: string, password: string): Promise<User> {
    const response = await api.auth.login({ email, password });
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    return response.user;
  }

  static async register(data: {
    name: string;
    email: string;
    phone: string;
    studentId: string;
    password: string;
  }): Promise<User> {
    const response = await api.auth.register(data);
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    return response.user;
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  static async getProfile(): Promise<User> {
    const response = await api.auth.getProfile();
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    return response.user;
  }

  static async updateProfile(data: { name: string; phone: string }): Promise<User> {
    const response = await api.auth.updateProfile(data);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    return response.user;
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await api.auth.changePassword({ currentPassword, newPassword });
  }
}