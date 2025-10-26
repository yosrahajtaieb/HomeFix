// components/providers/provider-booking.tsx
"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Provider = {
  id: number;
  starting_price: number;
  available_from: string;
};

type Props = {
  provider: Provider;
  userRole: "client" | "provider" | null;
  authChecked: boolean;
  onReviewSubmitted: () => void;
};

export function ProviderBooking({
  provider,
  userRole,
  authChecked,
  onReviewSubmitted,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  const fetchBookedTimes = async (date = selectedDate) => {
    if (!date) {
      setBookedTimes([]);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("time")
      .eq("provider_id", provider.id)
      .eq("date", date);

    if (data) {
      setBookedTimes(data.map((b: any) => b.time));
    }
  };

  useEffect(() => {
    fetchBookedTimes();
  }, [selectedDate]);

  const getMinimumBookingDate = () => {
    const today = new Date().toISOString().split("T")[0];
    const providerAvailableFrom = provider.available_from;

    if (!providerAvailableFrom || providerAvailableFrom <= today) {
      return today;
    }
    return providerAvailableFrom;
  };

  const getAvailableTimeSlots = () => {
    const allTimeSlots = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
    ];

    if (!selectedDate) return allTimeSlots;

    const today = new Date().toISOString().split("T")[0];

    if (selectedDate !== today) return allTimeSlots;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return allTimeSlots.filter((timeSlot) => {
      const [time, period] = timeSlot.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      const slotTime = hours * 60 + minutes;
      const currentTime = currentHour * 60 + currentMinute + 60;

      return slotTime > currentTime;
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("bookings").insert({
      provider_id: provider.id,
      client_id: session.user.id,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
    });
    setSubmitting(false);
    if (!error) {
      alert("Your booking is sent for confirmation!");
      fetchBookedTimes(selectedDate);
      setSelectedTime(null);
    } else {
      alert("Failed to submit booking.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setSubmittingReview(false);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      provider_id: provider.id,
      client_id: session.user.id,
      rating: reviewRating,
      comment: reviewText,
    });

    setSubmittingReview(false);

    if (!error) {
      setReviewSubmitted(true);
      setReviewText("");
      setReviewRating(0);
      onReviewSubmitted();
    } else {
      alert("Failed to submit review.");
    }
  };

  if (!authChecked) return null;

  if (userRole !== "client") {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Book This Provider</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {userRole === "provider"
                ? "Providers cannot book other providers."
                : "Please log in as a client to book this provider."}
            </p>
            {!userRole && (
              <a
                href="/login"
                className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Log In to Book
              </a>
            )}
          </div>
          <div className="mb-6 pt-6 border-t">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Starting Price</span>
              <span className="font-bold">${provider.starting_price}/hour</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Final price may vary based on the specific service requirements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Book This Provider</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={getMinimumBookingDate()}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {(() => {
                  const today = new Date().toISOString().split("T")[0];
                  const availableFrom = provider.available_from;

                  if (!availableFrom || availableFrom <= today) {
                    return "This provider is available for bookings starting today";
                  } else {
                    return `Bookings available from ${new Date(
                      availableFrom
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`;
                  }
                })()}
              </p>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableTimeSlots().map((time) => {
                  const isBooked = bookedTimes.includes(time);
                  return (
                    <button
                      key={time}
                      type="button"
                      className={`py-2 px-1 text-sm border rounded-md ${
                        selectedTime === time
                          ? "bg-primary text-white border-primary"
                          : isBooked
                          ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "border-gray-300 hover:border-primary"
                      }`}
                      onClick={() => !isBooked && setSelectedTime(time)}
                      disabled={isBooked}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              {selectedDate === new Date().toISOString().split("T")[0] &&
                getAvailableTimeSlots().length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    No available time slots remaining for today. Please select a
                    future date.
                  </p>
                )}
            </div>
          )}

          <form onSubmit={handleBooking}>
            <div className="mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Starting Price</span>
                <span className="font-bold">${provider.starting_price}/hour</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Final price may vary based on the specific service requirements.
              </p>
            </div>
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || submitting}
              className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Booking..." : "Book Now"}
            </button>
          </form>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
          {reviewSubmitted && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              Thank you for your review!
            </div>
          )}
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex items-center mb-2">
              <span className="mr-2 text-sm">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      reviewRating >= star
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={
                submittingReview || reviewRating === 0 || reviewText.trim() === ""
              }
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}