"use client";

import { useState } from "react";
import {
  X,
  User,
  Wrench,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Star,
  Phone,
  Mail,
} from "lucide-react";

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
  review?: {
    rating: number;
    comment: string;
    date: string;
  };
};

type BookingDetailsModalProps = {
  booking: Booking;
  onClose: () => void;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

export function BookingDetailsModal({
  booking,
  onClose,
  onConfirm,
  onCancel,
  onDelete,
  onComplete,
}:  Readonly<BookingDetailsModalProps>) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(booking.id);
      onClose();
    }
  };

  const handleCancel = () => {
    if (cancelReason.trim() && onCancel) {
      onCancel(booking.id);
      onClose();
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    ) {
      if (onDelete) {
        onDelete(booking.id);
        onClose();
      }
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(booking.id);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const customerName = booking.client
    ? `${booking.client.first_name} ${booking.client.last_name}`
    : "Unknown";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Booking Details</h2>
            <p className="text-sm text-gray-500">
              Booking ID: #{booking.id.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <div className="flex items-center text-gray-700 font-medium">
              <DollarSign className="h-5 w-5 mr-1 text-green-600" />
              <span className="text-xl">
                ${booking.provider?.starting_price || "N/A"}
              </span>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-primary" />
              Service Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Service Type
                </label>
                <p className="text-gray-900 font-medium">
                  {booking.provider?.category || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Service Date
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-1 text-primary" />
                  <span>{formatDate(booking.date)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Time
                </label>
                <div className="flex items-center text-gray-900">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  <span>{booking.time}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <div className="flex items-start text-gray-900">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 text-primary flex-shrink-0" />
                  <span>{booking.client?.address || "N/A"}</span>
                </div>
              </div>
            </div>
            {booking.notes && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Notes
                </label>
                <p className="text-gray-900 mt-1">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-900 font-medium">{customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  <a
                    href={`mailto:${booking.client?.email}`}
                    className="hover:text-primary"
                  >
                    {booking.client?.email || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  <a
                    href={`tel:${booking.client?.phone}`}
                    className="hover:text-primary"
                  >
                    {booking.client?.phone || "N/A"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-green-600" />
              Provider Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-900 font-medium">
                  {booking.provider?.name || "Unknown"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-green-600" />
                  <a
                    href={`mailto:${booking.provider?.email}`}
                    className="hover:text-primary"
                  >
                    {booking.provider?.email || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                  <a
                    href={`tel:${booking.provider?.phone}`}
                    className="hover:text-primary"
                  >
                    {booking.provider?.phone || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <div className="flex items-start text-gray-900">
                  <MapPin className="h-4 w-4 mr-1 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>{booking.provider?.location || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {booking.status === "completed" && booking.review && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                Customer Review
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Rating
                  </label>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= booking.review!.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-900 font-medium">
                      {booking.review.rating} out of 5
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Review Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(booking.review.date)}
                  </p>
                </div>
                {booking.review.comment && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Comment
                    </label>
                    <p className="text-gray-900 mt-1 leading-relaxed">
                      {booking.review.comment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cancellation Reason (for rejected bookings) */}
          {booking.status === "rejected" && booking.notes && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-red-800">
                <XCircle className="h-5 w-5 mr-2" />
                Rejection/Cancellation Notes
              </h3>
              <p className="text-gray-900">{booking.notes}</p>
            </div>
          )}

          {/* Cancel Dialog */}
          {showCancelDialog && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="text-lg font-semibold mb-3 text-red-800">
                Cancel Booking
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="cancelReason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cancellation Reason *
                  </label>
                  <textarea
                    id="cancelReason"
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Please provide a reason for cancellation..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCancelDialog(false);
                      setCancelReason("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={!cancelReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
          >
            Delete Booking
          </button>

          <div className="flex space-x-3">
            {booking.status === "pending" && (
              <>
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="..."
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Booking
                </button>
                <button onClick={handleConfirm} className="...">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
                </button>
              </>
            )}

            {booking.status === "confirmed" && (
              <>
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="..."
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Booking
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </button>
              </>
            )}

            <button onClick={onClose} className="...">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
