// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  workingDays: string[]
): number {
  let totalDays = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (workingDays.includes(dayOfWeek)) {
      totalDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return totalDays;
}

export function calculateProjectPrice(
  hourlyRate: number,
  hoursPerDay: number,
  workingDays: number,
  discountPercentage: number = 0
): {
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
} {
  const basePrice = hourlyRate * hoursPerDay * workingDays;
  const discountAmount = (basePrice * discountPercentage) / 100;
  const finalPrice = basePrice - discountAmount;

  return {
    basePrice,
    discountAmount,
    finalPrice,
  };
}
