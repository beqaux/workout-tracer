'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, Dumbbell, ArrowLeft, Check, X } from 'lucide-react';

interface LoggedExercise {
  id: string;
  sets: number;
  reps: number;
  weight: number | null;
  exerciseTemplate: {
    id: string;
    name: string;
    muscleGroups: {
      id: string;
      name: string;
    }[];
  };
}

interface Workout {
  id: string;
  name: string;
  completed: boolean;
  createdAt: string;
  loggedExercises: LoggedExercise[];
}

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test kullanıcısı ID'si (gerçek projede auth'dan gelecek)
  const TEST_USER_ID = 'test-user-id';

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`/api/workouts?userId=${TEST_USER_ID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data = await response.json();
      setWorkouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalSets = (workout: Workout) => {
    return workout.loggedExercises.reduce((total, exercise) => total + exercise.sets, 0);
  };

  const getUniqueExerciseCount = (workout: Workout) => {
    return workout.loggedExercises.length;
  };

  const getMuscleGroups = (workout: Workout) => {
    const allMuscleGroups = workout.loggedExercises.flatMap(
      exercise => exercise.exerciseTemplate.muscleGroups
    );
    const uniqueGroups = Array.from(
      new Map(allMuscleGroups.map(group => [group.id, group])).values()
    );
    return uniqueGroups;
  };

  const toggleWorkoutCompletion = async (workoutId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update workout');
      }

      // Refresh the workouts list
      fetchWorkouts();
    } catch (err) {
      setError('Failed to update workout completion status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchWorkouts}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workout Dashboard</h1>
            <p className="text-muted-foreground">
              Track your fitness journey and view your workout history
            </p>
          </div>
        </div>
        <Link href="/workout/add">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Workout
          </Button>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No workouts yet</h2>
          <p className="text-muted-foreground mb-6">
            Start your fitness journey by logging your first workout
          </p>
          <Link href="/workout/add">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Log Your First Workout
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <Card key={workout.id} className={`hover:shadow-lg transition-shadow ${workout.completed ? 'bg-green-50 border-green-200' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className={`text-lg flex items-center gap-2 ${workout.completed ? 'text-green-800' : ''}`}>
                      {workout.completed && <Check className="h-4 w-4 text-green-600" />}
                      {workout.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(workout.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={workout.completed ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleWorkoutCompletion(workout.id, !workout.completed)}
                      className={workout.completed ? "bg-green-100 hover:bg-green-200 text-green-800" : ""}
                    >
                      {workout.completed ? (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Undo
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Complete
                        </>
                      )}
                    </Button>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Exercises:</span>
                    <span>{getUniqueExerciseCount(workout)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total Sets:</span>
                    <span>{getTotalSets(workout)}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Muscle Groups:</p>
                    <div className="flex flex-wrap gap-1">
                      {getMuscleGroups(workout).map((group) => (
                        <Badge key={group.id} variant="secondary" className="text-xs">
                          {group.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Exercises:</p>
                    <div className="space-y-1">
                      {workout.loggedExercises.slice(0, 3).map((exercise) => (
                        <div key={exercise.id} className="text-xs text-muted-foreground">
                          {exercise.exerciseTemplate.name}: {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight && ` @ ${exercise.weight}kg`}
                        </div>
                      ))}
                      {workout.loggedExercises.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{workout.loggedExercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 