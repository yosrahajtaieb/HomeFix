"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ProviderHeader } from "./provider-header";
import { ProviderAbout } from "./provider-about";
import { ProviderAvailability } from "./provider-availability";
import { ProviderReviews } from "./provider-reviews";
import { ProviderBooking } from "./provider-booking";

type Provider = {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  location: string;
  starting_price: number;
  available_from: string;
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
};

type ProviderProfileProps = {
  provider: Provider;
  availability: Availability;
};

export function ProviderProfile({
  provider,
  availability,
}: Readonly<ProviderProfileProps>) {
  const [reviewsState, setReviewsState] = useState<Review[]>([]);
  const [userRole, setUserRole] = useState<"client" | "provider" | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchReviews = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        clients:client_id (
          first_name,
          last_name
        )
      `
      )
      .eq("provider_id", provider.id)
      .order("date", { ascending: false });

    if (!error && data) {
      const reviewsWithAuthors = data.map((review: any) => ({
        ...review,
        author: review.clients
          ? `${review.clients.first_name} ${review.clients.last_name}`
          : "Anonymous",
        authorImage: "/placeholder1.svg",
      }));
      setReviewsState(reviewsWithAuthors);
    }
  };

  useEffect(() => {
    fetchReviews();

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

      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (clientData && !clientError) {
        setUserRole("client");
      } else {
        setUserRole("provider");
      }

      setAuthChecked(true);
    };
    fetchUserRole();
  }, [provider.id]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <ProviderHeader provider={provider} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ProviderAbout provider={provider} />
          <ProviderAvailability availability={availability} />
          <ProviderReviews reviews={reviewsState} provider={provider} />
        </div>

        <div className="md:col-span-1">
          <ProviderBooking
            provider={provider}
            userRole={userRole}
            authChecked={authChecked}
            onReviewSubmitted={fetchReviews}
          />
        </div>
      </div>
    </div>
  );
}