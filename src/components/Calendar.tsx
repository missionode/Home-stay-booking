import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  isBefore,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { storage } from '../utils/storage';

interface CalendarProps {
  onDateSelect: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const today = new Date();

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today) || !storage.isDateAvailable(format(date, 'yyyy-MM-dd'))) {
      return;
    }
    onDateSelect(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-blue-600 rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-blue-600 rounded-full transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 p-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dateString = format(day, 'yyyy-MM-dd');
          const isAvailable = storage.isDateAvailable(dateString);
          const isPast = isBefore(day, today);
          const isCurrentDay = isToday(day);
          
          return (
            <button
              key={dateString}
              onClick={() => handleDateClick(day)}
              disabled={isPast || !isAvailable}
              className={`
                p-2 text-center rounded-lg transition-colors
                ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                ${!isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                ${isCurrentDay ? 'bg-blue-500 text-white' : ''}
                ${!isPast && isAvailable ? 'hover:bg-blue-100 cursor-pointer' : ''}
              `}
            >
              {format(day, 'd')}
              {isAvailable && !isPast && (
                <div className="text-xs text-green-500 mt-1">
                  {5 - (storage.getBookingsForDate(dateString).length)} slots
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};