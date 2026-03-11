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
import { Search, Rocket, Sparkles, Loader2, Info, BrainCircuit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import InsightCard from "@/components/InsightCard"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SemanticSearchPage() {
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [deepLoading, setDeepLoading] = React.useState(false)
  const [results, setResults] = React.useState<any[]>([])
  const [hasSearched, setHasSearched] = React.useState(false)
  const [deepAnswer, setDeepAnswer] = React.useState<string | null>(null)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setHasSearched(true)
    setDeepAnswer(null)
    try {
      const res = await fetch("/api/insights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const getDeepInsight = async () => {
    if (results.length === 0) return
    setDeepLoading(true)
    try {
      const res = await fetch("/api/insights/search/deep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, insights: results.slice(0, 5) })
      })
      const data = await res.json()
      if (data.answer) setDeepAnswer(data.answer)
    } catch (err) {
      console.error(err)
    } finally {
      setDeepLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/app">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground">Semantic Search</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-8 p-4 lg:p-12 bg-muted/5 min-h-screen">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold tracking-wider uppercase mb-2">
                <BrainCircuit className="w-3 h-3" />
                Next-Gen Semantic Search
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">
                Think in <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">Concepts</span>
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base max-w-md mx-auto leading-relaxed">
                Find exactly what you need by searching for ideas and meaning, not just exact keywords.
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center gap-2 bg-background p-2 rounded-2xl border shadow-sm ring-1 ring-border/50">
                <Search className="ml-3 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  placeholder="e.g., 'What did I save about the future of electric vehicle batteries?'" 
                  className="border-0 focus-visible:ring-0 text-base py-6 px-2 bg-transparent h-12"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  disabled={loading || !query.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
              </div>
            </form>

            {!hasSearched && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors cursor-pointer group" onClick={() => {setQuery("How can AI help in market research?"); handleSearch();}}>
                   <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4 text-indigo-500 group-hover:text-white" />
                   </div>
                   <h3 className="text-sm font-bold mb-1">Try: Market Research</h3>
                   <p className="text-xs text-muted-foreground">Find all related concepts about AI-driven research.</p>
                </div>
                <div className="p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors cursor-pointer group" onClick={() => {setQuery("Lithium battery constraints"); handleSearch();}}>
                   <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Info className="w-4 h-4 text-orange-500 group-hover:text-white" />
                   </div>
                   <h3 className="text-sm font-bold mb-1">Try: Technical Details</h3>
                   <p className="text-xs text-muted-foreground">Retrieve specific technical insights about supply chains.</p>
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-7xl mx-auto">
             <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-[250px] w-full rounded-2xl bg-muted/40 animate-pulse border border-border/50" />
                    ))}
                  </motion.div>
                ) : hasSearched && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {results.length > 0 && (
                      <div className="flex flex-col gap-4">
                        {!deepAnswer && !deepLoading && (
                          <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-indigo-900">Unlock Deep Insight</h3>
                                <p className="text-sm text-indigo-700/70">Connect the dots between these {results.length} results using Gemini AI.</p>
                              </div>
                            </div>
                            <Button 
                              onClick={getDeepInsight} 
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 shrink-0 shadow-lg shadow-indigo-500/20"
                            >
                              Synthesize Results
                            </Button>
                          </div>
                        )}

                        {deepLoading && (
                          <div className="bg-indigo-600/5 border border-indigo-600/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin relative z-10" />
                            </div>
                            <div>
                              <h3 className="font-bold text-indigo-900">Gemini is thinking...</h3>
                              <p className="text-sm text-indigo-700/70">Analyzing your {results.length} atoms to find common threads.</p>
                            </div>
                          </div>
                        )}

                        {deepAnswer && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-1 shadow-xl"
                          >
                            <div className="bg-background rounded-[15px] p-6 lg:p-8">
                               <div className="flex items-center gap-2 mb-4">
                                  <Badge className="bg-indigo-600 text-white border-0 hover:bg-indigo-600">AI SYNTHESIS</Badge>
                                  <div className="h-px flex-1 bg-border/50"></div>
                                  <Sparkles className="w-4 h-4 text-indigo-500" />
                               </div>
                               <div className="prose prose-sm lg:prose-base max-w-none text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                                  {deepAnswer}
                               </div>
                               <div className="mt-6 flex items-center justify-between border-t pt-4">
                                  <p className="text-[10px] text-muted-foreground italic">
                                    Synthesized from your top {Math.min(results.length, 5)} relevant atoms.
                                  </p>
                                  <Button variant="ghost" size="sm" onClick={() => setDeepAnswer(null)} className="text-[10px] font-bold h-7">
                                    Clear Synthesis
                                  </Button>
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between px-2">
                       <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          Search Results 
                          <Badge variant="secondary" className="font-mono text-[10px] py-0">{results.length}</Badge>
                       </h2>
                       {results.length > 0 && (
                         <div className="text-[10px] font-medium text-muted-foreground italic">
                           Sorted by relevance score
                         </div>
                       )}
                    </div>

                    {results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((insight, idx) => (
                          <div key={insight.id} className="relative group">
                             {insight.similarity && (
                               <div className="absolute -top-2 -right-2 z-10">
                                  <Badge className="bg-indigo-600 text-white border-0 text-[9px] font-bold shadow-md shadow-indigo-500/20">
                                    {(insight.similarity * 100).toFixed(0)}% Match
                                  </Badge>
                               </div>
                             )}
                             <InsightCard insight={insight} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert className="bg-muted/50 border-none py-12 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm border">
                           <Search className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                        <AlertTitle className="text-lg font-bold">No deep matches found</AlertTitle>
                        <AlertDescription className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                          We couldn't find any concepts that match "{query}". Try a broader term or different phrasing.
                        </AlertDescription>
                        <Button variant="outline" size="sm" className="mt-6 rounded-xl border-border/50" onClick={() => setHasSearched(false)}>
                          Go Back
                        </Button>
                      </Alert>
                    )}
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
