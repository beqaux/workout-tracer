import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell, TrendingUp, Users, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Dumbbell className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Workout Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your fitness journey, log workouts, and monitor your progress 
            with our modern workout tracking application.
          </p>
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                View Dashboard
              </Button>
            </Link>
            <Link href="/workout/add">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Start Workout
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your workout history and see your improvements over time.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Log Workouts</h3>
            <p className="text-gray-600">
              Easily record exercises, sets, reps, and weights for each workout.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Organize by Muscle Groups</h3>
            <p className="text-gray-600">
              Categorize exercises by muscle groups for better workout planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
