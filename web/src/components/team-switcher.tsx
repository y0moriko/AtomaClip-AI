"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
  activeTeam,
  onTeamChange,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
    id: string
  }[]
  activeTeam: {
    name: string
    logo: React.ElementType
    plan: string
    id: string
  } | null
  onTeamChange: (team: any) => void
}) {
  const { isMobile } = useSidebar()

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground shadow-sm">
                <activeTeam.logo className="size-4 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTeam.name}</span>
                <span className="truncate text-xs text-muted-foreground">{activeTeam.plan} Vault</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-indigo-100 shadow-xl"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-2">
              Switch Workspace
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => onTeamChange(team)}
                className="gap-3 p-2.5 mx-1 rounded-lg focus:bg-indigo-50 focus:text-indigo-900 transition-colors"
              >
                <div className="flex size-7 items-center justify-center rounded-md border border-indigo-100 bg-white">
                  <team.logo className="size-4 shrink-0 text-indigo-600" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium leading-none">{team.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">{team.plan}</span>
                </div>
                <DropdownMenuShortcut className="text-[10px]">⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3 p-2.5 mx-1 rounded-lg focus:bg-indigo-50 focus:text-indigo-900 transition-colors">
              <div className="flex size-7 items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-transparent">
                <Plus className="size-4 text-muted-foreground" />
              </div>
              <div className="font-medium text-sm text-muted-foreground">Add new vault</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
