import { Workout, WorkoutSet } from "@prisma/client";
import { IWorkoutRepository } from "../../interfaces/IWorkoutRepository";
import { CreateWorkoutData, IWorkoutManagementCore, LogSetData } from "../../interfaces/IWorkoutManagementCore";

export class WorkoutManagementCore implements IWorkoutManagementCore {
  private workoutRepository: IWorkoutRepository;

  constructor(workoutRepository: IWorkoutRepository) {
    this.workoutRepository = workoutRepository;
  }

  async createWorkout(data: CreateWorkoutData): Promise<Workout> {
    // Business logic for creating a workout can be added here.
    return this.workoutRepository.create(data);
  }

  async logSet(data: LogSetData): Promise<WorkoutSet> {
    // Business logic for logging a set can be added here.
    return this.workoutRepository.logSet(data);
  }

  async finishWorkout(workoutId: number): Promise<Workout> {
    // Business logic for finishing a workout can be added here.
    return this.workoutRepository.finish(workoutId);
  }

  async getWorkoutById(workoutId: number): Promise<Workout | null> {
    return this.workoutRepository.findById(workoutId);
  }

  async getUserProgress(userId: string): Promise<any[]> {
    // The logic for calculating progress is already in the repository.
    // In a more complex scenario, this core module would perform the calculation.
    return this.workoutRepository.getUserProgress(userId);
  }
}
