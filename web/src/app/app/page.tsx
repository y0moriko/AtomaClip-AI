"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { supabase } from "@/lib/supabase"
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
import SearchBar from "@/components/SearchBar"
import InsightCard from "@/components/InsightCard"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Library, Sparkles, Star } from "lucide-react"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const SAMPLE_CLIPS = [
  {
    id: "sample-1",
    content: "The best way to predict the future is to invent it. - Alan Kay",
    sourceUrl: "https://en.wikipedia.org/wiki/Alan_Kay",
    pageTitle: "Alan Kay - Wikipedia",
    tags: ["innovation", "futurism", "quotes"],
    userNote: "AI Summary: Emphasizes proactive creation over passive prediction",
    createdAt: new Date().toISOString(),
    isFavorite: false,
  },
  {
    id: "sample-2",
    content: "Knowledge is only useful if you can retrieve it at the right time. - Andy Hunt",
    sourceUrl: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
    pageTitle: "The Pragmatic Programmer",
    tags: ["knowledge-management", "productivity"],
    userNote: "AI Summary: Context matters more than storage",
    createdAt: new Date().toISOString(),
    isFavorite: true,
  },
  {
    id: "sample-3",
    content: "Atomic habits are the compound interest of self-improvement. - James Clear",
    sourceUrl: "https://jamesclear.com/atomic-habits",
    pageTitle: "Atomic Habits by James Clear",
    tags: ["habits", "learning", "growth"],
    userNote: "AI Summary: Small consistent changes lead to remarkable results",
    createdAt: new Date().toISOString(),
    isFavorite: false,
  },
]

