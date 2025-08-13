'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { getSession } from "@/lib/session";

// The DAO class is now an internal implementation detail, not exported.
class WorkoutDAO {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  public async findWorkoutById(id: number) {
    return await prisma.workout.findUnique({
      where: { id: id, userId: this.userId },
      include: {
        workoutTemplate: {
          include: {
            templateExercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
        workoutSets: true,
      },
    });
  }

  public async createWorkout(workoutTemplateId: number) {
    return await prisma.workout.create({
      data: {
        userId: this.userId,
        workoutTemplateId,
      },
    });
  }

  public async getUserProgress() {
    const completedSets = await prisma.workoutSet.findMany({
      where: {
        workout: {
          userId: this.userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
      select: {
        weight: true,
        exercise: {
          select: {
            name: true,
          },
        },
      },
    });

    const progressMap = new Map<string, { current: number; previous: number }>();
    for (const set of completedSets) {
      if (set.exercise && set.weight) {
        const exerciseName = set.exercise.name;
        if (!progressMap.has(exerciseName)) {
          progressMap.set(exerciseName, { current: set.weight, previous: 0 });
        } else {
          const existing = progressMap.get(exerciseName)!;
          if (existing.previous === 0) {
            existing.previous = set.weight;
          }
        }
      }
    }

    return Array.from(progressMap.entries()).map(([exercise, data]) => ({
      exercise,
      ...data,
      change: data.current - data.previous
    }));
  }

  public async logSet(data: { workoutId: number; exerciseId: number; reps: number; weight: number; rpe: number; }) {
    const workout = await prisma.workout.findFirst({
        where: { id: data.workoutId, userId: this.userId }
    });

    if (!workout) {
        throw new Error("Workout not found or user does not have permission.");
    }

    const newSet = await prisma.workoutSet.create({
      data: {
        workoutId: data.workoutId,
        exerciseId: data.exerciseId,
        reps: data.reps,
        weight: data.weight,
        rpe: data.rpe,
        weightUnit: 'lbs',
      },
    });
    
    revalidatePath(`/workout/${data.workoutId}`);
    return newSet;
  }

  public async finishWorkout(workoutId: number) {
    const workout = await prisma.workout.findFirst({
        where: { id: workoutId, userId: this.userId }
    });

    if (!workout) {
        throw new Error("Workout not found or user does not have permission.");
    }

    const updatedWorkout = await prisma.workout.update({
      where: { id: workoutId },
      data: { endedAt: new Date() },
    });

    revalidatePath(`/`);
    return updatedWorkout;
  }
}

// Exported server actions that use the DAO

export async function findWorkoutByIdAction(workoutId: number) {
    const session = await getSession();
    if (!session) {
        return null;
    }
    const dao = new WorkoutDAO(session.sub);
    return await dao.findWorkoutById(workoutId);
}

export async function createWorkoutAction(workoutTemplateId: number) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const dao = new WorkoutDAO(session.sub);
    return await dao.createWorkout(workoutTemplateId);
}

export async function logSetAction(data: { workoutId: number; exerciseId: number; reps: number; weight: number; rpe: number; }) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const dao = new WorkoutDAO(session.sub);
    return await dao.logSet(data);
}

export async function finishWorkoutAction(workoutId: number) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }
    const dao = new WorkoutDAO(session.sub);
    return await dao.finishWorkout(workoutId);
}
