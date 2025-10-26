"use client"

import { useState } from "react"
import { ProviderCard } from "../cards/provider-card"

type Provider = {
  id: number | string
  name: string
  image: string
  rating: number
  reviewCount: number
  description: string
  location: string
  startingPrice: number
  available_from: string
  categoryId?: string
  category?: string
}

type SortableProvidersGridProps = {
  providers: Provider[]
}

export function SortableProvidersGrid({ providers }: SortableProvidersGridProps) {
  const [sortOption, setSortOption] = useState("recommended")

  const sortedProviders = [...providers].sort((a, b) => {
    switch (sortOption) {
      case "highest-rated":
        return b.rating - a.rating
      case "lowest-price":
        return a.startingPrice - b.startingPrice
      case "most-reviews":
        return b.reviewCount - a.reviewCount
      default:
        return b.rating * b.reviewCount - a.rating * a.reviewCount
    }
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">
          {providers.length} Service Providers
        </h2>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-white border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="highest-rated">Highest Rated</option>
          <option value="lowest-price">Lowest Price</option>
          <option value="most-reviews">Most Reviews</option>
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProviders.map((provider) => (
          <ProviderCard key={provider.id} {...provider} />
        ))}
      </div>
    </div>
  )
}