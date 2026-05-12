"use client"

import * as React from "react"
import Link from "next/link"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Plus,
  Loader2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function NavProjects({
  projects,
  workspaceId,
  onProjectCreated,
}: {
  projects: {
    id: string
    name: string
    url: string
    icon: LucideIcon
    badge?: string
  }[]
  workspaceId?: string
  onProjectCreated?: () => void
}) {
  const { isMobile } = useSidebar()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [projectName, setProjectName] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const handleCreateProject = async () => {
    if (!projectName.trim() || !workspaceId) return
    setIsCreating(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName.trim(),
          workspaceId: workspaceId
        })
      })
      if (res.ok) {
        toast.success("Project created!")
        setProjectName("")
        setIsDialogOpen(false)
        if (onProjectCreated) onProjectCreated()
      } else {
        toast.error("Failed to create project")
      }
    } catch (err) {
      toast.error("Error creating project")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      // Assuming we have a delete endpoint or just using a generic one
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success("Project deleted")
        if (onProjectCreated) onProjectCreated()
      } else {
        toast.error("Failed to delete project")
      }
    } catch (err) {
      toast.error("Error deleting project")
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between pr-2">
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-accent rounded-sm">
              <Plus className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>
                Organize your research by creating a specific collection.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Cat Research"
                  className="col-span-3"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject} disabled={isCreating || !projectName.trim()}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link href={item.url} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <item.icon />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem asChild>
                  <Link href={item.url}>
                    <Folder className="text-muted-foreground" />
                    <span>View Collection</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Collection</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDeleteProject(item.id)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Collection</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
