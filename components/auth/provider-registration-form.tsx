"use client"

import type React from "react"
import { providerSignup } from "@/app/actions/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, CheckCircle } from "lucide-react"
import { serviceCategories } from "@/data/service-categories"

type ProviderRegistrationFormProps = {
  onBack?: () => void
}

export function ProviderRegistrationForm({ onBack }: ProviderRegistrationFormProps = {}) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    category: "",
    description: "",
    location: "",
    startingPrice: "",
    availability: "Available next week",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.category) newErrors.category = "Service category is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"

    if (!formData.startingPrice.trim()) newErrors.startingPrice = "Starting price is required"
    else if (isNaN(Number(formData.startingPrice)) || Number(formData.startingPrice) <= 0) {
      newErrors.startingPrice = "Starting price must be a positive number"
    }

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Create a FormData object with all provider information
      const formDataObj = new FormData()
      formDataObj.append('email', formData.email)
      formDataObj.append('password', formData.password)
      formDataObj.append('name', formData.name)
      formDataObj.append('phone', formData.phone)
      formDataObj.append('location', formData.location)
      formDataObj.append('category', formData.category)
      formDataObj.append('description', formData.description)
      formDataObj.append('startingPrice', formData.startingPrice)
      formDataObj.append('availability', formData.availability)

      // Call the server action
      const result = await providerSignup(formDataObj)

      if (result.success) {
        setIsSuccess(true)
        // Redirect after showing success message
        setTimeout(() => {
          router.push("/provider/dashboard") 
        }, 2000)
      } else {
        setErrors({ form: result.error || "Registration failed. Please try again." })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ form: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for joining HomeFix as a service provider. Your account is being reviewed.
        </p>
        <p className="text-gray-600">You will be redirected to the homepage shortly...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {onBack && (
        <button onClick={onBack} type="button" className="flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to options
        </button>
      )}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location (City, State) *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Service Information</h2>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Service Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a category</option>
            {serviceCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Service Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your services, experience, and expertise..."
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Starting Price ($/hour) *
            </label>
            <input
              type="text"
              id="startingPrice"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.startingPrice ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startingPrice && <p className="mt-1 text-sm text-red-500">{errors.startingPrice}</p>}
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="Available today">Available today</option>
              <option value="Available tomorrow">Available tomorrow</option>
              <option value="Available in 2 days">Available in 2 days</option>
              <option value="Available next week">Available next week</option>
              <option value="Available anytime">Available anytime</option>
            </select>
          </div>
        </div>

        
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Account Security</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>
      </div>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{errors.form}</div>
      )}

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
        >
          {isSubmitting ? "Registering..." : "Register as Provider"}
        </button>
      </div>
    </form>
  )
}

