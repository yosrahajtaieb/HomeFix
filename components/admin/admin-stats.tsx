import { createClient } from "@/utils/supabase/server"
import { Calendar, Users, Wrench, TrendingUp, CheckCircle, XCircle } from "lucide-react"

export default async function AdminStats() {
  const supabase = await createClient()

  // Fetch total bookings this month
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { count: totalBookingsThisMonth } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .gte("created_at", firstDayOfMonth)

  // Fetch active providers (approved ones)
  const { count: activeProviders } = await supabase
    .from("providers")
    .select("*", { count: "exact", head: true })
    .eq("approved", true)

  // Fetch total users/clients
  const { count: totalUsers } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })

  // Fetch completed bookings this month
  const { count: completedBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "confirmed")
    .gte("created_at", firstDayOfMonth)

  // Fetch cancelled bookings this month
  const { count: cancelledBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected")
    .gte("created_at", firstDayOfMonth)

  // Fetch most requested service (most common category from bookings)
  const { data: bookingsWithProviders } = await supabase
    .from("bookings")
    .select("provider_id")
    .gte("created_at", firstDayOfMonth)

  const { data: providers } = await supabase
    .from("providers")
    .select("id, category")

  // Count occurrences of each category
  const categoryCount: { [key: string]: number } = {}
  const providerMap = new Map(providers?.map(p => [p.id, p.category]) || [])
  
  bookingsWithProviders?.forEach(booking => {
    const category = providerMap.get(booking.provider_id)
    if (category) {
      categoryCount[category] = (categoryCount[category] || 0) + 1
    }
  })

  // Find most requested service
  let mostRequestedService = "N/A"
  let maxCount = 0
  for (const [category, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count
      mostRequestedService = category
    }
  }

  const stats = {
    totalBookingsThisMonth: totalBookingsThisMonth || 0,
    activeProviders: activeProviders || 0,
    totalUsers: totalUsers || 0,
    completedBookings: completedBookings || 0,
    cancelledBookings: cancelledBookings || 0,
    mostRequestedService: mostRequestedService,
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Platform Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Bookings This Month</h3>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBookingsThisMonth}</p>
          <p className="text-sm text-gray-500 mt-1">Current month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Active Providers</h3>
            <Wrench className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeProviders}</p>
          <p className="text-sm text-gray-500 mt-1">Currently approved</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500 mt-1">Registered clients</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Completed Bookings</h3>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.completedBookings}</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Cancelled Bookings</h3>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.cancelledBookings}</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-black">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Most Requested</h3>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.mostRequestedService}</p>
          <p className="text-sm text-gray-500 mt-1">Service category</p>
        </div>
      </div>
    </div>
  )
}