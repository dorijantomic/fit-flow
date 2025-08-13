import { getSession } from "@/lib/session";
import { getUserAction } from "./user.dao";
import prisma from "@/lib/prisma";
import { Workout, WorkoutTemplate, TemplateExercise, Exercise, WorkoutSet } from "@prisma/client";

// Define more specific types for our needs
type TodayWorkoutRaw = (Workout & {
    workoutTemplate: (WorkoutTemplate & {
        templateExercises: (TemplateExercise & {
            exercise: Exercise;
        })[];
    }) | null;
    workoutSets: WorkoutSet[];
}) | null;

type RecentWorkoutRaw = (Workout & {
    workoutTemplate: WorkoutTemplate | null;
});


// The DAO class is now an internal implementation detail, not exported.
class InternalWorkoutDAO {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
  public async getTodayWorkout(): Promise<TodayWorkoutRaw> {
    return await prisma.workout.findFirst({
      where: { userId: this.userId, endedAt: null },
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

  public async getRecentWorkouts(): Promise<RecentWorkoutRaw[]> {
    return await prisma.workout.findMany({
      where: { userId: this.userId, endedAt: { not: null } },
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: {
        workoutTemplate: true,
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
}


export async function getDashboardData() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const workoutDAO = new InternalWorkoutDAO(session.sub);

  const user = await getUserAction();
  if (!user) {
    return null;
  }

  const todayWorkoutRaw = await workoutDAO.getTodayWorkout();
  const recentWorkoutsRaw = await workoutDAO.getRecentWorkouts();
  const progressData = await workoutDAO.getUserProgress();

  // Transform data for the view
  const todayWorkout = todayWorkoutRaw && todayWorkoutRaw.workoutTemplate ? {
    id: todayWorkoutRaw.id,
    name: todayWorkoutRaw.workoutTemplate.name,
    estimatedTime: 65, // Mock
    exercises: todayWorkoutRaw.workoutTemplate.templateExercises.map((te) => ({
      name: te.exercise.name,
      sets: te.sets ?? 0,
      reps: te.reps ?? '0',
    })),
  } : {
    id: null,
    name: "No workout for today",
    estimatedTime: 0,
    exercises: [],
  };

  const recentWorkouts = recentWorkoutsRaw.map((w) => ({
    date: w.startedAt.toISOString().split('T')[0],
    name: w.workoutTemplate?.name ?? 'Unnamed Workout',
    volume: 10000, // Mock
    duration: w.endedAt ? (w.endedAt.getTime() - w.startedAt.getTime()) / 60000 : 0, // in minutes
  }));

  return {
    user: {
      name: user.name,
      streak: 0, // Mock
      weeklyGoal: 4, // Mock
      completedWorkouts: recentWorkouts.length, // Example
    },
    todayWorkout,
    recentWorkouts,
    progressData,
  };
}
