import type React from "react"
type HowItWorksSectionProps = {
  forwardedRef: React.RefObject<HTMLElement>
}

export function HowItWorksSection({ forwardedRef }: HowItWorksSectionProps) {
  return (
    <section ref={forwardedRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">Get your home services in three simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Choose a Service</h3>
            <p className="text-gray-600">Browse through our categories and select the service you need.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Book a Provider</h3>
            <p className="text-gray-600">Choose from our list of qualified professionals and book a time.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Get It Done</h3>
            <p className="text-gray-600">Sit back and relax while our professionals handle your needs.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

