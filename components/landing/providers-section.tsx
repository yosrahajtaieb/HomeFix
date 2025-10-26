import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { ProviderCard } from "@/components/providers/cards/provider-card"
type Provider = {
  id: number | string
  name: string
  image: string
rating?: number
  reviewCount?: number
  description: string
  location?: string
  startingPrice?: number
  available_from?: string
  categoryId?: string
  category: string
}

type ProvidersSectionProps = {
  featuredProviders: Provider[]
  forwardedRef: React.RefObject<HTMLElement>
}

export function ProvidersSection({ featuredProviders, forwardedRef }: ProvidersSectionProps) {
  return (
    <section ref={forwardedRef} className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Top Rated Providers</h2>
          <p className="mt-4 text-lg text-gray-600">Meet some of our highest-rated service professionals</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              id={provider.id}
              name={provider.name}
              image={provider.image}
             rating={provider.rating ?? 0}
              reviewCount={provider.reviewCount ?? 0}
              description={provider.description}
              location={provider.location ?? ""}
              startingPrice={provider.startingPrice ?? 0}
              available_from={provider.available_from ?? ""}
              categoryId={provider.categoryId ?? ""}
              category={provider.category}
              />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/providers"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            View All Providers
          </Link>
        </div>
      </div>
    </section>
  )
}

