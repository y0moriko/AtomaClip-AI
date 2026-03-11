"use client"

import { useState, useEffect } from "react"
import { Brain, Download, Chrome, ArrowLeft, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

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

  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Download Extension</h1>
          <p className="text-muted-foreground mt-2">
            Capture insights directly from any webpage
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          {token ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                <p className="text-sm text-indigo-700 font-medium">You're logged in!</p>
                <p className="text-xs text-indigo-600 mt-1">Once you install the extension, it will automatically sync with your account. No setup required.</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Install & Setup Extension</h4>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span>Click <strong>Download Extension</strong> below to get the ZIP file.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <span>Open <code className="bg-muted px-1.5 py-0.5 rounded text-xs">chrome://extensions</code> in your browser.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <span>Enable <strong>Developer mode</strong> in the top-right corner.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                    <span>Click <strong>Load unpacked</strong> and select the extracted folder.</span>
                  </li>
                </ol>

                <a href="/api/download-extension">
                  <Button className="w-full gap-2 mt-4" size="lg">
                    <Download className="w-4 h-4" />
                    Download Extension (ZIP)
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please log in first to get started.</p>
              <Link href="/login">
                <Button className="mt-4">Log In</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/app">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
