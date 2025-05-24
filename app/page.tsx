"use client"

"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
// ...other imports...

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
//import { featuredProviders } from "@/data/providers"


// Define the Testimonial type
type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
};

export default function Home() {
  // Create refs for each section
  const servicesRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const providersRef = useRef<HTMLElement>(null)


  const [featuredProviders, setFeaturedProviders] = useState<any[]>([])
  useEffect(() => {
    const fetchProviders = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("providers")
        .select("id, name, category, location, description,availability,starting_price")
        .limit(6)
      if (error) {
        console.error("Failed to load providers:", error)
        return
      }
      setFeaturedProviders(
        data.map((p: any) => ({
          id: p.id,
          location: p.location,
          name: p.name,
          category: p.category,
          availability: p.availability,
          reviewCount: p.review_count,
          image: "/placeholder1.svg", // always use placeholder image
          description: p.description,
          startingPrice: p.starting_price,
        }))
      )
    }
    fetchProviders()
  }, [])

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

useEffect(() => {
  const fetchTestimonials = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("author, rating, comment")
      .order("date", { ascending: false })
      .limit(6);
    if (!error && data) {
      setTestimonials(
        data.map((r: any) => ({
          name: r.author,
          location: "", // Add if you have location in your reviews table
          rating: r.rating,
          text: r.comment,
          image: "/placeholder.svg", // Or use a real image if you have one
        }))
      );
    }
  };
  fetchTestimonials();
}, []);


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

