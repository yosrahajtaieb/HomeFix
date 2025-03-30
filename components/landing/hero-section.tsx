"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type HeroSectionProps = {
  scrollToSection?: (ref: React.RefObject<HTMLElement>) => void
  servicesRef?: React.RefObject<HTMLElement>
}

export function HeroSection({ scrollToSection, servicesRef }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Home Services, <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-xl text-gray-600">
              Connect with trusted professionals for all your home service needs. From plumbing to electrical work,
              we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90"
              >
                Find a Service
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/become-provider"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Become a Provider
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Home service professional"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

