'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, Check, X } from 'lucide-react';
import { logSetAction, finishWorkoutAction } from '@/lib/data/workout.dao';

// Define types for the props
interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  weight: number | string;
  completed: number;
}

interface Workout {
  id: number;
  name: string;
  exercises: Exercise[];
}

interface WorkoutViewProps {
  workout: Workout;
}

// State to hold the input values for each set
interface SetInputState {
  [key: string]: {
    weight: string;
    reps: string;
    rpe: string;
  };
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const WorkoutView: React.FC<WorkoutViewProps> = ({ workout }) => {
  const router = useRouter();
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [setInputs, setSetInputs] = useState<SetInputState>({});
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (exerciseId: number, setIdx: number, field: 'weight' | 'reps' | 'rpe', value: string) => {
    const key = `${exerciseId}-${setIdx}`;
    setSetInputs(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const completeSet = async (exerciseId: number, setIdx: number) => {
    const key = `${exerciseId}-${setIdx}`;
    const inputs = setInputs[key] || {};
    
    const setData = {
      workoutId: workout.id,
      exerciseId: exerciseId,
      weight: parseFloat(inputs.weight) || 0,
      reps: parseInt(inputs.reps, 10) || 0,
      rpe: parseInt(inputs.rpe, 10) || 7,
    };

    startTransition(async () => {
      await logSetAction(setData);
      setRestTimer(120); // Mock 2-minute rest
      setIsResting(true);
    });
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const handleFinishWorkout = () => {
    startTransition(async () => {
      await finishWorkoutAction(workout.id);
      router.push('/');
    });
  };

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Elapsed Time</p>
            <p className="text-white font-mono text-lg">00:00</p> {/* Placeholder */}
          </div>
        </div>

        {/* Rest Timer */}
        {isResting && (
          <div className="bg-amber-600 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Rest Period</span>
              </div>
              <div className="text-white font-mono text-xl">{formatTime(restTimer)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
              <span className="text-slate-400 text-sm">{exercise.completed}/{exercise.sets} sets</span>
            </div>

            <div className="space-y-3">
              {Array.from({ length: exercise.sets }, (_, setIdx) => {
                const key = `${exercise.id}-${setIdx}`;
                const inputs = setInputs[key] || { weight: '', reps: '', rpe: '' };
                const isCompleted = setIdx < exercise.completed;
                const isCurrent = setIdx === exercise.completed;

                return (
                  <div key={setIdx} className={`flex items-center space-x-3 p-3 rounded-lg ${isCompleted ? 'bg-slate-800' : 'bg-slate-700'}`}>
                    <span className="text-slate-400 font-mono w-8">#{setIdx + 1}</span>
                    <input
                      type="number"
                      placeholder={exercise.weight.toString()}
                      value={inputs.weight}
                      onChange={(e) => handleInputChange(exercise.id, setIdx, 'weight', e.target.value)}
                      disabled={!isCurrent || isPending}
                      className="w-16 bg-slate-600 text-white rounded px-2 py-1 text-center font-mono text-sm disabled:opacity-50"
                    />
                    <span className="text-slate-400 text-sm">lbs</span>
                    <span className="text-slate-400">×</span>
                    <input
                      type="number"
                      placeholder={exercise.reps}
                      value={inputs.reps}
                      onChange={(e) => handleInputChange(exercise.id, setIdx, 'reps', e.target.value)}
                      disabled={!isCurrent || isPending}
                      className="w-12 bg-slate-600 text-white rounded px-2 py-1 text-center font-mono text-sm disabled:opacity-50"
                    />
                    <span className="text-slate-400 text-sm">reps</span>
                    <select
                      value={inputs.rpe}
                      onChange={(e) => handleInputChange(exercise.id, setIdx, 'rpe', e.target.value)}
                      disabled={!isCurrent || isPending}
                      className="bg-slate-600 text-white rounded px-2 py-1 text-sm disabled:opacity-50"
                    >
                      <option value="">RPE</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                    
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-green-400 ml-auto" />
                    ) : isCurrent ? (
                      <button
                        onClick={() => completeSet(exercise.id, setIdx)}
                        disabled={isPending}
                        className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:bg-indigo-400"
                      >
                        {isPending ? '...' : 'Complete'}
                      </button>
                    ) : (
                      <div className="w-5 h-5 ml-auto"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Workout Controls */}
      <div className="fixed bottom-20 left-4 right-4 bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
            <X className="w-5 h-5" />
            <span>End Workout</span>
          </button>
          <button 
            onClick={handleFinishWorkout}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:bg-green-400"
          >
            {isPending ? '...' : 'Finish Workout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutView;
