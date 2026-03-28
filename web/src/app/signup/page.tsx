"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Brain, Loader2, Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/app")
      }
    })
  }, [router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
        <Card className="w-full max-w-md shadow-2xl border-indigo-100 p-6">
          <CardContent className="pt-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Almost there!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We've sent a confirmation link to <strong className="text-indigo-600 font-bold">{email}</strong>. 
              Please check your email to activate your account.
            </p>
            <div className="w-full flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all">
                  Sign in to your account
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="ghost" className="w-full text-slate-500 font-medium hover:text-slate-900 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-indigo-100">
        <CardHeader className="text-center pb-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 mx-auto hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">AtomaClip</span>
          </Link>
          <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">Create your account</CardTitle>
          <CardDescription className="text-slate-500 font-medium mt-1">
            Start your free research trial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-11 font-semibold border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-medium tracking-wider">Or register with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Free Account
            </Button>
          </form>
          <div className="text-center text-sm">
            <span className="text-muted-foreground font-medium">Already have an account?</span>{" "}
            <Link href="/login" className="text-indigo-600 font-extrabold hover:underline decoration-2 underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
