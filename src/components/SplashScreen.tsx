import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Calendar className="w-20 h-20 text-white animate-pulse" />
            <div className="absolute -right-4 -top-4">
              <Users className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div className="absolute -left-4 -bottom-4">
              <Clock className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Booking System</h1>
        <p className="text-blue-100 text-lg">Simplifying your reservations</p>
      </div>
    </div>
  );
};