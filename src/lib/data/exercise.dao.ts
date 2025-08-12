import prisma from "@/lib/prisma";

export async function getExercises() {
  return await prisma.exercise.findMany();
}

export async function createExercise(data: { name: string; description?: string; movementPattern?: string; muscleGroup?: string; equipment?: string; difficulty?: string; videoUrl?: string }) {
  return await prisma.exercise.create({
    data,
  });
}

export async function getExerciseById(id: number) {
  return await prisma.exercise.findUnique({
    where: { id },
  });
}
