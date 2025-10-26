"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { PageHeader } from "@/components/services/page-header";
import { DashboardStats } from "@/components/providers/dashboard/dashboard-stats";
import { BookingsList } from "@/components/providers/dashboard/bookings-list";
import { BookingsModal } from "@/components/providers/dashboard/bookings-modal";
import { RecentReviews } from "@/components/providers/dashboard/recent-reviews";
import { ReviewsModal } from "@/components/providers/dashboard/reviews-modal";
import { AccountDetails } from "@/components/providers/dashboard/account-details";
import type {
  Provider,
  Booking,
  Review,
} from "@/components/providers/dashboard/types";

export default function ProviderDashboardPage() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingJobs, setUpcomingJobs] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProviderData = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Fetch provider data
      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProvider(providerData);

      // Fetch bookings
      const { data: jobsData } = await supabase
        .from("bookings")
        .select("*, clients(first_name, last_name, address)")
        .eq("provider_id", session?.user?.id || "")
        .order("date", { ascending: true });
      setUpcomingJobs(jobsData || []);

      // Fetch reviews from database (removed avatar_url)
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*, clients(first_name, last_name)")
        .eq("provider_id", session?.user?.id || "")
        .order("date", { ascending: false });
      
      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
      }
      
      setReviews(reviewsData || []);
      setLoading(false);
    };
    fetchProviderData();
  }, []);

  
const handleUpdateBookingStatus = async (
  bookingId: string,
  status: "confirmed" | "rejected",
  reason?: string // ← ADD this parameter
) => {
  const supabase = createClient();
  
  // ← ADD this: Build update object with optional reason
  const updateData: { status: string; notes?: string } = { status };
  
  if (status === "rejected" && reason) {
    updateData.notes = reason;
  }

  await supabase
    .from("bookings")
    .update(updateData) // ← CHANGE from { status } to updateData
    .eq("id", bookingId);

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



  const handleMarkCompleted = async (bookingId: string) => {
    setCompletingId(bookingId);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("bookings")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (error) {
        alert(`Failed to update: ${error.message}`);
        setCompletingId(null);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const { data: jobsData, error: fetchError } = await supabase
        .from("bookings")
        .select("*, clients(first_name, last_name, address)")
        .eq("provider_id", session?.user?.id || "")
        .order("date", { ascending: true });

      if (!fetchError && jobsData) {
        setUpcomingJobs(jobsData);
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setCompletingId(null);
    }
  };

  const hasBookingPassed = (bookingDate: string, bookingTime: string) => {
    const now = new Date();
    const booking = new Date(bookingDate);

    const [time, period] = bookingTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    booking.setHours(hours, minutes, 0, 0);
    booking.setHours(booking.getHours() + 1);

    return now > booking;
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
          <DashboardStats bookings={upcomingJobs} />

          <BookingsList
            bookings={upcomingJobs}
            provider={provider}
            completingId={completingId}
            onUpdateStatus={handleUpdateBookingStatus}
            onMarkCompleted={handleMarkCompleted}
            hasBookingPassed={hasBookingPassed}
            onViewAll={() => setIsBookingsModalOpen(true)}
          />

          <RecentReviews
            reviews={reviews}
            onViewAll={() => setIsReviewsModalOpen(true)}
          />

          <AccountDetails provider={provider} loading={loading} />
        </div>
      </main>

      <Footer />

      {/* Bookings Modal */}
      <BookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={upcomingJobs}
        provider={provider}
        completingId={completingId}
        onUpdateStatus={handleUpdateBookingStatus}
        onMarkCompleted={handleMarkCompleted}
        hasBookingPassed={hasBookingPassed}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        reviews={reviews}
      />
    </div>
  );
}