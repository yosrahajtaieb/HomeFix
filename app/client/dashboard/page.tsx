import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { Calendar, Clock, Star, MapPin, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Client Dashboard - HomeFix",
  description: "Manage your home service bookings and account",
}

export default function ClientDashboardPage() {
  // Mock data - in a real app, this would come from a database
  const upcomingBookings = [
    {
      id: 1,
      service: "Plumbing",
      provider: "John Smith",
      providerImage: "/placeholder.svg?height=40&width=40",
      date: "2023-06-15",
      time: "10:00 AM - 12:00 PM",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Electrical",
      provider: "Sarah Johnson",
      providerImage: "/placeholder.svg?height=40&width=40",
      date: "2023-06-20",
      time: "2:00 PM - 4:00 PM",
      status: "pending",
    },
  ]

  const favoriteProviders = [
    {
      id: 1,
      name: "John Smith",
      image: "/placeholder.svg?height=40&width=40",
      service: "Plumbing",
      rating: 4.9,
      location: "New York, NY",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=40&width=40",
      service: "Electrical",
      rating: 4.8,
      location: "Los Angeles, CA",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      description: "Booked a plumbing service with John Smith",
      date: "2023-06-10",
    },
    {
      id: 2,
      type: "review",
      description: "Left a 5-star review for Sarah Johnson",
      date: "2023-06-05",
    },
    {
      id: 3,
      type: "favorite",
      description: "Added John Smith to favorites",
      date: "2023-06-01",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader title="Client Dashboard" description="Manage your bookings and account" />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold mb-2">Upcoming Bookings</h3>
              <p className="text-gray-600 mb-4">Your scheduled services</p>
              <p className="text-3xl font-bold text-primary">{upcomingBookings.length}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold mb-2">Favorite Providers</h3>
              <p className="text-gray-600 mb-4">Your saved service providers</p>
              <p className="text-3xl font-bold text-primary">{favoriteProviders.length}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold mb-2">Completed Services</h3>
              <p className="text-gray-600 mb-4">Services you've received</p>
              <p className="text-3xl font-bold text-primary">3</p>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Bookings</h2>
              <Link
                href="/client/bookings"
                className="text-primary hover:underline flex items-center text-sm font-medium"
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {upcomingBookings.length > 0 ? (
                <div className="divide-y">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Image
                            src={booking.providerImage || "/placeholder.svg"}
                            alt={booking.provider}
                            width={48}
                            height={48}
                            className="rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{booking.service} Service</h3>
                            <p className="text-gray-600">with {booking.provider}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(booking.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="text-sm text-gray-600 hover:text-gray-900">Reschedule</button>
                        <button className="text-sm text-red-600 hover:text-red-800">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">You don't have any upcoming bookings.</p>
                  <Link href="/services" className="mt-2 inline-block text-primary hover:underline font-medium">
                    Browse services
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Favorite Providers */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Favorite Providers</h2>
              <Link href="/providers" className="text-primary hover:underline flex items-center text-sm font-medium">
                Find more providers <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteProviders.map((provider) => (
                <div key={provider.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <Image
                      src={provider.image || "/placeholder.svg"}
                      alt={provider.name}
                      width={56}
                      height={56}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      <p className="text-primary text-sm">{provider.service} Specialist</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                        <span className="mx-1.5 text-gray-300">•</span>
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-sm text-gray-500">{provider.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <Link href={`/providers/${provider.id}`} className="text-sm text-gray-600 hover:text-gray-900">
                      View Profile
                    </Link>
                    <Link
                      href={`/book/${provider.id}`}
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {recentActivity.length > 0 ? (
                <div className="divide-y">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No recent activity to display.</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Account Details</h2>
              <Link
                href="/client/profile/edit"
                className="text-primary hover:underline flex items-center text-sm font-medium"
              >
                Edit Profile <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      <p className="text-gray-900">John Doe</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                      <p className="text-gray-900">johndoe@example.com</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                      <p className="text-gray-900">(555) 123-4567</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                      <p className="text-gray-900">123 Main Street, New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
