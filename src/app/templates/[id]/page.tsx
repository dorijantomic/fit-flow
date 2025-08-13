import { getTemplateById } from "@/lib/services/templateService";
import Link from "next/link";

export default async function TemplateDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return <div>Invalid Template ID</div>;
  }

  const template = await getTemplateById(id);

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{template.name}</h1>
        <div>
          <Link href={`/templates/${template.id}/edit`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
            Edit
          </Link>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </div>
      </div>
      <p className="text-lg text-gray-600 mb-6">{template.description}</p>
      
      <h2 className="text-2xl font-bold mb-4">Exercises</h2>
      <div className="space-y-4">
        {template.templateExercises.map((exercise) => (
          <div key={exercise.id} className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold">{exercise.exercise.name}</h3>
            <p>Sets: {exercise.sets}</p>
            <p>Reps: {exercise.reps}</p>
            <p>Rest: {exercise.rest} seconds</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Start Workout
        </button>
      </div>
    </div>
  );
}
