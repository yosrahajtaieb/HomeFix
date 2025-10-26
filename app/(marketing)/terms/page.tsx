// app/resources/page.tsx
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Coming soon! This page will contain helpful resources.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}