"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export function ProviderProfileEditForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    description: "",
    startingPrice: "",
    availability: "",
    password: "",
    confirmPassword: "",
    // For display only:
    name: "",
    email: "",
    category: "",
  })

  useEffect(() => {
    const fetchProvider = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setLoading(false)
        setErrors({ form: "Not logged in" })
        return
      }
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("id", session.user.id)
        .single()
      if (data) {
        setFormData({
          phone: data.phone || "",
          location: data.location || "",
          description: data.description || "",
          startingPrice: data.starting_price ? String(data.starting_price) : "",
          availability: data.availability || "",
          password: "",
          confirmPassword: "",
          name: data.name || "",
          email: data.email || "",
          category: data.category || "",
        })
      }
      if (error) setErrors({ form: "Could not fetch profile" })
      setLoading(false)
    }
    fetchProvider()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.startingPrice.trim()) newErrors.startingPrice = "Starting price is required"
    else if (isNaN(Number(formData.startingPrice)) || Number(formData.startingPrice) <= 0) {
      newErrors.startingPrice = "Starting price must be a positive number"
    }
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
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
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setErrors({ form: "Not logged in" })
        setIsSubmitting(false)
        return
      }
      // Update provider fields
      const { error } = await supabase
        .from("providers")
        .update({
          phone: formData.phone,
          location: formData.location,
          description: formData.description,
          starting_price: formData.startingPrice ? Number(formData.startingPrice) : null,
          availability: formData.availability,
        })
        .eq("id", session.user.id)
      // Update password if provided
      if (!error && formData.password) {
        const { error: pwError } = await supabase.auth.updateUser({ password: formData.password })
        if (pwError) {
          setErrors({ form: "Profile updated, but password change failed: " + pwError.message })
          setIsSubmitting(false)
          return
        }
      }
      if (error) {
        setErrors({ form: "An error occurred while updating your profile. Please try again." })
      } else {
        router.push("/provider/dashboard")
      }
    } catch (error) {
      setErrors({ form: "An error occurred while updating your profile. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        {/* Display only (not editable) */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="bg-gray-100 px-3 py-2 rounded">{formData.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="bg-gray-100 px-3 py-2 rounded">{formData.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
              <div className="bg-gray-100 px-3 py-2 rounded">{formData.category}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="mt-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
              <option value="">Select availability</option>
              <option value="Available today">Available today</option>
              <option value="Available tomorrow">Available tomorrow</option>
              <option value="Available in 2 days">Available in 2 days</option>
              <option value="Available next week">Available next week</option>
              <option value="Available anytime">Available anytime</option>
            </select>
          </div>
        </div>
        {/* Password Change Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
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
                autoComplete="new-password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
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
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-6">{errors.form}</div>
        )}
        <div className="mt-8 flex justify-end space-x-4">
          <Link
            href="/provider/dashboard"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </form>
  )
}