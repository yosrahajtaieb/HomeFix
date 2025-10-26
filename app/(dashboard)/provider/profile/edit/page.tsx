import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { ProviderProfileEditForm } from "@/components/providers/forms/profile-edit-form"

export const metadata: Metadata = {
  title: "Edit Provider Profile - HomeFix",
  description: "Update your HomeFix service provider profile information",
}

export default function ProviderProfileEditPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader title="Edit Provider Profile" description="Update your business and account information" />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <ProviderProfileEditForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
