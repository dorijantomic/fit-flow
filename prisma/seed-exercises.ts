// scripts/seed-exercises.ts
// Run with: npx tsx scripts/seed-exercises.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  // Compound Upper Body - Push
  {
    name: "Bench Press",
    category: "compound",
    movementPattern: ["push"],
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["shoulders"],
    equipmentNeeded: ["barbell", "bench"],
    difficultyLevel: 3,
    instructions: "Lie on bench, grip bar shoulder-width apart, lower to chest with control, press up explosively.",
  },
  {
    name: "Overhead Press",
    category: "compound", 
    movementPattern: ["push"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: ["triceps", "core"],
    equipmentNeeded: ["barbell"],
    difficultyLevel: 4,
    instructions: "Stand with bar at shoulder height, press overhead while keeping core tight.",
  },
  {
    name: "Incline Dumbbell Press",
    category: "compound",
    movementPattern: ["push"],
    primaryMuscles: ["chest", "shoulders"],
    secondaryMuscles: ["triceps"],
    equipmentNeeded: ["dumbbells", "bench"],
    difficultyLevel: 2,
    instructions: "Set bench to 30-45 degrees, press dumbbells up and together at the top.",
  },
  {
    name: "Dips",
    category: "compound",
    movementPattern: ["push"],
    primaryMuscles: ["triceps", "chest"],
    secondaryMuscles: ["shoulders"],
    equipmentNeeded: ["dip_bars"],
    difficultyLevel: 3,
    instructions: "Lean slightly forward, lower until shoulders are below elbows, press up.",
  },

  // Compound Upper Body - Pull
  {
    name: "Pull-ups",
    category: "compound",
    movementPattern: ["pull"],
    primaryMuscles: ["lats", "rhomboids"],
    secondaryMuscles: ["biceps", "rear_delts"],
    equipmentNeeded: ["pull_up_bar"],
    difficultyLevel: 4,
    instructions: "Hang with arms extended, pull up until chin clears bar, lower with control.",
  },
  {
    name: "Bent-Over Row",
    category: "compound",
    movementPattern: ["pull"],
    primaryMuscles: ["lats", "rhomboids", "middle_traps"],
    secondaryMuscles: ["biceps", "rear_delts"],
    equipmentNeeded: ["barbell"],
    difficultyLevel: 3,
    instructions: "Hinge at hips, keep back straight, pull bar to lower chest/upper abdomen.",
  },
  {
    name: "T-Bar Row",
    category: "compound",
    movementPattern: ["pull"],
    primaryMuscles: ["lats", "rhomboids"],
    secondaryMuscles: ["biceps", "rear_delts"],
    equipmentNeeded: ["t_bar", "plates"],
    difficultyLevel: 2,
    instructions: "Stand over bar, hinge at hips, pull bar to chest with elbows close to body.",
  },
  {
    name: "Lat Pulldown",
    category: "compound",
    movementPattern: ["pull"],
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "rhomboids"],
    equipmentNeeded: ["cable_machine"],
    difficultyLevel: 2,
    instructions: "Sit with thighs secured, pull bar to upper chest, squeeze shoulder blades.",
  },

  // Compound Lower Body - Squat Pattern
  {
    name: "Back Squat",
    category: "compound",
    movementPattern: ["squat"],
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves", "core"],
    equipmentNeeded: ["barbell", "squat_rack"],
    difficultyLevel: 4,
    instructions: "Bar on upper back, descend until hips below knees, drive through heels to stand.",
  },
  {
    name: "Front Squat",
    category: "compound",
    movementPattern: ["squat"],
    primaryMuscles: ["quadriceps"],
    secondaryMuscles: ["glutes", "core"],
    equipmentNeeded: ["barbell", "squat_rack"],
    difficultyLevel: 5,
    instructions: "Bar across front delts, elbows high, squat down keeping torso upright.",
  },
  {
    name: "Goblet Squat",
    category: "compound",
    movementPattern: ["squat"],
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core"],
    equipmentNeeded: ["dumbbell"],
    difficultyLevel: 2,
    instructions: "Hold dumbbell at chest, squat down keeping chest up and knees out.",
  },
  {
    name: "Bulgarian Split Squat",
    category: "compound",
    movementPattern: ["squat"],
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves"],
    equipmentNeeded: ["bench", "dumbbells"],
    difficultyLevel: 3,
    instructions: "Rear foot elevated, lower until front thigh is parallel, drive up through front heel.",
  },

  // Compound Lower Body - Hinge Pattern
  {
    name: "Deadlift",
    category: "compound",
    movementPattern: ["hinge"],
    primaryMuscles: ["hamstrings", "glutes", "erector_spinae"],
    secondaryMuscles: ["lats", "traps", "forearms"],
    equipmentNeeded: ["barbell", "plates"],
    difficultyLevel: 5,
    instructions: "Bar over mid-foot, hinge at hips, keep back straight, drive through heels.",
  },
  {
    name: "Romanian Deadlift",
    category: "compound",
    movementPattern: ["hinge"],
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["erector_spinae"],
    equipmentNeeded: ["barbell"],
    difficultyLevel: 3,
    instructions: "Start standing, hinge at hips pushing butt back, lower bar along legs.",
  },
  {
    name: "Sumo Deadlift",
    category: "compound",
    movementPattern: ["hinge"],
    primaryMuscles: ["glutes", "quadriceps"],
    secondaryMuscles: ["hamstrings", "adductors"],
    equipmentNeeded: ["barbell", "plates"],
    difficultyLevel: 4,
    instructions: "Wide stance, toes pointed out, hands inside legs, drive through heels.",
  },
  {
    name: "Hip Thrust",
    category: "compound",
    movementPattern: ["hinge"],
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings"],
    equipmentNeeded: ["barbell", "bench"],
    difficultyLevel: 2,
    instructions: "Upper back on bench, bar over hips, drive hips up squeezing glutes.",
  },

  // Isolation Upper Body
  {
    name: "Barbell Curl",
    category: "isolation",
    movementPattern: ["pull"],
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipmentNeeded: ["barbell"],
    difficultyLevel: 1,
    instructions: "Stand with bar in hands, curl up without swinging, squeeze at top.",
  },
  {
    name: "Tricep Dips",
    category: "isolation",
    movementPattern: ["push"],
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["shoulders"],
    equipmentNeeded: ["bench"],
    difficultyLevel: 2,
    instructions: "Hands on bench behind you, lower until arms at 90 degrees, press up.",
  },
  {
    name: "Lateral Raise",
    category: "isolation",
    movementPattern: ["push"],
    primaryMuscles: ["shoulders"],
    secondaryMuscles: [],
    equipmentNeeded: ["dumbbells"],
    difficultyLevel: 1,
    instructions: "Arms at sides, raise dumbbells out to shoulder height, lower slowly.",
  },
  {
    name: "Face Pull",
    category: "isolation",
    movementPattern: ["pull"],
    primaryMuscles: ["rear_delts", "rhomboids"],
    secondaryMuscles: ["middle_traps"],
    equipmentNeeded: ["cable_machine"],
    difficultyLevel: 2,
    instructions: "High cable position, pull rope to face level separating hands at end.",
  },

  // Isolation Lower Body
  {
    name: "Leg Curl",
    category: "isolation",
    movementPattern: ["hinge"],
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: [],
    equipmentNeeded: ["leg_curl_machine"],
    difficultyLevel: 1,
    instructions: "Lie prone, curl heels toward glutes, lower slowly.",
  },
  {
    name: "Leg Extension",
    category: "isolation",
    movementPattern: ["squat"],
    primaryMuscles: ["quadriceps"],
    secondaryMuscles: [],
    equipmentNeeded: ["leg_extension_machine"],
    difficultyLevel: 1,
    instructions: "Sit with back against pad, extend legs until straight, lower slowly.",
  },
  {
    name: "Calf Raise",
    category: "isolation",
    movementPattern: ["squat"],
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    equipmentNeeded: ["calf_raise_machine"],
    difficultyLevel: 1,
    instructions: "Stand on balls of feet, raise up as high as possible, lower slowly.",
  },

  // Core
  {
    name: "Plank",
    category: "isolation",
    movementPattern: ["core"],
    primaryMuscles: ["core", "abs"],
    secondaryMuscles: ["shoulders"],
    equipmentNeeded: ["bodyweight"],
    difficultyLevel: 2,
    instructions: "Hold push-up position with straight line from head to heels.",
  },
  {
    name: "Dead Bug",
    category: "isolation",
    movementPattern: ["core"],
    primaryMuscles: ["core", "abs"],
    secondaryMuscles: [],
    equipmentNeeded: ["bodyweight"],
    difficultyLevel: 2,
    instructions: "Lie on back, knees at 90 degrees, extend opposite arm and leg slowly.",
  },
  {
    name: "Russian Twist",
    category: "isolation",
    movementPattern: ["core"],
    primaryMuscles: ["obliques", "abs"],
    secondaryMuscles: [],
    equipmentNeeded: ["bodyweight"],
    difficultyLevel: 2,
    instructions: "Sit with knees bent, lean back slightly, rotate torso side to side.",
  }
];

