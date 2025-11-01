"use client";

import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ShoppingBag, // ← ADD THIS
} from "lucide-react";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  active: boolean;
  bookings_count?: number; // ← ADD THIS
};

type UserDetailsModalProps = {
  user: User;
  onClose: () => void;
  onSuspend: (id: string, activate: boolean) => void;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

export function UserDetailsModal({
  user,
  onClose,
  onSuspend,
}: UserDetailsModalProps) {
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const handleSuspend = () => {
    if (suspendReason.trim()) {
      onSuspend(user.id, false);
      onClose();
    }
  };

  const handleActivate = () => {
    onSuspend(user.id, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">User Details</h2>
            <p className="text-sm text-gray-500">
              User ID: #{user.id.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                user.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.active ? "Active" : "Suspended"}
            </span>
          </div>

          {/* User Information */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <div className="flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:text-primary"
                  >
                    {user.email}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  <a href={`tel:${user.phone}`} className="hover:text-primary">
                    {user.phone || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <div className="flex items-start text-gray-900">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{user.address || "N/A"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Total Bookings
                </label>
                <div className="flex items-center text-gray-900">
                  <ShoppingBag className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-semibold">{user.bookings_count || 0}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Registration Date
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Suspend Dialog */}
          {showSuspendDialog && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="text-lg font-semibold mb-3 text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Suspend User Account
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Are you sure you want to suspend this user&apos;s account? They
                  will not be able to access the platform.
                </p>
                <div>
                  <label
                    htmlFor="suspendReason"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reason for Suspension *
                  </label>
                  <textarea
                    id="suspendReason"
                    rows={3}
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Please provide a reason for suspension..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowSuspendDialog(false);
                      setSuspendReason("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSuspend}
                    disabled={!suspendReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Suspension
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
          <div>
            {user.active ? (
              <button
                onClick={() => setShowSuspendDialog(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors flex items-center"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Suspend Account
              </button>
            ) : (
              <button
                onClick={handleActivate}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate Account
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}