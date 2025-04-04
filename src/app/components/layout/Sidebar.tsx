// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  ChevronRight,
  LayoutDashboard,
  FolderOpen,
  Settings,
  PlusCircle,
} from "lucide-react";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
    subItems: [
      {
        title: "New Project",
        href: "/projects/new",
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-950 border-r pt-20">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));

            return (
              <div key={link.href} className="space-y-1">
                <Link href={link.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.title}
                    {link.subItems && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                </Link>

                {link.subItems && (
                  <div className="ml-6 space-y-1">
                    {link.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href;

                      return (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant={isSubActive ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isSubActive
                                ? "bg-primary text-primary-foreground"
                                : ""
                            )}
                          >
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.title}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
