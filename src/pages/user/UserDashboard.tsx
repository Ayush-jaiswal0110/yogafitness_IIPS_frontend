import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  IdCard,
  CheckCircle,
  XCircle,
  Loader2,
  Bell,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { AuthService } from '@/lib/auth';
import { api } from '@/lib/api';

interface Booking {
  id: string;
  booking_date: string;
  payment_status: string;
  amount: number;
  events: {
    title: string;
    date: string;
    time: string;
    location: string;
    instructor: string;
    image: string;
  };
}

const UserDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.bookings.getMy();
        setBookings(response.bookings);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <Alert>
              <AlertDescription>
                Please login to view your dashboard.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.student_id && (
                  <div className="flex items-start gap-2">
                    <IdCard className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-semibold">{user.student_id}</p>
                    </div>
                  </div>
                )}
                <Badge className="bg-gradient-to-r from-orange-500 to-pink-500">
                  {user.role === 'student' ? 'Student' : user.role === 'other' ? 'Other User' : 'Admin'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Booking Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-gray-900">{bookings.length}</p>
                  <p className="text-gray-600 mt-2">Total Bookings</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {bookings.filter((b) => b.payment_status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Confirmed</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {bookings.filter((b) => b.payment_status === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/events">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Browse Events
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="w-full">
                    About Club
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                My Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : error ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't booked any events yet. Browse our upcoming events and join us!
                  </p>
                  <Link to="/events">
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      Browse Events
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden bg-gray-200">
                        <img
                          src={booking.events.image || '/api/placeholder/400/300'}
                          alt={booking.events.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{booking.events.title}</h3>
                          <Badge
                            className={
                              booking.payment_status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : booking.payment_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {booking.payment_status === 'completed' && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {booking.payment_status === 'failed' && (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {booking.payment_status.charAt(0).toUpperCase() +
                              booking.payment_status.slice(1)}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.events.date).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {booking.events.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {booking.events.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {booking.events.instructor}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Amount Paid:</span>
                            <span className="font-bold text-lg text-orange-500">
                              {booking.amount > 0 ? `₹${booking.amount}` : 'Free'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
