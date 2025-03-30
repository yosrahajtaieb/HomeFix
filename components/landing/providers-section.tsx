import type React from "react"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

type Provider = {
  id: number
  name: string
  category: string
  rating: number
  reviewCount: number
  image: string
  description: string
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
            <div
              key={provider.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={provider.image || "/placeholder.svg"}
                    alt={provider.name}
                    width={64}
                    height={64}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{provider.name}</h3>
                    <p className="text-gray-600">{provider.category}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1 text-gray-800 font-medium">{provider.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-600">{provider.reviewCount} reviews</span>
                </div>
                <p className="text-gray-700 mb-4">{provider.description}</p>
                <button className="inline-flex items-center text-primary font-medium hover:underline">
                  View Profile
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            View All Providers
          </button>
        </div>
      </div>
    </section>
  )
}

