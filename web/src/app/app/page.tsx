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

export default function DashboardPage() {
  const [insights, setInsights] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [view, setView] = React.useState("all") // 'all', 'recent', 'starred'

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
  }, [view])

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
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  {view === 'starred' ? (
                    <Star className="w-6 h-6 text-muted-foreground/40" />
                  ) : (
                    <Library className="w-6 h-6 text-muted-foreground/40" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {view === 'recent' ? "No recent activity" : view === 'starred' ? "No starred atoms" : "Vault section is empty"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {view === 'recent' ? "Clips from the last 24 hours will appear here." : 
                   view === 'starred' ? "Mark atoms as favorite to see them in this list." :
                   "Start clipping insights to see them here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
