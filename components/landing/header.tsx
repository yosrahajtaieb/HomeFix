"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Wrench, X, Menu } from "lucide-react";
import Link from "next/link";

export function Header() {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"client" | "provider" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
    
    if (session?.user) {
      // Check clients table
      const { data: clientData } = await supabase
        .from("clients")
        .select("id")
        .eq("id", session.user.id)
        .single();
      if (clientData) {
        setUserType("client");
        return;
      }
      // Check providers table
      const { data: providerData } = await supabase
        .from("providers")
        .select("id")
        .eq("id", session.user.id)
        .single();
      if (providerData) {
        setUserType("provider");
        return;
      }
      setUserType(null);
    } else {
      setUserType(null);
    }
  };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session?.user);
        // Repeat user type check on auth state change
        if (session?.user) {
          supabase
            .from("clients")
            .select("id")
            .eq("id", session.user.id)
            .single()
            .then(({ data: clientData }) => {
              if (clientData) {
                setUserType("client");
              } else {
                supabase
                  .from("providers")
                  .select("id")
                  .eq("id", session.user.id)
                  .single()
                  .then(({ data: providerData }) => {
                    if (providerData) setUserType("provider");
                    else setUserType(null);
                  });
              }
            });
        } else {
          setUserType(null);
        }
      }
    );
  
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => window.scrollTo(0, 0)}
          >
            <Wrench className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HomeFix</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                href={
                  userType === "provider"
                    ? "/provider/dashboard"
                    : userType === "client"
                    ? "/client/dashboard"
                    : "/"
                }
                className="text-sm font-medium hover:text-primary"
              >
                Profile
              </Link>
              <button
                onClick={async () => {
                  const supabase = createClient();
                  const { error } = await supabase.auth.signOut();
                  if (!error) {
                    window.location.href = "/login";
                  } else {
                    console.error("Logout failed:", error.message);
                  }
                }}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={toggleMenu}>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <nav className="flex flex-col space-y-4 p-4">
            {isLoggedIn ? (
              <>
                <Link
                  href={
                    userType === "provider"
                      ? "/provider/dashboard"
                      : userType === "client"
                      ? "/client/dashboard"
                      : "/"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    const { error } = await supabase.auth.signOut();
                    setMobileMenuOpen(false);
                    if (!error) {
                      window.location.href = "/login";
                    } else {
                      console.error("Logout failed:", error.message);
                    }
                  }}
                  className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
