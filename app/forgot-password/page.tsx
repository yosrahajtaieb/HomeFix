import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - HomeFix",
  description: "Reset your HomeFix account password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Forgot Password</h1>
              <p className="mt-4 text-lg text-gray-600">Enter your email to reset your password</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <ForgotPasswordForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

