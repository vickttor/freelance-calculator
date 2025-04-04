// app/api/settings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Find user settings or create defaults if not exists
    let settings = await prisma.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId,
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
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT: Update user settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate input
    const {
      defaultHourlyRate,
      defaultHoursPerDay,
      defaultWorkingDays,
      pixDiscountPercentage,
      currency,
    } = body;

    // Update or create settings
    const settings = await prisma.settings.upsert({
      where: { userId },
      update: {
        defaultHourlyRate,
        defaultHoursPerDay,
        defaultWorkingDays,
        pixDiscountPercentage,
        currency,
      },
      create: {
        userId,
        defaultHourlyRate,
        defaultHoursPerDay,
        defaultWorkingDays,
        pixDiscountPercentage,
        currency,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
