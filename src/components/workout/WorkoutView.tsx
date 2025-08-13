'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, Check, X, Play, Pause, Clock } from 'lucide-react';
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
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [setInputs, setSetInputs] = useState<SetInputState>({});
  const [isPending, startTransition] = useTransition();

  // Workout timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkoutTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      setRestTimer(120); // 2-minute rest
      setIsResting(true);
    });
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  // Rest timer effect
  useEffect(() => {
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

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = workout.exercises.reduce((acc, ex) => acc + ex.completed, 0);
  const progress = (completedSets / totalSets) * 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{workout.name}</h1>
              <p className="text-sm text-gray-400">{completedSets}/{totalSets} sets completed</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-gray-400 text-sm mb-1">
                <Clock className="w-4 h-4" />
                <span>Workout time</span>
              </div>
              <p className="text-lg font-mono font-bold">{formatTime(workoutTimer)}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="mx-4 mt-4">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 rounded-full p-2">
                  <Timer className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-orange-100">Rest Period</p>
                  <p className="text-sm text-orange-200">Take your time to recover</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-orange-100">
                  {formatTime(restTimer)}
                </div>
                <button 
                  onClick={skipRest}
                  className="text-xs text-orange-300 hover:text-orange-100 transition-colors"
                >
                  Skip rest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercises */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-32">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            {/* Exercise Header */}
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-100">{exercise.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-700 rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-gray-300">
                      {exercise.completed}/{exercise.sets}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sets */}
            <div className="p-4 space-y-3">
              {Array.from({ length: exercise.sets }, (_, setIdx) => {
                const key = `${exercise.id}-${setIdx}`;
                const inputs = setInputs[key] || { weight: '', reps: '', rpe: '' };
                const isCompleted = setIdx < exercise.completed;
                const isCurrent = setIdx === exercise.completed;

                return (
                  <div 
                    key={setIdx} 
                    className={`relative rounded-lg border transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : isCurrent 
                        ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20' 
                        : 'bg-gray-800/30 border-gray-700'
                    }`}
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Set number */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : setIdx + 1}
                        </div>

                        {/* Inputs */}
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              placeholder={exercise.weight.toString()}
                              value={inputs.weight}
                              onChange={(e) => handleInputChange(exercise.id, setIdx, 'weight', e.target.value)}
                              disabled={!isCurrent || isPending}
                              className="w-16 bg-gray-800 border border-gray-600 rounded-lg px-2 py-2 text-center text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            <span className="text-xs text-gray-400">lbs</span>
                          </div>
                          
                          <span className="text-gray-500">×</span>
                          
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              placeholder={exercise.reps}
                              value={inputs.reps}
                              onChange={(e) => handleInputChange(exercise.id, setIdx, 'reps', e.target.value)}
                              disabled={!isCurrent || isPending}
                              className="w-14 bg-gray-800 border border-gray-600 rounded-lg px-2 py-2 text-center text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            <span className="text-xs text-gray-400">reps</span>
                          </div>

                          <select
                            value={inputs.rpe}
                            onChange={(e) => handleInputChange(exercise.id, setIdx, 'rpe', e.target.value)}
                            disabled={!isCurrent || isPending}
                            className="bg-gray-800 border border-gray-600 rounded-lg px-2 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          >
                            <option value="">RPE</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                          </select>
                        </div>

                        {/* Action button */}
                        {isCurrent && (
                          <button
                            onClick={() => completeSet(exercise.id, setIdx)}
                            disabled={isPending}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                          >
                            {isPending ? '...' : 'Done'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white py-3 px-4 rounded-xl transition-colors border border-gray-700"
            >
              <X className="w-4 h-4" />
              <span className="font-medium">End Early</span>
            </button>
            
            <button 
              onClick={handleFinishWorkout}
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white py-3 px-4 rounded-xl font-semibold transition-all disabled:cursor-not-allowed shadow-lg shadow-green-600/20"
            >
              {isPending ? 'Finishing...' : 'Complete Workout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutView;