'use server';

import { revalidatePath } from 'next/cache';
import { createWorkoutAction, logSetAction } from '@/lib/data/workout.dao';
import { createWorkoutTemplate } from '@/lib/data/workoutTemplate.dao';
import { getSession } from './session';

export async function startWorkout(userId: string, workoutTemplateId: number) {
  const workout = await createWorkoutAction(workoutTemplateId);
  revalidatePath('/');
  return workout;
}

export async function completeSet(workoutId: number, setId: number, reps: number, weight: number, rpe: number) {
    const workoutSet = await logSetAction({ workoutId, exerciseId: setId, reps, weight, rpe });
    revalidatePath('/');
    return workoutSet;
}

export async function createTemplateAction(data: { name: string; description?: string }) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await createWorkoutTemplate({ ...data, userId: session.sub });
  revalidatePath("/templates");
}
