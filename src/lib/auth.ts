// Fixed admin credentials - no changes allowed
const ADMIN_EMAIL = 'yogaiipsadmin@gmail.com';
const ADMIN_PASSWORD = 'yogakarlo';

export class AuthService {
  private static readonly AUTH_KEY = 'yoga_admin_auth';
  
  static login(email: string, password: string): boolean {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(this.AUTH_KEY, 'authenticated');
      return true;
    }
    return false;
  }
  
  static logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }
  
  static isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'authenticated';
  }
  
  static getAdminEmail(): string {
    return ADMIN_EMAIL;
  }
}