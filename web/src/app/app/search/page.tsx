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
import { Search, Rocket } from "lucide-react"

export default function SearchPlaceholder() {
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
                <BreadcrumbPage>Semantic Search</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Semantic Search</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Find concepts, not just words. Our AI is currently learning how to map your atomic thoughts.
          </p>
          <div className="mt-8 px-4 py-2 bg-indigo-500 text-white text-xs font-bold rounded-full flex items-center gap-2">
            <Rocket className="w-3 h-3" />
            COMING SOON
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
