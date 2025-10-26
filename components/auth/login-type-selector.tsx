"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { ClientLoginForm } from "./client-login-form"
import { ProviderLoginForm } from "./provider-login-form"
import Link from "next/link"

type UserType = "client" | "provider" | null

export function LoginTypeSelector() {
  const [selectedType, setSelectedType] = useState<UserType>("client")
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // User is already logged in, redirect to homepage
        router.replace("/")
        return
      }
      
      // Only set to false if user is NOT logged in
      setIsChecking(false)
    }
    
    checkAuth()
  }, [router])

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex rounded-md overflow-hidden border">
          <button
            type="button"
            onClick={() => setSelectedType("client")}
            className={`flex-1 py-3 text-center font-medium ${
              selectedType === "client" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("provider")}
            className={`flex-1 py-3 text-center font-medium ${
              selectedType === "provider" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Service Provider
          </button>
        </div>
      </div>

      {selectedType === "client" && <ClientLoginForm />}
      {selectedType === "provider" && <ProviderLoginForm />}

      <div className="mt-6 text-right">
        <Link href="/admin/login" className="text-sm text-gray-600 hover:text-primary underline">
          Login as Admin
        </Link>
      </div>
    </div>
  )
}