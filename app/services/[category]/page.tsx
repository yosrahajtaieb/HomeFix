"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Calendar } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ServicePageHeader } from "@/components/services/service-page-header"
import { ServiceSearchFilter } from "@/components/services/service-search-filter"
import { ProvidersGrid } from "@/components/providers/grids/providers-grid"
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
  const [filteredProviders, setFilteredProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [sortBy, setSortBy] = useState("recommended")

  useEffect(() => {
    if (!categoryDetails) return
    
    const fetchProviders = async () => {
      const supabase = createClient()
      
      console.log("Fetching providers for category:", category)
      
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .ilike("category", category)
      
      console.log("Providers data:", data)
      console.log("Error:", error)
      
      if (error) {
        console.error("Supabase error:", error)
        setLoading(false)
        return
      }
      
      if (data && data.length > 0) {
        const providersWithReviews = await Promise.all(
          data.map(async (provider) => {
            const { data: reviewsData } = await supabase
              .from("reviews")
              .select("rating")
              .eq("provider_id", provider.id)

            const reviewCount = reviewsData?.length || 0
            const averageRating = reviewCount > 0
              ? (reviewsData?.reduce((sum, r) => sum + r.rating, 0) || 0) / reviewCount
              : 0

            return {
              ...provider,
              rating: parseFloat(averageRating.toFixed(1)),
              reviewCount: reviewCount,
              startingPrice: provider.starting_price || 0, // Map starting_price
              image: provider.image || "/placeholder1.svg",
            }
          })
        )
        
        console.log("Providers with reviews:", providersWithReviews)
        
        setProviders(providersWithReviews)
        setFilteredProviders(providersWithReviews)
      } else {
        setProviders([])
        setFilteredProviders([])
      }
      setLoading(false)
    }
    
    fetchProviders()
  }, [category, categoryDetails])

  // Apply filters whenever search/location/sort changes
  useEffect(() => {
    let result = [...providers]

    // Filter by search term (name)
    if (searchTerm) {
      result = result.filter((provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by location
    if (locationFilter) {
      result = result.filter((provider) =>
        provider.location?.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Sort providers
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "price":
        result.sort((a, b) => a.startingPrice - b.startingPrice)
        break
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      default:
        // "recommended" - keep original order or custom logic
        break
    }

    setFilteredProviders(result)
  }, [searchTerm, locationFilter, sortBy, providers])

  if (!categoryDetails) {
    notFound()
  }

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

        <ServiceSearchFilter 
          searchPlaceholder={`Search ${categoryDetails.name.toLowerCase()} providers...`}
          onSearchChange={setSearchTerm}
          onLocationChange={setLocationFilter}
          onSortChange={setSortBy}
        />

        {loading ? (
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading providers...</p>
            </div>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
            <p className="text-gray-600 text-lg">No providers found matching your criteria.</p>
          </div>
        ) : (
          <ProvidersGrid providers={filteredProviders} />
        )}
      </main>

      <Footer />
    </div>
  )
}