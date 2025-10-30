"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  Trash2,
} 

from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { BookingDetailsModal } from "./booking-details-modal";
import { sendClientBookingStatusUpdate } from "@/app/actions/booking-actions";

type Booking = {
  id: string;
  client_id: string;
  provider_id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "rejected" | "completed";
  notes: string | null;
  created_at: string;
  client?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
  };
  provider?: {
    name: string;
    email: string;
    phone: string;
    location: string;
    category: string;
    starting_price: number;
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

export default function AdminBookingsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "earliest">("latest");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);

    // Fetch all bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      setLoading(false);
      return;
    }

    // Fetch all clients with all required fields
    const { data: clients } = await supabase
      .from("clients")
      .select("id, first_name, last_name, email, phone, address");

    // Fetch all providers with all required fields
    const { data: providers } = await supabase
      .from("providers")
      .select("id, name, category, starting_price, email, phone, location");

    // Fetch all reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("provider_id, client_id, rating, comment, date");

    // Create lookup maps
    const clientMap = new Map(clients?.map((c) => [c.id, c]) || []);
    const providerMap = new Map(providers?.map((p) => [p.id, p]) || []);

    // Create review lookup map with composite key
    const reviewMap = new Map(
      reviews?.map((r) => [`${r.client_id}_${r.provider_id}`, r]) || []
    );

    // Merge data
    const enrichedBookings =
      bookingsData?.map((booking) => ({
        ...booking,
        client: clientMap.get(booking.client_id),
        provider: providerMap.get(booking.provider_id),
        review: reviewMap.get(`${booking.client_id}_${booking.provider_id}`),
      })) || [];

    setBookings(enrichedBookings);
    setLoading(false);
  };

  const handleConfirm = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", id);

    if (!error) {
      // ← ADD THIS: Send confirmation email to client
      sendClientBookingStatusUpdate(id, "confirmed").then((result) => {
        if (result.success) {
          console.log("✅ Client confirmation email sent");
        } else {
          console.error("❌ Failed to send confirmation email:", result.error);
        }
      });

      setBookings(
        bookings.map((booking) =>
          booking.id === id
            ? { ...booking, status: "confirmed" as const }
            : booking
        )
      );
    }
  };

  const handleCancel = async (id: string, reason: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({
        status: "rejected",
        notes: reason,
      })
      .eq("id", id);

    if (!error) {
      // ← ADD THIS: Send rejection email to client with reason
      sendClientBookingStatusUpdate(id, "rejected", reason).then((result) => {
        if (result.success) {
          console.log("✅ Client rejection email sent");
        } else {
          console.error("❌ Failed to send rejection email:", result.error);
        }
      });

      setBookings(
        bookings.map((booking) =>
          booking.id === id
            ? { ...booking, status: "rejected" as const, notes: reason }
            : booking
        )
      );
    }
  };


  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      const { error } = await supabase.from("bookings").delete().eq("id", id);

      if (!error) {
        setBookings(bookings.filter((booking) => booking.id !== id));
      }
    }
  };

    const handleComplete = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", id);

    if (!error) {
      // ← ADD THIS: Send completion email to client
      sendClientBookingStatusUpdate(id, "completed").then((result) => {
        if (result.success) {
          console.log("✅ Client completion email sent");
        } else {
          console.error("❌ Failed to send completion email:", result.error);
        }
      });

      setBookings(
        bookings.map((booking) =>
          booking.id === id
            ? { ...booking, status: "completed" as const }
            : booking
        )
      );
    }
  };

  // Use useMemo to recalculate when dependencies change
    // Use useMemo to recalculate when dependencies change
  const filteredBookings = useMemo(() => {
    const filtered = bookings.filter((booking) => {
      const clientName = booking.client
        ? `${booking.client.first_name} ${booking.client.last_name}`.toLowerCase()
        : "";
      const providerName = booking.provider?.name.toLowerCase() || "";
      const serviceType = booking.provider?.category.toLowerCase() || "";

      const matchesSearch =
        clientName.includes(searchTerm.toLowerCase()) ||
        providerName.includes(searchTerm.toLowerCase()) ||
        serviceType.includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort the filtered results
    const sorted = [...filtered].sort((a, b) => {
      // Parse date and time
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // If dates are the same, compare times
      if (dateA.getTime() === dateB.getTime()) {
        // Parse time strings (assuming format like "14:30" or "2:30 PM")
        const [hoursA, minutesA] = a.time.split(':').map(num => parseInt(num));
        const [hoursB, minutesB] = b.time.split(':').map(num => parseInt(num));
        
        const timeA = hoursA * 60 + minutesA;
        const timeB = hoursB * 60 + minutesB;
        
        return sortOrder === "latest" ? timeB - timeA : timeA - timeB;
      }
      
      // Compare dates
      return sortOrder === "latest" 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });

   
    return sorted;
  }, [bookings, searchTerm, statusFilter, sortOrder]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-8 text-center text-gray-500">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-black overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-black">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by customer, provider, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-black rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "latest" | "earliest")}
              className="appearance-none bg-white border border-black rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="latest">Latest First</option>
              <option value="earliest">Earliest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.client
                      ? `${booking.client.first_name} ${booking.client.last_name}`
                      : "Unknown"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.provider?.name || "Unknown"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.provider?.category || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(booking.date)}
                  </div>
                  <div className="text-sm text-gray-500">{booking.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${booking.provider?.starting_price || "N/A"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No bookings found matching your criteria.
          </p>
        </div>
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}