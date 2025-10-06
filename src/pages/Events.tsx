import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import { db } from '@/lib/database';
import { Event } from '@/types';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Initialize dummy data and load events
    db.initializeDummyData();
    setEvents(db.getEvents());
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = event.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const upcomingEvents = filteredEvents.filter(event => event.type === 'upcoming');
  const previousEvents = filteredEvents.filter(event => event.type === 'previous');

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
              <p className="text-xl mb-8">Discover our yoga and fitness sessions</p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Events Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="previous">Previous Events</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
                  <p className="text-gray-600">Register now for these exciting sessions</p>
                </div>
                
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} showBookButton={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {searchTerm ? 'No upcoming events match your search.' : 'No upcoming events at the moment.'}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="previous" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Previous Events</h2>
                  <p className="text-gray-600">Take a look at our past successful sessions</p>
                </div>
                
                {previousEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {previousEvents.map((event) => (
                      <EventCard key={event.id} event={event} showBookButton={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {searchTerm ? 'No previous events match your search.' : 'No previous events to display.'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join our community of health-conscious students and embark on a path to holistic wellbeing.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              onClick={() => setActiveTab('upcoming')}
            >
              Browse Upcoming Events
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default EventsPage;