"use client";

import type React from "react";
import Link from "next/link";

type FooterProps = {
  scrollToSection?: (ref: React.RefObject<HTMLElement>) => void;
  servicesRef?: React.RefObject<HTMLElement>;
};

export function Footer({ scrollToSection, servicesRef }: FooterProps = {}) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">HomeFix</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/plumbing" className="hover:text-primary">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/electrical"
                  className="hover:text-primary"
                >
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/services/hvac" className="hover:text-primary">
                  HVAC
                </Link>
              </li>
              <li>
                <Link href="/services/locksmith" className="hover:text-primary">
                  Locksmith
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary">
                  View All
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">For Providers</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/signup?role=provider"
                  className="hover:text-primary"
                >
                  Join as Provider
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-primary">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  Provider FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} HomeFix. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}
