"use client"

import * as React from "react"
import { 
  User, 
  Shield, 
  Zap, 
  CreditCard, 
  Bell, 
  Puzzle, 
  Bot, 
  Workflow, 
  ArrowUpRight,
  Globe,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  Slack,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [atomsUsed, setAtomsUsed] = React.useState(14)
  const [totalLimit, setTotalLimit] = React.useState(20)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account, preferences, and integrations.</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="extension" className="gap-2">
            <Puzzle className="w-4 h-4" /> Extension
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Workflow className="w-4 h-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" /> Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="border-indigo-50/50 shadow-sm">
            <CardHeader>
              <CardTitle>Usage Tracker</CardTitle>
              <CardDescription>You are currently on the <strong>Scout (Free)</strong> plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Monthly Atoms Used</span>
                  <span className="text-muted-foreground">{atomsUsed} / {totalLimit} clips</span>
                </div>
                <Progress value={(atomsUsed / totalLimit) * 100} className="h-3 bg-indigo-50" />
                <p className="text-xs text-muted-foreground mt-2">
                  Your limit resets in 12 days.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-indigo-50/30 border-t border-indigo-50 p-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <span className="text-sm font-bold text-indigo-900">Upgrade to Scholar Pro</span>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold">
                  Get Unlimited Atoms
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="border-slate-100">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extension" className="space-y-6">
          <Card className="border-slate-100">
            <CardHeader>
              <CardTitle>Clipping Preferences</CardTitle>
              <CardDescription>Control how AtomaClip captures data from the web.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ghost Paragraph Depth</label>
                <Select defaultValue="medium">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1 sentence before/after)</SelectItem>
                    <SelectItem value="medium">Medium (Full paragraph context)</SelectItem>
                    <SelectItem value="long">Deep (Surrounding 200 words)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Higher depth provides more context but uses more tokens.</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">AI Auto-Tagging</p>
                  <p className="text-xs text-muted-foreground">Automatically generate semantic tags for every clip.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Right-Click Quick Capture</p>
                  <p className="text-xs text-muted-foreground">Enable the right-click menu for faster atoms.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-100">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                  <Layers className="w-6 h-6 text-black" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Notion</CardTitle>
                  <CardDescription>Sync atoms to your databases.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  Connect Notion <ArrowUpRight className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-slate-100">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                  <Slack className="w-6 h-6 text-[#4A154B]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Slack</CardTitle>
                  <CardDescription>Send research updates to channels.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2 text-indigo-600 border-indigo-100">
                  Manage Slack Webhook
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="border-indigo-100 bg-indigo-50/10">
            <CardHeader>
              <CardTitle>Current Plan: Scout</CardTitle>
              <CardDescription>The essential toolkit for individual researchers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₱0</span>
                  <span className="text-muted-foreground">/ month</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> 20 Atomic Clips per month
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground/30" /> PDF Clipping Support (Pro)
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t border-indigo-100 pt-6">
              <div className="grid gap-2 w-full">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred PH Payments</p>
                <div className="flex gap-4 grayscale opacity-50">
                  <span className="font-bold text-xl italic text-blue-600">GCash</span>
                  <span className="font-bold text-xl italic text-green-600">Maya</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
