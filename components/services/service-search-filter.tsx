import { Search, ChevronDown, Sliders } from "lucide-react"

type ServiceSearchFilterProps = {
  searchPlaceholder?: string
}

export function ServiceSearchFilter({ searchPlaceholder = "Search providers..." }: ServiceSearchFilterProps) {
  return (
    <section className="py-6 border-b">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none bg-white border rounded-md pl-3 pr-10 py-2 focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Sort by: Recommended</option>
                <option>Highest Rated</option>
                <option>Lowest Price</option>
                <option>Most Reviews</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
              <Sliders className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

