import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import type { Booking, Provider } from "./types";

type BookingCardProps = {
  booking: Booking;
  provider: Provider | null;
  completingId: string | null;
  onUpdateStatus: (bookingId: string, status: "confirmed" | "rejected", reason?: string) => void;
  onMarkCompleted: (bookingId: string) => void;
  hasBookingPassed: (date: string, time: string) => boolean;
};

export function BookingCard({
  booking,
  provider,
  completingId,
  onUpdateStatus,
  onMarkCompleted,
  hasBookingPassed,
}: Readonly<BookingCardProps>) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = () => {
    if (rejectReason.trim()) {
      onUpdateStatus(booking.id, "rejected", rejectReason);
      setShowRejectDialog(false);
      setRejectReason("");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <Image
            src="/placeholder1.svg"
            alt={
              booking.clients
                ? `${booking.clients.first_name} ${booking.clients.last_name}`
                : "Client"
            }
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
          <div>
            <h3 className="font-semibold text-lg">
              {booking.clients
                ? `${booking.clients.first_name} ${booking.clients.last_name}`
                : "Client"}
            </h3>
            <p className="text-gray-600">
              {provider?.category || "Service"} Service
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
            <div className="mt-1 text-sm text-gray-500 flex items-start">
              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{booking.clients?.address}</span>
            </div>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-2">
          {/* Status Badge */}
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

          {/* Pending Actions */}
          {booking.status === "pending" && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onUpdateStatus(booking.id, "confirmed")}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowRejectDialog(true)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
              >
                Reject Booking
              </button>
            </div>
          )}

          {/* Mark as Completed Button */}
          {booking.status === "confirmed" &&
            hasBookingPassed(booking.date, booking.time) && (
              <button
                onClick={() => onMarkCompleted(booking.id)}
                disabled={completingId === booking.id}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                {completingId === booking.id ? "Marking..." : "Mark as Completed"}
              </button>
            )}
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
          <h3 className="text-lg font-semibold mb-3 text-red-800 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            Reject Booking
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Please provide a reason for rejecting this booking. The client will be notified.
            </p>
            <div>
              <label
                htmlFor="rejectReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for Rejection *
              </label>
              <textarea
                id="rejectReason"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="E.g., Not available at this time, outside service area, etc."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}