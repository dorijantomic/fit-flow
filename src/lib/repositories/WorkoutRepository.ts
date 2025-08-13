import { IWorkoutRepository } from "@/lib/api/interfaces/IWorkoutRepository";
import prisma from "@/lib/prisma";
import { Workout, WorkoutSet } from "@prisma/client";

export class WorkoutRepository implements IWorkoutRepository {
  async findById(id: number): Promise<Workout | null> {
    return prisma.workout.findUnique({
      where: { id },
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

  async create(data: { userId: string; workoutTemplateId: number }): Promise<Workout> {
    return prisma.workout.create({ data });
  }

  async logSet(data: { workoutId: number; exerciseId: number; reps: number; weight: number; rpe: number; }): Promise<WorkoutSet> {
    return prisma.workoutSet.create({
      data: {
        ...data,
        weightUnit: 'lbs',
      },
    });
  }

  async finish(workoutId: number): Promise<Workout> {
    return prisma.workout.update({
      where: { id: workoutId },
      data: { endedAt: new Date() },
    });
  }

  async getUserProgress(userId: string): Promise<any[]> {
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
}
