import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Calendar } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ServicePageHeader } from "@/components/services/service-page-header"
import { ServiceSearchFilter } from "@/components/services/service-search-filter"
import { ServiceProvidersGrid } from "@/components/services/service-providers-grid"
import { serviceCategories } from "@/data/service-categories"
import { plumbingProviders } from "@/data/plumbing-providers"
import { electricalProviders } from "@/data/electrical-providers"
import { hvacProviders } from "@/data/hvac-providers"
import { locksmithProviders } from "@/data/locksmith-providers"

type Props = {
  params: { category: string }
  searchParams: { date?: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const category = serviceCategories.find((cat) => cat.id === params.category)

  if (!category) {
    return {
      title: "Service Not Found - HomeFix",
      description: "The requested service category could not be found",
    }
  }

  return {
    title: `${category.name} Services - HomeFix`,
    description: `Find top-rated ${category.name.toLowerCase()} professionals for all your home service needs`,
  }
}

export default function ServiceCategoryPage({ params, searchParams }: Props) {
  const { category } = params
  const { date } = searchParams

  // Find the category details
  const categoryDetails = serviceCategories.find((cat) => cat.id === category)

  if (!categoryDetails) {
    notFound()
  }

  // Get the appropriate providers based on the category
  let providers
  switch (category) {
    case "plumbing":
      providers = plumbingProviders
      break
    case "electrical":
      providers = electricalProviders
      break
    case "hvac":
      providers = hvacProviders
      break
    case "locksmith":
      providers = locksmithProviders
      break
    default:
      providers = []
  }

  // Filter providers by date if provided
  // In a real app, you would filter based on provider availability
  // For this demo, we'll just simulate filtering by showing fewer providers
  const filteredProviders = date
    ? providers.filter((_, index) => index % 2 === 0) // Just a simple filter for demo purposes
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

        <ServiceProvidersGrid providers={filteredProviders} />
      </main>

      <Footer />
    </div>
  )
}

