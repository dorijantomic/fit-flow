'use client';

import React from 'react';
import { Play, TrendingUp, Award, Target, Clock } from 'lucide-react';

// Define types for the props
interface UserData {
  name: string;
  streak: number;
  weeklyGoal: number;
  completedWorkouts: number;
}

interface Workout {
  name: string;
  estimatedTime: number;
  exercises: {
    name: string;
    sets: number;
    reps: string;
  }[];
}

interface ProgressItem {
  exercise: string;
  current: number;
  change: number;
}

interface RecentWorkout {
  date: string;
  name:string;
  volume: number;
  duration: number;
}

interface DashboardProps {
  user: UserData;
  todayWorkout: Workout;
  progressData: ProgressItem[];
  recentWorkouts: RecentWorkout[];
  startWorkout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  todayWorkout,
  progressData,
  recentWorkouts,
  startWorkout,
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">This Week's Volume</h3>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">42,780 lbs</p>
          <p className="text-green-400 text-sm">+8.2% from last week</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Recovery Score</h3>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">7.4/10</p>
          <p className="text-slate-400 text-sm">Good to train</p>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Today's Workout</h2>
          <span className="text-slate-400 text-sm">{todayWorkout.estimatedTime} min</span>
        </div>
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">{todayWorkout.name}</h3>
        <div className="space-y-2 mb-6">
          {todayWorkout.exercises.slice(0, 3).map((exercise, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-slate-300">{exercise.name}</span>
              <span className="text-slate-400">{exercise.sets}x{exercise.reps}</span>
            </div>
          ))}
          {todayWorkout.exercises.length > 3 && (
            <div className="text-slate-400 text-sm">+{todayWorkout.exercises.length - 3} more exercises</div>
          )}
        </div>
        <button
          onClick={startWorkout}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors"
        >
          <Play className="w-5 h-5" />
          <span>Start Workout</span>
        </button>
      </div>

      {/* Progress Overview */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Progress</h2>
        <div className="space-y-3">
          {progressData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-slate-300">{item.exercise}</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono">{item.current} lbs</span>
                <span className="text-green-400 text-sm">+{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workouts */}
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
                <p className="text-slate-400 text-sm">{workout.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
