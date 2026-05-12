"use client"

import * as React from "react"
import { 
  Brain, 
  Target, 
  Clock, 
  Link as LinkIcon, 
  Linkedin, 
  Globe, 
  ExternalLink,
  ChevronRight,
  Shield,
  Eye,
  Settings,
  Share2,
  Trophy,
  Zap,
  Sparkles,
  ArrowLeft,
  Home
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"

interface ProfileStats {
  totalAtoms: number
  monthlyAtoms: number
  hoursSaved: number
  researchStreak: number
  level: number
  topTags: { name: string; count: number }[]
  tagDistribution: { name: string; percentage: number }[]
}

export default function ProfilePage() {
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<ProfileStats>({
    totalAtoms: 0,
    monthlyAtoms: 0,
    hoursSaved: 0,
    researchStreak: 0,
    level: 1,
    topTags: [],
    tagDistribution: []
  })

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser()
        if (supaUser) {
          setUser({
            name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0],
            email: supaUser.email,
            avatar: supaUser.user_metadata?.avatar_url,
          })
          
          const response = await fetch('/api/usage/stats')
          if (response.ok) {
            const usage = await response.json()
            
            const totalAtoms = usage.totalCount || 0
            const monthlyAtoms = usage.atomsUsed || 0
            const hoursSaved = (monthlyAtoms * 0.25).toFixed(1)
            const level = Math.floor(totalAtoms / 50) + 1
            
            setStats({
              totalAtoms,
              monthlyAtoms,
              hoursSaved: parseFloat(hoursSaved),
              researchStreak: Math.min(level, 7),
              level,
              topTags: usage.topTags || [],
              tagDistribution: usage.tagDistribution || []
            })
          }
        }
      } catch (error) {
        console.error('Failed to load profile data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (!user && !loading) return null

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app">
            <Button variant="ghost" size="icon" className="h-9 w-9 border border-border/50 hover:bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-indigo-100 shadow-sm">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xl bg-indigo-50 text-indigo-700">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                  Level {stats.level} Researcher
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-orange-500 text-orange-500" />
                  {stats.researchStreak} Day Streak
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/app">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" /> Share Portfolio
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-lg shadow-indigo-100">
            <Eye className="w-4 h-4" /> View Public Site
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-50/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Atoms Captured</CardTitle>
            <Brain className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAtoms.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+{stats.monthlyAtoms} this month</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-50/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hours Saved</CardTitle>
            <Clock className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hoursSaved}h</div>
            <p className="text-xs text-muted-foreground mt-1">vs manual copy-pasting</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-50/50 shadow-sm md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Knowledge Distribution</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-4 bg-muted/50 rounded animate-pulse" />
                ))}
              </div>
            ) : stats.tagDistribution.length > 0 ? (
              <div className="space-y-3">
                {stats.tagDistribution.slice(0, 3).map((tag, i) => (
                  <div key={tag.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-muted-foreground">{tag.percentage}%</span>
                    </div>
                    <Progress value={tag.percentage} className={`h-1.5 ${i === 0 ? 'bg-indigo-50' : 'bg-emerald-50'}`} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Start saving atoms to see your knowledge distribution!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-indigo-50/50 shadow-sm">
          <CardHeader>
            <CardTitle>Research Persona</CardTitle>
            <CardDescription>How you appear to the community and Gemini AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Current Focus</label>
              <Input placeholder="e.g. Writing Thesis on Sustainable Energy" className="border-slate-200 focus:ring-indigo-500" />
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold">Professional Links</label>
              <div className="grid gap-2">
                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input placeholder="linkedin.com/in/username" className="pl-10 text-sm border-slate-200" />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input placeholder="Personal Portfolio URL" className="pl-10 text-sm border-slate-200" />
                </div>
              </div>
            </div>
            <div className="pt-4 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  Public Portfolio
                </div>
                <p className="text-[11px] text-muted-foreground">Allow others to see your curated research.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-50/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Interests</CardTitle>
              <CardDescription>Most used semantic tags.</CardDescription>
            </div>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-20 bg-muted/50 rounded-full animate-pulse" />
                  ))}
                </>
              ) : stats.topTags.length > 0 ? (
                stats.topTags.map((tag) => (
                  <Badge key={tag.name} variant="secondary" className="px-3 py-1 bg-white border border-indigo-100 text-indigo-700 hover:bg-indigo-50 cursor-default">
                    {tag.name} ({tag.count})
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags yet. Start saving atoms!</p>
              )}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pro Insight
                </h4>
                <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                  "Your research intensity in <strong>AI Ethics</strong> has increased by 15% this week. Would you like a generated summary of your latest 20 atoms?"
                </p>
                <Button size="sm" variant="secondary" className="text-indigo-700 font-bold bg-white hover:bg-indigo-50">
                  Analyze My Library
                </Button>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                <Brain className="w-48 h-48" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
