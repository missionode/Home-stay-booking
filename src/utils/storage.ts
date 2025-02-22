import { Booking, DayBookings } from '../types/booking';

const BOOKINGS_KEY = 'bookings';
const MAX_BOOKINGS_PER_DAY = 5;

export const storage = {
  getBookings(): DayBookings {
    try {
      const bookings = localStorage.getItem(BOOKINGS_KEY);
      return bookings ? JSON.parse(bookings) : {};
    } catch (error) {
      console.error('Error reading bookings:', error);
      return {};
    }
  },

  saveBooking(booking: Booking): void {
    try {
      const bookings = this.getBookings();
      if (!bookings[booking.date]) {
        bookings[booking.date] = [];
      }
      bookings[booking.date].push(booking);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving booking:', error);
      throw new Error('Failed to save booking');
    }
  },

  updateBooking(booking: Booking): void {
    try {
      const bookings = this.getBookings();
      const dateBookings = bookings[booking.date];
      
      if (!dateBookings) {
        throw new Error('Booking not found');
      }

      const index = dateBookings.findIndex(b => b.id === booking.id);
      if (index === -1) {
        throw new Error('Booking not found');
      }

      dateBookings[index] = booking;
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error('Failed to update booking');
    }
  },

  isDateAvailable(date: string): boolean {
    const bookings = this.getBookings();
    return !bookings[date] || bookings[date].length < MAX_BOOKINGS_PER_DAY;
  },

  isPhoneNumberUnique(date: string, phoneNumber: string, excludeBookingId?: string): boolean {
    const bookings = this.getBookings();
    if (!bookings[date]) return true;
    
    return !bookings[date].some(
      booking => 
        booking.id !== excludeBookingId && (
          booking.primaryBooker.phoneNumber === phoneNumber ||
          booking.additionalGuests.some(guest => guest.phoneNumber === phoneNumber)
        )
    );
  },

  getBookingsForDate(date: string): Booking[] {
    const bookings = this.getBookings();
    return bookings[date] || [];
  },

  createBackup(): string {
    try {
      const data: Record<string, any> = {};
      
      // Backup all localStorage data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key);
        }
      }

      // Create backup object with metadata
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data
      };

      return JSON.stringify(backup);
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup');
    }
  },

  restoreBackup(backupData: string): void {
    try {
      const backup = JSON.parse(backupData);
      
      // Validate backup format
      if (!backup.data || !backup.timestamp || !backup.version) {
        throw new Error('Invalid backup format');
      }

      // Clear current data
      localStorage.clear();

      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error('Failed to restore backup');
    }
  }
};