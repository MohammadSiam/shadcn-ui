"use client";

import { SidebarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "./modeToogle";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14  sticky top-0 z-50 w-full items-center bg-background">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
