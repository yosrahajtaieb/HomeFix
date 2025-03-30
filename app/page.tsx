"use client"

import type React from "react"

import { useRef } from "react"

// Import components
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { ServicesSection } from "@/components/landing/services-section"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { ProvidersSection } from "@/components/landing/providers-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { Footer } from "@/components/landing/footer"

// Import data
import { serviceCategories } from "@/data/service-categories"
import { featuredProviders } from "@/data/providers"
import { testimonials } from "@/data/testimonials"

export default function Home() {
  // Create refs for each section
  const servicesRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const providersRef = useRef<HTMLElement>(null)

  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />

        <ServicesSection serviceCategories={serviceCategories} forwardedRef={servicesRef} />

        <HowItWorksSection forwardedRef={howItWorksRef} />

        <ProvidersSection featuredProviders={featuredProviders} forwardedRef={providersRef} />

        <TestimonialsSection testimonials={testimonials} />
      </main>

      <Footer scrollToSection={scrollToSection} servicesRef={servicesRef} />
    </div>
  )
}

