"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
  Settings,
  HelpCircle,
  Infinity as InfinityIcon
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import * as React from "react"

interface UsageStats {
  subscriptionTier: string
  atomsUsed: number
  limit: number
  isUnlimited: boolean
  daysUntilReset: number
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [usageStats, setUsageStats] = React.useState<UsageStats | null>(null)

  React.useEffect(() => {
    async function fetchUsageStats() {
      try {
        const response = await fetch('/api/usage/stats')
        if (response.ok) {
          const data = await response.json()
          setUsageStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch usage stats:', error)
      }
    }
    fetchUsageStats()
  }, [])

  const isPro = usageStats?.subscriptionTier === 'pro'
  const atomsUsed = usageStats?.atomsUsed ?? 0
  const totalLimit = usageStats?.isUnlimited ? 9999 : (usageStats?.limit ?? 20)
  const progress = usageStats?.isUnlimited ? 100 : ((atomsUsed / totalLimit) * 100)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
            >
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-purple-500/10 shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-purple-50 text-purple-700 font-semibold text-xs">
                  {userInitials || "AR"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-semibold text-slate-700">{user.name}</span>
                <span className="truncate text-[11px] text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl border-purple-100 shadow-2xl p-1.5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg ring-2 ring-purple-500/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-purple-50 text-purple-700 font-bold">
                    {userInitials || "AR"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-slate-800">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              {!isPro && (
                <div className="px-2 pb-2">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Monthly Atoms</span>
                    <span>{atomsUsed}/{totalLimit}</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-slate-100" />
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-purple-100" />
            {!isPro ? (
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg focus:bg-purple-600 focus:text-white group transition-all">
                  <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center group-focus:bg-white/20">
                    <Sparkles className="size-4 text-purple-600 group-focus:text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">Upgrade to Pro</span>
                    <span className="text-[10px] text-muted-foreground group-focus:text-white/80 leading-none mt-0.5">
                      {atomsUsed >= totalLimit ? 'Limit reached!' : 'Unlock unlimited atoms'}
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg bg-amber-50/50 cursor-default">
                  <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
                    <InfinityIcon className="size-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-amber-900">Scholar Pro</span>
                    <span className="text-[10px] text-amber-700 leading-none mt-0.5">Unlimited atoms active</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator className="bg-purple-100" />
            <DropdownMenuGroup className="space-y-0.5">
              <DropdownMenuItem 
                className="gap-3 py-2 px-3 rounded-lg focus:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => router.push("/app/profile")}
              >
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="gap-3 py-2 px-3 rounded-lg focus:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => router.push("/app/settings?tab=billing")}
              >
                <CreditCard className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="gap-3 py-2 px-3 rounded-lg focus:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => router.push("/app/settings")}
              >
                <Settings className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-purple-100" />
            <DropdownMenuGroup className="space-y-0.5">
              <DropdownMenuItem className="gap-3 py-2 px-3 rounded-lg focus:bg-slate-50 transition-colors">
                <HelpCircle className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Help Center</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2 px-3 rounded-lg focus:bg-red-50 focus:text-red-700 transition-colors" onClick={handleSignOut}>
                <LogOut className="size-4" />
                <span className="text-sm font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
