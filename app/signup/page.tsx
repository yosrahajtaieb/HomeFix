import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SignupTypeSelector } from "@/components/auth/signup-type-selector"

export const metadata: Metadata = {
  title: "Sign Up - HomeFix",
  description: "Create a new HomeFix account",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Create an Account</h1>
              <p className="mt-4 text-lg text-gray-600">Join HomeFix to find services or grow your business</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <SignupTypeSelector />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

