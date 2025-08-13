import { getTemplates } from "@/lib/services/templateService";
import Link from "next/link";

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workout Templates</h1>
        <Link href="/templates/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Template
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Link key={template.id} href={`/templates/${template.id}`} className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{template.name}</h5>
            <p className="font-normal text-gray-700">{template.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
