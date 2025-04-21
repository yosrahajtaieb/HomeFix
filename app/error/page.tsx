'use client'

import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-lg text-gray-600 mb-8">
          We encountered an error while processing your request.
        </p>
        <Link 
          href="/login" 
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          Return to login
        </Link>
      </div>
    </div>
  )
}