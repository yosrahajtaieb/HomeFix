import type { Booking } from "./types";

type DashboardStatsProps = {
  bookings: Booking[];
};

export function DashboardStats({ bookings }: DashboardStatsProps) {
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const rejectedCount = bookings.filter((b) => b.status === "rejected").length;
  
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-2">Upcoming Jobs</h3>
        <p className="text-gray-600 mb-4">Confirmed bookings</p>
        <p className="text-3xl font-bold text-blue-600">{confirmedCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-2">Completed Jobs</h3>
        <p className="text-gray-600 mb-4">Successfully finished</p>
        <p className="text-3xl font-bold text-green-600">{completedCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-2">Pending Jobs</h3>
        <p className="text-gray-600 mb-4">Awaiting confirmation</p>
        <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-2">Cancelled Jobs</h3>
        <p className="text-gray-600 mb-4">Rejected bookings</p>
        <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
      </div>
    </div>
  );
}