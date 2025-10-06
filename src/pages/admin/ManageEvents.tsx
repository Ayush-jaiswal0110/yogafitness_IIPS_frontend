import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Calendar, Users, MapPin, Clock } from 'lucide-react';
import { db } from '@/lib/database';
import { Event } from '@/types';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  maxParticipants: z.number().min(1, 'Max participants must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative'),
  instructor: z.string().min(1, 'Instructor is required'),
  type: z.enum(['upcoming', 'previous']),
});

type EventFormData = z.infer<typeof eventSchema>;

const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      maxParticipants: 30,
      price: 0,
      type: 'upcoming'
    }
  });

  useEffect(() => {
    db.initializeDummyData();
    loadEvents();
  }, []);

  const loadEvents = () => {
    setEvents(db.getEvents());
  };

  const onSubmit = (data: EventFormData) => {
    const eventData: Event = {
      id: editingEvent?.id || Date.now().toString(),
      ...data,
      currentParticipants: editingEvent?.currentParticipants || 0,
      image: editingEvent?.image || '/api/placeholder/400/300',
    };

    if (editingEvent) {
      db.updateEvent(editingEvent.id, eventData);
      setSuccess('Event updated successfully!');
    } else {
      db.addEvent(eventData);
      setSuccess('Event created successfully!');
    }

    loadEvents();
    setIsDialogOpen(false);
    setEditingEvent(null);
    reset();

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setValue('title', event.title);
    setValue('description', event.description);
    setValue('date', event.date);
    setValue('time', event.time);
    setValue('location', event.location);
    setValue('maxParticipants', event.maxParticipants);
    setValue('price', event.price);
    setValue('instructor', event.instructor);
    setValue('type', event.type);
    setIsDialogOpen(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      db.deleteEvent(eventId);
      loadEvents();
      setSuccess('Event deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    reset({
      maxParticipants: 30,
      price: 0,
      type: 'upcoming'
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Events</h1>
          <p className="text-gray-600">Create, edit, and manage your club events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewEvent} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" {...register('title')} />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Select onValueChange={(value) => setValue('instructor', value)} value={watch('instructor')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mrs. Manju Suchdeo">Mrs. Manju Suchdeo</SelectItem>
                      <SelectItem value="Dr. Surendra Malviya">Dr. Surendra Malviya</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.instructor && (
                    <p className="text-sm text-red-600 mt-1">{errors.instructor.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} rows={3} />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" {...register('date')} />
                  {errors.date && (
                    <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" {...register('time')} />
                  {errors.time && (
                    <p className="text-sm text-red-600 mt-1">{errors.time.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} placeholder="e.g., IIPS Yoga Hall" />
                {errors.location && (
                  <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input 
                    id="maxParticipants" 
                    type="number" 
                    {...register('maxParticipants', { valueAsNumber: true })} 
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-red-600 mt-1">{errors.maxParticipants.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    {...register('price', { valueAsNumber: true })} 
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select onValueChange={(value: 'upcoming' | 'previous') => setValue('type', value)} value={watch('type')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="previous">Previous</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant={event.type === 'upcoming' ? 'default' : 'secondary'}>
                  {event.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600 text-sm">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {event.currentParticipants}/{event.maxParticipants} participants
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-semibold text-green-600">
                  {event.price > 0 ? `₹${event.price}` : 'Free'}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600">Create your first event to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageEvents;