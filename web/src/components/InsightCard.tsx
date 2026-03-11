"use client"

import * as React from "react"
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

export default function InsightCard({ insight: initialInsight, onDelete }: { insight: any, onDelete?: (id: string) => void }) {
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
    <Card className="flex flex-col h-full bg-card hover:bg-accent/5 transition-colors border-border/50 shadow-sm overflow-hidden group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1 overflow-hidden">
          <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            <span className="truncate">{new URL(insight.sourceUrl).hostname}</span>
          </CardTitle>
          <CardDescription className="line-clamp-1 text-[10px]">
            {insight.pageTitle}
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-7 w-7", insight.isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground/40 hover:text-foreground")}
            onClick={toggleFavorite}
          >
            <Heart className={cn("h-3.5 w-3.5", insight.isFavorite && "fill-current")} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {setIsEditingNote(true); setNoteDraft(insight.userNote || "");}}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyToMarkdown}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Markdown
              </DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        {/* Ghost Paragraph: Before */}
        {isExpanded && insight.contextBefore && (
          <p className="text-[11px] text-muted-foreground/60 italic mb-2 leading-relaxed">
            ...{insight.contextBefore}
          </p>
        )}

        {/* Main Atomic Clip - MANDATORY font-serif */}
        <p className="font-serif text-[0.95rem] leading-relaxed text-foreground antialiased selection:bg-indigo-100 selection:text-indigo-900">
          "{insight.content}"
        </p>

        {/* Ghost Paragraph: After */}
        {isExpanded && insight.contextAfter && (
          <p className="text-[11px] text-muted-foreground/60 italic mt-2 leading-relaxed">
            {insight.contextAfter}...
          </p>
        )}

        <div className="mt-4">
          {isEditingNote ? (
            <div className="space-y-2">
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
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => setIsEditingNote(false)}>
                    <X className="w-3 h-3" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-green-500" onClick={saveNote}>
                    <Check className="w-3 h-3" />
                 </Button>
              </div>
            </div>
          ) : (
            (insight.userNote || isAiSummary) && (
              <div 
                className={cn(
                  "p-2.5 rounded-lg border text-[11px] leading-relaxed cursor-pointer hover:border-indigo-500/30 transition-colors",
                  isAiSummary 
                    ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-900/80" 
                    : "bg-muted/50 border-border text-muted-foreground"
                )}
                onClick={() => setIsEditingNote(true)}
              >
                <div className="flex items-center gap-1.5 mb-1 opacity-70">
                  {isAiSummary ? (
                    <Sparkles className="h-3 w-3 text-indigo-500" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  <span className="font-bold uppercase text-[9px] tracking-wider">
                    {isAiSummary ? "AI Insight" : "Your Note"}
                  </span>
                </div>
                {isAiSummary ? insight.userNote.replace("AI Summary:", "").trim() : (insight.userNote || "Click to add a note...")}
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
        <div className="flex flex-wrap gap-1">
          {insight.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] font-medium bg-secondary/50 text-secondary-foreground border-none">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="w-full flex items-center justify-between border-t pt-2 mt-1">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter opacity-60">
            {new Date(insight.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
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
        </div>
      </CardFooter>
    </Card>
  )
}
