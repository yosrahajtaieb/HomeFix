"use client"

import { useState } from "react"
import { ClientLoginForm } from "./client-login-form"
import { ProviderLoginForm } from "./provider-login-form"

type UserType = "client" | "provider" | null

export function LoginTypeSelector() {
  const [selectedType, setSelectedType] = useState<UserType>("client")

  return (
    <div>
      <div className="mb-6">
        <div className="flex rounded-md overflow-hidden border">
          <button
            type="button"
            onClick={() => setSelectedType("client")}
            className={`flex-1 py-3 text-center font-medium ${
              selectedType === "client" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("provider")}
            className={`flex-1 py-3 text-center font-medium ${
              selectedType === "provider" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Service Provider
          </button>
        </div>
      </div>

      {selectedType === "client" ? <ClientLoginForm /> : <ProviderLoginForm />}
    </div>
  )
}

