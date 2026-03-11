"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Download,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Search,
  Library,
  Heart,
  Users,
  Zap,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Researcher",
    email: "test@atomaclip.ai",
    avatar: "/avatars/avatar.jpg",
  },
  teams: [
    {
      name: "Personal Vault",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "Team Brain",
      logo: AudioWaveform,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Workspace",
      url: "/app",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "All Atoms",
          url: "/app",
        },
        {
          title: "Recent",
          url: "/app",
        },
        {
          title: "Starred",
          url: "/app",
        },
      ],
    },
    {
      title: "Research Tools",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Semantic Search",
          url: "#",
          badge: "Coming Soon"
        },
        {
          title: "Daily Spark",
          url: "#",
          badge: "Coming Soon"
        },
        {
          title: "AI Tagging",
          url: "#",
          badge: "Coming Soon"
        },
      ],
    },
    {
      title: "Extension",
      url: "/download",
      icon: Download,
      items: [
        {
          title: "Download",
          url: "/download",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Collections",
      url: "#",
      icon: Frame,
      badge: "Coming Soon"
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
