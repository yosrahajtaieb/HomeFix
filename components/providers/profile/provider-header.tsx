// components/providers/provider-header.tsx
import Image from "next/image";
import { MapPin, Star, DollarSign, CheckCircle } from "lucide-react";

type Provider = {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  starting_price: number;
  available_from: string;
  category: string;
};

export function ProviderHeader({ provider }: { provider: Provider }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <Image
              src="/placeholder1.svg"
              alt={provider.name}
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                <p className="text-primary font-medium">
                  {provider.category} Specialist
                </p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{provider.rating}</span>
                    <span className="mx-1.5 text-gray-300">•</span>
                    <span className="text-gray-600">
                      {provider.reviewCount} reviews
                    </span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {provider.location}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center text-green-600 font-medium mb-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>
                    {(() => {
                      const today = new Date().toISOString().split("T")[0];
                      const availableFrom = provider.available_from;

                      if (!availableFrom || availableFrom <= today) {
                        return "Available Today";
                      } else {
                        return `Available from ${new Date(
                          availableFrom
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`;
                      }
                    })()}
                  </span>
                </div>

                <div className="flex items-center font-medium">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>Starting from ${provider.starting_price}/hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}