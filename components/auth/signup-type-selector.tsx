"use client"

import { useState } from "react"
import { UserRound, Wrench } from "lucide-react"
import { ClientRegistrationForm } from "./client-registration-form"
import { ProviderRegistrationForm } from "@/components/auth/provider-registration-form"

type UserType = "client" | "provider" | null

export function SignupTypeSelector() {
  const [selectedType, setSelectedType] = useState<UserType>(null)

  if (selectedType === "client") {
    return <ClientRegistrationForm onBack={() => setSelectedType(null)} />
  }

  if (selectedType === "provider") {
    return <ProviderRegistrationForm onBack={() => setSelectedType(null)} />
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-center mb-8">I want to sign up as a...</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setSelectedType("client")}
          className="flex flex-col items-center p-8 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <UserRound className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Client</h3>
          <p className="text-gray-600 text-center">I&apos;m looking for home services and want to hire professionals</p>
        </button>

        <button
          onClick={() => setSelectedType("provider")}
          className="flex flex-col items-center p-8 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Wrench className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Service Provider</h3>
          <p className="text-gray-600 text-center">I want to offer my professional services and grow my business</p>
        </button>
      </div>
    </div>
  )
}

