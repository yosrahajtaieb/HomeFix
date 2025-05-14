import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function ProviderNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Provider Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">Sorry, we couldn't find the service provider you're looking for.</p>
          <Link
            href="/providers"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90"
          >
            Browse All Providers
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
