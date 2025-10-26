import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Provider } from "./types";

type AccountDetailsProps = {
  provider: Provider | null;
  loading: boolean;
};

export function AccountDetails({ provider, loading }: AccountDetailsProps) {
  let detailsContent: JSX.Element;

  if (loading) {
    detailsContent = <p>Loading...</p>;
  } else if (provider) {
    detailsContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-500 mb-1">
              Full Name
            </p>
            <p className="text-gray-900">{provider.name}</p>
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-500 mb-1">
              Email Address
            </p>
            <p className="text-gray-900">{provider.email}</p>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-500 mb-1">
              Phone Number
            </p>
            <p className="text-gray-900">{provider.phone}</p>
          </div>

          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-500 mb-1">
              Location
            </p>
            <p className="text-gray-900">{provider.location}</p>
          </div>
        </div>
      </div>
    );
  } else {
    detailsContent = <p>No provider data found.</p>;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Account Details</h2>
        <Link
          href="/provider/profile/edit"
          className="text-primary hover:underline flex items-center text-sm font-medium"
        >
          Edit Profile <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          {detailsContent}
        </div>
      </div>
    </div>
  );
}