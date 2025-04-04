// app/projects/new/page.tsx
import ProjectForm from "@/app/components/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-10">
      <ProjectForm project={null} />
    </div>
  );
}
