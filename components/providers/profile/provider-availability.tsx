// components/providers/provider-availability.tsx
type Availability = {
  schedule: {
    day: string;
    hours: string;
  }[];
};

export function ProviderAvailability({
  availability,
}: {
  availability: Availability;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Availability</h2>

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
  );
}