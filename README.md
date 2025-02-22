# Booking System

A comprehensive web-based booking application built with React, TypeScript, and Tailwind CSS.

## Features

- Interactive monthly calendar with availability indicators
- Real-time booking slot tracking
- Form validation with Zod
- Responsive design for all screen sizes
- Local storage persistence
- Toast notifications for user feedback

## Technical Stack

- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod for validation
- date-fns for date manipulation
- Lucide React for icons

## Project Structure

```
src/
├── components/          # React components
│   ├── Calendar.tsx    # Calendar grid component
│   ├── BookingForm.tsx # Booking form modal
│   └── Toast.tsx       # Toast notification component
├── types/              # TypeScript type definitions
│   └── booking.ts      # Booking-related types
├── utils/              # Utility functions
│   ├── storage.ts      # localStorage management
│   └── validation.ts   # Zod validation schemas
└── App.tsx             # Main application component
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Click on an available date in the calendar to open the booking form
2. Fill in the primary booker's details
3. Add up to 4 additional guests if needed
4. Submit the form to create a booking

## Validation Rules

- Full Name: 2-50 characters, letters only
- Phone Number: Format +XX-XXXXXXXXXX
- Age: 18-100
- Gender: Male/Female/Other
- Maximum 4 additional guests
- Unique phone number per date
- Maximum 5 bookings per day

## Storage

Bookings are stored in localStorage with the following structure:

```typescript
{
  [date: string]: {
    id: string;
    date: string;
    primaryBooker: Guest;
    additionalGuests: Guest[];
    createdAt: string;
  }[]
}
```

## Future Improvements

1. Add backend integration for data persistence
2. Implement booking management (view, edit, cancel)
3. Add email confirmation system
4. Implement date range selection
5. Add booking analytics and reporting
6. Implement user authentication
7. Add multi-language support
8. Implement booking time slots

## Known Limitations

1. Data persistence limited to browser localStorage
2. No server-side validation
3. Limited to single-day bookings
4. No authentication system
5. No booking modification after creation

## Browser Support

Tested and supported in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request