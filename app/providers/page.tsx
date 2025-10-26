"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { SortableProvidersGrid } from "@/components/providers/grids/sortable-providers-grid"
import { createClient } from "@/utils/supabase/client"

export default function AllProvidersPage() {
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchProviders = async () => {
    const supabase = createClient();
    
    const { data: providersData } = await supabase
      .from("providers")
      .select("*");
    
    if (providersData) {
      // Calculate ratings for each provider
      const providersWithReviews = await Promise.all(
        providersData.map(async (provider) => {
          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("rating")
            .eq("provider_id", provider.id);

          const reviewCount = reviewsData?.length || 0;
          const averageRating = reviewCount > 0
            ? (reviewsData?.reduce((sum, r) => sum + r.rating, 0) || 0) / reviewCount
            : 0;

          return {
            ...provider,
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount: reviewCount,
            image: provider.image || "/placeholder1.svg",
          };
        })
      );

      setProviders(providersWithReviews);
    }
    setLoading(false);
  };
  fetchProviders();
}, []);

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
            <SortableProvidersGrid
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
                availableFrom: provider.available_from,
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