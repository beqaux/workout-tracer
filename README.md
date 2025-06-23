# Workout Tracker

A modern workout tracking application built with Next.js, Prisma, and PostgreSQL.

## Features

- Track your workouts with exercises, sets, reps, and weights
- Organize exercises by muscle groups
- Exercise templates for consistent tracking
- Modern, responsive UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Database Schema

The application uses a flexible database schema that supports:

- **MuscleGroup**: Organizes exercises by body parts (Chest, Back, Legs, etc.)
- **ExerciseTemplate**: Reusable exercise definitions that can belong to multiple muscle groups
- **User**: User accounts for personalized tracking
- **Workout**: Individual workout sessions
- **LoggedExercise**: Specific exercise records within workouts

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd workout-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update your `.env` file with your database URL:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/workout_tracker"
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Seed the database with initial data:
```bash
npm run db:seed
```

7. Generate Prisma client:
```bash
npm run db:generate
```

8. Start the development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (app)/             # App pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions and Prisma client
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