async function seedExercises() {
  console.log('Starting exercise database seeding...');

  try {
    // Clear existing exercises (optional - remove this in production)
    await prisma.workoutSet.deleteMany({});
    await prisma.workout.deleteMany({});
    await prisma.templateExercise.deleteMany({});
    await prisma.workoutTemplate.deleteMany({});
    await prisma.exercise.deleteMany({});
    console.log('Cleared existing data');

    // Insert exercises
    for (const exercise of exercises) {
      await prisma.exercise.create({
        data: exercise
      });
      console.log(`✓ Added: ${exercise.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${exercises.length} exercises!`);
    
    // Create some basic workout templates
    console.log('\nCreating sample workout templates...');
    
    // Get the default user (you may need to adjust this)
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'user@example.com' }
    });

    if (defaultUser) {
      // Upper Body Template
      const upperBodyTemplate = await prisma.workoutTemplate.create({
        data: {
          name: "Upper Body Strength",
          description: "Focus on compound upper body movements",
          userId: defaultUser.id,
          estimatedDuration: 65
        }
      });

      // Add exercises to upper body template
      const upperExercises = await prisma.exercise.findMany({
        where: {
          name: {
            in: ["Bench Press", "Bent-Over Row", "Overhead Press", "Pull-ups"]
          }
        }
      });

      for (let i = 0; i < upperExercises.length; i++) {
        await prisma.templateExercise.create({
          data: {
            workoutTemplateId: upperBodyTemplate.id,
            exerciseId: upperExercises[i].id,
            orderIndex: i + 1,
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 8,
            targetWeight: i === 0 ? 135 : i === 1 ? 115 : i === 2 ? 95 : 0, // Rough starting weights
            restSeconds: 180
          }
        });
      }

      // Lower Body Template
      const lowerBodyTemplate = await prisma.workoutTemplate.create({
        data: {
          name: "Lower Body Power",
          description: "Squat and hinge patterns for lower body strength",
          userId: defaultUser.id,
          estimatedDuration: 60
        }
      });

      const lowerExercises = await prisma.exercise.findMany({
        where: {
          name: {
            in: ["Back Squat", "Romanian Deadlift", "Bulgarian Split Squat", "Hip Thrust"]
          }
        }
      });

      for (let i = 0; i < lowerExercises.length; i++) {
        await prisma.templateExercise.create({
          data: {
            workoutTemplateId: lowerBodyTemplate.id,
            exerciseId: lowerExercises[i].id,
            orderIndex: i + 1,
            targetSets: i < 2 ? 4 : 3, // Main lifts get 4 sets, accessories get 3
            targetRepsMin: i < 2 ? 5 : 8,
            targetRepsMax: i < 2 ? 6 : 12,
            targetWeight: i === 0 ? 185 : i === 1 ? 155 : i === 2 ? 25 : 95,
            restSeconds: i < 2 ? 180 : 120
          }
        });
      }

      console.log('✓ Created sample workout templates');
    }

  } catch (error) {
    console.error('Error seeding exercises:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedExercises()
    .then(() => {
      console.log('\n🚀 Exercise seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedExercises };
