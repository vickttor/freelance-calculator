// app/projects/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/app/components/projects/ProjectForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProjectPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }

        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError("Failed to load project. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="w-full h-[600px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-destructive/10 p-4 rounded-md">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <ProjectForm project={project} />
    </div>
  );
}
