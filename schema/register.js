import { z } from 'zod';

export const validRegister = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^\d{10}$/), // Example for a 10-digit phone number
  role: z.enum(['student', 'mentor', 'admin']),
});

