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
import { Zap, Rocket } from "lucide-react"

export default function SparkPlaceholder() {
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
                <BreadcrumbPage>Daily Spark</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Spark</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Receive 3 related "Atoms" every morning to help you connect the dots between your research sessions.
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
