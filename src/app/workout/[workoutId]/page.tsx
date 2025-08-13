import WorkoutView from '@/components/workout/WorkoutView';
import { findWorkoutByIdAction } from '@/lib/data/workout.dao';
import { notFound } from 'next/navigation';

// Helper function to transform the database data into the shape the component expects
function transformWorkoutData(dbWorkout: any) {
  if (!dbWorkout || !dbWorkout.workoutTemplate) {
    return null;
  }

  const transformedExercises = dbWorkout.workoutTemplate.templateExercises.map((te: any) => {
    const loggedSetsForExercise = dbWorkout.workoutSets.filter((ws: any) => ws.exerciseId === te.exerciseId);
    return {
      id: te.exercise.id,
      name: te.exercise.name,
      sets: te.sets ?? 0,
      reps: te.reps ?? '0',
      weight: 0,
      completed: loggedSetsForExercise.length,
    };
  });

  return {
    id: dbWorkout.id,
    name: dbWorkout.workoutTemplate.name,
    exercises: transformedExercises,
  };
}

interface WorkoutPageProps {
  params: {
    workoutId: string;
  };
}

export default async function WorkoutPage({ params: { workoutId } }: WorkoutPageProps) {
  const dbWorkout = await findWorkoutByIdAction(parseInt(workoutId, 10));

  if (!dbWorkout) {
    notFound();
  }

  const workout = transformWorkoutData(dbWorkout);

  if (!workout) {
   
    notFound();
  }

  return <WorkoutView workout={workout} />;
}
