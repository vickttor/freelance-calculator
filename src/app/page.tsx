// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">Freelance Calculator</div>
          <div className="space-x-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 md:p-16 flex items-center justify-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Calculate Your Freelance Project Pricing
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Streamline your freelance business with our project pricing
              calculator. Set custom rates, working hours, and get automatic
              discounts for preferred payment methods.
            </p>
            <div className="space-x-4">
              <Link href="/auth/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-primary p-8 md:p-16 flex items-center justify-center text-primary-foreground">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-6">Features</h2>
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground text-primary">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Project Management</h3>
                  <p className="text-primary-foreground/80">
                    Create and manage all your freelance projects in one place
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground text-primary">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Accurate Pricing</h3>
                  <p className="text-primary-foreground/80">
                    Calculate project costs based on your schedule and hourly
                    rate
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground text-primary">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Payment Discounts</h3>
                  <p className="text-primary-foreground/80">
                    Offer configurable discounts for preferred payment methods
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-4 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground text-primary">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-xl">Client Management</h3>
                  <p className="text-primary-foreground/80">
                    Keep track of client information and project history
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Freelance Calculator. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
