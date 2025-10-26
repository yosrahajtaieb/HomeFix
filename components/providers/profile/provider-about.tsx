// components/providers/provider-about.tsx
type Provider = {
  name: string;
  description: string;
  location: string;
  category: string;
};

export function ProviderAbout({ provider }: { provider: Provider }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">About {provider.name}</h2>
        <p className="text-gray-700 mb-6">{provider.description}</p>

        <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
        <ul className="list-disc pl-5 mb-6 text-gray-700">
          {provider.category?.toLowerCase() === "plumbing" && (
            <>
              <li>Leak detection and repair</li>
              <li>Pipe installation and replacement</li>
              <li>Drain cleaning</li>
              <li>Water heater installation and repair</li>
              <li>Fixture installation</li>
            </>
          )}
          {provider.category?.toLowerCase() === "electrical" && (
            <>
              <li>Electrical panel upgrades</li>
              <li>Wiring and rewiring</li>
              <li>Lighting installation</li>
              <li>Outlet and switch installation</li>
              <li>Electrical troubleshooting</li>
            </>
          )}
          {provider.category?.toLowerCase() === "hvac" && (
            <>
              <li>Heating system installation and repair</li>
              <li>Air conditioning installation and repair</li>
              <li>Ventilation system maintenance</li>
              <li>Duct cleaning</li>
              <li>Thermostat installation</li>
            </>
          )}
          {provider.category?.toLowerCase() === "locksmith" && (
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
          Serving {provider.location} and surrounding areas within a 25-mile
          radius.
        </p>
      </div>
    </div>
  );
}