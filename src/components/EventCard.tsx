import { Event } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  showBookButton?: boolean;
}

const EventCard = ({ event, showBookButton = true }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const spotsLeft = event.maxParticipants - event.currentParticipants;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <Badge 
          className={`absolute top-2 right-2 ${
            event.type === 'upcoming' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        >
          {event.type === 'upcoming' ? 'Upcoming' : 'Completed'}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">{event.title}</CardTitle>
        <p className="text-gray-600 text-sm">{event.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{formatTime(event.time)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{event.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">Instructor: {event.instructor}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {event.currentParticipants}/{event.maxParticipants} participants
            </span>
          </div>
          
          {event.price > 0 && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              ₹{event.price}
            </Badge>
          )}
          
          {event.price === 0 && (
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Free
            </Badge>
          )}
        </div>
        
        {event.type === 'upcoming' && spotsLeft <= 5 && spotsLeft > 0 && (
          <Badge variant="destructive" className="w-full justify-center">
            Only {spotsLeft} spots left!
          </Badge>
        )}
      </CardContent>
      
      {showBookButton && event.type === 'upcoming' && (
        <CardFooter>
          <Link to={`/book/${event.id}`} className="w-full">
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              disabled={isEventFull}
            >
              {isEventFull ? 'Event Full' : 'Book Now'}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;