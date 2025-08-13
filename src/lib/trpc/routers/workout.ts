import { z } from 'zod';
import { WorkoutManagementCore } from '@/lib/api/core/workout-management/WorkoutManagementCore';
import { WorkoutRepository } from '@/lib/repositories/WorkoutRepository';
import { publicProcedure, router } from '../trpc';

const workoutManagementCore = new WorkoutManagementCore(new WorkoutRepository());

export const workoutRouter = router({
  getWorkoutById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return workoutManagementCore.getWorkoutById(input);
    }),

  createWorkout: publicProcedure
    .input(z.object({
      userId: z.string(),
      workoutTemplateId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return workoutManagementCore.createWorkout(input);
    }),

  logSet: publicProcedure
    .input(z.object({
      workoutId: z.number(),
      exerciseId: z.number(),
      reps: z.number(),
      weight: z.number(),
      rpe: z.number(),
    }))
    .mutation(async ({ input }) => {
      return workoutManagementCore.logSet(input);
    }),

  finishWorkout: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return workoutManagementCore.finishWorkout(input);
    }),
    
  getUserProgress: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return workoutManagementCore.getUserProgress(input);
    }),
});
