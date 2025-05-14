"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { AllProvidersGrid } from "@/components/providers/all-providers-grid"
import { createClient } from "@/utils/supabase/client"

export default function AllProvidersPage() {
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("providers")
        .select("*")
      if (data) setProviders(data)
      setLoading(false)
    }
    fetchProviders()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader
          title="All Service Providers"
          description="Browse our complete directory of trusted home service professionals"
        />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <AllProvidersGrid
              providers={providers.map((provider) => ({
                ...provider,
                // Map your DB fields to the props expected by AllProvidersGrid
                id: provider.id,
                name: provider.name,
                image: provider.image || "/placeholder1.svg",
                rating: provider.rating || 0,
                reviewCount: provider.reviewCount || 0,
                description: provider.description,
                location: provider.location,
                startingPrice: provider.starting_price,
                availability: provider.availability,
                categoryId: provider.category || "",
                categoryName: provider.category || "",
              }))}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}