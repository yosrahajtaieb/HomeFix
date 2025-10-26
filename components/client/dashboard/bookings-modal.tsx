"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { BookingCard } from "./booking-card";
import type { Booking } from "./types";

type BookingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
};

export function BookingsModal({
  isOpen,
  onClose,
  bookings,
}: BookingsModalProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  if (!isOpen) return null;

  // Filter bookings based on selected status
  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Bookings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === "all"
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All ({statusCounts.all})
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Pending ({statusCounts.pending})
              </button>
              <button
                onClick={() => setFilterStatus("confirmed")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === "confirmed"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Confirmed ({statusCounts.confirmed})
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Completed ({statusCounts.completed})
              </button>
              <button
                onClick={() => setFilterStatus("rejected")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancelled ({statusCounts.rejected})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4">
            {" "}
            {/* ← ADD py-4 */}
            {filteredBookings.length > 0 ? (
              <div className="divide-y pb-4">
                {" "}
                {/* ← ADD pb-4 */}
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  No {filterStatus !== "all" ? filterStatus : ""} bookings
                  found.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
