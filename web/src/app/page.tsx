import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Brain, 
  ArrowRight, 
  CheckCircle2,
  Chrome,
  MessageSquare,
  Globe,
  Zap,
  Search,
  BookOpen,
  Shield,
  Users,
  Star
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">AtomaClip</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm font-medium">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 text-sm">
            <Sparkles className="w-3 h-3 mr-2" />
            For High-Velocity Researchers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Your Second Brain, <br />
            <span className="text-indigo-600">Automated.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            AtomaClip captures web content, auto-tags it with AI, and builds your searchable knowledge base instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Start Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> AI Auto-Tagging</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Semantic Search</span>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-6">TRUSTED BY RESEARCHERS AT</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground/60">
            <span className="font-semibold">Content Strategists</span>
            <span className="font-semibold">AI Engineers</span>
            <span className="font-semibold">Legal Researchers</span>
            <span className="font-semibold">Academic Teams</span>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Bookmarks are where <span className="text-red-500">ideas go to die.</span>
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Traditional saving tools are manual, slow, and impossible to search. 
            AtomaClip solves the time lost looking for that one paragraph you saved months ago.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <Zap className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
              <p className="text-sm font-medium">Context Preservation</p>
              <p className="text-xs text-muted-foreground">AI saves surrounding text automatically</p>
            </div>
            <div className="text-center p-4">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
              <p className="text-sm font-medium">Zero Manual Work</p>
              <p className="text-xs text-muted-foreground">No more typing tags or categories</p>
            </div>
            <div className="text-center p-4">
              <Search className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
              <p className="text-sm font-medium">Meaning-Based Search</p>
              <p className="text-xs text-muted-foreground">Find it even if you forgot the exact words</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl border">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Capture</h3>
              <p className="text-sm text-muted-foreground">
                Select any text on the web. Our extension grabs the clip and context around it.
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl border">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Auto-Tag</h3>
              <p className="text-sm text-muted-foreground">
                AtomaClip generates accurate, semantic tags instantly. Your vault organizes itself.
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl border">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Search</h3>
              <p className="text-sm text-muted-foreground">
                Search by concepts. Ask your brain questions instead of fishing for keywords.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">Everything You Need</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Web Clipper", desc: "Save any article with one click" },
              { icon: Sparkles, title: "AI Tagging", desc: "Automatic semantic categorization" },
              { icon: Search, title: "Semantic Search", desc: "Find by meaning, not just keywords" },
              { icon: Shield, title: "Private by Default", desc: "Your data stays yours" },
              { icon: Users, title: "Team Sharing", desc: "Collaborate on research" },
              { icon: Star, title: "Export Ready", desc: "Download your knowledge anytime" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Stop searching. Start discovering.
          </h2>
          <p className="text-indigo-100 mb-8">
            Join the beta today and build your personal knowledge brain. Free for your first 20 clips.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-indigo-600 font-medium">
              Get Started Free
            </Button>
          </Link>
          <p className="mt-6 text-sm text-indigo-200">
            <Chrome className="w-4 h-4 inline mr-1" />
            Chrome Extension available after sign up
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">AtomaClip</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Login</Link>
            <Link href="/signup" className="hover:text-foreground">Sign Up</Link>
            <a href="mailto:feedback@atomaclip.ai" className="hover:text-foreground flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Feedback
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 AtomaClip
          </p>
        </div>
      </footer>
    </div>
  )
}
