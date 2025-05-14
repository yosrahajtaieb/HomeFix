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
}

type ServiceProvidersGridProps = {
  providers: Provider[]
}

export function ServiceProvidersGrid({ providers }: ServiceProvidersGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.id}
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
                  
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  )
}

