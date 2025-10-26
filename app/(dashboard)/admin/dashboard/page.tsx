import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { PageHeader } from "@/components/services/page-header";
import AdminStats from "@/components/admin/dashboard/admin-stats";
import AdminBookingsTable from "@/components/admin/dashboard/admin-bookings-table";
import AdminUsersTable from "@/components/admin/dashboard/admin-users-table";
import AdminProvidersTable from "@/components/admin/dashboard/admin-providers-table";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  // Use getUser() instead of getSession() for security
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

 
  if (!user) {
    console.log("No user, redirecting to login"); // DEBUG
    redirect("/login");
  }

  // Check if user is an admin
  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("id, email, is_superadmin")
    .eq("id", user.id)
    .maybeSingle();

 
  if (!adminData) {
    console.log("Not an admin, redirecting to home"); // DEBUG
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader
          title="Admin Dashboard"
          description="Manage platform activity and users"
        />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <AdminStats />

          <div className="mb-12">
            <section className="pt-8">
              <h2 className="text-3xl font-bold mb-4">Booking Management</h2>
              <AdminBookingsTable />
            </section>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <AdminUsersTable />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Provider Management</h2>
            <AdminProvidersTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}