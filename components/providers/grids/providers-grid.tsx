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

type ProvidersGridProps = {
  providers: Provider[]
}

export function ProvidersGrid({ providers }: ProvidersGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} {...provider} />
          ))}
        </div>
      </div>
    </section>
  )
}