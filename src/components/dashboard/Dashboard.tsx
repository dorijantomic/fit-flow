// src/components/dashboard/Dashboard.tsx - Updated with real data integration
'use client';

import React from 'react';
import { Play, TrendingUp, Award, Target, Clock, AlertTriangle, DumbbellIcon } from 'lucide-react';

// Updated interfaces to include real data
interface UserData {
  name: string;
  streak: number;
  weeklyGoal: number;
  completedWorkouts: number;
}

interface Workout {
  id: number | null;
  name: string;
  estimatedTime: number;
  exercises: {
    id: number;
    name: string;
    sets: number;
    reps: string;
    weight?: number;
    completed?: number;
  }[];
}

interface ProgressItem {
  exercise: string;
  current: number;
  previous: number;
  change: number;
}

interface RecentWorkout {
  date: string;
  name: string;
  volume: number;
  duration: number;
}

interface WeeklyStats {
  completedWorkouts: number;
  totalVolume: number;
  avgDuration: number;
  volumeChange: number;
}

interface DashboardProps {
  user: UserData;
  todayWorkout: Workout;
  progressData: ProgressItem[];
  recentWorkouts: RecentWorkout[];
  weeklyStats: WeeklyStats;
  startWorkout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  todayWorkout,
  progressData,
  recentWorkouts,
  weeklyStats,
  startWorkout,
}) => {
  // Calculate recovery score (mock for now - would come from user input)
  const mockRecoveryScore = 7.4;
  const recoveryStatus = mockRecoveryScore >= 8 ? 'Excellent' : 
                        mockRecoveryScore >= 6 ? 'Good to train' : 
                        'Consider rest';
  
  const recoveryColor = mockRecoveryScore >= 8 ? 'text-green-400' : 
                       mockRecoveryScore >= 6 ? 'text-amber-400' : 
                       'text-red-400';

  return (
    <div className="space-y-6">
      {/* Welcome Section with Real Streak Data */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-indigo-100 mb-4">Ready to crush your goals today?</p>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">{user.streak} day streak</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-400" />
            <span>{user.completedWorkouts}/{user.weeklyGoal} workouts this week</span>
          </div>
        </div>
      </div>

      {/* Real Weekly Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">This Week's Volume</h3>
            <TrendingUp className={`w-4 h-4 ${weeklyStats.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <p className="text-2xl font-bold text-white">{weeklyStats.totalVolume.toLocaleString()} lbs</p>
          {weeklyStats.volumeChange !== 0 && (
            <p className={`text-sm ${weeklyStats.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {weeklyStats.volumeChange >= 0 ? '+' : ''}{weeklyStats.volumeChange}% from last week
            </p>
          )}
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Recovery Score</h3>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mockRecoveryScore}/10</p>
          <p className={`text-sm ${recoveryColor}`}>{recoveryStatus}</p>
        </div>
      </div>

      {/* Today's Workout with Real Data */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Today's Workout</h2>
          {todayWorkout.estimatedTime > 0 && (
            <span className="text-slate-400 text-sm">{todayWorkout.estimatedTime} min</span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">{todayWorkout.name}</h3>
        
        {todayWorkout.exercises.length > 0 ? (
          <>
            <div className="space-y-2 mb-6">
              {todayWorkout.exercises.slice(0, 4).map((exercise, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-300">{exercise.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">{exercise.sets}x{exercise.reps}</span>
                    {exercise.completed !== undefined && exercise.completed > 0 && (
                      <span className="text-green-400 text-xs">
                        ({exercise.completed}/{exercise.sets})
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {todayWorkout.exercises.length > 4 && (
                <div className="text-slate-400 text-sm">+{todayWorkout.exercises.length - 4} more exercises</div>
              )}
            </div>
            
            <button
              onClick={startWorkout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>{todayWorkout.id ? 'Continue Workout' : 'Start Workout'}</span>
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No workout templates found</p>
            <button
              onClick={() => window.location.href = '/templates/create'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Create Your First Template
            </button>
          </div>
        )}
      </div>

      {/* Real Progress Overview */}
      {progressData.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Progress</h2>
          <div className="space-y-3">
            {progressData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-slate-300">{item.exercise}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-mono">{item.current} lbs</span>
                  {item.change !== 0 && (
                    <span className={`text-sm ${item.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change > 0 ? '+' : ''}{item.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Recent Workouts */}
      {recentWorkouts.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Workouts</h2>
          <div className="space-y-3">
            {recentWorkouts.map((workout, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-slate-300 font-medium">{workout.name}</p>
                  <p className="text-slate-400 text-sm">{workout.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono text-sm">{workout.volume.toLocaleString()} lbs</p>
                  {workout.duration > 0 && (
                    <p className="text-slate-400 text-sm">{workout.duration} min</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for New Users */}
      {recentWorkouts.length === 0 && progressData.length === 0 && (
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <DumbbellIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Ready to Start Your Journey?</h3>
          <p className="text-slate-400 mb-4">Complete your first workout to see your progress here</p>
          {todayWorkout.exercises.length > 0 && (
            <button
              onClick={startWorkout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Start First Workout
            </button>
          )}
        </div>
      )}

      {/* Weekly Summary Card */}
      {weeklyStats.completedWorkouts > 0 && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">This Week's Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Average Duration</p>
              <p className="text-white font-mono text-lg">{weeklyStats.avgDuration} min</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Weekly Goal Progress</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (user.completedWorkouts / user.weeklyGoal) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-slate-400 text-sm">
                  {Math.round((user.completedWorkouts / user.weeklyGoal) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;