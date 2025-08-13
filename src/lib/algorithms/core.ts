// src/lib/algorithms/core.ts
// Core "black box" module for scientific calculations

export interface WorkoutSet {
  id: number;
  weight: number;
  reps: number;
  rpe: number;
  exerciseId: number;
  completedAt: Date;
}

export interface ExercisePerformance {
  exerciseId: number;
  exerciseName: string;
  sets: WorkoutSet[];
  previousMax: number;
  currentEstimated1RM: number;
}

export interface ProgressionRecommendation {
  exerciseId: number;
  action: 'increase_weight' | 'increase_reps' | 'maintain' | 'deload';
  newWeight?: number;
  newReps?: number;
  reasoning: string;
  confidence: number; // 0-1
}

export interface RecoveryMetrics {
  score: number; // 1-10
  factors: {
    sleep: number;
    stress: number;
    soreness: number;
    motivation: number;
  };
  recommendation: 'full_intensity' | 'reduced_intensity' | 'rest_day';
}

// Core Scientific Algorithms Module - This is the "black box" core
export class ScientificAlgorithms {
  
  /**
   * Calculate 1RM using multiple formulas for accuracy
   * Inputs are abstracted - consumers don't need to know the formulas used
   */
  static estimate1RM(weight: number, reps: number): number {
    if (reps === 1) return weight;
    if (reps > 15) return weight; // Not reliable for high reps
    
    // Multiple formula approach for accuracy
    const epley = weight * (1 + reps / 30);
    const brzycki = weight * (36 / (37 - reps));
    const lombardi = weight * Math.pow(reps, 0.10);
    
    // Weighted average (Epley is most common, but Brzycki better for higher reps)
    const weightedAverage = reps <= 6 
      ? (epley * 0.5 + brzycki * 0.3 + lombardi * 0.2)
      : (epley * 0.3 + brzycki * 0.5 + lombardi * 0.2);
    
    return Math.round(weightedAverage * 100) / 100;
  }

  /**
   * Calculate training volume for a set or collection of sets
   */
  static calculateVolume(sets: WorkoutSet[]): {
    totalVolume: number;
    intensityLoad: number;
    setVolume: number;
    averageIntensity: number;
  } {
    const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    const intensityLoad = sets.reduce((sum, set) => sum + (set.weight * set.reps * (set.rpe || 7)), 0);
    const setVolume = sets.length;
    
    // Calculate average relative intensity (requires 1RM estimates)
    const avgWeight = sets.reduce((sum, set) => sum + set.weight, 0) / sets.length;
    const avgReps = sets.reduce((sum, set) => sum + set.reps, 0) / sets.length;
    const estimated1RM = this.estimate1RM(avgWeight, avgReps);
    const averageIntensity = (avgWeight / estimated1RM) * 100;

    return {
      totalVolume,
      intensityLoad,
      setVolume,
      averageIntensity: Math.round(averageIntensity * 100) / 100
    };
  }

  /**
   * Auto-progression algorithm - the core "intelligence" of the app
   */
  static calculateProgression(
    exercisePerformance: ExercisePerformance,
    sessionHistory: WorkoutSet[][]
  ): ProgressionRecommendation {
    const lastSession = sessionHistory[0] || [];
    const previousSession = sessionHistory[1] || [];
    
    if (lastSession.length === 0) {
      return {
        exerciseId: exercisePerformance.exerciseId,
        action: 'maintain',
        reasoning: 'No recent performance data',
        confidence: 0.1
      };
    }

    // Calculate session metrics
    const avgRPE = lastSession.reduce((sum, set) => sum + (set.rpe || 7), 0) / lastSession.length;
    const targetSetsCompleted = lastSession.length;
    const avgWeight = lastSession.reduce((sum, set) => sum + set.weight, 0) / lastSession.length;
    const avgReps = lastSession.reduce((sum, set) => sum + set.reps, 0) / lastSession.length;
    
    // Calculate completion rate (did they hit their target reps?)
    const targetReps = Math.max(...lastSession.map(s => s.reps)); // Assume first set was target
    const completionRate = lastSession.filter(s => s.reps >= targetReps * 0.9).length / lastSession.length;

    // Progressive overload decision tree
    if (avgRPE <= 7 && completionRate >= 0.8) {
      // Easy session, increase weight
      const increment = avgWeight < 135 ? 2.5 : 5; // Smaller jumps for lighter weights
      return {
        exerciseId: exercisePerformance.exerciseId,
        action: 'increase_weight',
        newWeight: avgWeight + increment,
        reasoning: `Low RPE (${avgRPE.toFixed(1)}) and high completion rate (${(completionRate * 100).toFixed(0)}%) indicate readiness for weight increase`,
        confidence: 0.85
      };
    }
    
    if (avgRPE <= 8 && completionRate >= 0.7) {
      // Moderate session, increase reps first
      return {
        exerciseId: exercisePerformance.exerciseId,
        action: 'increase_reps',
        newReps: Math.ceil(avgReps) + 1,
        reasoning: `Moderate RPE (${avgRPE.toFixed(1)}) suggests adding volume before weight`,
        confidence: 0.75
      };
    }
    
    if (avgRPE >= 9 || completionRate < 0.6) {
      // Hard session or poor completion, check for deload need
      const recentSessions = sessionHistory.slice(0, 3);
      const hardSessionCount = recentSessions.filter(session => {
        const sessionRPE = session.reduce((sum, set) => sum + (set.rpe || 7), 0) / session.length;
        return sessionRPE >= 8.5;
      }).length;

      if (hardSessionCount >= 2) {
        // Multiple hard sessions = deload
        return {
          exerciseId: exercisePerformance.exerciseId,
          action: 'deload',
          newWeight: avgWeight * 0.9, // 10% deload
          reasoning: `${hardSessionCount} consecutive hard sessions indicate need for deload`,
          confidence: 0.9
        };
      }
    }

    // Default: maintain current load
    return {
      exerciseId: exercisePerformance.exerciseId,
      action: 'maintain',
      reasoning: `Performance metrics suggest maintaining current load (RPE: ${avgRPE.toFixed(1)}, Completion: ${(completionRate * 100).toFixed(0)}%)`,
      confidence: 0.6
    };
  }

