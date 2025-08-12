'use server';

import { WorkoutDAO } from '@/lib/data/workout.dao';
import { revalidatePath } from 'next/cache';

export async function startWorkout(userId: string, workoutTemplateId: number) {
  const workoutDAO = new WorkoutDAO();
  const workout = await workoutDAO.createWorkout(userId, workoutTemplateId);
  revalidatePath('/');
  return workout;
}

export async function completeSet(workoutSetId: number, reps: number, weight: number, rpe: number) {
  const workoutDAO = new WorkoutDAO();
  const workoutSet = await workoutDAO.updateWorkoutSet(workoutSetId, reps, weight, rpe);
  revalidatePath('/');
  return workoutSet;
}
