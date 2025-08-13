import prisma from "@/lib/prisma";

export async function getWorkoutTemplates() {
  return await prisma.workoutTemplate.findMany({
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

export async function createWorkoutTemplate(data: { name: string; description?: string; userId: string }) {
  return await prisma.workoutTemplate.create({
    data,
  });
}

export async function getWorkoutTemplateById(id: number) {
  return await prisma.workoutTemplate.findUnique({
    where: { id: id },
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

export async function updateWorkoutTemplate(id: number, data: any) {
  return await prisma.workoutTemplate.update({
    where: { id: id },
    data,
  });
}

export async function deleteWorkoutTemplate(id: number) {
  return await prisma.workoutTemplate.delete({
    where: { id: id },
  });
}

export async function createTemplateAction(data: { name: string; description?: string; userId: string }) {
  return await prisma.workoutTemplate.create({
    data,
  });
}
