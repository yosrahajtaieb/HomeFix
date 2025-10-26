// components/providers/provider-reviews.tsx
import Image from "next/image";
import { Star } from "lucide-react";

type Review = {
  id: number;
  author: string;
  authorImage: string;
  rating: number;
  date: string;
  comment: string;
};

type Provider = {
  rating: number;
  reviewCount: number;
};

export function ProviderReviews({
  reviews,
  provider,
}: {
  reviews: Review[];
  provider: Provider;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Customer Reviews</h2>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-bold text-lg">{provider.rating}</span>
            <span className="ml-2 text-gray-600">
              ({provider.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to leave a review!
            </p>
          ) : (
            reviews.map((review) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}