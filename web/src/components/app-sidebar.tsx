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
  MessageSquare,
  User,
  Settings
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { NavSecondary } from "@/components/nav-secondary"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [workspaces, setWorkspaces] = React.useState<any[]>([])
  const [activeWorkspace, setActiveWorkspace] = React.useState<any>(null)
  const [projects, setProjects] = React.useState<any[]>([])
  const [user, setUser] = React.useState<any>({
    name: "Researcher",
    email: "",
    avatar: "",
  })

  const loadUser = React.useCallback(async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (supabaseUser) {
      setUser({
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || "Researcher",
        email: supabaseUser.email || "",
        avatar: supabaseUser.user_metadata?.avatar_url || "",
      })
    }
  }, [])

  const loadData = React.useCallback(async () => {
    try {
      const res = await fetch('/api/workspaces')
      const data = await res.json()
      if (Array.isArray(data)) {
        setWorkspaces(data)
        if (data.length > 0) {
          setActiveWorkspace((prev: any) => {
            const current = data.find(w => w.id === prev?.id)
            return current || data[0]
          })
        }
      }
    } catch (err) {
      console.error("Failed to load workspaces", err)
    }
  }, [])

  React.useEffect(() => {
    loadUser()
    loadData()
  }, [loadUser, loadData])

  React.useEffect(() => {
    if (activeWorkspace) {
      const current = workspaces.find(w => w.id === activeWorkspace.id)
      if (current) {
        setProjects(current.projects || [])
      }
    }
  }, [activeWorkspace, workspaces])

  const navMain = [
    {
      title: "Research Tools",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Semantic Search",
          url: "/app/search",
        },
        {
          title: "Daily Spark",
          url: "/app/spark",
          badge: "Coming Soon"
        },
        {
          title: "AI Tagging",
          url: "/app/tagging",
        },
      ],
    },
    {
      title: "Library",
      url: "/app",
      icon: Library,
      items: [
        {
          title: "All Atoms",
          url: "/app",
        },
        {
          title: "Starred",
          url: "/app",
        },
        {
          title: "Recent",
          url: "/app",
        },
      ],
    },
  ]

  const navSecondary = [
    {
      title: "Download Extension",
      url: "/download",
      icon: Download,
    },
    {
      title: "Share Feedback",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSePg5VszEZk61sPFBQeXNoNNyddD49sdmpqOVq09-y-Q9rsQQ/viewform?usp=sf_link",
      icon: MessageSquare,
    },
  ]

  const formattedTeams = workspaces.map(w => ({
    name: w.name,
    logo: w.type === 'personal' ? GalleryVerticalEnd : AudioWaveform,
    plan: w.type === 'personal' ? 'Personal' : 'Team',
    id: w.id
  }))

  const activeTeam = formattedTeams.find(t => t.id === activeWorkspace?.id) || formattedTeams[0] || null

  const handleTeamChange = (team: any) => {
    const workspace = workspaces.find(w => w.id === team.id)
    if (workspace) {
      setActiveWorkspace(workspace)
    }
  }

  const formattedProjects = projects.map(p => ({
    id: p.id,
    name: p.name,
    url: `/app/projects/${p.id}`,
    icon: Frame,
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher 
          teams={formattedTeams.length > 0 ? formattedTeams : [
            { id: 'loading', name: "Loading...", logo: GalleryVerticalEnd, plan: "Wait" }
          ]} 
          activeTeam={activeTeam}
          onTeamChange={handleTeamChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects 
          projects={formattedProjects} 
          workspaceId={activeWorkspace?.id}
          onProjectCreated={loadData}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} className="mt-auto" />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
