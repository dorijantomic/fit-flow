import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  SENDGRID_API_KEY: z.string(),
  // Add other environment variables here as needed
});

export const env = envSchema.parse(process.env);
