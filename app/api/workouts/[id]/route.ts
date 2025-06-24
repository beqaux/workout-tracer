import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch a specific workout
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id: params.id,
      },
      include: {
        loggedExercises: {
          include: {
            exerciseTemplate: {
              include: {
                muscleGroups: true,
              },
            },
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}

// PUT: Update a workout
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // First, delete existing logged exercises
    await prisma.loggedExercise.deleteMany({
      where: {
        workoutId: params.id,
      },
    });

    // Update workout and create new logged exercises
    const updatedWorkout = await prisma.workout.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        loggedExercises: {
          create: data.exercises.map((exercise: any) => ({
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight || null,
            exerciseTemplateId: exercise.exerciseTemplateId,
          })),
        },
      },
      include: {
        loggedExercises: {
          include: {
            exerciseTemplate: {
              include: {
                muscleGroups: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedWorkout);
  } catch (error) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Failed to update workout' },
      { status: 500 }
    );
  }
}

// PATCH: Toggle workout completion status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const updatedWorkout = await prisma.workout.update({
      where: {
        id: params.id,
      },
      data: {
        completed: data.completed,
      },
      include: {
        loggedExercises: {
          include: {
            exerciseTemplate: {
              include: {
                muscleGroups: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedWorkout);
  } catch (error) {
    console.error('Error updating workout completion:', error);
    return NextResponse.json(
      { error: 'Failed to update workout completion' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a workout
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete workout (logged exercises will be deleted due to cascade)
    await prisma.workout.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: 'Workout deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
} 