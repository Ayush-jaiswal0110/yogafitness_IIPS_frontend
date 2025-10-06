import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, TrendingUp, DollarSign, Activity, Clock } from 'lucide-react';
import { db } from '@/lib/database';
import { Event, User, Booking } from '@/types';

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    db.initializeDummyData();
    setUsers(db.getUsers());
    setEvents(db.getEvents());
    setBookings(db.getBookings());
  }, []);

  const upcomingEvents = events.filter(event => event.type === 'upcoming');
  const previousEvents = events.filter(event => event.type === 'previous');
  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'completed')
    .reduce((sum, booking) => sum + booking.amount, 0);
  const recentBookings = bookings.slice(-5).reverse();

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Active Events',
      value: upcomingEvents.filter(e => e.currentParticipants > 0).length,
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the Fitness & Yoga Club admin panel. Here's an overview of your club's performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => {
                  const event = events.find(e => e.id === booking.eventId);
                  const user = users.find(u => u.id === booking.userId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {event?.title || 'Unknown Event'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}
                        >
                          {booking.paymentStatus}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          ₹{booking.amount}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {event.currentParticipants}/{event.maxParticipants}
                      </p>
                      <p className="text-xs text-gray-600">participants</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Event Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{previousEvents.length}</p>
              <p className="text-sm text-gray-600">Completed Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  previousEvents.reduce((sum, event) => sum + (event.currentParticipants / event.maxParticipants * 100), 0) / 
                  (previousEvents.length || 1)
                )}%
              </p>
              <p className="text-sm text-gray-600">Average Attendance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {previousEvents.reduce((sum, event) => sum + event.currentParticipants, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Participants</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;