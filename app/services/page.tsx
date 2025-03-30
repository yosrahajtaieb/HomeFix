import type { Metadata } from "next"
import { serviceCategories } from "@/data/service-categories"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { ServiceCategoriesGrid } from "@/components/services/service-categories-grid"
import { ServiceSearchBar } from "@/components/services/service-search-bar"

export const metadata: Metadata = {
  title: "Services - HomeFix",
  description: "Browse our professional home services: Plumbing, Electrical, HVAC, and Locksmith",
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader title="Our Services" description="Professional home services delivered by trusted experts" />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <ServiceSearchBar />
          <ServiceCategoriesGrid serviceCategories={serviceCategories} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

