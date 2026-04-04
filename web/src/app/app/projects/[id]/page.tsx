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
import { Folder, Sparkles, Loader2, MessageSquare, Send, Bot, User, ArrowLeft, Home, PanelRightOpen, PanelRightClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [isSorting, setIsSorting] = React.useState(false)
  
  const [messages, setMessages] = React.useState<Message[]>([])
  const [conversationHistory, setConversationHistory] = React.useState<{role: string; content: string}[]>([])
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [showSidebar, setShowSidebar] = React.useState(true)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

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

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

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

  const handleSendMessage = async () => {
    if (!query.trim() || !project?.insights || project.insights.length === 0) return
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setConversationHistory(prev => [...prev, { role: "user", content: query.trim() }])
    const currentQuery = query.trim()
    setQuery("")
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/insights/search/deep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: currentQuery,
          insights: project.insights,
          conversationHistory
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        setConversationHistory(prev => [...prev, { role: "assistant", content: data.answer }])
      } else {
        toast.error("AI synthesis failed")
      }
    } catch (err) {
      toast.error("Error connecting to AI")
    } finally {
      setIsLoading(false)
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
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Link href="/app">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/app">Workspace</BreadcrumbLink>
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
            <Link href="/app">
              <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                <Home className="w-3 h-3" />
                Dashboard
              </Button>
            </Link>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-start justify-between p-4 pb-0">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                {project.description && (
                  <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-medium">
                    {project.insights?.length || 0} Atoms
                  </span>
                </div>
              </div>
            </div>

            {project.insights?.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Folder className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold">No clips in this project</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">
                  Clips you save to this project or clips AI sorts here will appear here.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
              </div>
            )}
          </div>

          {showSidebar && (
            <div className="w-96 flex-shrink-0 flex flex-col bg-gradient-to-b from-indigo-50/30 to-white border-l border-indigo-100/50">
              <div className="flex items-center gap-2 p-4 border-b border-indigo-100/50 bg-indigo-600/5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-900">Project Intelligence</h3>
                  <p className="text-[10px] text-indigo-600/70">Ask anything about {project.insights?.length || 0} atoms</p>
                </div>
              </div>

              {project.insights?.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Add some atoms to this project first, then ask questions!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={chatContainerRef}>
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center pt-12">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                          <Sparkles className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">Research Assistant Ready</h4>
                        <p className="text-xs text-muted-foreground max-w-[200px]">
                          Ask questions about your {project.insights?.length} atoms. I can synthesize findings, find connections, and more!
                        </p>
                        <div className="mt-6 space-y-2 w-full">
                          {['What are the main themes?', 'Summarize key findings', 'What gaps exist in my research?'].map((suggestion, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="w-full text-xs h-8 justify-start text-muted-foreground"
                              onClick={() => setQuery(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-2",
                              message.role === 'user' ? "justify-end" : "justify-start"
                            )}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-3 text-sm max-w-[85%] leading-relaxed",
                                message.role === 'user'
                                  ? "bg-indigo-600 text-white rounded-br-md"
                                  : "bg-white border border-indigo-100/50 shadow-sm rounded-bl-md"
                              )}
                              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                            />
                            {message.role === 'user' && (
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                                <User className="w-3 h-3 text-indigo-600" />
                              </div>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-2 justify-start">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                            <div className="bg-white border border-indigo-100/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-indigo-100/50 bg-white">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Ask about your research..."
                        className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/30"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        disabled={isLoading}
                      />
                      <Button 
                        className="bg-indigo-600 hover:bg-indigo-700"
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!query.trim() || isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-2">
                      Powered by AI
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function formatMessage(content: string): string {
  let formatted = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br/>');
  
  formatted = `<p class="mb-2">${formatted}</p>`;
  
  formatted = formatted
    .replace(/<p class="mb-2">• /g, '<p class="mb-2 flex items-start gap-2"><span class="text-indigo-500 mt-0.5">•</span> ')
    .replace(/<p class="mb-2">- /g, '<p class="mb-2 flex items-start gap-2"><span class="text-indigo-500 mt-0.5">-</span> ')
    .replace(/<p class="mb-2"><br\/>/g, '<p class="mb-2">');
  
  return formatted;
}
