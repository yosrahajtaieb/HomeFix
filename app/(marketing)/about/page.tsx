import type { Metadata } from "next"
import Image from "next/image"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { PageHeader } from "@/components/services/page-header"
import { CheckCircle, Users, Award, ThumbsUp } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - HomeFix",
  description: "Learn about HomeFix, our mission, and the team behind our home services marketplace",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <PageHeader
          title="About HomeFix"
          description="Connecting homeowners with trusted service professionals since 2020"
        />

        {/* Mission Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  At HomeFix, we believe that finding reliable home service professionals shouldn't be a challenge. Our
                  mission is to simplify the process of connecting homeowners with skilled, vetted professionals who can
                  handle all their home service needs.
                </p>
                <p className="text-lg text-gray-600">
                  We're committed to transparency, quality, and exceptional customer service. By carefully vetting our
                  service providers and facilitating seamless connections, we're creating a marketplace that homeowners
                  can trust and professionals can thrive in.
                </p>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/about.jpg"
                  alt="HomeFix team meeting"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">HomeFix by the Numbers</h2>
              <p className="mt-4 text-lg text-gray-600">Our impact in the home services industry</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-gray-600">Homeowners Served</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5K+</div>
                <p className="text-gray-600">Service Providers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">25K+</div>
                <p className="text-gray-600">Completed Jobs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.8</div>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Core Values</h2>
              <p className="mt-4 text-lg text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-gray-600">
                  We're committed to connecting homeowners with only the highest quality service professionals who
                  deliver exceptional work.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-600">
                  We foster a supportive community where homeowners and service providers can connect, communicate, and
                  collaborate effectively.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trust</h3>
                <p className="text-gray-600">
                  We build trust through transparency, thorough vetting processes, and by standing behind the quality of
                  our service providers.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ThumbsUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Satisfaction</h3>
                <p className="text-gray-600">
                  We're dedicated to ensuring customer satisfaction at every step, from finding the right professional
                  to completing the job.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

