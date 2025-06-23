import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const muscleGroupName = searchParams.get('muscleGroup');

  try {
    let exercises;
    
    if (muscleGroupName) {
      // Specific muscle group exercises
      exercises = await prisma.exerciseTemplate.findMany({
        where: {
          muscleGroups: {
            some: {
              name: muscleGroupName.toUpperCase(),
            },
          },
        },
        include: {
          muscleGroups: true,
        },
        orderBy: {
          name: 'asc'
        }
      });
    } else {
      // All exercises
      exercises = await prisma.exerciseTemplate.findMany({
        include: {
          muscleGroups: true,
        },
        orderBy: {
          name: 'asc'
        }
      });
    }
    
    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
} 