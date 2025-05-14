"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ProviderProfile } from "@/components/providers/provider-profile"
import { createClient } from "@/utils/supabase/client"

type Props = {
  params: { id: string }
}

export default function ProviderProfilePage({ params }: Props) {
  const providerId = params.id
  const [provider, setProvider] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProvider = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("id", providerId)
        .single()
      setProvider(data)
      setLoading(false)
    }
    fetchProvider()
  }, [providerId])

  if (loading) return <div>Loading...</div>
  if (!provider) return notFound()

  // You can keep using mock reviews and availability for now
  const reviews = [
    {
      id: 1,
      author: "Emily Wilson",
      authorImage: "/placeholder1.svg?height=40&width=40",
      rating: 5,
      date: "2023-05-15",
      comment: "Excellent service! Very professional and completed the job quickly. Would definitely hire again.",
    },
    // ...more mock reviews
  ]

  const availability = {
    schedule: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    nextAvailable: "Tomorrow",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <ProviderProfile provider={provider} reviews={reviews} availability={availability} />
      </main>

      <Footer />
    </div>
  )
}