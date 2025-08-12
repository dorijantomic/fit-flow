import { User as PrismaUser, Workout as PrismaWorkout, WorkoutSet as PrismaWorkoutSet, Exercise as PrismaExercise } from '@prisma/client';

export type User = PrismaUser;

export type Exercise = PrismaExercise;

export type WorkoutSet = PrismaWorkoutSet;

export type Workout = PrismaWorkout & {
  workoutSets: WorkoutSet[];
};

export type TodayWorkout = {
  name: string;
  exercises: {
    id: number;
    name: string;
    sets: number;
    reps: string;
    weight: number | string;
    completed: number;
    rpe: number | null;
  }[];
  estimatedTime: number;
};

export type RecentWorkout = {
  date: string;
  name: string;
  volume: number;
  duration: number;
};

export type ProgressData = {
  exercise: string;
  current: number;
  previous: number;
  change: number;
};
