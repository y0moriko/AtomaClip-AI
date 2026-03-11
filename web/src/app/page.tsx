import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Sparkles, 
  Brain, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Chrome,
  MessageSquare,
  Globe,
  Quote
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AtomaClip AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm font-medium">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full -z-10" />
          <Badge variant="secondary" className="mb-6 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 mr-2 text-indigo-500" />
            For High-Velocity Researchers
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Your Second Brain, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Automated.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Tired of losing valuable insights in a sea of bookmarks? AtomaClip captures web data, 
            auto-tags it with AI, and builds your searchable knowledge base instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="text-base px-10 py-7 rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-transform">
                Create Your Knowledge Brain
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> AI Auto-Tagging</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Semantic Search</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free to Start</span>
          </div>
        </div>
      </section>

      {/* Trust / Proof Section */}
      <section className="py-12 border-y bg-muted/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
             <div className="flex items-center gap-2 font-bold text-xl italic tracking-tighter">CONTENT STRATEGISTS</div>
             <div className="flex items-center gap-2 font-bold text-xl italic tracking-tighter">AI ENGINEERS</div>
             <div className="flex items-center gap-2 font-bold text-xl italic tracking-tighter">LEGAL RESEARCHERS</div>
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Bookmarks are where <br />
                <span className="text-red-500 underline decoration-wavy underline-offset-4">ideas go to die.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Traditional saving tools are manual, slow, and impossible to search. 
                AtomaClip solves the "Researcher's Tax"—the hours lost looking for that one 
                paragraph you saved three months ago.
              </p>
              <ul className="space-y-4">
                {[
                  "Context Preservation: AI saves surrounding text automatically.",
                  "Zero Manual Work: No more manually typing tags or categories.",
                  "Meaning-Based Search: Find it even if you forgot the exact words."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium">
                    <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Zap className="w-3 h-3 text-indigo-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-3xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full" />
               <Quote className="w-12 h-12 text-indigo-200 mb-6" />
               <p className="text-xl italic font-medium mb-6 relative z-10">
                 "I used to spend 4 hours a week organizing research notes. Now AtomaClip does it 
                 while I sleep. The semantic search is a complete game changer for my prompt engineering workflow."
               </p>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-indigo-500" />
                 <div>
                   <p className="font-bold">Sarah Chen</p>
                   <p className="text-sm text-muted-foreground">Lead AI Prompt Engineer</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Visual) */}
      <section id="how-it-works" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Capture to Insight in 3 Steps</h2>
            <p className="text-muted-foreground">Everything you need to build your knowledge base without the friction.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Highlight & Capture",
                description: "Select any text on the web. Our extension grabs the clip and the 'ghost paragraphs' around it for context.",
                icon: Globe,
                color: "bg-blue-500"
              },
              {
                title: "AI Auto-Classification",
                description: "AtomaClip uses NLP to generate accurate, semantic tags instantly. Your vault organizes itself.",
                icon: Sparkles,
                color: "bg-purple-500"
              },
              {
                title: "Semantic Retrieval",
                description: "Search by concepts. Ask your brain questions instead of fishing for keywords.",
                icon: Search,
                color: "bg-indigo-500"
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 bg-background border rounded-3xl hover:shadow-xl transition-shadow relative overflow-hidden">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-indigo-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/40">
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-400/20 blur-3xl rounded-full" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
            Stop searching. <br />
            Start discovering.
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
            Join the beta today and build your personal knowledge brain. Free for your first 20 atoms.
          </p>
          <Link href="/signup" className="relative z-10">
            <Button size="lg" variant="secondary" className="text-indigo-600 px-10 py-7 text-lg font-bold rounded-2xl bg-white hover:bg-indigo-50 border-none">
              Build Your Brain Now
            </Button>
          </Link>
          <p className="mt-6 text-sm text-indigo-200 opacity-80 relative z-10">
            <Chrome className="w-4 h-4 inline mr-2" />
            Chrome Extension installation provided after sign up.
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-4 border-t border-muted">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">AtomaClip AI</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <Link href="/login" className="hover:text-foreground">Login</Link>
            <Link href="/signup" className="hover:text-foreground">Sign Up</Link>
            <Link href="mailto:feedback@atomaclip.ai" className="hover:text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Feedback
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-bold">
            © 2026 AtomaClip AI
          </p>
        </div>
      </footer>
    </div>
  )
}
