import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-start">
            <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="font-medium">Our Office</h3>
              <p className="text-gray-600 mt-1">
                123 Main Street
                <br />
                Suite 500
                <br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="font-medium">Phone</h3>
              <p className="text-gray-600 mt-1">
                <a href="tel:+18005551234" className="hover:text-primary">
                  (800) 555-1234
                </a>
                <br />
                <span className="text-sm text-gray-500">Customer Support</span>
              </p>
              <p className="text-gray-600 mt-1">
                <a href="tel:+18005555678" className="hover:text-primary">
                  (800) 555-5678
                </a>
                <br />
                <span className="text-sm text-gray-500">Provider Support</span>
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="font-medium">Email</h3>
              <p className="text-gray-600 mt-1">
                <a href="mailto:support@homefix.com" className="hover:text-primary">
                  support@homefix.com
                </a>
                <br />
                <span className="text-sm text-gray-500">Customer Support</span>
              </p>
              <p className="text-gray-600 mt-1">
                <a href="mailto:providers@homefix.com" className="hover:text-primary">
                  providers@homefix.com
                </a>
                <br />
                <span className="text-sm text-gray-500">Provider Support</span>
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="ml-4">
              <h3 className="font-medium">Hours of Operation</h3>
              <p className="text-gray-600 mt-1">
                Monday - Friday: 8:00 AM - 8:00 PM EST
                <br />
                Saturday: 9:00 AM - 5:00 PM EST
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

