"use client"

import type React from "react"

type CTASectionProps = {
  scrollToSection: (ref: React.RefObject<HTMLElement>) => void
  servicesRef: React.RefObject<HTMLElement>
}

export function CTASection({ scrollToSection, servicesRef }: CTASectionProps) {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to get started?</h2>
          <p className="mt-4 text-lg text-white/80">
            Join thousands of satisfied customers who trust HomeFix for their home service needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-primary shadow-sm hover:bg-gray-100">
              Sign Up Now
            </button>
            <button
              onClick={() => scrollToSection(servicesRef)}
              className="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-base font-medium text-white hover:bg-white/10"
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

