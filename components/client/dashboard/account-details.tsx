import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Client } from "./types";

type AccountDetailsProps = {
  client: Client | null;
  loading: boolean;
};

export function AccountDetails({ client, loading }: Readonly<AccountDetailsProps>) {
  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Account Details</h2>
        <Link
          href="/client/profile/edit"
          className="text-primary hover:underline flex items-center text-sm font-medium"
        >
          Edit Profile <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          {loading && <p>Loading...</p>}
          {!loading && !client && <p>No client data found.</p>}
          {!loading && client && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </span>
                  <p className="text-gray-900">
                    {client.first_name} {client.last_name}
                  </p>
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </span>
                  <p className="text-gray-900">{client.email}</p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </span>
                  <p className="text-gray-900">{client.phone}</p>
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-500 mb-1">
                    Address
                  </span>
                  <p className="text-gray-900">{client.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}