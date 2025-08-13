import { Workout, WorkoutSet } from "@prisma/client";

// Define the shape of data needed for workout creation and set logging
export type CreateWorkoutData = {
  userId: string;
  workoutTemplateId: number;
};

export type LogSetData = {
  workoutId: number;
  exerciseId: number;
  reps: number;
  weight: number;
  rpe: number;
};

export interface IWorkoutManagementCore {
  createWorkout(data: CreateWorkoutData): Promise<Workout>;
  logSet(data: LogSetData): Promise<WorkoutSet>;
  finishWorkout(workoutId: number): Promise<Workout>;
  getWorkoutById(workoutId: number): Promise<Workout | null>;
  getUserProgress(userId: string): Promise<any[]>;
}
