import { Workout, WorkoutSet } from "@prisma/client";

export interface IWorkoutRepository {
  findById(id: number): Promise<Workout | null>;
  create(data: { userId: string; workoutTemplateId: number }): Promise<Workout>;
  logSet(data: { workoutId: number; exerciseId: number; reps: number; weight: number; rpe: number; }): Promise<WorkoutSet>;
  finish(workoutId: number): Promise<Workout>;
  getUserProgress(userId: string): Promise<any[]>;
}
