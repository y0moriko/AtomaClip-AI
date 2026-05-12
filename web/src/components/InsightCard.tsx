"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, ExternalLink, MoreHorizontal, ChevronDown, ChevronUp, Sparkles, User, Heart, Trash2, Edit2, Check, X } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export default function InsightCard({ insight: initialInsight, isSample = false, onDelete }: { insight: any; isSample?: boolean; onDelete?: (id: string) => void }) {
  const [insight, setInsight] = React.useState(initialInsight)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isEditingNote, setIsEditingNote] = React.useState(false)
  const [noteDraft, setNoteDraft] = React.useState(insight.userNote || "")
  const [isDeleting, setIsDeleting] = React.useState(false)

  const copyToMarkdown = () => {
    const tags = insight.tags?.map((t: string) => `#${t.replace(/\s+/g, '')}`).join(" ") || ""
    const markdown = `> ${insight.content}\n\n**Note:** ${insight.userNote || "None"}\n**Source:** [${insight.pageTitle || 'Link'}](${insight.sourceUrl})\n${tags}`
    navigator.clipboard.writeText(markdown)
    toast.success("Copied to Markdown")
  }

  const toggleFavorite = async () => {
    if (isSample) return
    const newFavorite = !insight.isFavorite
    // Optimistic update
    setInsight({ ...insight, isFavorite: newFavorite })
    
    try {
      const res = await fetch(`/api/insights/${insight.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: newFavorite })
      })
      if (!res.ok) throw new Error("Failed to update")
    } catch (err) {
      setInsight({ ...insight, isFavorite: !newFavorite })
      toast.error("Failed to update favorite status")
    }
  }

  const handleDelete = async () => {
    if (isSample) return
    if (isDeleting) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/insights/${insight.id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Atom deleted")
        if (onDelete) onDelete(insight.id)
      } else {
        throw new Error("Failed to delete")
      }
    } catch (err) {
      toast.error("Failed to delete")
      setIsDeleting(false)
    }
  }

  const saveNote = async () => {
    if (isSample) return
    const cleanNote = noteDraft.trim()
    setIsEditingNote(false)
    
    if (cleanNote === insight.userNote) return

    try {
      const res = await fetch(`/api/insights/${insight.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userNote: cleanNote })
      })
      if (res.ok) {
        setInsight({ ...insight, userNote: cleanNote })
        toast.success("Note updated")
      } else {
        throw new Error("Failed to update note")
      }
    } catch (err) {
      setNoteDraft(insight.userNote || "")
      toast.error("Failed to update note")
    }
  }

  const isAiSummary = insight.userNote?.startsWith("AI Summary:")

  if (isDeleting) return null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="flex flex-col h-full bg-card hover:bg-accent/5 transition-colors border-border/50 shadow-sm overflow-hidden group">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1 overflow-hidden">
            {isSample ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Badge variant="outline" className="w-fit text-[9px] bg-indigo-500/10 text-indigo-600 border-indigo-500/20 font-bold uppercase tracking-wider">
                  Sample
                </Badge>
              </motion.div>
            ) : (
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                <span className="truncate">{new URL(insight.sourceUrl).hostname}</span>
              </CardTitle>
            )}
            <CardDescription className="line-clamp-1 text-[10px]">
              {insight.pageTitle}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {!isSample && (
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-7 w-7", insight.isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground/40 hover:text-foreground")}
                  onClick={toggleFavorite}
                >
                  <motion.div
                    animate={insight.isFavorite ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={cn("h-3.5 w-3.5", insight.isFavorite && "fill-current")} />
                  </motion.div>
                </Button>
              </motion.div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button variant="ghost" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isSample && (
                  <DropdownMenuItem onClick={() => {setIsEditingNote(true); setNoteDraft(insight.userNote || "");}}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Note
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={copyToMarkdown}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Markdown
                </DropdownMenuItem>
                {!isSample && (
                  <>
                    <DropdownMenuItem asChild>
                      <a href={insight.sourceUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Source
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-2">
          {/* Ghost Paragraph: Before */}
          <AnimatePresence>
            {isExpanded && insight.contextBefore && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] text-muted-foreground/60 italic mb-2 leading-relaxed overflow-hidden"
              >
                ...{insight.contextBefore}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Main Atomic Clip - MANDATORY font-serif */}
          <motion.p 
            className="font-serif text-[0.95rem] leading-relaxed text-foreground antialiased selection:bg-indigo-100 selection:text-indigo-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            "{insight.content}"
          </motion.p>

          {/* Ghost Paragraph: After */}
          <AnimatePresence>
            {isExpanded && insight.contextAfter && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] text-muted-foreground/60 italic mt-2 leading-relaxed overflow-hidden"
              >
                {insight.contextAfter}...
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-4">
            {isSample ? (
              insight.userNote && (
                <div className="space-y-2">
                  {insight.userNote.split('\n\n').map((part: string, idx: number) => {
                    const isPartAi = part.startsWith('AI Insight:') || part.startsWith('AI Summary:');
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "p-2.5 rounded-lg border text-[11px] leading-relaxed",
                          isPartAi 
                            ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-900/80" 
                            : "bg-muted/50 border-border text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-1.5 mb-1 opacity-70">
                          {isPartAi ? (
                            <Sparkles className="h-3 w-3 text-indigo-500" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span className="font-bold uppercase text-[9px] tracking-wider">
                            {isPartAi ? "AI Insight" : "Your Note"}
                          </span>
                        </div>
                        {isPartAi ? part.replace(/AI (Insight|Summary):/, "").trim() : part}
                      </motion.div>
                    )
                  })}
                </div>
              )
            ) : isEditingNote ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <Input 
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  className="text-[11px] h-8 bg-muted/50 border-indigo-500/30"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveNote()
                    if (e.key === 'Escape') setIsEditingNote(false)
                  }}
                />
                <div className="flex items-center gap-1 justify-end">
                   <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                     <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => setIsEditingNote(false)}>
                        <X className="w-3 h-3" />
                     </Button>
                   </motion.div>
                   <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                     <Button variant="ghost" size="icon" className="h-6 w-6 text-green-500" onClick={saveNote}>
                        <Check className="w-3 h-3" />
                     </Button>
                   </motion.div>
                </div>
              </motion.div>
            ) : (
              insight.userNote && (
                <div className="space-y-2">
                  {insight.userNote.split('\n\n').map((part: string, idx: number) => {
                    const isPartAi = part.startsWith('AI Insight:') || part.startsWith('AI Summary:');
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ x: 3 }}
                        className={cn(
                          "p-2.5 rounded-lg border text-[11px] leading-relaxed cursor-pointer hover:border-indigo-500/30 transition-colors",
                          isPartAi 
                            ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-900/80" 
                            : "bg-muted/50 border-border text-muted-foreground"
                        )}
                        onClick={() => !isPartAi && setIsEditingNote(true)}
                      >
                        <div className="flex items-center gap-1.5 mb-1 opacity-70">
                          {isPartAi ? (
                            <Sparkles className="h-3 w-3 text-indigo-500" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span className="font-bold uppercase text-[9px] tracking-wider">
                            {isPartAi ? "AI Insight" : "Your Note"}
                          </span>
                        </div>
                        {isPartAi ? part.replace(/AI (Insight|Summary):/, "").trim() : part}
                      </motion.div>
                    )
                  })}
                </div>
              )
            )}
            {!insight.userNote && !isEditingNote && (
               <Button 
                variant="ghost" 
                className="w-full justify-start text-[10px] h-7 text-muted-foreground/50 hover:text-indigo-600 transition-colors gap-2 px-1"
                onClick={() => setIsEditingNote(true)}
               >
                  <Edit2 className="w-2.5 h-2.5" /> Add a note...
               </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex flex-col items-start gap-3">
          <motion.div className="flex flex-wrap gap-1">
            {insight.tags?.map((tag: string, idx: number) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ scale: 1.1 }}
              >
                <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] font-medium bg-secondary/50 text-secondary-foreground border-none cursor-pointer">
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
          <div className="w-full flex items-center justify-between border-t pt-2 mt-1">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter opacity-60">
              {new Date(insight.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] font-bold gap-1 px-2 hover:bg-transparent hover:text-indigo-600 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>Less <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Context <ChevronDown className="h-3 w-3" /></>
                )}
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
