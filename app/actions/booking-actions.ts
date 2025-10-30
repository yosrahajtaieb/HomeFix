"use server";

import { sendBookingEmail } from "@/lib/email-service";

export async function sendProviderBookingNotification(bookingId: string) {
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();

  // Fetch complete booking details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      clients (first_name, last_name, address),
      providers (name, email, category)
    `)
    .eq("id", bookingId)
    .single();

  if (!booking || !booking.clients || !booking.providers) {
    return { success: false, error: "Booking not found" };
  }

  // Format date
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Send email
  return await sendBookingEmail("providerNewBooking", booking.providers.email, {
    providerName: booking.providers.name,
    clientName: `${booking.clients.first_name} ${booking.clients.last_name}`,
    service: booking.providers.category,
    date: formattedDate,
    time: booking.time,
    address: booking.clients.address,
  });
}

// ← ADD THIS NEW FUNCTION
export async function sendClientBookingStatusUpdate(
  bookingId: string,
  status: "confirmed" | "rejected" | "completed",
  reason?: string
) {
  const { createClient } = await import("@/utils/supabase/server");
  const supabase = await createClient();

  // Fetch complete booking details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      clients (first_name, last_name, email),
      providers (name, category)
    `)
    .eq("id", bookingId)
    .single();

  if (!booking || !booking.clients || !booking.providers) {
    return { success: false, error: "Booking not found" };
  }

  // Format date
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Send appropriate email based on status
  let emailType: "clientBookingConfirmed" | "clientBookingRejected" | "clientBookingCompleted";
  
  if (status === "confirmed") {
    emailType = "clientBookingConfirmed";
  } else if (status === "rejected") {
    emailType = "clientBookingRejected";
  } else {
    emailType = "clientBookingCompleted";
  }

  return await sendBookingEmail(emailType, booking.clients.email, {
    clientName: `${booking.clients.first_name} ${booking.clients.last_name}`,
    providerName: booking.providers.name,
    service: booking.providers.category,
    date: formattedDate,
    time: booking.time,
    reason: reason, // Only used for rejected emails
  });
}