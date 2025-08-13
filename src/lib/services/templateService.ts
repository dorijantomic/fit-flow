import { getWorkoutTemplates, createWorkoutTemplate, getWorkoutTemplateById, updateWorkoutTemplate, deleteWorkoutTemplate } from "@/lib/data/workoutTemplate.dao";

export async function getTemplates() {
  return await getWorkoutTemplates();
}

export async function getTemplateById(id: number) {
  return await getWorkoutTemplateById(id);
}

export async function createTemplate(data: { name: string; description?: string; userId: string }) {
  return await createWorkoutTemplate(data);
}

export async function updateTemplate(id: number, data: any) {
  return await updateWorkoutTemplate(id, data);
}

export async function deleteTemplate(id: number) {
  return await deleteWorkoutTemplate(id);
}

// Placeholder for progression function
export async function getProgression(templateId: number) {
  // TODO: Implement progression logic
  console.log(`Getting progression for template ${templateId}`);
  return { recommendation: "Increase weight by 2.5kg" };
}
