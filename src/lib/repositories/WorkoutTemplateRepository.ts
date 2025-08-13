import { IWorkoutTemplateRepository } from "@/lib/api/interfaces/IWorkoutTemplateRepository";
import prisma from "@/lib/prisma";
import { WorkoutTemplate } from "@prisma/client";

export class WorkoutTemplateRepository implements IWorkoutTemplateRepository {
  async findAll(): Promise<WorkoutTemplate[]> {
    return prisma.workoutTemplate.findMany({
      include: {
        templateExercises: {
          include: {
            exercise: true,
          },
        },
        workouts: true,
      },
    });
  }

  async findById(id: number): Promise<WorkoutTemplate | null> {
    return prisma.workoutTemplate.findUnique({
      where: { id },
      include: {
        templateExercises: {
          include: {
            exercise: true,
          },
        },
        workouts: true,
      },
    });
  }

  async create(data: { name: string; description?: string; userId: string }): Promise<WorkoutTemplate> {
    return prisma.workoutTemplate.create({ data });
  }

  async update(id: number, data: Partial<WorkoutTemplate>): Promise<WorkoutTemplate> {
    return prisma.workoutTemplate.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.workoutTemplate.delete({ where: { id } });
  }
}
