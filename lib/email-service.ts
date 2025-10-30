import { Resend } from "resend";



const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = 
  | "providerNewBooking" 
  | "clientBookingConfirmed" 
  | "clientBookingRejected" 
  | "clientBookingCompleted";

type EmailData = {
  providerName?: string;
  clientName?: string;
  service?: string;
  date?: string;
  time?: string;
  address?: string;
  reason?: string;
};

export async function sendBookingEmail(
  type: EmailType,
  to: string,
  data: EmailData
) {
  // Check if emails are enabled (optional feature flag)
  const emailEnabled = process.env.EMAIL_ENABLED !== "false";
  
  if (!emailEnabled) {
    console.log("Email sending is disabled");
    return { success: false, error: "Email disabled" };
  }

  // Validate recipient email
  if (!to || !to.includes("@")) {
    console.error("Invalid recipient email:", to);
    return { success: false, error: "Invalid email address" };
  }

  try {
    // Get the email content based on type
    const emailContent = getEmailContent(type, data);
    
    const result = await resend.emails.send({
      from: "HomeFix <noreply@homefix.support>", // Use verified domain later
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`✅ Email sent successfully to ${to}:`, result);
    return { success: true, result };
  } catch (error: any) {
    console.error(`❌ Error sending email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

function getEmailContent(type: EmailType, data: EmailData) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  switch (type) {
    case "providerNewBooking":
      return {
        subject: "New Booking Pending Your Confirmation",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Booking Request</h2>
            <p>Hi ${data.providerName},</p>
            <p>You have a new booking request that requires your confirmation:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Client:</strong> ${data.clientName}</p>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Location:</strong> ${data.address}</p>
            </div>
            <p>Please log in to your dashboard to confirm or reject this booking.</p>
            <a href="${baseUrl}/provider/dashboard" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              View Dashboard
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br/>
              The HomeFix Team
            </p>
          </div>
        `,
      };

    case "clientBookingConfirmed":
      return {
        subject: "Your Booking is Confirmed!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Booking Confirmed ✓</h2>
            <p>Hi ${data.clientName},</p>
            <p>Great news! Your booking has been confirmed by the provider.</p>
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <p><strong>Provider:</strong> ${data.providerName}</p>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
            </div>
            <p>Your service provider will arrive at the scheduled time. If you need to make any changes, please contact us.</p>
            <a href="${baseUrl}/client/dashboard" 
               style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              View Booking Details
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br/>
              The HomeFix Team
            </p>
          </div>
        `,
      };

    case "clientBookingRejected":
      return {
        subject: "Booking Update: Unable to Confirm",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Booking Not Confirmed</h2>
            <p>Hi ${data.clientName},</p>
            <p>Unfortunately, your booking request could not be confirmed by the provider.</p>
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p><strong>Provider:</strong> ${data.providerName}</p>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
            </div>
            <p>Don't worry! You can browse other providers or reschedule your booking.</p>
            <a href="${baseUrl}/services" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Find Another Provider
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br/>
              The HomeFix Team
            </p>
          </div>
        `,
      };

    case "clientBookingCompleted":
      return {
        subject: "Service Completed - Please Leave a Review",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Service Completed!</h2>
            <p>Hi ${data.clientName},</p>
            <p>Your service has been marked as completed.</p>
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <p><strong>Provider:</strong> ${data.providerName}</p>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Date:</strong> ${data.date}</p>
            </div>
            <p>We hope you're satisfied with the service! Please take a moment to leave a review and help other homeowners.</p>
            <a href="${baseUrl}/client/dashboard" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Leave a Review
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br/>
              The HomeFix Team
            </p>
          </div>
        `,
      };

    default:
      return {
        subject: "HomeFix Notification",
        html: "<p>You have a new notification from HomeFix.</p>",
      };
  }
}