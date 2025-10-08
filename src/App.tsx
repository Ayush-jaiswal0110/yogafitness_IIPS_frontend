import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Events from './pages/Events';
import BookEvent from './pages/BookEvent';
import About from './pages/About';
import Register from './pages/Register';
import UserDashboard from './pages/user/UserDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageEvents from './pages/admin/ManageEvents';
import Users from './pages/admin/Users';
import EmailHistory from './pages/admin/EmailHistory';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/book/:eventId" element={<BookEvent />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <ManageEvents />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/emails" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout>
                <EmailHistory />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;