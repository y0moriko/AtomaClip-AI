"use client"

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
import { Sparkles, CheckCircle2 } from "lucide-react"

export default function TaggingInfo() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/app">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>AI Tagging</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AI Auto-Tagging</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            AtomaClip automatically analyzes your clips and applies relevant tags so you don't have to.
          </p>
          <div className="mt-8 px-4 py-2 bg-green-500/10 text-green-600 text-xs font-bold rounded-full flex items-center gap-2 border border-green-500/20">
            <CheckCircle2 className="w-3 h-3" />
            ACTIVE FEATURE
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-widest">
            Powered by facebook/bart-large-mnli
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
