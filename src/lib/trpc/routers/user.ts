import { z } from 'zod';
import { UserManagementCore } from '@/lib/api/core/user-management/UserManagementCore';
import { UserRepository } from '@/lib/repositories/UserRepository';
import { publicProcedure, router } from '../trpc';

// Instantiate the core module with its repository dependency
const userManagementCore = new UserManagementCore(new UserRepository());

export const userRouter = router({
  getUserById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return userManagementCore.getUserById(input);
    }),

  getUserByEmail: publicProcedure
    .input(z.string().email())
    .query(async ({ input }) => {
      return userManagementCore.getUserByEmail(input);
    }),
  
  // Example of a mutation. We'll need to expand the Zod schema
  // based on the actual User model.
  createUser: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
      experienceLevel: z.string().optional(),
      goals: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      // This is a simplified version. A real implementation would need
      // the full user object and password handling.
      const { experienceLevel, ...rest } = input;
      const userData = {
        ...rest,
        experienceLevel: experienceLevel ?? null,
        emailVerified: false,
      };
      return userManagementCore.createUser(userData);
    }),
});
