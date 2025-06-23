import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const muscleGroups = await prisma.muscleGroup.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(muscleGroups);
  } catch (error) {
    console.error('Error fetching muscle groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch muscle groups' },
      { status: 500 }
    );
  }
} 