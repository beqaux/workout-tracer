import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all workouts for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: userId,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// POST: Create a new workout
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.userId || !data.exercises || !Array.isArray(data.exercises)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, userId, exercises' },
        { status: 400 }
      );
    }

    // Create workout with logged exercises
    const newWorkout = await prisma.workout.create({
      data: {
        name: data.name,
        userId: data.userId,
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

    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
} 