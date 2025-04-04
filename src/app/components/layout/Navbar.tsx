// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { Icons } from "@/components/icons";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-950 border-b fixed w-full z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold mr-8">
              Freelance Calculator
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <NavLink href="/dashboard" current={pathname === "/dashboard"}>
                Dashboard
              </NavLink>
              <NavLink
                href="/projects"
                current={pathname.startsWith("/projects")}
              >
                Projects
              </NavLink>
              <NavLink
                href="/settings"
                current={pathname.startsWith("/settings")}
              >
                Settings
              </NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-full h-8 w-8 p-0"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Profile picture"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        {session.user.name ? session.user.name[0] : "U"}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {session.user.name || session.user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => (window.location.href = "/settings")}
                  >
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => signOut({ callbackUrl: "/" })}
                  >
                    <Icons.logout className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-3 pb-3 space-y-2 md:hidden">
            <MobileNavLink
              href="/dashboard"
              current={pathname === "/dashboard"}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href="/projects"
              current={pathname.startsWith("/projects")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </MobileNavLink>
            <MobileNavLink
              href="/settings"
              current={pathname.startsWith("/settings")}
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </MobileNavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        current ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  current,
  onClick,
  children,
}: {
  href: string;
  current: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-sm font-medium ${
        current
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
