import Link from "next/link"
import type { ReactNode } from "react"

type ServiceCategory = {
  id: string
  name: string
  description: string
  icon: ReactNode
}

type ServiceCategoriesGridProps = {
  serviceCategories: ServiceCategory[]
}

export function ServiceCategoriesGrid({ serviceCategories }: ServiceCategoriesGridProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Browse Service Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
        {serviceCategories.map((category) => (
          <Link
            key={category.id}
            href={`/services/${category.id}`}
            className="group flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-primary/5 flex items-center justify-center p-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                {category.icon}
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="mt-2 text-gray-600">{category.description}</p>
              <div className="mt-4 flex items-center text-primary font-medium">
                View providers
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