  /**
   * Recovery scoring algorithm
   */
  static calculateRecoveryScore(metrics: {
    sleepHours: number;
    stressLevel: number; // 1-10 (higher = more stressed)
    musclesoreness: number; // 1-10 (higher = more sore)
    motivationLevel: number; // 1-10 (higher = more motivated)
  }): RecoveryMetrics {
    
    // Convert sleep to 0-10 scale
    const sleepScore = Math.min(10, Math.max(0, (metrics.sleepHours / 8) * 10));
    
    // Invert stress and soreness (lower is better)
    const stressScore = 11 - metrics.stressLevel;
    const sorenessScore = 11 - metrics.musclesoreness;
    
    // Motivation is already correctly scaled
    const motivationScore = metrics.motivationLevel;

    // Weighted average (sleep and stress are most important)
    const recoveryScore = (
      sleepScore * 0.35 +
      stressScore * 0.35 +
      sorenessScore * 0.20 +
      motivationScore * 0.10
    );

    let recommendation: 'full_intensity' | 'reduced_intensity' | 'rest_day';
    
    if (recoveryScore >= 8) {
      recommendation = 'full_intensity';
    } else if (recoveryScore >= 6) {
      recommendation = 'reduced_intensity';
    } else {
      recommendation = 'rest_day';
    }

    return {
      score: Math.round(recoveryScore * 10) / 10,
      factors: {
        sleep: Math.round(sleepScore * 10) / 10,
        stress: Math.round(stressScore * 10) / 10,
        soreness: Math.round(sorenessScore * 10) / 10,
        motivation: motivationScore
      },
      recommendation
    };
  }

  /**
   * Detect if user needs a deload based on performance trends
   */
  static detectDeloadNeed(recentSessions: WorkoutSet[][], windowDays: number = 14): {
    needsDeload: boolean;
    reason: string;
    severity: 'mild' | 'moderate' | 'severe';
  } {
    if (recentSessions.length < 3) {
      return { needsDeload: false, reason: 'Insufficient data', severity: 'mild' };
    }

    // Calculate performance trend
    const sessionVolumes = recentSessions.map(session => 
      this.calculateVolume(session).totalVolume
    );
    
    const sessionRPEs = recentSessions.map(session =>
      session.reduce((sum, set) => sum + (set.rpe || 7), 0) / session.length
    );

    // Check for volume decline
    const recentVolume = sessionVolumes.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
    const olderVolume = sessionVolumes.slice(-2).reduce((a, b) => a + b, 0) / 2;
    const volumeDecline = ((olderVolume - recentVolume) / olderVolume) * 100;

    // Check for consistently high RPE
    const avgRecentRPE = sessionRPEs.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const highRPESessions = sessionRPEs.filter(rpe => rpe >= 8.5).length;

    // Deload triggers
    if (volumeDecline > 15 && avgRecentRPE > 8) {
      return {
        needsDeload: true,
        reason: `Volume declined ${volumeDecline.toFixed(1)}% with high RPE (${avgRecentRPE.toFixed(1)})`,
        severity: 'severe'
      };
    }
    
    if (highRPESessions >= 3) {
      return {
        needsDeload: true,
        reason: `${highRPESessions} consecutive high-RPE sessions`,
        severity: 'moderate'
      };
    }
    
    if (avgRecentRPE > 8.5) {
      return {
        needsDeload: true,
        reason: `Consistently high RPE (${avgRecentRPE.toFixed(1)})`,
        severity: 'mild'
      };
    }

    return { needsDeload: false, reason: 'Performance within normal range', severity: 'mild' };
  }
}