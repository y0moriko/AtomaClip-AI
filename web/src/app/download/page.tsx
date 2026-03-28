"use client"

import { useState, useEffect } from "react"
import { Brain, Download, Chrome, ArrowLeft, Copy, Check, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function DownloadPage() {
  const [token, setToken] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token)
      }
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 py-12 lg:py-24">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-xl shadow-indigo-500/20">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Get Started</h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-md mx-auto leading-relaxed">
            Install the AtomaClip extension to capture insights directly from any webpage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card border rounded-3xl p-6 lg:p-10 shadow-sm ring-1 ring-border/50">
            {token ? (
              <div className="space-y-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                       <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 border-none font-bold px-3 py-1 rounded-full text-[10px] tracking-widest uppercase">
                          Tutorial Guide
                       </Badge>
                       <div className="h-px flex-1 bg-border/50"></div>
                    </div>
                    
                    <div className="rounded-2xl overflow-hidden border bg-black aspect-video shadow-2xl group relative cursor-pointer ring-4 ring-background">
                       <video 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        controls
                        poster="/icon.svg"
                       >
                         <source src="/Extract.mp4" type="video/mp4" />
                         Your browser does not support the video tag.
                       </video>
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white transition-colors" />
                       </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground italic text-center leading-relaxed px-4">
                      Watch this 30-second guide on how to load AtomaClip into your browser.
                    </p>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                       <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none font-bold px-3 py-1 rounded-full text-[10px] tracking-widest uppercase">
                          Setup Steps
                       </Badge>
                       <div className="h-px flex-1 bg-border/50"></div>
                    </div>

                    <div className="space-y-5">
                      <ol className="space-y-5 text-sm">
                        <li className="flex gap-4 items-start group">
                          <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">1</span>
                          <div className="space-y-1">
                            <p className="font-bold text-foreground">Download & Extract</p>
                            <p className="text-muted-foreground text-[13px] leading-relaxed">Click below to download. Then, unzip the folder to your desktop.</p>
                          </div>
                        </li>
                        <li className="flex gap-4 items-start group">
                          <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">2</span>
                          <div className="space-y-1">
                            <p className="font-bold text-foreground">Open Extensions</p>
                            <p className="text-muted-foreground text-[13px] leading-relaxed">Type <code className="bg-muted px-1.5 py-0.5 rounded text-indigo-600 font-mono text-[11px]">brave://extensions</code> (or <code className="bg-muted px-1.5 py-0.5 rounded text-indigo-600 font-mono text-[11px]">edge://extensions</code> for Edge) in your URL bar.</p>
                          </div>
                        </li>
                        <li className="flex gap-4 items-start group">
                          <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">3</span>
                          <div className="space-y-1">
                            <p className="font-bold text-foreground">Developer Mode</p>
                            <p className="text-muted-foreground text-[13px] leading-relaxed">Toggle the switch in the top-right corner to enable developer mode.</p>
                          </div>
                        </li>
                        <li className="flex gap-4 items-start group">
                          <span className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">4</span>
                          <div className="space-y-1">
                            <p className="font-bold text-foreground">Load Unpacked</p>
                            <p className="text-muted-foreground text-[13px] leading-relaxed">Click "Load unpacked" and select your extracted folder.</p>
                          </div>
                        </li>
                      </ol>

                      <a href="/api/download-extension" className="block pt-2">
                        <Button className="w-full gap-2 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20" size="lg">
                          <Download className="w-4 h-4" />
                          Download Extension (ZIP)
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t flex flex-col items-center gap-3">
                   <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Extension Status</p>
                   <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      Synced with {token.substring(0, 8)}...
                      <Check className="w-3 h-3 ml-1" />
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                   <Chrome className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">Authentication Required</h3>
                   <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm leading-relaxed">Please log in to your account to download and sync your personal extension.</p>
                </div>
                <Link href="/login" className="block">
                  <Button className="rounded-xl px-8 font-bold h-11 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Sign In to Continue</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/app">
            <Button variant="ghost" size="sm" className="gap-2 font-bold text-muted-foreground hover:text-foreground rounded-lg">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
