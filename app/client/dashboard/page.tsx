"use client"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { Calendar, Clock, Star, MapPin, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";


/*export const metadata: Metadata = {
  title: "Client Dashboard - HomeFix",
  description: "Manage your home service bookings and account",
}*/

export default function ClientDashboardPage() {
  const [client, setClient] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchClient = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setClient(data);
    setLoading(false);
  };
  fetchClient();
}, []);
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
      {loading ? (
        <p>Loading...</p>
      ) : client ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-gray-900">{client.first_name} {client.last_name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900">{client.email}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              <p className="text-gray-900">{client.phone}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
              <p className="text-gray-900">{client.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No client data found.</p>
      )}
    </div>
  </div>
</div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
