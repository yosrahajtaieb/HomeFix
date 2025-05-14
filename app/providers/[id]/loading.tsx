export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="animate-pulse">
        <div className="bg-gray-200 h-48 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-gray-200 h-8 w-64 mb-6 rounded"></div>
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
