import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { LoginTypeSelector } from "@/components/auth/login-type-selector"

export const metadata: Metadata = {
  title: "Login - HomeFix",
  description: "Login to your HomeFix account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome Back</h1>
              <p className="mt-4 text-lg text-gray-600">Log in to access your HomeFix account</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
              <LoginTypeSelector />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}