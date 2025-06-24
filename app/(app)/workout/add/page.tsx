'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface MuscleGroup {
  id: string;
  name: string;
}

interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
}

interface ExerciseEntry {
  id: string; // temporary ID for UI
  exerciseTemplateId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number | null;
}

export default function AddWorkout() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState('');
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for new exercise
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [weight, setWeight] = useState<string>('');

  // Test kullanıcısı ID'si
  const TEST_USER_ID = 'test-user-id';

  useEffect(() => {
    fetchMuscleGroups();
  }, []);

  useEffect(() => {
    if (selectedMuscleGroup) {
      fetchExercises(selectedMuscleGroup);
    }
  }, [selectedMuscleGroup]);

  const fetchMuscleGroups = async () => {
    try {
      const response = await fetch('/api/muscle-groups');
      if (!response.ok) throw new Error('Failed to fetch muscle groups');
      const data = await response.json();
      setMuscleGroups(data);
    } catch (err) {
      setError('Failed to load muscle groups');
    }
  };

  const fetchExercises = async (muscleGroupName: string) => {
    try {
      const response = await fetch(`/api/exercises?muscleGroup=${muscleGroupName}`);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json();
      setExercises(data);
    } catch (err) {
      setError('Failed to load exercises');
    }
  };

  const addExercise = () => {
    if (!selectedExercise) return;

    const exercise = exercises.find(ex => ex.id === selectedExercise);
    if (!exercise) return;

    const newEntry: ExerciseEntry = {
      id: Date.now().toString(), // temporary ID
      exerciseTemplateId: selectedExercise,
      exerciseName: exercise.name,
      sets,
      reps,
      weight: weight ? parseFloat(weight) : null,
    };

    setExerciseEntries([...exerciseEntries, newEntry]);
    
    // Reset form
    setSelectedExercise('');
    setSets(3);
    setReps(10);
    setWeight('');
  };

  const removeExercise = (id: string) => {
    setExerciseEntries(exerciseEntries.filter(entry => entry.id !== id));
  };

  const saveWorkout = async () => {
    if (!workoutName.trim() || exerciseEntries.length === 0) {
      setError('Please provide a workout name and add at least one exercise');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const workoutData = {
        name: workoutName,
        userId: TEST_USER_ID,
        exercises: exerciseEntries.map(entry => ({
          exerciseTemplateId: entry.exerciseTemplateId,
          sets: entry.sets,
          reps: entry.reps,
          weight: entry.weight,
        })),
      };

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      // Success! Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Workout</h1>
          <p className="text-muted-foreground">
            Log your exercises, sets, reps, and weights
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workoutName">Workout Name</Label>
                <Input
                  id="workoutName"
                  placeholder="e.g., Push Day, Leg Day, Full Body"
                  value={workoutName}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkoutName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Exercise</CardTitle>
              <CardDescription>
                Select a muscle group and exercise, then specify sets, reps, and weight
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Muscle Group</Label>
                <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map((group) => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedMuscleGroup && (
                <div>
                  <Label>Exercise</Label>
                  <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map((exercise) => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    value={sets}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSets(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    value={reps}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReps(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.5"
                    placeholder="Optional"
                    value={weight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={addExercise}
                disabled={!selectedExercise}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Exercise List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Workout Summary</CardTitle>
              <CardDescription>
                {exerciseEntries.length} exercise(s) added
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exerciseEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No exercises added yet. Start by selecting a muscle group and exercise.
                </div>
              ) : (
                <div className="space-y-3">
                  {exerciseEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{entry.exerciseName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.sets} sets × {entry.reps} reps
                          {entry.weight && ` @ ${entry.weight}kg`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExercise(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {exerciseEntries.length > 0 && (
                <Button
                  onClick={saveWorkout}
                  disabled={loading || !workoutName.trim()}
                  className="w-full mt-6"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Workout'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 