/* eslint-disable react/no-unescaped-entities */
// app/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type Project } from "@/app/components/projects/ProjectForm";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setError("Failed to load projects. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Update projects list by removing the deleted project
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      setError("Failed to delete project. Please try again.");
      console.error(error);
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case "Web":
        return "bg-blue-100 text-blue-800";
      case "Mobile":
        return "bg-green-100 text-green-800";
      case "Desktop":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Button onClick={() => router.push("/projects/new")}>
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md">
          <p className="text-destructive">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No projects found</CardTitle>
            <CardDescription>
              You haven't created any projects yet. Get started by creating your
              first project.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/projects/new")}>
              Create your first project
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>
              Manage and calculate pricing for your freelance projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent projects.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>{project.clientEmail}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getScopeColor(
                          project.scope
                        )}`}
                      >
                        {project.scope}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(project.startDate), "MMM d")} -{" "}
                      {format(new Date(project.endDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {project.discountedPrice ? (
                        <div>
                          <span className="line-through text-muted-foreground mr-2">
                            ${project.totalPrice?.toFixed(2) ?? "0.00"}
                          </span>
                          <span className="font-bold">
                            ${project.discountedPrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span>${project.totalPrice?.toFixed(2) ?? "0.00"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/projects/${project.id}/edit`)
                          }
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Project
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{project.name}
                                "? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  project.id && handleDelete(project.id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
