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
  HelpCircle
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
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

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
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-indigo-500/10 shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs">
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
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl border-indigo-100 shadow-2xl p-1.5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg ring-2 ring-indigo-500/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-indigo-50 text-indigo-700 font-bold">
                    {userInitials || "AR"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-slate-800">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-indigo-50" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-lg focus:bg-indigo-600 focus:text-white group transition-all">
                <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center group-focus:bg-white/20">
                  <Sparkles className="size-4 text-indigo-600 group-focus:text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Upgrade to Pro</span>
                  <span className="text-[10px] text-muted-foreground group-focus:text-white/80 leading-none mt-0.5">Unlock unlimited atoms</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-indigo-50" />
            <DropdownMenuGroup className="space-y-0.5">
              <DropdownMenuItem className="gap-3 py-2 px-3 rounded-lg focus:bg-slate-50 transition-colors">
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2 px-3 rounded-lg focus:bg-slate-50 transition-colors">
                <CreditCard className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-2 px-3 rounded-lg focus:bg-slate-50 transition-colors">
                <Settings className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-indigo-50" />
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
