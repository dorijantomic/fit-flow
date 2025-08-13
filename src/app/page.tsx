// src/app/page.tsx - Updated to use real data
import { logoutAction } from "@/lib/auth-actions";
import Dashboard from "@/components/dashboard/Dashboard";
import { getDashboardDataAction } from "@/lib/services/performanceService";
import { Dumbbell, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { createWorkoutAction } from "@/lib/data/workout.dao";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function Home() {
  const dashboardData = await getDashboardDataAction();

  if (!dashboardData) {
    // This could happen if the session is invalid or user is not found.
    redirect('/auth/login');
  }

  const { user, todayWorkout, progressData, recentWorkouts, weeklyStats } = dashboardData;

  const startWorkout = async () => {
    'use server';
    
    if (todayWorkout.id) {
      redirect(`/workout/${todayWorkout.id}`);
    } else {
      // If there's no workout for today, create a new one from a default template.
      // First, check if user has any templates
      const session = await getSession();
      if (!session) {
        redirect('/auth/login');
      }
      
      const defaultTemplate = await prisma.workoutTemplate.findFirst({
        where: { userId: session.sub },
      });

      if (defaultTemplate) {
        const newWorkout = await createWorkoutAction(defaultTemplate.id);
        redirect(`/workout/${newWorkout.id}`);
      } else {
        // No templates exist, redirect to template creation
        redirect('/templates/create');
      }
    }
  };

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
          <div className="flex items-center space-x-4">
            <p>Welcome, {user.name}</p>
            <form action={logoutAction}>
              <button type="submit" className="p-2 rounded-md hover:bg-slate-700">
                <Settings className="w-6 h-6 text-slate-400" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <Dashboard
          user={user}
          todayWorkout={todayWorkout}
          progressData={progressData}
          recentWorkouts={recentWorkouts}
          weeklyStats={weeklyStats}
          startWorkout={startWorkout}
        />
      </div>
    </div>
  );
}
