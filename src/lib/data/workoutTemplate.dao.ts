import prisma from "@/lib/prisma";

export async function getWorkoutTemplates() {
  return await prisma.workoutTemplate.findMany({
    include: {
      templateExercises: true,
      workouts: true,
    },
  });
}

export async function createWorkoutTemplate(data: { name: string; description?: string; userId: string }) {
  return await prisma.workoutTemplate.create({
    data,
  });
}

export async function getWorkoutTemplateById(id: number) {
  return await prisma.workoutTemplate.findUnique({
    where: { id },
    include: {
      templateExercises: true,
      workouts: true,
    },
  });
}
