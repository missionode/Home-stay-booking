import { z } from 'zod';

export const guestSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name must contain only letters and spaces'),
  phoneNumber: z
    .string()
    .regex(/^\+\d{2}-\d{10}$/, 'Phone number must be in format: +XX-XXXXXXXXXX'),
  age: z
    .number()
    .min(18, 'Must be at least 18 years old')
    .max(100, 'Must be less than 100 years old'),
  gender: z.enum(['male', 'female', 'other'])
});

export const bookingFormSchema = z.object({
  primaryBooker: guestSchema,
  additionalGuests: z.array(guestSchema).max(4, 'Maximum 4 additional guests allowed')
});