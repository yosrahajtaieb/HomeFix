"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProviderProfile } from "@/components/providers/profile/provider-profile"
import { Header } from "@/components/landing/header" // Add this import
import { createClient } from "@/utils/supabase/client"

export default function ProviderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [provider, setProvider] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProvider = async () => {
      const supabase = createClient()
      
      console.log("Fetching provider with ID:", params.id)
      
      const { data: providerData, error: providerError } = await supabase
        .from("providers")
        .select("*")
        .eq("id", params.id)
        .maybeSingle()

      console.log("Provider data:", providerData)
      console.log("Provider error:", providerError)

      if (providerError || !providerData) {
        console.error("Redirecting due to error or no data")
        router.push("/providers")
        return
      }

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("rating")
        .eq("provider_id", params.id)

      const reviewCount = reviewsData?.length || 0
      const averageRating = reviewCount > 0
        ? (reviewsData?.reduce((sum, r) => sum + r.rating, 0) || 0) / reviewCount
        : 0

      setProvider({
        ...providerData,
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: reviewCount,
      })
      setLoading(false)
    }

    fetchProvider()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header /> {/* Add header even during loading */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading provider...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return null
  }

  const availability = {
    schedule: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
      { day: "Sunday", hours: "9:00 AM - 5:00 PM" },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header /> {/* Add header */}
      <ProviderProfile provider={provider} availability={availability} />
    </div>
  )
}