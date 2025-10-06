import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Eye, Heart, Users, Award, BookOpen } from 'lucide-react';

const AboutPage = () => {
  const achievements = [
    'Over 500+ students participated in various events',
    'Successfully conducted 50+ yoga and fitness sessions',
    'Established partnerships with certified yoga instructors',
    'Created a supportive community for holistic wellness',
    'Promoted mental health awareness among students'
  ];

  const activities = [
    {
      title: 'Daily Yoga Sessions',
      description: 'Morning and evening yoga classes for all skill levels',
      icon: Heart
    },
    {
      title: 'Fitness Workshops',
      description: 'Specialized workshops on nutrition, exercise, and wellness',
      icon: Users
    },
    {
      title: 'Meditation Programs',
      description: 'Mindfulness and meditation sessions for stress relief',
      icon: Target
    },
    {
      title: 'Health Seminars',
      description: 'Educational seminars on holistic health and lifestyle',
      icon: BookOpen
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 bg-white text-orange-600">
                ABOUT US
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fitness & Yoga Club
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                A sub-club of SAMPOORNA CLUB, dedicated to enhancing the quality of living 
                through yoga, fitness, and holistic wellness practices.
              </p>
            </div>
          </div>
        </section>

        {/* Club Information */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Club</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The Fitness and Yoga Club was established with a motive of enhancing the quality 
                of living and maintaining daily routine with yoga and healthy diet for students 
                of International Institute of Professional Studies, DAVV Indore.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Target className="h-8 w-8 text-orange-500 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To create health awareness and provide Holistic Health to humanity all over the world. 
                    As we believe health is the sum of physical, mental, emotional, socio-economical and 
                    spiritual well-being.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    To practice, share and develop with you by providing a HARMONIOUS environment, 
                    bringing together KNOWLEDGEABLE and COMPASSIONATE teachers, trainers and industry 
                    experts who have the DESIRE to SHARE their PASSIONS with you to IMPROVE and DEVELOP 
                    our community and ourselves as we undergo the journey to mindfulness and holistic 
                    wellbeing together.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-pink-500">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Eye className="h-8 w-8 text-pink-500 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Wellness and wellbeing for all with no one left out. In this great vision we are 
                    propagating ancient yet scientific wisdom which can bring light of hope to everyone.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We have a dream vision to see everyone healthy in a holistic manner. To create a 
                    COMMUNITY for yoga, mindfulness and holistic wellbeing. To enhance the quality of 
                    life in the communities.
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Faculty Coordinators</h2>
              <p className="text-lg text-gray-600">
                Our dedicated faculty members who guide and support our club activities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <img
                    src="/api/placeholder/200/200"
                    alt="Mrs. Manju Suchdeo"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mrs. Manju Suchdeo</h3>
                  <p className="text-gray-600 mb-4">Co-ordinating Faculty</p>
                  <p className="text-sm text-gray-500">
                    Specializes in yoga instruction and holistic wellness practices. 
                    Brings years of experience in promoting student health and wellbeing.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <img
                    src="/api/placeholder/200/200"
                    alt="Dr. Surendra Malviya"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Surendra Malviya</h3>
                  <p className="text-gray-600 mb-4">Co-ordinating Faculty</p>
                  <p className="text-sm text-gray-500">
                    Expert in fitness training and sports medicine. Dedicated to promoting 
                    physical fitness and healthy lifestyle among students.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Activities</h2>
              <p className="text-lg text-gray-600">
                Discover the various programs and activities we offer
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {activity.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
              <p className="text-lg text-gray-600">
                Milestones we've achieved in promoting health and wellness
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <Award className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Ready to embark on your wellness journey? Join the Fitness & Yoga Club and 
              become part of a community dedicated to holistic health and wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Email</h3>
                <p>fitness@iips.edu.in</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Phone</h3>
                <p>+91 731 123 4567</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Location</h3>
                <p>IIPS Campus, DAVV Indore</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;