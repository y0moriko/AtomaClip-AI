"use client"

import * as React from "react"
import { Copy, ExternalLink, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
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

export default function InsightCard({ insight }: { insight: any }) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const copyToMarkdown = () => {
    const tags = insight.tags?.map((t: string) => `#${t.replace(/\s+/g, '')}`).join(" ") || ""
    const markdown = `> ${insight.content}\n\n**Note:** ${insight.userNote || "None"}\n**Source:** [${insight.pageTitle || 'Link'}](${insight.sourceUrl})\n${tags}`
    navigator.clipboard.writeText(markdown)
    toast.success("Copied to Markdown")
  }

  return (
    <Card className="flex flex-col h-full bg-card hover:bg-accent/5 transition-colors">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyToMarkdown}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Markdown
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={insight.sourceUrl} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Source
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        {/* Ghost Paragraph: Before */}
        {isExpanded && insight.contextBefore && (
          <p className="text-[11px] text-muted-foreground/60 italic mb-2 leading-relaxed">
            ...{insight.contextBefore}
          </p>
        )}

        {/* Main Atomic Clip - MANDATORY font-serif */}
        <p className="font-serif text-[0.95rem] leading-relaxed text-foreground antialiased">
          "{insight.content}"
        </p>

        {/* Ghost Paragraph: After */}
        {isExpanded && insight.contextAfter && (
          <p className="text-[11px] text-muted-foreground/60 italic mt-2 leading-relaxed">
            {insight.contextAfter}...
          </p>
        )}

        {insight.userNote && (
          <div className="mt-4 p-2 rounded-md bg-muted/50 border text-[11px] text-muted-foreground">
            <span className="font-bold uppercase text-[9px] block mb-1">Note</span>
            {insight.userNote}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex flex-col items-start gap-3">
        <div className="flex flex-wrap gap-1">
          {insight.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="rounded-sm px-1.5 py-0 text-[10px] font-normal bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="w-full flex items-center justify-between border-t pt-2">
          <span className="text-[10px] text-muted-foreground">
            {new Date(insight.createdAt).toLocaleDateString()}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-[10px] gap-1 px-2"
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
