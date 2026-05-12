"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" }
  })
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50"
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold text-xl">AtomaClip</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm font-medium">Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-24 px-4 relative">
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <Badge variant="outline" className="mb-6 text-sm">
              <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
              For High-Velocity Researchers
            </Badge>
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            Stop Bookmarking. <br />
            <motion.span 
              className="text-indigo-600 inline-block"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Start Clipping.
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            A lightweight Chrome extension to capture specific web insights. 
            Search your library by <span className="text-foreground font-semibold underline decoration-indigo-500/30">meaning</span>, not just keywords.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="px-10 h-14 text-lg font-bold shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 transition-all">
                  Add to Chrome — Setup in 30s
                  <motion.div
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2"
                  >
                    <Chrome className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border rounded-2xl p-8 bg-muted/20"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Zap, title: "Save Atoms, Not URLs", desc: "Capture the exact sentence or paragraph you need, not the whole page." },
              { icon: Brain, title: "Ghost Paragraphs", desc: "We automatically save the context before and after every clip you make." },
              { icon: Search, title: "Semantic Search", desc: "Ask questions like 'What was that fact about GDP?' to find your notes instantly." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={cardFadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="space-y-2 cursor-default"
              >
                <div className="flex items-center gap-2 font-bold text-indigo-600">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.div>
                  <span>{item.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <motion.section 
        className="py-10 border-y bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.p 
            className="text-sm font-medium text-muted-foreground mb-6"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            TRUSTED BY RESEARCHERS AT
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground/60"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {["Content Strategists", "AI Engineers", "Legal Researchers", "Academic Teams"].map((item, i) => (
              <motion.span 
                key={i}
                variants={fadeInUp}
                custom={i * 0.1}
                className="font-semibold hover:text-indigo-600 transition-colors cursor-default"
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Problem */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            className="text-2xl font-bold mb-6 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Bookmarks are where <span className="text-red-500">ideas go to die.</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Traditional saving tools are manual, slow, and impossible to search. 
            AtomaClip solves the time lost looking for that one paragraph you saved months ago.
          </motion.p>
          <motion.div 
            className="grid sm:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Zap, title: "Context Preservation", desc: "AI saves surrounding text automatically" },
              { icon: Sparkles, title: "Zero Manual Work", desc: "No more typing tags or categories" },
              { icon: Search, title: "Meaning-Based Search", desc: "Find it even if you forgot the exact words" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={cardFadeIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="text-center p-4 rounded-xl hover:bg-muted/30 transition-colors cursor-default"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="inline-block"
                >
                  <item.icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                </motion.div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-20 px-4 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-2xl font-bold mb-12 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Globe, bg: "bg-blue-100", color: "text-blue-600", step: "1", title: "Capture", desc: "Select any text on the web. Our extension grabs the clip and context around it." },
              { icon: Sparkles, bg: "bg-purple-100", color: "text-purple-600", step: "2", title: "Auto-Tag", desc: "AtomaClip generates accurate, semantic tags instantly. Your vault organizes itself." },
              { icon: Search, bg: "bg-indigo-100", color: "text-indigo-600", step: "3", title: "Search", desc: "Search by concepts. Ask your brain questions instead of fishing for keywords." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={cardFadeIn}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-background p-6 rounded-xl border relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <motion.div 
                  className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-4 relative z-10`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </motion.div>
                <h3 className="font-semibold mb-2 relative z-10">{item.step}. {item.title}</h3>
                <p className="text-sm text-muted-foreground relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-2xl font-bold mb-12 text-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything You Need
          </motion.h2>
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: BookOpen, title: "Web Clipper", desc: "Save any article with one click" },
              { icon: Sparkles, title: "AI Tagging", desc: "Automatic semantic categorization" },
              { icon: Search, title: "Semantic Search", desc: "Find by meaning, not just keywords" },
              { icon: Shield, title: "Private by Default", desc: "Your data stays yours" },
              { icon: Users, title: "Team Sharing", desc: "Collaborate on research" },
              { icon: Star, title: "Export Ready", desc: "Download your knowledge anytime" },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={cardFadeIn}
                whileHover={{ x: 5, backgroundColor: "hsl(var(--muted)/0.3)" }}
                className="flex gap-4 p-4 rounded-lg transition-colors cursor-default"
              >
                <motion.div 
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        className="py-20 px-4 bg-indigo-600 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-2xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Stop searching. Start discovering.
          </motion.h2>
          <motion.p 
            className="text-indigo-100 mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join the beta today and build your personal knowledge brain. Free for your first 20 clips.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" className="text-indigo-600 font-medium">
                  Get Started Free
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          <motion.p 
            className="mt-6 text-sm text-indigo-200"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Chrome className="w-4 h-4 inline mr-1" />
            Chrome Extension available after sign up
          </motion.p>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="py-10 px-4 border-t"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-semibold">AtomaClip</span>
          </motion.div>
          <motion.div 
            className="flex gap-6 text-sm text-muted-foreground"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} custom={0}>
              <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            </motion.div>
            <motion.div variants={fadeInUp} custom={0.1}>
              <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            </motion.div>
            <motion.div variants={fadeInUp} custom={0.2}>
              <a href="mailto:feedback@atomaclip.ai" className="hover:text-foreground flex items-center gap-1 transition-colors">
                <MessageSquare className="w-3 h-3" /> Feedback
              </a>
            </motion.div>
          </motion.div>
          <p className="text-xs text-muted-foreground">
            © 2026 AtomaClip
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
