"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Calendar } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ServicePageHeader } from "@/components/services/service-page-header"
import { ServiceSearchFilter } from "@/components/services/service-search-filter"
import { ServiceProvidersGrid } from "@/components/services/service-providers-grid"
import { serviceCategories } from "@/data/service-categories"
import { createClient } from "@/utils/supabase/client"

type Props = {
  params: { category: string }
  searchParams: { date?: string }
}

export default function ServiceCategoryPage({ params, searchParams }: Props) {
  const { category } = params
  const { date } = searchParams

  const categoryDetails = serviceCategories.find((cat) => cat.id === category)
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categoryDetails) return
    const fetchProviders = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("category", category)
      setProviders(data || [])
      setLoading(false)
    }
    fetchProviders()
  }, [category, categoryDetails])

  if (!categoryDetails) {
    notFound()
  }

  // Optionally filter by date if you want
  const filteredProviders = date
    ? providers.filter((_, index) => index % 2 === 0)
    : providers

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <ServicePageHeader
          title={`${categoryDetails.name} Services`}
          description={`Find top-rated ${categoryDetails.name.toLowerCase()} professionals in your area`}
        />

        {date && (
          <div className="container mx-auto px-4 sm:px-6 mt-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="ml-3 text-sm text-blue-700">
                  Showing providers available on <strong>{new Date(date).toLocaleDateString()}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <ServiceSearchFilter searchPlaceholder={`Search ${categoryDetails.name.toLowerCase()} providers...`} />

        {loading ? (
          <div className="container mx-auto px-4 sm:px-6 py-8">Loading...</div>
        ) : (
          <ServiceProvidersGrid providers={filteredProviders} />
        )}
      </main>

      <Footer />
    </div>
  )
}