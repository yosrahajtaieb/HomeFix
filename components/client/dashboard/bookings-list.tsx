import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BookingCard } from "./booking-card";
import type { Booking } from "./types";

type BookingsListProps = {
  bookings: Booking[];
  onViewAll: () => void;
};

export function BookingsList({ bookings, onViewAll }: BookingsListProps) {
  // Show only upcoming bookings (pending + confirmed)
  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Bookings</h2>
        <button
          onClick={onViewAll}
          className="text-primary hover:underline flex items-center text-sm font-medium"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {upcomingBookings.length > 0 ? (
          <div className="divide-y">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              You don't have any upcoming bookings.
            </p>
            <Link
              href="/services"
              className="mt-2 inline-block text-primary hover:underline font-medium"
            >
              Browse services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}