export default function DashboardPage() {
  const [insights, setInsights] = React.useState<any[]>([])
  const [sparks, setSparks] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sparksLoading, setSparksLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [view, setView] = React.useState("all") // 'all', 'recent', 'starred'

  const fetchSparks = async () => {
    setSparksLoading(true)
    try {
      const res = await fetch("/api/insights/spark")
      const data = await res.json()
      setSparks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch sparks", err)
    } finally {
      setSparksLoading(false)
    }
  }

  const fetchInsights = async (query = "", currentView = view) => {
    setLoading(true)
    setSearchQuery(query)
    try {
      const endpoint = query ? "/api/insights/search" : "/api/insights"
      const method = query ? "POST" : "GET"
      const body = query ? JSON.stringify({ query }) : undefined

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body
      })
      const data = await res.json()
      let filteredData = Array.isArray(data) ? data : []

      if (!query) {
        if (currentView === "recent") {
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          filteredData = filteredData.filter((i: any) => new Date(i.createdAt) > oneDayAgo)
        } else if (currentView === "starred") {
          filteredData = filteredData.filter((i: any) => i.isFavorite)
        }
      }

      setInsights(filteredData)
    } catch (err) {
      console.error(err)
      setInsights([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInsight = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id))
  }

  React.useEffect(() => {
    fetchInsights()

    // Real-time subscription for new insights
    const channel = supabase
      .channel('realtime-insights')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'insights' },
        (payload) => {
          console.log('Real-time insight added:', payload.new)
          // Refresh the list to include the new insight
          // We call it with current searchQuery and view to maintain filters
          fetchInsights(searchQuery, view)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [view, searchQuery])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {searchQuery ? "Deep Search" : view === "recent" ? "Recent" : view === "starred" ? "Starred" : "All Atoms"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto w-full max-w-sm">
              <SearchBar onSearch={(q) => fetchInsights(q)} />
            </div>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 overflow-y-auto custom-scrollbar bg-muted/10">
          {!searchQuery && (
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 mb-4">
              <Card 
                className={`bg-background border-none shadow-none ring-1 cursor-pointer transition-all ${view === 'all' ? 'ring-indigo-500 shadow-sm' : 'ring-border/50 hover:ring-border'}`}
                onClick={() => setView('all')}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Atoms</CardTitle>
                  <Library className={`h-4 w-4 ${view === 'all' ? 'text-indigo-500' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{view === 'all' ? insights.length : '--'}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Full library</p>
                </CardContent>
              </Card>
              <Card 
                className={`bg-background border-none shadow-none ring-1 cursor-pointer transition-all ${view === 'recent' ? 'ring-indigo-500 shadow-sm' : 'ring-border/50 hover:ring-border'}`}
                onClick={() => setView('recent')}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Atoms</CardTitle>
                  <Sparkles className={`h-4 w-4 ${view === 'recent' ? 'text-indigo-500' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{view === 'recent' ? insights.length : 'New'}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Last 24 hours</p>
                </CardContent>
              </Card>
              <Card 
                className={`bg-background border-none shadow-none ring-1 cursor-pointer transition-all ${view === 'starred' ? 'ring-yellow-500 shadow-sm' : 'ring-border/50 hover:ring-border'}`}
                onClick={() => setView('starred')}
              >
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Starred</CardTitle>
                  <Star className={`h-4 w-4 ${view === 'starred' ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{view === 'starred' ? insights.length : 'Saved'}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Your favorites</p>
                </CardContent>
              </Card>
            </div>
          )}

          {(searchQuery || view !== "all") && (
            <div className="mb-6 flex items-center gap-3">
              {searchQuery && (
                <Badge variant="outline" className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/5 text-indigo-600 border-indigo-500/20">
                  Query: {searchQuery}
                </Badge>
              )}
              {view !== "all" && !searchQuery && (
                <Badge variant="outline" className={`px-3 py-1 rounded-lg text-xs font-bold capitalize border-opacity-20 ${
                  view === 'recent' ? 'bg-indigo-500/5 text-indigo-500 border-indigo-500' : 'bg-yellow-500/5 text-yellow-600 border-yellow-500'
                }`}>
                  Filter: {view}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchQuery("")
                  setView("all")
                  fetchInsights("", "all")
                }}
                className="text-[11px] font-bold text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            </div>
          )}

          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-[200px] w-full rounded-xl bg-muted/50" />
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {insights.map((insight) => (
                    <InsightCard 
                      key={insight.id} 
                      insight={insight} 
                      onDelete={handleDeleteInsight} 
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!loading && insights.length === 0 && (
              <div className="space-y-12 max-w-5xl mx-auto pb-20">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    Your Research Engine is Ready
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    AtomaClip transforms how you gather and use information. Follow these 2 simple steps to start building your "Team Brain."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Step 1 */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4 bg-background border border-border/50 rounded-3xl p-6 shadow-sm hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                      <h4 className="font-bold text-lg">Capture Anything</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Highlight any text on any website, right-click, and select <span className="font-bold text-foreground">"Capture to AtomaClip"</span>.
                    </p>
                    <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-muted/30 group">
                      <img 
                        src="/step-1-highlight.png" 
                        alt="Highlight and right-click to capture" 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-4 bg-background border border-border/50 rounded-3xl p-6 shadow-sm hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                      <h4 className="font-bold text-lg">Contextualize & Organize</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Add a personal note and pick a <span className="font-bold text-foreground">Collection</span>. Our AI will automatically tag and summarize it.
                    </p>
                    <div className="relative rounded-xl overflow-hidden border border-border aspect-video bg-muted/30 group">
                      <img 
                        src="/step-2-popup.png" 
                        alt="The AtomaClip capture popup" 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="h-[1px] w-8 bg-border"></div>
                    Sample Atoms Below
                    <div className="h-[1px] w-8 bg-border"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                    {SAMPLE_CLIPS.map((sample) => (
                      <InsightCard key={sample.id} insight={sample} isSample />
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-600 rounded-3xl p-10 text-center text-white shadow-2xl shadow-indigo-500/20 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
                  <h4 className="text-2xl font-bold mb-3">Don't have the extension yet?</h4>
                  <p className="text-indigo-100 mb-8 max-w-sm mx-auto">
                    The extension is the portal to your research brain. Install it once, use it everywhere.
                  </p>
                  <Link href="/download">
                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 h-12 text-base rounded-full shadow-lg transition-transform active:scale-95">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get Browser Extension
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
