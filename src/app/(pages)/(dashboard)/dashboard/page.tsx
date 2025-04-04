/* eslint-disable react/no-unescaped-entities */
// app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { format } from "date-fns";
import { Calendar, ClipboardList, DollarSign } from "lucide-react";
import { type Project } from "@/app/components/projects/ProjectForm";

interface Settings {
  defaultHourlyRate: number;
  defaultHoursPerDay: number;
  defaultWorkingDays: string[];
  pixDiscountPercentage: number;
  currency: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
    averageProjectValue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsResponse = await fetch("/api/projects");
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        // Fetch settings
        const settingsResponse = await fetch("/api/settings");
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);

        // Calculate statistics
        const now = new Date();
        const activeProjects = projectsData.filter(
          (project: Project) => new Date(project.endDate) >= now
        );
        const completedProjects = projectsData.filter(
          (project: Project) => new Date(project.endDate) < now
        );

        const totalEarnings = projectsData.reduce(
          (sum: number, project: Project) =>
            sum + (project.discountedPrice || project.totalPrice || 0),
          0
        );

        setStats({
          totalProjects: projectsData.length,
          activeProjects: activeProjects.length,
          completedProjects: completedProjects.length,
          totalEarnings,
          averageProjectValue:
            projectsData.length > 0 ? totalEarnings / projectsData.length : 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get recent projects (up to 5)
  const recentProjects = projects
    .sort((a, b) => {
      const dateA = a.createdAt || a.startDate;
      const dateB = b.createdAt || b.startDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || "there"}! Here's an overview of
          your freelance projects.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active, {stats.completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalEarnings, settings?.currency || "USD")}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Project Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                stats.averageProjectValue,
                settings?.currency || "USD"
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per project</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                settings?.defaultHourlyRate || 0,
                settings?.currency || "USD"
              )}
            </div>
            <p className="text-xs text-muted-foreground">Default rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Recent Projects</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/projects")}
          >
            View all
          </Button>
        </div>

        {recentProjects.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                You haven't created any projects. Start by creating your first
                project!
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/projects/new")}>
                Create Project
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <Link href={`/projects/${project.id}/edit`} key={project.id}>
                <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="truncate ml-2">
                          {project.clientEmail}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeline:</span>
                        <span>
                          {format(new Date(project.startDate), "MMM d")} -{" "}
                          {format(new Date(project.endDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>
                          {formatCurrency(
                            project.discountedPrice || project.totalPrice || 0,
                            settings?.currency || "USD"
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-medium">Quick Actions</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button
            onClick={() => router.push("/projects/new")}
            className="h-auto py-4 justify-start"
          >
            <div className="flex flex-col items-start">
              <span className="text-lg">Create New Project</span>
              <span className="text-xs text-muted-foreground">
                Start a new freelance project
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/settings")}
            className="h-auto py-4 justify-start"
          >
            <div className="flex flex-col items-start">
              <span className="text-lg">Settings</span>
              <span className="text-xs text-muted-foreground">
                Update your preferences
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
