import Link from "next/link"

type ServicePageHeaderProps = {
  title: string
  description: string
}

export function ServicePageHeader({ title, description }: ServicePageHeaderProps) {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
            <p className="mt-2 text-lg text-gray-600">{description}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-primary shadow hover:bg-gray-50"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

