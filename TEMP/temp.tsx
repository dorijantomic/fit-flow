
import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, TrendingUp, Calendar, Target, Clock, Award, ChevronRight, Settings, User, BarChart3, Dumbbell, Timer, Check, X } from 'lucide-react';

const FitFlowApp = () => {
const [activeTab, setActiveTab] = useState('dashboard');
const [currentWorkout, setCurrentWorkout] = useState(null);
const [restTimer, setRestTimer] = useState(0);
const [isResting, setIsResting] = useState(false);

// Mock data
const user = {
name: "Alex Chen",
streak: 12,
weeklyGoal: 4,
completedWorkouts: 3,
currentProgram: "Upper/Lower Split"
};

const todayWorkout = {
name: "Upper Body Strength",
exercises: [
{ id: 1, name: "Bench Press", sets: 4, reps: "6-8", weight: 185, completed: 0, rpe: null },
{ id: 2, name: "Bent-Over Row", sets: 4, reps: "6-8", weight: 165, completed: 0, rpe: null },
{ id: 3, name: "Overhead Press", sets: 3, reps: "8-10", weight: 115, completed: 0, rpe: null },
{ id: 4, name: "Pull-ups", sets: 3, reps: "8-12", weight: "BW", completed: 0, rpe: null }
],
estimatedTime: 65
};

const recentWorkouts = [
{ date: "2025-08-10", name: "Lower Body Power", volume: 12450, duration: 58 },
{ date: "2025-08-08", name: "Upper Body Hypertrophy", volume: 8920, duration: 72 },
{ date: "2025-08-06", name: "Lower Body Strength", volume: 15300, duration: 68 }
];

const progressData = [
{ exercise: "Bench Press", current: 185, previous: 180, change: +5 },
{ exercise: "Squat", current: 245, previous: 240, change: +5 },
{ exercise: "Deadlift", current: 315, previous: 310, change: +5 }
];

// Timer effect
useEffect(() => {
let interval;
if (isResting && restTimer > 0) {
interval = setInterval(() => {
setRestTimer(prev => prev - 1);
}, 1000);
} else if (restTimer === 0) {
setIsResting(false);
}
return () => clearInterval(interval);
}, [isResting, restTimer]);

const startWorkout = () => {
setCurrentWorkout({...todayWorkout});
setActiveTab('workout');
};

const completeSet = (exerciseId, setNumber) => {
setCurrentWorkout(prev => ({
...prev,
exercises: prev.exercises.map(ex =>
[ex.id](http://ex.id/) === exerciseId
? { ...ex, completed: ex.completed + 1 }
: ex
)
}));
setRestTimer(120); // 2 minute rest
setIsResting(true);
};

const formatTime = (seconds) => {
const mins = Math.floor(seconds / 60);
const secs = seconds % 60;
return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Dashboard = () => (
<div className="space-y-6">
{/* Welcome Section */}
<div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
<h1 className="text-2xl font-bold mb-2">Welcome back, {[user.name](http://user.name/)}!</h1>
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

```
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

```

);

const WorkoutView = () => (
<div className="space-y-6">
{/* Workout Header */}
<div className="bg-slate-800 rounded-xl p-6">
<div className="flex items-center justify-between mb-4">
<h1 className="text-2xl font-bold text-white">{[currentWorkout.name](http://currentworkout.name/)}</h1>
<div className="flex items-center space-x-4">
<div className="text-right">
<p className="text-slate-400 text-sm">Elapsed Time</p>
<p className="text-white font-mono text-lg">28:45</p>
</div>
</div>
</div>

```
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
    {currentWorkout.exercises.map((exercise, idx) => (
      <div key={exercise.id} className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
          <span className="text-slate-400 text-sm">{exercise.completed}/{exercise.sets} sets</span>
        </div>

        {/* Previous Best */}
        <div className="bg-slate-700 rounded-lg p-3 mb-4">
          <p className="text-slate-400 text-sm mb-1">Previous Best</p>
          <p className="text-white font-mono">4 × 8 @ {exercise.weight} lbs | RPE 7</p>
        </div>

        {/* Set Logging */}
        <div className="space-y-3">
          {Array.from({length: exercise.sets}, (_, setIdx) => (
            <div key={setIdx} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
              <span className="text-slate-400 font-mono w-8">#{setIdx + 1}</span>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder={exercise.weight.toString()}
                  className="w-16 bg-slate-600 text-white rounded px-2 py-1 text-center font-mono text-sm"
                />
                <span className="text-slate-400 text-sm">lbs</span>
              </div>

              <span className="text-slate-400">×</span>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="8"
                  className="w-12 bg-slate-600 text-white rounded px-2 py-1 text-center font-mono text-sm"
                />
                <span className="text-slate-400 text-sm">reps</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm">RPE</span>
                <select className="bg-slate-600 text-white rounded px-2 py-1 text-sm">
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
              </div>

              {setIdx < exercise.completed ? (
                <Check className="w-5 h-5 text-green-400 ml-auto" />
              ) : setIdx === exercise.completed ? (
                <button
                  onClick={() => completeSet(exercise.id, setIdx + 1)}
                  className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Complete
                </button>
              ) : (
                <div className="w-5 h-5 ml-auto"></div>
              )}
            </div>
          ))}
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
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
        Finish Workout
      </button>
    </div>
  </div>
</div>

```

);

const AnalyticsView = () => (
<div className="space-y-6">
<div className="bg-slate-800 rounded-xl p-6">
<h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>

```
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-slate-400 text-sm mb-2">Total Volume (30 days)</h3>
        <p className="text-2xl font-bold text-white">187,450 lbs</p>
        <p className="text-green-400 text-sm">+12.3% vs last month</p>
      </div>
      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-slate-400 text-sm mb-2">Avg Workout Duration</h3>
        <p className="text-2xl font-bold text-white">64 min</p>
        <p className="text-slate-400 text-sm">2 min faster</p>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Strength Progress</h3>
      {progressData.map((item, idx) => (
        <div key={idx} className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">{item.exercise}</span>
            <span className="text-green-400">+{item.change} lbs</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
              style={{width: `${(item.current / 350) * 100}%`}}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-slate-400 mt-1">
            <span>{item.previous} lbs</span>
            <span>{item.current} lbs</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

```

);

const ProfileView = () => (
<div className="space-y-6">
<div className="bg-slate-800 rounded-xl p-6">
<h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

```
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xl font-bold">AC</span>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">{user.name}</h2>
        <p className="text-slate-400">Premium Member</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Current Program</h3>
        <p className="text-slate-400">{user.currentProgram}</p>
      </div>

      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Goals</h3>
        <p className="text-slate-400">Increase strength & build muscle</p>
      </div>

      <div className="bg-slate-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">Experience Level</h3>
        <p className="text-slate-400">Intermediate (2.5 years)</p>
      </div>
    </div>
  </div>
</div>

```

);

return (
<div className="min-h-screen bg-slate-900 text-white">
{/* Header */}
<div className="bg-slate-800 border-b border-slate-700 p-4">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-3">
<div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
<Dumbbell className="w-5 h-5 text-white" />
</div>
<h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
FitFlow Pro
</h1>
</div>
<Settings className="w-6 h-6 text-slate-400" />
</div>
</div>

```
  {/* Content */}
  <div className="p-4 pb-24">
    {activeTab === 'dashboard' && <Dashboard />}
    {activeTab === 'workout' && currentWorkout && <WorkoutView />}
    {activeTab === 'analytics' && <AnalyticsView />}
    {activeTab === 'profile' && <ProfileView />}
  </div>

  {/* Bottom Navigation */}
  <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4">
    <div className="flex items-center justify-around">
      {[
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
        { id: 'workout', icon: Dumbbell, label: 'Workout' },
        { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
        { id: 'profile', icon: User, label: 'Profile' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'text-indigo-400 bg-indigo-600/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  </div>
</div>

```

);
};

export default FitFlowApp;