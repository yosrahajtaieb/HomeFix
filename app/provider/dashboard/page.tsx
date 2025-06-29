"use client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { PageHeader } from "@/components/services/page-header";
import {
  Calendar,
  Clock,
  Star,
  DollarSign,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

/*export const metadata: Metadata = {
  title: "Provider Dashboard - HomeFix",
  description: "Manage your service business and bookings",
}*/

export default function ProviderDashboardPage() {
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingJobs, setUpcomingJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchProviderAndJobs = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      // Fetch provider info (already in your code)
      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProvider(providerData);

      // Fetch bookings for this provider, join with clients
      const { data: jobsData, error } = await supabase
        .from("bookings")
        .select("*, clients(first_name, last_name, address)")
        .eq("provider_id", session?.user?.id || "")
        .order("date", { ascending: true });

      setUpcomingJobs(jobsData || []);
      setLoading(false);
    };
    fetchProviderAndJobs();
  }, []);

  // Mock data - in a real app, this would come from a database

  const recentReviews = [
    {
      id: 1,
      client: "Emily Wilson",
      clientImage: "/placeholder1.svg?height=40&width=40",
      rating: 5,
      comment:
        "Great service! Fixed my leaky faucet quickly and professionally.",
      date: "2023-06-10",
    },
    {
      id: 2,
      client: "David Thompson",
      clientImage: "/placeholder1.svg?height=40&width=40",
      rating: 4,
      comment: "Good work on my sink installation. Would recommend.",
      date: "2023-06-05",
    },
  ];
// Add this above your return statement
const handleUpdateBookingStatus = async (bookingId: string, status: "confirmed" | "rejected") => {
  const supabase = createClient();
  await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  // Refresh jobs after update
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: jobsData } = await supabase
    .from("bookings")
    .select("*, clients(first_name, last_name, address)")
    .eq("provider_id", session?.user?.id || "")
    .order("date", { ascending: true });

  setUpcomingJobs(jobsData || []);
};
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader
          title="Provider Dashboard"
          description="Manage your service business and bookings"
        />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold mb-2">Upcoming Jobs</h3>
              <p className="text-gray-600 mb-4">Confirmed bookings</p>
              <p className="text-3xl font-bold text-primary">
                {upcomingJobs.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold mb-2">Completed Jobs</h3>
              <p className="text-gray-600 mb-4">This month</p>
              <p className="text-3xl font-bold text-primary">5</p>
            </div>
          </div>

          {/* Upcoming Jobs */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Jobs</h2>
              <Link
                href="/provider/jobs"
                className="text-primary hover:underline flex items-center text-sm font-medium"
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {upcomingJobs.length > 0 ? (
                <div className="divide-y">
                  {upcomingJobs.map((job) => (
                    <div key={job.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Image
                            src={"/placeholder1.svg"}
                            alt={
                              job.clients
                                ? `${job.clients.first_name} ${job.clients.last_name}`
                                : "Client"
                            }
                            width={48}
                            height={48}
                            className="rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {provider?.category || "Service"} Service
                            </h3>
                            <p className="text-gray-600">
                              for{" "}
                              {job.clients
                                ? `${job.clients.first_name} ${job.clients.last_name}`
                                : "Client"}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(job.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{job.time}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500 flex items-start">
                              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{job.clients?.address}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right mt-2">
  {job.status === "pending" ? (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => handleUpdateBookingStatus(job.id, "confirmed")}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
      >
        Confirm Booking
      </button>
      <button
        onClick={() => handleUpdateBookingStatus(job.id, "rejected")}
        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
      >
        Reject Booking
      </button>
    </div>
  ) : (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      job.status === "confirmed"
        ? "bg-green-100 text-green-800"
        : job.status === "rejected"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"
    }`}>
      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
    </span>
  )}
</div>
                      </div>
                      {/* ...contact/get directions buttons... */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    You don't have any upcoming jobs.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Reviews</h2>
              <Link
                href="/provider/reviews"
                className="text-primary hover:underline flex items-center text-sm font-medium"
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {recentReviews.length > 0 ? (
                <div className="divide-y">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-6">
                      <div className="flex items-start">
                        <Image
                          src={review.clientImage || "/placeholder1.svg"}
                          alt={review.client}
                          width={48}
                          height={48}
                          className="rounded-full mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{review.client}</h3>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    You don't have any reviews yet.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Account Details</h2>
              <Link
                href="/provider/profile/edit"
                className="text-primary hover:underline flex items-center text-sm font-medium"
              >
                Edit Profile <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                {loading ? (
                  <p>Loading...</p>
                ) : provider ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-900">{provider.name}</p>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Email Address
                        </label>
                        <p className="text-gray-900">{provider.email}</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Phone Number
                        </label>
                        <p className="text-gray-900">{provider.phone}</p>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Location
                        </label>
                        <p className="text-gray-900">{provider.location}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No provider data found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
