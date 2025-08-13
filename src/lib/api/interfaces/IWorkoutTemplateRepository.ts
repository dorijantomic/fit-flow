import { WorkoutTemplate } from "@prisma/client";

export interface IWorkoutTemplateRepository {
  findAll(): Promise<WorkoutTemplate[]>;
  findById(id: number): Promise<WorkoutTemplate | null>;
  create(data: { name: string; description?: string; userId: string }): Promise<WorkoutTemplate>;
  update(id: number, data: Partial<WorkoutTemplate>): Promise<WorkoutTemplate>;
  delete(id: number): Promise<void>;
}
