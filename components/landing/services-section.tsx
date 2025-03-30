import type React from "react"
import type { ReactNode } from "react"
import Link from "next/link"

type ServiceCategory = {
  id: string
  name: string
  description: string
  icon: ReactNode
}

type ServicesSectionProps = {
  serviceCategories: ServiceCategory[]
  forwardedRef: React.RefObject<HTMLElement>
}

export function ServicesSection({ serviceCategories, forwardedRef }: ServicesSectionProps) {
  return (
    <section ref={forwardedRef} className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600">Professional home services you can trust</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((category) => (
            <Link
              href={`/services/${category.id}`}
              key={category.id}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-medium text-center mb-2">{category.name}</h3>
              <p className="text-gray-600 text-center text-sm">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

