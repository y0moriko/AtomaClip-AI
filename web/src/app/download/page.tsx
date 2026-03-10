"use client"

import { Brain, Download, Chrome, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DownloadPage() {
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
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Chrome className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-semibold">Chrome & Chromium Browsers</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Works with Chrome, Edge, Brave, and other Chromium-based browsers.
                </p>
              </div>
            </div>

            <div className="border-t" />

            <div className="space-y-4">
              <h4 className="font-medium">How to Install</h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Download the extension files below</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Open <code className="bg-muted px-1.5 py-0.5 rounded text-xs">chrome://extensions</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Enable <strong>Developer mode</strong> (top right toggle)</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <span>Click <strong>Load unpacked</strong> and select the extension folder</span>
                </li>
              </ol>
            </div>

            <div className="border-t" />

            <div className="flex flex-col gap-3">
            <a
              href="/api/download-extension"
              className="w-full"
            >
              <Button className="w-full gap-2" size="lg">
                <Download className="w-4 h-4" />
                Download Extension (ZIP)
              </Button>
            </a>
              <p className="text-xs text-center text-muted-foreground">
                Click to download all extension files, then load the folder
              </p>
            </div>
          </div>
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
