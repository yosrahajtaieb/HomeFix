import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ProviderRegistrationForm } from "@/components/auth/provider-registration-form"

export const metadata: Metadata = {
  title: "Become a Provider - HomeFix",
  description: "Join our network of trusted home service professionals",
}

export default function BecomeProviderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Become a Provider</h1>
              <p className="mt-4 text-lg text-gray-600">
                Join our network of trusted professionals and grow your business
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <ProviderRegistrationForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

