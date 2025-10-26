import Image from "next/image";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import type { Booking } from "./types";

type BookingCardProps = {
  booking: Booking;
};

export function BookingCard({ booking }: Readonly<BookingCardProps>) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <Image
            src="/placeholder1.svg"
            alt={booking.providers?.name || "Provider"}
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {booking.providers?.name || "Provider"}
            </h3>
            <p className="text-gray-600">
              {booking.providers?.category || "Service"}
            </p>
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

            {/* Show cancellation reason if booking is rejected */}
            {booking.status === "rejected" && booking.notes && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Cancellation Reason:
                    </p>
                    <p className="text-sm text-red-700 mt-1">{booking.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-right ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              booking.status === "confirmed"
                ? "bg-blue-100 text-blue-800"
                : booking.status === "completed"
                ? "bg-green-100 text-green-800"
                : booking.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}