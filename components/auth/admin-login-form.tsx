"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { CheckCircle, Loader2 } from "lucide-react"
import { adminLogin } from "@/app/(auth)/actions/auth"

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Check if user is admin
        const { data: adminData } = await supabase
          .from("admins")
          .select("id")
          .eq("id", session.user.id)
          .single()
        
        if (session?.user) {
          router.replace("/")
          return // Keep loading state during redirect
        }
      }
      
      // Only set to false if user is NOT logged in as admin
      setIsChecking(false)
    }
    
    checkAuth()
  }, [router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!password) newErrors.password = "Password is required"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsLoading(true)
    setErrors({})
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const result = await adminLogin(formData)
      if (result && result.success === true) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/admin/dashboard")
          router.refresh()
        }, 1500)
      } else {
        setErrors({ form: result?.error || "Invalid email or password. Please try again." })
      }
    } catch (err) {
      setErrors({ form: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Login Successful!</h2>
        <p className="text-gray-600 mb-4">You are now logged in as an admin.</p>
        <p className="text-gray-600">Redirecting…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="admin-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
        </div>
        <input
          type="password"
          id="admin-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{errors.form}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Logging in...
          </>
        ) : (
          "Log in as Admin"
        )}
      </button>
    </form>
  )
}