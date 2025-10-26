"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { PageHeader } from "@/components/services/page-header";
import { DashboardStats } from "@/components/client/dashboard/dashboard-stats";
import { BookingsList } from "@/components/client/dashboard/bookings-list";
import { BookingsModal } from "@/components/client/dashboard/bookings-modal";
import { AccountDetails } from "@/components/client/dashboard/account-details";
import type {
  Client,
  Booking,
} from "@/components/client/dashboard/types";

export default function ClientDashboardPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Fetch client info
      const { data: clientData } = await supabase
        .from("clients")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setClient(clientData);

      // Fetch bookings with provider info
      const { data: bookingsData, error } = await supabase
        .from("bookings")
        .select("*, providers(name, category)")
        .eq("client_id", session.user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching bookings:", error);
      }

      setBookings(bookingsData || []);
      setLoading(false);
    };

    fetchClientData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader
          title="Client Dashboard"
          description="Manage your bookings and account"
        />

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <DashboardStats bookings={bookings} />

          <BookingsList
            bookings={bookings}
            onViewAll={() => setIsBookingsModalOpen(true)}
          />

          <AccountDetails client={client} loading={loading} />
        </div>
      </main>

      <Footer />

      {/* Bookings Modal */}
      <BookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
      />
    </div>
  );
}