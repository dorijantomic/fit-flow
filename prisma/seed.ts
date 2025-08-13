import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create a default user
  const defaultUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      id: 'default-user-id',
      email: 'user@example.com',
      name: 'Default User',
      password: await hashPassword('password123'),
      emailVerified: true,
    },
  });
  console.log(`Created default user: ${defaultUser.email}`);

  // Create some exercises
  const benchPress = await prisma.exercise.upsert({
    where: { name: 'Bench Press' },
    update: {},
    create: { name: 'Bench Press', movementPattern: 'push' },
  });

  const squat = await prisma.exercise.upsert({
    where: { name: 'Squat' },
    update: {},
    create: { name: 'Squat', movementPattern: 'squat' },
  });

  const deadlift = await prisma.exercise.upsert({
    where: { name: 'Deadlift' },
    update: {},
    create: { name: 'Deadlift', movementPattern: 'hinge' },
  });
  console.log('Created exercises: Bench Press, Squat, Deadlift');

  // Create a default workout template
  const defaultTemplate = await prisma.workoutTemplate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Default Upper Body',
      userId: defaultUser.id,
      templateExercises: {
        create: [
          { exerciseId: benchPress.id, sets: 4, reps: '6-8' },
          { exerciseId: squat.id, sets: 4, reps: '6-8' },
          { exerciseId: deadlift.id, sets: 3, reps: '5' },
        ],
      },
    },
  });
  console.log(`Created default workout template: ${defaultTemplate.name}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
