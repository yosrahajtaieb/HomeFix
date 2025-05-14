"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, DollarSign, Clock } from "lucide-react"

type Provider = {
  id: number
  name: string
  image: string
  rating: number
  reviewCount: number
  description: string
  location: string
  startingPrice: number
  availability: string
  categoryId: string
  categoryName: string
}

type AllProvidersGridProps = {
  providers: Provider[]
}

export function AllProvidersGrid({ providers }: AllProvidersGridProps) {
  const [sortOption, setSortOption] = useState("recommended")

  // Sort providers based on selected option
  const sortedProviders = [...providers].sort((a, b) => {
    switch (sortOption) {
      case "highest-rated":
        return b.rating - a.rating
      case "lowest-price":
        return a.startingPrice - b.startingPrice
      case "most-reviews":
        return b.reviewCount - a.reviewCount
      default:
        // For "recommended", we'll use a combination of rating and reviews
        return b.rating * b.reviewCount - a.rating * a.reviewCount
    }
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">{providers.length} Service Providers</h2>

        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none bg-white border rounded-md pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="most-reviews">Most Reviews</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 8l4 4 4-4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProviders.map((provider) => (
          <div
            key={`${provider.categoryId}-${provider.id}`}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={provider.image || "/placeholder1.svg"}
                  alt={provider.name}
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold">{provider.name}</h3>
                  <Link href={`/services/${provider.categoryId}`} className="text-sm text-primary hover:underline">
                    {provider.categoryName}
                  </Link>
                  <div className="flex items-center mt-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                    <span className="mx-1.5 text-gray-300">•</span>
                    <span className="text-sm text-gray-600">{provider.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{provider.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {provider.location}
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  <span>Starting from ${provider.startingPrice}/hour</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  <span>{provider.availability}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Link href={`/providers/${provider.id}`} className="text-primary font-medium hover:underline">
                  View Profile
                </Link>
                <Link
                  href={`/book/${provider.id}`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  )
}

