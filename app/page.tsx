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
 

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);


useEffect(() => {
    const fetchProviders = async () => {
      const supabase = createClient()
      const { data: providersData, error } = await supabase
        .from("providers")
        .select("*")
        .limit(6)
      
      if (error) {
        console.error("Failed to load providers:", error)
        return
      }
      
      if (providersData) {
        const providersWithReviews = await Promise.all(
          providersData.map(async (provider) => {
            const { data: reviewsData } = await supabase
              .from("reviews")
              .select("rating")
              .eq("provider_id", provider.id);

            const reviewCount = reviewsData?.length || 0;
            const averageRating = reviewCount > 0
              ? (reviewsData?.reduce((sum, r) => sum + r.rating, 0) || 0) / reviewCount
              : 0;

            return {
              id: provider.id,
              name: provider.name,
              category: provider.category,
              location: provider.location,
              description: provider.description,
              available_from: provider.available_from,
              startingPrice: provider.starting_price,
              rating: parseFloat(averageRating.toFixed(1)),
              reviewCount: reviewCount,
              image: "/placeholder1.svg",
            };
          })
        );

        setFeaturedProviders(providersWithReviews);
      }
    }
    fetchProviders()
  }, [])

  // Fetch testimonials - ADD THIS BACK!
  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          client_id, 
          rating, 
          comment, 
          date,
          clients (
            first_name,
            last_name
          )
        `)
        .order("date", { ascending: false })
        .limit(6);
      
      console.log("Reviews data:", data);
      console.log("Reviews error:", error);
      
      if (!error && data) {
        setTestimonials(
          data.map((r: any) => ({
            name: r.clients?.first_name && r.clients?.last_name 
              ? `${r.clients.first_name} ${r.clients.last_name}`
              : "Anonymous",
            location: "",
            rating: r.rating,
            text: r.comment,
            image: "/placeholder.svg",
          }))
        );
      } else if (error) {
        console.error("Failed to load testimonials:", error);
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

