import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";
import type { Review } from "./types";

type RecentReviewsProps = {
  reviews: Review[];
  onViewAll: () => void;
};

export function RecentReviews({ reviews, onViewAll }: RecentReviewsProps) {
  // Show only the 3 most recent reviews
  const recentReviews = reviews.slice(0, 3);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recent Reviews</h2>
        {reviews.length > 3 && (
          <button
            onClick={onViewAll}
            className="text-primary hover:underline flex items-center text-sm font-medium"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {recentReviews.length > 0 ? (
          <div className="divide-y">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start">
                  <Image
                    src="/placeholder1.svg"
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
                            {new Date(review.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
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
          <div className="p-6 text-center">
            <p className="text-gray-500">You don&apos;t have any reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}