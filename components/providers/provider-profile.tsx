"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";
import Image from "next/image";
import {
  Clock,
  MapPin,
  Star,
  DollarSign,
  Phone,
  Mail,
  CheckCircle,
  CalendarIcon,
} from "lucide-react";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type Provider = {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  location: string;
  starting_price: number;
  availability: string;
  category: string;
};

type Review = {
  id: number;
  author: string;
  authorImage: string;
  rating: number;
  date: string;
  comment: string;
};

type Availability = {
  schedule: {
    day: string;
    hours: string;
  }[];
  nextAvailable: string;
};

type ProviderProfileProps = {
  provider: Provider;
  
  availability: Availability;
};

export function ProviderProfile({
  provider,
  availability,
}: ProviderProfileProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewsState, setReviewsState] = useState<Review[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [userRole, setUserRole] = useState<"client" | "provider" | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
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
    const fetchUserRole = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setUserRole(null);
        setAuthChecked(true);
        return;
      }
      // Check if user is a client
      const { data: clientData } = await supabase
        .from("clients")
        .select("id")
        .eq("id", session.user.id)
        .single();
      if (clientData) {
        setUserRole("client");
      } else {
        setUserRole("provider");
      }
      setAuthChecked(true);
    };
    fetchUserRole();


  }, [selectedDate, provider.id]);
  // Mock available time slots
  const availableTimeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

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
      // Optionally reset date/time selection here
    } else {
      // Show error message
    }
  };
const fetchReviews = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("provider_id", provider.id)
    .order("date", { ascending: false });
  if (!error && data) {
    setReviewsState(data);
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
    // Optionally show a login prompt
    return;
  }

  // Insert the review into Supabase
  const { error } = await supabase.from("reviews").insert({
    provider_id: provider.id,
    client_id: session.user.id,
    author: session.user.user_metadata?.full_name || "Anonymous",
    rating: reviewRating,
    comment: reviewText,
    // date will default to now()
  });

  setSubmittingReview(false);

  if (!error) {
    setReviewSubmitted(true);
    setReviewText("");
    setReviewRating(0);
    await fetchReviews();
  } else {
    // Optionally, show an error message
    alert("Failed to submit review.");
  }
};

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Provider Header */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <Image
                src="/placeholder1.svg"
                alt={provider.name}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{provider.name}</h1>
                  <p className="text-primary font-medium">
                    {provider.category} Specialist
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">
                        {provider.rating}
                      </span>
                      <span className="mx-1.5 text-gray-300">•</span>
                      <span className="text-gray-600">
                        {provider.reviewCount} reviews
                      </span>
                    </div>
                    <span className="mx-2 text-gray-300">|</span>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center text-green-600 font-medium mb-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>{provider.availability}</span>
                  </div>
                  <div className="flex items-center font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>Starting from ${provider.starting_price}/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content and Booking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">About {provider.name}</h2>
              <p className="text-gray-700 mb-6">{provider.description}</p>

              <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
              <ul className="list-disc pl-5 mb-6 text-gray-700">
                {provider.category === "Plumbing" && (
                  <>
                    <li>Leak detection and repair</li>
                    <li>Pipe installation and replacement</li>
                    <li>Drain cleaning</li>
                    <li>Water heater installation and repair</li>
                    <li>Fixture installation</li>
                  </>
                )}
                {provider.category === "Electrical" && (
                  <>
                    <li>Electrical panel upgrades</li>
                    <li>Wiring and rewiring</li>
                    <li>Lighting installation</li>
                    <li>Outlet and switch installation</li>
                    <li>Electrical troubleshooting</li>
                  </>
                )}
                {provider.category === "HVAC" && (
                  <>
                    <li>Heating system installation and repair</li>
                    <li>Air conditioning installation and repair</li>
                    <li>Ventilation system maintenance</li>
                    <li>Duct cleaning</li>
                    <li>Thermostat installation</li>
                  </>
                )}
                {provider.category === "Locksmith" && (
                  <>
                    <li>Lock installation and repair</li>
                    <li>Key duplication</li>
                    <li>Emergency lockout services</li>
                    <li>Security system installation</li>
                    <li>Safe installation and repair</li>
                  </>
                )}
              </ul>

              <h3 className="text-lg font-semibold mb-3">Service Area</h3>
              <p className="text-gray-700">
                Serving {provider.location} and surrounding areas within a
                25-mile radius.
              </p>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Availability</h2>
              <p className="text-gray-700 mb-6">
                <span className="font-medium">Next available:</span>{" "}
                {availability.nextAvailable}
              </p>

              <h3 className="text-lg font-semibold mb-3">Regular Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availability.schedule.map((item) => (
                  <div
                    key={item.day}
                    className="flex justify-between py-2 border-b last:border-b-0"
                  >
                    <span className="font-medium">{item.day}</span>
                    <span className="text-gray-700">{item.hours}</span>
                  </div>
                ))}
              </div>

              
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Customer Reviews</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-bold text-lg">
                    {provider.rating}
                  </span>
                  <span className="ml-2 text-gray-600">
                    ({provider.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {reviewsState.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start">
                      <Image
                        src={review.authorImage || "/placeholder1.svg"}
                        alt={review.author}
                        width={40}
                        height={40}
                        className="rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{review.author}</h3>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card */}

        <div className="md:col-span-1">
          {authChecked && userRole === "client" && (
            <>
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden top-4">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Book This Provider</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
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
                        {availableTimeSlots.map((time) => {
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
                    </div>
                  )}

                  <form onSubmit={handleBooking}>
                    {/* ...date and time pickers... */}
                    <div className="mb-6">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Starting Price</span>
                        <span className="font-bold">
                          ${provider.starting_price}/hour
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Final price may vary based on the specific service
                        requirements.
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
                    <div className="mb-4 text-green-600">
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
                      className="w-full border rounded-md px-3 py-2"
                      rows={3}
                      placeholder="Write your review here..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={
                        submittingReview ||
                        reviewRating === 0 ||
                        reviewText.trim() === ""
                      }
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
