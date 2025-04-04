/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";

export interface Project {
  id?: string;
  name: string;
  description?: string;
  clientEmail: string;
  startDate: Date;
  endDate: Date;
  scope: string;
  hourlyRate: number;
  hoursPerDay: number;
  workingDays: string[];
  totalPrice?: number;
  discountedPrice?: number;
  paymentMethod?: string;
  createdAt?: Date;
}

interface CalculatedPrice {
  totalDays: number;
  totalHours: number;
  basePrice: number;
  discountPercentage: number;
  discountedPrice: number;
}

interface UserSettings {
  pixDiscountPercentage: number;
  defaultHourlyRate: number;
  defaultHoursPerDay: number;
  defaultWorkingDays: string[];
}

const DAYS_OF_WEEK = [
  { id: "Monday", label: "Monday" },
  { id: "Tuesday", label: "Tuesday" },
  { id: "Wednesday", label: "Wednesday" },
  { id: "Thursday", label: "Thursday" },
  { id: "Friday", label: "Friday" },
  { id: "Saturday", label: "Saturday" },
  { id: "Sunday", label: "Sunday" },
];

const PAYMENT_METHODS = [
  { id: "pix", label: "PIX" },
  { id: "bankTransfer", label: "Bank Transfer" },
  { id: "creditCard", label: "Credit Card" },
  { id: "other", label: "Other" },
];

export default function ProjectForm({
  project = null,
}: {
  project: Project | null;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] =
    useState<CalculatedPrice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const [formData, setFormData] = useState<Project>({
    name: project?.name || "",
    description: project?.description || "",
    clientEmail: project?.clientEmail || "",
    startDate: project?.startDate ? new Date(project.startDate) : new Date(),
    endDate: project?.endDate
      ? new Date(project.endDate)
      : new Date(new Date().setDate(new Date().getDate() + 30)),
    scope: project?.scope || "Web",
    hourlyRate: project?.hourlyRate || 0,
    hoursPerDay: project?.hoursPerDay || 0,
    workingDays: project?.workingDays || [],
    paymentMethod: project?.paymentMethod || "",
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const settings = await response.json();
          setUserSettings(settings);

          // Pre-fill form with user settings if creating a new project
          if (!project) {
            setFormData((prev) => ({
              ...prev,
              hourlyRate: settings.defaultHourlyRate,
              hoursPerDay: settings.defaultHoursPerDay,
              workingDays: settings.defaultWorkingDays,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    fetchUserSettings();
  }, [project]);

  const calculatePrice = () => {
    setIsLoading(true);

    try {
      // Calculate working days between start and end dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      let totalDays = 0;
      let totalHours = 0;

      // Loop through each day between start and end date
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        if (formData.workingDays.includes(dayOfWeek)) {
          totalDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Calculate total working hours
      totalHours = totalDays * formData.hoursPerDay;

      // Calculate base price
      const basePrice = totalHours * formData.hourlyRate;

      // Apply discount if payment method is PIX
      let discountedPrice = basePrice;
      let discountPercentage = 0;

      if (formData.paymentMethod === "pix" && userSettings) {
        discountPercentage = userSettings.pixDiscountPercentage;
        discountedPrice = basePrice * (1 - discountPercentage / 100);
      }

      setCalculatedPrice({
        totalDays,
        totalHours,
        basePrice,
        discountPercentage,
        discountedPrice,
      });
    } catch (error) {
      console.error("Calculation error:", error);
      setError("Error calculating price. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!calculatedPrice) {
        calculatePrice();
        setIsLoading(false);
        return;
      }

      const projectData = {
        ...formData,
        totalPrice: calculatedPrice.basePrice,
        discountedPrice: calculatedPrice.discountedPrice,
      };

      const response = await fetch("/api/projects", {
        method: project ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...projectData,
          id: project?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save project");
      }

      router.push("/projects");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while saving the project";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleWorkingDaysChange = (day: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, workingDays: [...prev.workingDays, day] };
      } else {
        return {
          ...prev,
          workingDays: prev.workingDays.filter((d) => d !== day),
        };
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "New Project"}</CardTitle>
        <CardDescription>
          {project
            ? "Update your project details and pricing"
            : "Create a new project and calculate pricing"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, clientEmail: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate
                        ? format(formData.startDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date: Date | undefined) =>
                        date && setFormData({ ...formData, startDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate
                        ? format(formData.endDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date: Date | undefined) =>
                        date && setFormData({ ...formData, endDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="scope">Project Scope</Label>
              <Select
                value={formData.scope}
                onValueChange={(value) =>
                  setFormData({ ...formData, scope: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourlyRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="hoursPerDay">Hours Per Day</Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.hoursPerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hoursPerDay: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Working Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.id}`}
                      checked={formData.workingDays.includes(day.id)}
                      onCheckedChange={(checked: boolean) =>
                        handleWorkingDaysChange(day.id, checked)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor={`day-${day.id}`}>{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {calculatedPrice && (
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">
                  Price Calculation
                </h3>
                <div className="space-y-1">
                  <p>Total Working Days: {calculatedPrice.totalDays}</p>
                  <p>Total Hours: {calculatedPrice.totalHours}</p>
                  <p>Base Price: ${calculatedPrice.basePrice.toFixed(2)}</p>
                  {calculatedPrice.discountPercentage > 0 && (
                    <>
                      <p>Discount: {calculatedPrice.discountPercentage}%</p>
                      <p className="font-semibold">
                        Final Price: $
                        {calculatedPrice.discountedPrice.toFixed(2)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <div className="flex space-x-2">
          {!calculatedPrice && (
            <Button type="button" onClick={calculatePrice} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Calculating
                </>
              ) : (
                "Calculate Price"
              )}
            </Button>
          )}

          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : calculatedPrice ? (
              "Save Project"
            ) : (
              "Calculate & Save"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
