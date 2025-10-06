import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fitness & Yoga Club</h3>
              <p className="text-gray-300">
                International Institute of Professional Studies<br />
                DAVV Indore
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">
                Email: fitness@iips.edu.in<br />
                Phone: +91 731 123 4567
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Faculty Coordinators</h3>
              <p className="text-gray-300">
                Mrs. Manju Suchdeo<br />
                Dr. Surendra Malviya
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fitness & Yoga Club, IIPS DAVV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;