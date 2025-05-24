import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, DollarSign, Clock } from "lucide-react"

type ProviderCardProps = {
  id: number | string
  name: string
  image: string
  rating: number
  reviewCount: number
  description: string
  location: string
  startingPrice: number
  availability: string
  categoryId: string
  category: string
}

export function ProviderCard({
  id,
  name,
  image,
  rating,
  reviewCount,
  description,
  location,
  startingPrice,
  availability,
  categoryId,
  category,
}: ProviderCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Image
            src={image || "/placeholder1.svg"}
            alt={name}
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <Link href={`/services/${categoryId}`} className="text-sm text-primary hover:underline">
              {category}
            </Link>
            <div className="flex items-center mt-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
              <span className="mx-1.5 text-gray-300">•</span>
              <span className="text-sm text-gray-600">{reviewCount} reviews</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
            <span>Starting from ${startingPrice}/hour</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-blue-600" />
           <span>{availability || "Available 9am-5pm"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link href={`/providers/${id}`} className="text-primary font-medium hover:underline">
            View Profile
          </Link>
          
        </div>
      </div>
    </div>
  )
}