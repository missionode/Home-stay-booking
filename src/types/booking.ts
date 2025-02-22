export interface Guest {
  fullName: string;
  phoneNumber: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface Booking {
  id: string;
  date: string;
  primaryBooker: Guest;
  additionalGuests: Guest[];
  createdAt: string;
}

export interface DayBookings {
  [date: string]: Booking[];
}