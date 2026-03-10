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
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "All Atoms",
          url: "/",
        },
        {
          title: "Recent",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
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
        },
        {
          title: "Daily Spark",
          url: "#",
        },
        {
          title: "AI Tagging",
          url: "#",
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
      name: "Market Analysis",
      url: "#",
      icon: Frame,
    },
    {
      name: "AI Trends",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Legal Briefs",
      url: "#",
      icon: Map,
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
