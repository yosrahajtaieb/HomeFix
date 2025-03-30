import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { AllProvidersGrid } from "@/components/providers/all-providers-grid"
import { plumbingProviders } from "@/data/plumbing-providers"
import { electricalProviders } from "@/data/electrical-providers"
import { hvacProviders } from "@/data/hvac-providers"
import { locksmithProviders } from "@/data/locksmith-providers"

export const metadata: Metadata = {
  title: "All Service Providers - HomeFix",
  description: "Browse our complete directory of trusted home service professionals",
}

export default function AllProvidersPage() {
  // Combine all providers and add category information
  const allProviders = [
    ...plumbingProviders.map((provider) => ({ ...provider, categoryId: "plumbing", categoryName: "Plumbing" })),
    ...electricalProviders.map((provider) => ({ ...provider, categoryId: "electrical", categoryName: "Electrical" })),
    ...hvacProviders.map((provider) => ({ ...provider, categoryId: "hvac", categoryName: "HVAC" })),
    ...locksmithProviders.map((provider) => ({ ...provider, categoryId: "locksmith", categoryName: "Locksmith" })),
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader
          title="All Service Providers"
          description="Browse our complete directory of trusted home service professionals"
        />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <AllProvidersGrid providers={allProviders} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

