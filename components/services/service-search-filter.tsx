import { Search, MapPin, ChevronDown } from "lucide-react"

type ServiceSearchFilterProps = {
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  onSortChange?: (value: string) => void
  onLocationChange?: (value: string) => void
}

export function ServiceSearchFilter({ 
  searchPlaceholder = "Search providers...",
  onSearchChange,
  onSortChange,
  onLocationChange
}: ServiceSearchFilterProps) {
  return (
    <section className="py-6 border-b">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
          {/* Search by name */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Location filter - takes remaining space */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location..."
                onChange={(e) => onLocationChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="relative min-w-[200px]">
            <select 
              onChange={(e) => onSortChange?.(e.target.value)}
              className="appearance-none bg-white border rounded-md pl-3 pr-10 py-2 w-full focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Lowest Price</option>
              <option value="reviews">Most Reviews</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}