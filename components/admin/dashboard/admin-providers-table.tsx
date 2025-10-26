"use client";

import { useState, useEffect } from "react";
import { Search, User, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ProviderDetailsModal } from "./provider-details-modal";

type Provider = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  starting_price: number;
  approved: boolean;
  created_at: string;
  active: boolean;
  completed_jobs?: number;
  average_rating?: number;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

export default function AdminProvidersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const supabase = createClient();

  useEffect(() => {
    fetchProviders();
  }, []);

  

    const fetchProviders = async () => {
    setLoading(true);

    const { data: providersData, error } = await supabase
      .from("providers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching providers:", error);
      setLoading(false);
      return;
    }

    // Fetch completed jobs count and average rating for each provider
    const providersWithStats = await Promise.all(
      (providersData || []).map(async (provider) => {
        // Count completed jobs
        const { count } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", provider.id)
          .eq("status", "completed"); // ← CHANGED from "confirmed" to "completed"

        // Get average rating from reviews
        const { data: reviews } = await supabase
          .from("reviews")
          .select("rating")
          .eq("provider_id", provider.id);

        // Calculate average rating
        let average_rating = 0;
        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
          average_rating = sum / reviews.length;
        }

        return {
          ...provider,
          completed_jobs: count || 0,
          average_rating: reviews && reviews.length > 0 ? average_rating : undefined,
        };
      })
    );

    setProviders(providersWithStats);
    setLoading(false);
  };

  const handleSuspend = async (id: string, activate: boolean) => {
    const { error } = await supabase
      .from("providers")
      .update({ active: activate })
      .eq("id", id);

    if (!error) {
      setProviders(
        providers.map((provider) =>
          provider.id === id ? { ...provider, active: activate } : provider
        )
      );
    }
  };
  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("providers")
      .update({ approved: true })
      .eq("id", id);

    if (!error) {
      setProviders(
        providers.map((provider) =>
          provider.id === id ? { ...provider, approved: true } : provider
        )
      );
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService =
      serviceFilter === "all" || provider.category === serviceFilter;

    return matchesSearch && matchesService;
  });

  const getStatusColor = (active: boolean) => {
    return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(providers.map((p) => p.category)));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-black overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          Loading providers...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-black overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-black">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none bg-white border border-black rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Services</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Service Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Registration
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Completed Jobs
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProviders.map((provider) => (
              <tr
                key={provider.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedProvider(provider)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {provider.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{provider.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {provider.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(provider.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {provider.completed_jobs || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {provider.average_rating
                      ? `${provider.average_rating} ⭐`
                      : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      provider.active
                    )}`}
                  >
                    {provider.active ? "Active" : "Suspended"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No providers found matching your criteria.
          </p>
        </div>
      )}

      {selectedProvider && (
        <ProviderDetailsModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onSuspend={handleSuspend}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
}
