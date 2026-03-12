"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import InsightCard from "@/components/InsightCard"
import { Folder, Sparkles, Loader2, MessageSquare, Send, Bot, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [isSorting, setIsSorting] = React.useState(false)
  
  // Synthesis State
  const [query, setQuery] = React.useState("")
  const [isSynthesizing, setIsSynthesizing] = React.useState(false)
  const [synthesis, setSynthesis] = React.useState<string | null>(null)
  const [showChat, setShowChat] = React.useState(false)

  React.useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data)
        } else {
          toast.error("Failed to load project")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [params.id])

  const handleAutoSort = async () => {
    if (!project) return
    setIsSorting(true)
    try {
      const res = await fetch('/api/insights/auto-sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: project.workspaceId })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Sorted ${data.sortedCount} clips into projects!`)
        // Refresh project data
        const refreshRes = await fetch(`/api/projects/${params.id}`)
        const refreshData = await refreshRes.json()
        setProject(refreshData)
      } else {
        toast.error(data.error || "Failed to sort clips")
      }
    } catch (err) {
      toast.error("Auto-sort failed")
    } finally {
      setIsSorting(false)
    }
  }

  const handleSynthesis = async () => {
    if (!query.trim() || !project?.insights || project.insights.length === 0) return
    
    setIsSynthesizing(true)
    setSynthesis(null)
    setShowChat(true)
    
    try {
      // Send project insights to the deep search API
      const res = await fetch('/api/insights/search/deep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          insights: project.insights
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        setSynthesis(data.answer)
      } else {
        toast.error("AI synthesis failed")
      }
    } catch (err) {
      toast.error("Error connecting to AI")
    } finally {
      setIsSynthesizing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/app">
                    Workspace
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1">
                    <Folder className="w-4 h-4" />
                    {project.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-xs h-8 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 font-bold"
              onClick={handleAutoSort}
              disabled={isSorting}
            >
              {isSorting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              AI AUTO-SORT
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 overflow-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
              {project.description && (
                <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>
              )}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-medium">
                  {project.insights?.length || 0} Atoms
                </span>
              </div>
            </div>

            {/* Synthesis Chat Trigger */}
            {project.insights?.length > 0 && !showChat && (
              <Button 
                onClick={() => setShowChat(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 text-xs"
              >
                <MessageSquare className="w-4 h-4" />
                Ask your research
              </Button>
            )}
          </div>

          {/* AI Synthesis / Chat Interface */}
          {showChat && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 mb-4 relative overflow-hidden group">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowChat(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-indigo-900/80">Project Intelligence</h3>
              </div>

              {synthesis ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-3">
                    <div className="flex-1 bg-white/50 border rounded-xl p-4 text-sm leading-relaxed prose prose-indigo">
                       {synthesis}
                    </div>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto text-indigo-600"
                    onClick={() => {setSynthesis(null); setQuery("")}}
                  >
                    Ask another question
                  </Button>
                </div>
              ) : isSynthesizing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
                  <p className="text-xs text-indigo-900/60 font-medium italic">Connecting the dots across {project.insights?.length} atoms...</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input 
                      placeholder="e.g. What are the key findings about cat social behavior in these clips?"
                      className="pr-12 bg-white/80 border-indigo-500/20 focus-visible:ring-indigo-500/30"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSynthesis()}
                    />
                    <Button 
                      size="icon" 
                      className="absolute right-1 top-1 h-8 w-8 bg-indigo-600 hover:bg-indigo-700"
                      onClick={handleSynthesis}
                      disabled={!query.trim()}
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.insights?.map((insight: any) => (
              <InsightCard 
                key={insight.id} 
                insight={insight} 
                onDelete={(id) => {
                  setProject({
                    ...project,
                    insights: project.insights.filter((i: any) => i.id !== id)
                  })
                }}
              />
            ))}
          </div>
          
          {(!project.insights || project.insights.length === 0) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Folder className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No clips in this project</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-1">
                Clips you save to this project or clips AI sorts here will appear here.
              </p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
