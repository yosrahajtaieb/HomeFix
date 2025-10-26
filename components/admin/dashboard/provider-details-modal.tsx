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
  Wrench,
  DollarSign,
  Star,
  Award,
  BadgeCheck,
} from "lucide-react";

type Provider = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  starting_price: number;
  approved: boolean;
  created_at: string;
  active: boolean;
  completed_jobs?: number;
  average_rating?: number;
  description?: string;
};

type ProviderDetailsModalProps = {
  provider: Provider;
  onClose: () => void;
  onSuspend: (id: string, activate: boolean) => void;
  onApprove?: (id: string) => void;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

export function ProviderDetailsModal({
  provider,
  onClose,
  onSuspend,
  onApprove,
}: ProviderDetailsModalProps) {
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const handleSuspend = () => {
    if (suspendReason.trim()) {
      onSuspend(provider.id, false);
      onClose();
    }
  };

  const handleActivate = () => {
    onSuspend(provider.id, true);
    onClose();
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(provider.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Provider Details</h2>
              {provider.approved && (
                <BadgeCheck className="h-6 w-6 text-blue-600 fill-blue-100" />
              )}
            </div>
            <p className="text-sm text-gray-500">
              Provider ID: #{provider.id.slice(0, 8)}
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
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                  provider.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {provider.active ? "Active" : "Suspended"}
              </span>
              <span
                className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                  provider.approved
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {provider.approved ? "Approved" : "Pending Approval"}
              </span>
            </div>
          </div>

          {/* Provider Information */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-medium text-lg">
                    {provider.name}
                  </p>
                  {provider.approved && (
                    <BadgeCheck className="h-5 w-5 text-blue-600 fill-blue-100" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <div className="flex items-center text-gray-900">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  <a
                    href={`mailto:${provider.email}`}
                    className="hover:text-primary"
                  >
                    {provider.email}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <div className="flex items-center text-gray-900">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  <a
                    href={`tel:${provider.phone}`}
                    className="hover:text-primary"
                  >
                    {provider.phone || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <div className="flex items-start text-gray-900">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{provider.location || "N/A"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Registration Date
                </label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{formatDate(provider.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-green-600" />
              Service Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Service Category
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {provider.category}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Starting Price
                </label>
                <div className="flex items-center text-gray-900">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  <span className="font-medium text-lg">
                    {provider.starting_price}
                  </span>
                </div>
              </div>
            </div>
            {provider.description && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-900 mt-1 leading-relaxed">
                  {provider.description}
                </p>
              </div>
            )}
          </div>

          {/* Performance Stats */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-600" />
              Performance Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Completed Jobs
                </label>
                <p className="text-gray-900 font-medium text-2xl">
                  {provider.completed_jobs || 0}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Average Rating
                </label>
                <div className="flex items-center text-gray-900">
                  <Star className="h-5 w-5 mr-1 text-yellow-500 fill-current" />
                  <span className="font-medium text-2xl">
                    {provider.average_rating
                      ? provider.average_rating.toFixed(1)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Suspend Dialog */}
          {showSuspendDialog && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h3 className="text-lg font-semibold mb-3 text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Suspend Provider Account
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Are you sure you want to suspend this provider's account? They
                  will not be able to receive bookings.
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
          <div className="flex gap-3">
            {/* Approve Button - Only show if not approved */}
            {!provider.approved && provider.active && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center"
              >
                <BadgeCheck className="h-4 w-4 mr-2" />
                Approve Account
              </button>
            )}

            {/* Suspend/Activate Button */}
            {provider.active ? (
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
