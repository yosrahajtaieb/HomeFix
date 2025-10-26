import { ChevronRight } from "lucide-react";
import { BookingCard } from "./booking-card";
import type { Booking, Provider } from "./types";

type BookingsListProps = {
  bookings: Booking[];
  provider: Provider | null;
  completingId: string | null;
  onUpdateStatus: (bookingId: string, status: "confirmed" | "rejected", reason?: string) => void;
  onMarkCompleted: (bookingId: string) => void;
  hasBookingPassed: (date: string, time: string) => boolean;
  onViewAll: () => void;
};

export function BookingsList({
  bookings,
  provider,
  completingId,
  onUpdateStatus,
  onMarkCompleted,
  hasBookingPassed,
  onViewAll,
}: Readonly<BookingsListProps>) {
  // Show only upcoming jobs (pending + confirmed)
  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Jobs</h2>
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
              <BookingCard
                key={booking.id}
                booking={booking}
                provider={provider}
                completingId={completingId}
                onUpdateStatus={onUpdateStatus}
                onMarkCompleted={onMarkCompleted}
                hasBookingPassed={hasBookingPassed}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">You don't have any upcoming bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
}