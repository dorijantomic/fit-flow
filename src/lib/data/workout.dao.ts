export async function getWorkouts(userId: string) {
  return await prisma.workout.findMany({
    where: { userId },
    include: {
      workoutTemplate: true,
      workoutSets: true,
    },
    orderBy: { startedAt: "desc" },
  });
}

export async function createWorkout(data: { userId: string; workoutTemplateId?: number; notes?: string }) {
  return await prisma.workout.create({
    data,
  });
}
import prisma from "@/lib/prisma";
// import { Prisma } from "@prisma/client";

export class WorkoutDAO {
  public async findWorkoutById(id: number) {
    return await prisma.workout.findUnique({
      where: { id },
      include: {
        workoutSets: true,
      },
    });
  }

  public async getTodayWorkout(userId: string) {
    return await prisma.workout.findFirst({
      where: { userId, endedAt: null },
      orderBy: { startedAt: 'desc' },
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

  public async getRecentWorkouts(userId: string) {
    return await prisma.workout.findMany({
      where: { userId, endedAt: { not: null } },
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: {
        workoutTemplate: true,
      },
    });
  }

  public async getUserProgress(userId: string) {
    const completedSets = await prisma.workoutSet.findMany({
      where: {
        workout: {
          userId: userId,
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

  public async createWorkout(userId: string, workoutTemplateId: number) {
    return await prisma.workout.create({
      data: {
        userId,
        workoutTemplateId,
      },
    });
  }

  public async updateWorkoutSet(id: number, reps: number, weight: number, rpe: number) {
    return await prisma.workoutSet.update({
      where: { id },
      data: {
        reps,
        weight,
        rpe,
      },
    });
  }
}
