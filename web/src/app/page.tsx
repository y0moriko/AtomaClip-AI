import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Sparkles, 
  Brain, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Chrome,
  MessageSquare,
  Download,
  ExternalLink
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">AtomaClip AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Research Assistant
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Capture Knowledge at the
            <span className="text-indigo-600"> Speed of Thought</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform how you collect and retrieve web insights. Highlight anything, 
            find anything. Your personal AI-powered knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-500" />
            Free for first 20 clips • No credit card required
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How AtomaClip Works</h2>
          <p className="text-center text-muted-foreground mb-12">
            Three simple steps to build your personal knowledge brain
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Highlight & Capture",
                description: "Select any text on any webpage, right-click, and capture. The AI automatically saves context around your clip.",
                icon: Search
              },
              {
                step: "02", 
                title: "AI Auto-Tags",
                description: "Our AI analyzes your clip and generates relevant tags automatically. No manual tagging needed.",
                icon: Sparkles
              },
              {
                step: "03",
                title: "Semantic Search",
                description: "Search by meaning, not keywords. Ask 'Why are electric cars expensive?' and find related clips instantly.",
                icon: Brain
              }
            ].map((item) => (
              <Card key={item.step} className="relative">
                <CardContent className="pt-8">
                  <span className="text-6xl font-bold text-muted/20 absolute top-4 right-4">
                    {item.step}
                  </span>
                  <item.icon className="w-10 h-10 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Vector Semantic Search",
                description: "Find clips by meaning, not just exact words. AI understands context."
              },
              {
                icon: Sparkles,
                title: "Auto-Tagging",
                description: "AI generates relevant tags automatically from clip content."
              },
              {
                icon: Search,
                title: "Ghost Paragraphs",
                description: "AI saves 2 sentences before and after for full context later."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Capture insights in seconds. Built for high-velocity researchers."
              },
              {
                icon: Users,
                title: "Team Brains",
                description: "Share clips with teammates. (Coming soon: Team plans)"
              },
              {
                icon: MessageSquare,
                title: "Daily Spark",
                description: "Get 3 related clips every morning to connect research dots."
              }
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4 p-4 rounded-lg border bg-card">
                <feature.icon className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Who Is This For?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Content Strategists",
                description: "Save research clips for content briefs and strategy docs."
              },
              {
                title: "AI Prompt Engineers",
                description: "Build your personal library of prompt examples and patterns."
              },
              {
                title: "Legal Researchers",
                description: "Collect case references quickly with full context preserved."
              }
            ].map((person) => (
              <Card key={person.title}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{person.title}</h3>
                  <p className="text-sm text-muted-foreground">{person.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground mb-12">Start free, upgrade when you need more</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="border-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="text-3xl font-bold mt-2">$0</p>
                <p className="text-sm text-muted-foreground mt-2">forever</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> 20 clips/month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> AI auto-tagging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Semantic search
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-indigo-600">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Pro</h3>
                  <Badge>Most Popular</Badge>
                </div>
                <p className="text-3xl font-bold mt-2">$5</p>
                <p className="text-sm text-muted-foreground mt-2">per month</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited clips
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Advanced search
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Team features
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Early Access / Sign Up */}
      <section id="signup" className="py-20 px-4 bg-indigo-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Early Access</h2>
          <p className="text-indigo-100 mb-8">
            Join 10+ researchers building their knowledge brains. 
            Be the first to try new features.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white text-foreground"
              required
            />
            <Button type="submit" variant="secondary" size="lg">
              Join Waitlist
            </Button>
          </form>
          <p className="mt-4 text-sm text-indigo-200">
            <Chrome className="w-4 h-4 inline mr-1" />
            Chrome Extension coming soon to Web Store
          </p>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Have Feedback?</h2>
          <p className="text-muted-foreground mb-8">
            We're building this for you. Tell us what works, what doesn't, 
            and what features you need.
          </p>
          <a href="mailto:feedback@atomaclip.ai">
            <Button variant="outline" size="lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              Share Your Feedback
            </Button>
          </a>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Download for Chrome</h2>
            <p className="text-muted-foreground">
              Install the extension directly in your browser. No account required to start.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <Chrome className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Option 1: Direct Download (Free)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download the extension files and load them manually. Best for beta testing.
                  </p>
                  <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                    <li>Download the extension ZIP file from our GitHub releases</li>
                    <li>Extract the ZIP file to a folder</li>
                    <li>Open Chrome → Settings → Extensions</li>
                    <li>Enable "Developer mode" (top right toggle)</li>
                    <li>Click "Load unpacked" and select the extracted folder</li>
                  </ol>
                  <Button className="mt-4" asChild>
                    <a href="https://github.com/yourusername/atomaclip/releases" target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download ZIP
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-green-600 font-bold">Soon</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Option 2: Chrome Web Store</h3>
                  <p className="text-sm text-muted-foreground">
                    Find us on the Chrome Web Store for one-click installation. Coming soon!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">AtomaClip AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 AtomaClip AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
