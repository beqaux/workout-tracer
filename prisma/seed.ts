import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database started...')

  // Create muscle groups
  const muscleGroups = [
    { name: 'CHEST' },
    { name: 'BACK' },
    { name: 'LEGS' },
    { name: 'SHOULDERS' },
    { name: 'ARMS' },
    { name: 'ABS' },
    { name: 'GLUTES' },
    { name: 'CALVES' },
  ]

  console.log('Creating muscle groups...')
  for (const group of muscleGroups) {
    await prisma.muscleGroup.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    })
  }

  // Create exercise templates
  console.log('Creating exercise templates...')
  
  // Chest exercises
  await prisma.exerciseTemplate.upsert({
    where: { name: 'Bench Press' },
    update: {},
    create: {
      name: 'Bench Press',
      muscleGroups: {
        connect: [{ name: 'CHEST' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Incline Bench Press' },
    update: {},
    create: {
      name: 'Incline Bench Press',
      muscleGroups: {
        connect: [{ name: 'CHEST' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Push Up' },
    update: {},
    create: {
      name: 'Push Up',
      muscleGroups: {
        connect: [{ name: 'CHEST' }]
      }
    }
  })

  // Back exercises
  await prisma.exerciseTemplate.upsert({
    where: { name: 'Deadlift' },
    update: {},
    create: {
      name: 'Deadlift',
      muscleGroups: {
        connect: [{ name: 'BACK' }, { name: 'LEGS' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Pull Up' },
    update: {},
    create: {
      name: 'Pull Up',
      muscleGroups: {
        connect: [{ name: 'BACK' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Bent Over Row' },
    update: {},
    create: {
      name: 'Bent Over Row',
      muscleGroups: {
        connect: [{ name: 'BACK' }]
      }
    }
  })

  // Leg exercises
  await prisma.exerciseTemplate.upsert({
    where: { name: 'Squat' },
    update: {},
    create: {
      name: 'Squat',
      muscleGroups: {
        connect: [{ name: 'LEGS' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Leg Press' },
    update: {},
    create: {
      name: 'Leg Press',
      muscleGroups: {
        connect: [{ name: 'LEGS' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Leg Curl' },
    update: {},
    create: {
      name: 'Leg Curl',
      muscleGroups: {
        connect: [{ name: 'LEGS' }]
      }
    }
  })

  // Shoulder exercises
  await prisma.exerciseTemplate.upsert({
    where: { name: 'Shoulder Press' },
    update: {},
    create: {
      name: 'Shoulder Press',
      muscleGroups: {
        connect: [{ name: 'SHOULDERS' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Lateral Raise' },
    update: {},
    create: {
      name: 'Lateral Raise',
      muscleGroups: {
        connect: [{ name: 'SHOULDERS' }]
      }
    }
  })

  // Arm exercises
  await prisma.exerciseTemplate.upsert({
    where: { name: 'Bicep Curl' },
    update: {},
    create: {
      name: 'Bicep Curl',
      muscleGroups: {
        connect: [{ name: 'ARMS' }]
      }
    }
  })

  await prisma.exerciseTemplate.upsert({
    where: { name: 'Tricep Dips' },
    update: {},
    create: {
      name: 'Tricep Dips',
      muscleGroups: {
        connect: [{ name: 'ARMS' }]
      }
    }
  })

  // Create test user
  console.log('Creating test user...')
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'test@example.com',
    }
  })

  console.log('✅ Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 