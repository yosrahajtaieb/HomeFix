import { AdminLoginForm } from "@/components/auth/admin-login-form"
import Link from "next/link"

export const metadata = { title: "Admin Login - HomeFix" }

export default function Page() {
  return (
    <div className="mx-auto max-w-md py-10">
      <div className="mb-4">
        <Link href="/login" className="text-sm text-gray-600 hover:text-primary">
          ← Back to login
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <AdminLoginForm />
    </div>
  )
}