"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Star, ChevronDown } from "lucide-react";
import type { Review } from "./types";

type ReviewsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
};

export function ReviewsModal({ isOpen, onClose, reviews }: ReviewsModalProps) {
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  if (!isOpen) return null;

  // Filter reviews by rating
  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((r) => r.rating === filterRating);

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const ratingCounts: Record<number | "all", number> = {
    all: reviews.length,
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

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
            <div>
              <h2 className="text-2xl font-bold">All Reviews</h2>
              <div className="flex items-center mt-1">
                <span className="text-3xl font-bold text-yellow-600">
                  {averageRating}
                </span>
                <div className="ml-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(Number(averageRating))
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{reviews.length} reviews</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Filters and Sort */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Rating Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterRating("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterRating === "all"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All ({ratingCounts.all})
                </button>
                {([5, 4, 3, 2, 1] as const).map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                      filterRating === rating
                        ? "bg-yellow-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                    {rating} ({ratingCounts[rating]})
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-240px)] px-6">
            {sortedReviews.length > 0 ? (
              <div className="divide-y">
                {sortedReviews.map((review) => (
                  <div key={review.id} className="py-6">
                    <div className="flex items-start">
                      <Image
                        src={"/placeholder1.svg"}
                        alt={
                          review.clients
                            ? `${review.clients.first_name} ${review.clients.last_name}`
                            : "Client"
                        }
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              {review.clients
                                ? `${review.clients.first_name} ${review.clients.last_name}`
                                : "Anonymous"}
                            </h3>
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
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  {filterRating === "all"
                    ? "No reviews yet."
                    : `No reviews found with ${filterRating} star rating.`}
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