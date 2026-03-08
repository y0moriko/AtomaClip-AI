"use client"

import * as React from "react"
import { Search, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="relative w-full max-w-sm ml-auto group">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
      <Input
        placeholder="Deep search atoms..."
        className="pl-8 pr-12 h-9 bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-ring/20 transition-all text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch(e.currentTarget.value)
        }}
      />
      <div className="absolute right-2 top-2 h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground hidden sm:flex">
        <Command className="h-2.5 w-2.5" />
        <span>K</span>
      </div>
    </div>
  )
}
