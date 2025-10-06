import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users as UsersIcon, Mail, Phone, Calendar, Download } from 'lucide-react';
import { db } from '@/lib/database';
import { User, Booking, Event } from '@/types';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    db.initializeDummyData();
    setUsers(db.getUsers());
    setBookings(db.getBookings());
    setEvents(db.getEvents());
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Student ID', 'Registration Date', 'Total Bookings'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone,
        user.studentId,
        new Date(user.registrationDate).toLocaleDateString(),
        getUserBookings(user.id).length.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">View and manage registered users</p>
        </div>
        <Button onClick={exportUsers} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.paymentStatus === 'completed').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => {
                    const registrationDate = new Date(user.registrationDate);
                    const now = new Date();
                    return registrationDate.getMonth() === now.getMonth() && 
                           registrationDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => {
          const userBookings = getUserBookings(user.id);
          const completedBookings = userBookings.filter(b => b.paymentStatus === 'completed');
          
          return (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <Badge variant="outline">
                    {completedBookings.length} bookings
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {user.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Student ID: {user.studentId}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Registered: {new Date(user.registrationDate).toLocaleDateString()}
                  </div>
                </div>

                {userBookings.length > 0 && (
                  <div className="pt-3 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Bookings</h4>
                    <div className="space-y-1">
                      {userBookings.slice(0, 3).map((booking) => {
                        const event = events.find(e => e.id === booking.eventId);
                        return (
                          <div key={booking.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              {event?.title || 'Unknown Event'}
                            </span>
                            <Badge 
                              variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms.' : 'Users will appear here once they register for events.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersPage;