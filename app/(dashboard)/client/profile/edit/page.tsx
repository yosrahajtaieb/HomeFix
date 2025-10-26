import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { ClientProfileEditForm } from "@/components/client/profile-edit-form"

export const metadata: Metadata = {
  title: "Edit Profile - HomeFix",
  description: "Update your HomeFix client profile information",
}

export default function ClientProfileEditPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader title="Edit Profile" description="Update your account information" />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <ClientProfileEditForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
