import { z } from 'zod';

export const validLogin = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

