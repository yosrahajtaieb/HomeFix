import type { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import  AdminStats  from "@/components/admin/admin-stats"
import  AdminBookingsTable  from "@/components/admin/admin-bookings-table"
import  AdminUsersTable  from "@/components/admin/admin-users-table"
import  AdminProvidersTable  from "@/components/admin/admin-providers-table"

export const metadata: Metadata = {  
  title: "Admin Dashboard - HomeFix",
  description: "Manage the HomeFix platform",
}

export default async function AdminDashboardPage() {
    const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/admin/login")
  }

  // Verify user is actually an admin
  const { data: admin } = await supabase
    .from("admins")
    .select("id, email, is_superadmin")
    .eq("id", user.id)
    .maybeSingle()

  if (!admin) {
    // User is logged in but not an admin - sign them out and redirect
    await supabase.auth.signOut()
    redirect("/admin/login?error=unauthorized")
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader title="Admin Dashboard" description="Manage platform activity and users" />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Statistics */}
          <AdminStats />

          {/* Booking Management */}
          <div className="mb-12">
             <section className="pt-8"> {/* Add pt-8 for top padding */}
                <h2 className="text-3xl font-bold mb-4">Booking Management</h2>
                <AdminBookingsTable />
             </section>
          </div>

          {/* User Management */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <AdminUsersTable />
          </div>

          {/* Provider Management */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Provider Management</h2>
            <AdminProvidersTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}