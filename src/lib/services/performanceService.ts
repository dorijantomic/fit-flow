// src/lib/services/performance.service.ts
// Service layer that bridges database and scientific algorithms

import prisma from "@/lib/prisma";
import { ScientificAlgorithms, type WorkoutSet, type ExercisePerformance, type ProgressionRecommendation, type RecoveryMetrics } from "../algorithms/core";
import { getSession } from "@/lib/session";

export class PerformanceService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Get real dashboard data replacing the mock data
   */
  async getDashboardData() {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: this.userId },
      select: { name: true, email: true }
    });

    if (!user) return null;

    // Get today's workout (active or most recent incomplete)
    const todayWorkout = await this.getTodayWorkout();
    
    // Get recent workout performance
    const recentWorkouts = await this.getRecentWorkouts();
    
    // Get progress data using scientific algorithms
    const progressData = await this.getProgressData();
    
    // Calculate weekly stats
    const weeklyStats = await this.getWeeklyStats();

    return {
      user: {
        name: user.name,
        streak: await this.calculateStreak(),
        weeklyGoal: 4, // TODO: Make this user-configurable
        completedWorkouts: weeklyStats.completedWorkouts,
      },
      todayWorkout,
      recentWorkouts,
      progressData,
      weeklyStats
    };
  }

  /**
   * Get today's workout with real data
   */
  private async getTodayWorkout() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check for active workout
    let workout = await prisma.workout.findFirst({
      where: {
        userId: this.userId,
        startedAt: { gte: today },
        endedAt: null
      },
      include: {
        workoutTemplate: {
          include: {
            templateExercises: {
              include: { exercise: true },
            }
          }
        },
        workoutSets: true
      }
    });

    // If no active workout, create one from user's most used template
    if (!workout) {
      const defaultTemplate = await prisma.workoutTemplate.findFirst({
        where: { userId: this.userId },
        include: {
          templateExercises: {
            include: { exercise: true },
          }
        },
      });

      if (defaultTemplate) {
        const estimatedTime = defaultTemplate.templateExercises.reduce((acc, te) => acc + (te.rest || 0), 0) / 60;
        return {
          id: null,
          name: defaultTemplate.name,
          estimatedTime: estimatedTime || 60,
          exercises: defaultTemplate.templateExercises.map(te => ({
            id: te.exercise.id,
            name: te.exercise.name,
            sets: te.sets || 3,
            reps: te.reps || '8-12',
            weight: 0,
            completed: 0
          }))
        };
      }
    }

    if (!workout || !workout.workoutTemplate) {
      return {
        id: null,
        name: "Create your first workout",
        estimatedTime: 0,
        exercises: []
      };
    }
    
    const estimatedTime = workout.workoutTemplate.templateExercises.reduce((acc, te) => acc + (te.rest || 0), 0) / 60;
    // Map real workout data
    return {
      id: workout.id,
      name: workout.workoutTemplate.name,
      estimatedTime: estimatedTime || 60,
      exercises: workout.workoutTemplate.templateExercises.map(te => {
        const completedSets = workout.workoutSets.filter(ws => ws.exerciseId === te.exerciseId);
        return {
          id: te.exercise.id,
          name: te.exercise.name,
          sets: te.sets || 3,
          reps: te.reps || '8-12',
          weight: 0,
          completed: completedSets.length
        };
      })
    };
  }

  /**
   * Get recent workouts with calculated volumes
   */
  private async getRecentWorkouts() {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: this.userId,
        endedAt: { not: null }
      },
      include: {
        workoutTemplate: true,
        workoutSets: true
      },
      orderBy: { startedAt: 'desc' },
      take: 5
    });

    return workouts.map(workout => {
      const volume = ScientificAlgorithms.calculateVolume(
        workout.workoutSets.map(ws => ({
          id: ws.id,
          weight: ws.weight,
          reps: ws.reps,
          rpe: ws.rpe || 7,
          exerciseId: ws.exerciseId,
          completedAt: ws.createdAt
        }))
      );

      const duration = workout.endedAt && workout.startedAt
        ? Math.round((workout.endedAt.getTime() - workout.startedAt.getTime()) / 60000)
        : 0;

      return {
        date: workout.startedAt.toISOString().split('T')[0],
        name: workout.workoutTemplate?.name || 'Unnamed Workout',
        volume: Math.round(volume.totalVolume),
        duration
      };
    });
  }

  /**
   * Get progress data using scientific algorithms
   */
  private async getProgressData() {
    // Get recent sets for major exercises
    const majorExercises = await prisma.exercise.findMany({
      where: {
        workoutSets: {
          some: {
            workout: { userId: this.userId }
          }
        }
      },
      include: {
        workoutSets: {
          where: {
            workout: { userId: this.userId }
          },
          orderBy: { createdAt: 'desc' },
          take: 20 // Last 20 sets per exercise
        }
      },
      take: 5 // Top 5 exercises
    });

    return majorExercises.map(exercise => {
      const sets = exercise.workoutSets.map(ws => ({
        id: ws.id,
        weight: ws.weight,
        reps: ws.reps,
        rpe: ws.rpe || 7,
        exerciseId: ws.exerciseId,
        completedAt: ws.createdAt
      }));

      if (sets.length < 2) {
        return {
          exercise: exercise.name,
          current: 0,
          previous: 0,
          change: 0
        };
      }

      // Calculate current and previous estimated 1RM
      const currentSet = sets[0];
      const previousSet = sets[Math.min(5, sets.length - 1)]; // Look back ~5 sets

      const current1RM = ScientificAlgorithms.estimate1RM(currentSet.weight, currentSet.reps);
      const previous1RM = ScientificAlgorithms.estimate1RM(previousSet.weight, previousSet.reps);

      return {
        exercise: exercise.name,
        current: Math.round(current1RM),
        previous: Math.round(previous1RM),
        change: Math.round(current1RM - previous1RM)
      };
    });
  }

  /**
   * Calculate user's current streak
   */
  private async calculateStreak(): Promise<number> {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: this.userId,
        endedAt: { not: null }
      },
      orderBy: { startedAt: 'desc' },
      select: { startedAt: true }
    });

    if (workouts.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const workout of workouts) {
      const workoutDate = new Date(workout.startedAt);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        streak++;
        currentDate = workoutDate;
      } else if (daysDiff === 2) {
        // Allow for one rest day
        continue;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get weekly statistics
   */
  private async getWeeklyStats() {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const workouts = await prisma.workout.findMany({
      where: {
        userId: this.userId,
        startedAt: { gte: weekStart, lt: weekEnd },
        endedAt: { not: null }
      },
      include: { workoutSets: true }
    });

    const totalVolume = workouts.reduce((sum, workout) => {
      const volume = ScientificAlgorithms.calculateVolume(
        workout.workoutSets.map(ws => ({
          id: ws.id,
          weight: ws.weight,
          reps: ws.reps,
          rpe: ws.rpe || 7,
          exerciseId: ws.exerciseId,
          completedAt: ws.createdAt
        }))
      );
      return sum + volume.totalVolume;
    }, 0);

    const avgDuration = workouts.length > 0
      ? workouts.reduce((sum, w) => {
          const duration = w.endedAt && w.startedAt
            ? (w.endedAt.getTime() - w.startedAt.getTime()) / 60000
            : 0;
          return sum + duration;
        }, 0) / workouts.length
      : 0;

    const volumeChange = await this.calculateVolumeChange(weekStart, totalVolume);

    return {
      completedWorkouts: workouts.length,
      totalVolume: Math.round(totalVolume),
      avgDuration: Math.round(avgDuration),
      volumeChange
    };
  }

  /**
   * Calculate volume change from previous week
   */
  private async calculateVolumeChange(currentWeekStart: Date, currentWeekVolume: number): Promise<number> {
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    
    const prevWeekEnd = new Date(currentWeekStart);

    const prevWeekWorkouts = await prisma.workout.findMany({
      where: {
        userId: this.userId,
        startedAt: { gte: prevWeekStart, lt: prevWeekEnd },
        endedAt: { not: null }
      },
      include: { workoutSets: true }
    });

    const prevWeekVolume = prevWeekWorkouts.reduce((sum, workout) => {
      const volume = ScientificAlgorithms.calculateVolume(
        workout.workoutSets.map(ws => ({
          id: ws.id,
          weight: ws.weight,
          reps: ws.reps,
          rpe: ws.rpe || 7,
          exerciseId: ws.exerciseId,
          completedAt: ws.createdAt
        }))
      );
      return sum + volume.totalVolume;
    }, 0);
    
    if (prevWeekVolume === 0) return 0;
    
    return Math.round(((currentWeekVolume - prevWeekVolume) / prevWeekVolume) * 100);
  }

  /**
   * Get progression recommendations for all user exercises
   */
  async getProgressionRecommendations(): Promise<ProgressionRecommendation[]> {
    const exercises = await prisma.exercise.findMany({
      where: {
        workoutSets: {
          some: {
            workout: { userId: this.userId }
          }
        }
      },
      include: {
        workoutSets: {
          where: {
            workout: { userId: this.userId, endedAt: { not: null } }
          },
          orderBy: { createdAt: 'desc' },
          take: 30 // Last 30 sets for analysis
        }
      }
    });

    const recommendations: ProgressionRecommendation[] = [];

    for (const exercise of exercises) {
      if (exercise.workoutSets.length < 3) continue; // Need minimum data

      const sets = exercise.workoutSets.map(ws => ({
        id: ws.id,
        weight: ws.weight,
        reps: ws.reps,
        rpe: ws.rpe || 7,
        exerciseId: ws.exerciseId,
        completedAt: ws.createdAt
      }));

      // Group sets by workout sessions
      const sessionGroups: WorkoutSet[][] = [];
      let currentSession: WorkoutSet[] = [];
      let lastDate: string | null = null;

      for (const set of sets) {
        const setDate = set.completedAt.toISOString().split('T')[0];
        if (lastDate !== setDate) {
          if (currentSession.length > 0) {
            sessionGroups.push([...currentSession]);
          }
          currentSession = [set];
          lastDate = setDate;
        } else {
          currentSession.push(set);
        }
      }
      if (currentSession.length > 0) {
        sessionGroups.push(currentSession);
      }

      if (sessionGroups.length < 2) continue; // Need at least 2 sessions

      const exercisePerformance: ExercisePerformance = {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: sets,
        previousMax: 0, // TODO: Calculate from history
        currentEstimated1RM: ScientificAlgorithms.estimate1RM(sets[0].weight, sets[0].reps)
      };

      const recommendation = ScientificAlgorithms.calculateProgression(
        exercisePerformance,
        sessionGroups
      );

      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * Calculate recovery score (requires user input)
   */
  calculateRecoveryScore(userInput: {
    sleepHours: number;
    stressLevel: number;
    musclesoreness: number;
    motivationLevel: number;
  }): RecoveryMetrics {
    return ScientificAlgorithms.calculateRecoveryScore(userInput);
  }
}

// Server action to get dashboard data
export async function getDashboardDataAction() {
  const session = await getSession();
  if (!session) return null;

  const service = new PerformanceService(session.sub);
  return await service.getDashboardData();
}

// Server action to get progression recommendations
export async function getProgressionRecommendationsAction() {
  const session = await getSession();
  if (!session) return [];

  const service = new PerformanceService(session.sub);
  return await service.getProgressionRecommendations();
}
