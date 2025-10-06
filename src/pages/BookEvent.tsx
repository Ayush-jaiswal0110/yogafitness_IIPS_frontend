import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import BookingForm from '@/components/BookingForm';
import EventCard from '@/components/EventCard';
import { db } from '@/lib/database';
import { Event } from '@/types';

const BookEventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    db.initializeDummyData();
    if (eventId) {
      const foundEvent = db.getEvents().find(e => e.id === eventId);
      setEvent(foundEvent || null);
    }
  }, [eventId]);

  const handleBookingSuccess = () => {
    navigate('/events', { 
      state: { message: 'Booking confirmed successfully!' }
    });
  };

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/events')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const isEventPast = event.type === 'previous';

  if (isEventFull || isEventPast) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/events')}
              className="mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EventCard event={event} showBookButton={false} />
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {isEventPast ? 'Event Completed' : 'Event Full'}
                </h2>
                <p className="text-gray-600">
                  {isEventPast 
                    ? 'This event has already taken place.' 
                    : 'Unfortunately, this event is fully booked.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/events')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <EventCard event={event} showBookButton={false} />
            </div>
            <div>
              <BookingForm event={event} onSuccess={handleBookingSuccess} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookEventPage;