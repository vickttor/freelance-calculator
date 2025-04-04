// app/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DAYS_OF_WEEK = [
  { id: "Monday", label: "Monday" },
  { id: "Tuesday", label: "Tuesday" },
  { id: "Wednesday", label: "Wednesday" },
  { id: "Thursday", label: "Thursday" },
  { id: "Friday", label: "Friday" },
  { id: "Saturday", label: "Saturday" },
  { id: "Sunday", label: "Sunday" },
];

const CURRENCIES = [
  { id: "USD", label: "USD - US Dollar" },
  { id: "EUR", label: "EUR - Euro" },
  { id: "GBP", label: "GBP - British Pound" },
  { id: "BRL", label: "BRL - Brazilian Real" },
  { id: "CAD", label: "CAD - Canadian Dollar" },
  { id: "AUD", label: "AUD - Australian Dollar" },
  { id: "JPY", label: "JPY - Japanese Yen" },
  { id: "CNY", label: "CNY - Chinese Yuan" },
];

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    defaultHourlyRate: 50,
    defaultHoursPerDay: 6,
    defaultWorkingDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    pixDiscountPercentage: 20,
    currency: "USD",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/settings");

        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const data = await response.json();
        setSettings(data);
      } catch (error) {
        setError("Failed to load settings. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleWorkingDaysChange = (day: string, checked: string | boolean) => {
    setSettings((prev) => {
      if (checked) {
        return {
          ...prev,
          defaultWorkingDays: [...prev.defaultWorkingDays, day],
        };
      } else {
        return {
          ...prev,
          defaultWorkingDays: prev.defaultWorkingDays.filter((d) => d !== day),
        };
      }
    });
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save settings");
      }

      setIsSaved(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred while saving settings");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="general">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your default project settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isSaved && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <AlertDescription>
                      Settings saved successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultHourlyRate">
                      Default Hourly Rate
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                        {settings.currency}
                      </span>
                      <Input
                        id="defaultHourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.defaultHourlyRate}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultHourlyRate: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="rounded-l-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultHoursPerDay">
                      Default Hours Per Day
                    </Label>
                    <Input
                      id="defaultHoursPerDay"
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={settings.defaultHoursPerDay}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultHoursPerDay: parseFloat(e.target.value) || 0,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="block mb-2">Default Working Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.id}`}
                          checked={settings.defaultWorkingDays.includes(day.id)}
                          onCheckedChange={(checked) =>
                            handleWorkingDaysChange(day.id, checked)
                          }
                          disabled={isLoading}
                        />
                        <Label htmlFor={`day-${day.id}`}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      setSettings({ ...settings, currency: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Saving
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and discounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isSaved && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <AlertDescription>
                      Settings saved successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pixDiscountPercentage">
                    PIX Discount Percentage
                  </Label>
                  <div className="flex">
                    <Input
                      id="pixDiscountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.pixDiscountPercentage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pixDiscountPercentage:
                            parseFloat(e.target.value) || 0,
                        })
                      }
                      className="rounded-r-none"
                      disabled={isLoading}
                    />
                    <span className="inline-flex items-center px-3 bg-muted border border-l-0 border-input rounded-r-md">
                      %
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Discount to apply when clients pay via PIX method.
                  </p>
                </div>

                {/* You can add more payment settings here in the future */}
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Saving
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
