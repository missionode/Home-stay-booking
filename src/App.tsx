import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Calendar } from './components/Calendar';
import { BookingForm } from './components/BookingForm';
import { BookingManagement } from './components/BookingManagement';
import { UserProfile } from './components/UserProfile';
import { SplashScreen } from './components/SplashScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { Toast } from './components/Toast';
import { storage } from './utils/storage';
import type { Guest } from './types/booking';
import { Calendar as CalendarIcon } from 'lucide-react';

function App() {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleBookingSubmit = async (data: {
    primaryBooker: Guest;
    additionalGuests: Guest[];
  }) => {
    try {
      const isUnique = storage.isPhoneNumberUnique(
        selectedDate!,
        data.primaryBooker.phoneNumber
      );

      if (!isUnique) {
        throw new Error('Phone number already exists for this date');
      }

      storage.saveBooking({
        id: crypto.randomUUID(),
        date: selectedDate!,
        primaryBooker: data.primaryBooker,
        additionalGuests: data.additionalGuests,
        createdAt: new Date().toISOString()
      });

      setToast({
        message: 'Booking successful!',
        type: 'success'
      });
      setSelectedDate(null);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Failed to create booking',
        type: 'error'
      });
    }
  };

  const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="py-8">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route
          path="/home"
          element={
            <MainLayout>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CalendarIcon size={32} className="text-blue-500" />
                    <h1 className="text-3xl font-bold text-gray-900">Booking System</h1>
                  </div>
                  <p className="text-gray-600">
                    Select a date to make a booking. Maximum 5 bookings per day.
                  </p>
                </div>

                <Calendar onDateSelect={handleDateSelect} />

                {selectedDate && (
                  <BookingForm
                    onSubmit={handleBookingSubmit}
                    onClose={() => setSelectedDate(null)}
                  />
                )}

                {toast && (
                  <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                  />
                )}
              </div>
            </MainLayout>
          }
        />
        <Route
          path="/manage"
          element={
            <MainLayout>
              <BookingManagement />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <UserProfile />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;