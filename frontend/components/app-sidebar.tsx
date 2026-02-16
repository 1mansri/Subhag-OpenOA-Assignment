"use client";

import * as React from "react";
import { Wind, LayoutDashboard, Home } from "lucide-react";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Wind className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">OpenOA Cloud</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Wind Energy Analytics
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: "Home",
              url: "/",
              icon: Home,
              isActive: false,
            },
            {
              title: "AEP Dashboard",
              url: "/analysis",
              icon: LayoutDashboard,
              isActive: true,
            },
          ]}
        />
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>About</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 text-xs text-muted-foreground space-y-2">
              <p>
                <span className="font-medium text-foreground">OpenOA</span> is a
                Python framework for wind plant operational assessment by NREL.
              </p>
              <p>
                This dashboard demonstrates Monte Carlo AEP analysis using the
                La Haute Borne wind farm dataset.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                <span>OpenOA v3.2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>FastAPI Backend</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
