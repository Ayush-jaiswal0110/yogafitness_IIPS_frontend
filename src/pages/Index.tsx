import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, Eye, Users, Calendar, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import { db } from '@/lib/database';
import { Faculty } from '@/types';

const HomePage = () => {
  useEffect(() => {
    // Initialize dummy data on first load
    db.initializeDummyData();
  }, []);

  const faculty: Faculty[] = [
    {
      name: 'Mrs. Manju Suchdeo',
      designation: 'Co-ordinating Faculty',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Dr. Surendra Malviya',
      designation: 'Co-ordinating Faculty',
      image: '/api/placeholder/200/200'
    }
  ];

  const upcomingEvents = db.getEvents().filter(event => event.type === 'upcoming').slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              SAMPOORNA CLUB
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Fitness & <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Yoga Club</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              International Institute of Professional Studies, DAVV Indore
            </p>
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
              Enhancing the quality of living and maintaining daily routine with yoga and healthy diet. 
              Join us on a journey to mindfulness and holistic wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Events
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-orange-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To create health awareness and provide Holistic Health to humanity all over the world. 
                  We believe health is the sum of physical, mental, emotional, socio-economical and spiritual well-being. 
                  We practice, share and develop by providing a HARMONIOUS environment, bringing together KNOWLEDGEABLE 
                  and COMPASSIONATE teachers, trainers and industry experts who have the DESIRE to SHARE their PASSIONS 
                  with you to IMPROVE and DEVELOP our community and ourselves as we undergo the journey to mindfulness 
                  and holistic wellbeing together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-pink-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-pink-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Wellness and wellbeing for all with no one left out. In this great vision we are propagating 
                  ancient yet scientific wisdom which can bring light of hope to everyone. We have a dream vision 
                  to see everyone healthy in a holistic manner. To create a COMMUNITY for yoga, mindfulness and 
                  holistic wellbeing. To enhance the quality of life in the communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Faculty Coordinators</h2>
            <p className="text-lg text-gray-600">Meet our dedicated faculty members who guide our club</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faculty.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.designation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">Join us for these exciting upcoming sessions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/events">
              <Button size="lg" variant="outline">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">{db.getUsers().length}+</h3>
              <p className="text-xl">Active Members</p>
            </div>
            <div>
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">{db.getEvents().length}+</h3>
              <p className="text-xl">Events Conducted</p>
            </div>
            <div>
              <Award className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">5+</h3>
              <p className="text-xl">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;