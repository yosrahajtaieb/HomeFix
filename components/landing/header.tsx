"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Wrench, X, Menu } from "lucide-react";
import Link from "next/link";

export function Header() {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"client" | "provider" | "admin" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const determineUserType = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); // fast, cached
      const user = session?.user;

      setIsLoggedIn(!!user);
      if (!user) {
        setUserType(null);
        return;
      }

      const userId = user.id;

      const [
        { data: adminData },
        { data: clientData },
        { data: providerData },
      ] = await Promise.all([
        supabase.from("admins").select("id").eq("id", userId).maybeSingle(),
        supabase.from("clients").select("id").eq("id", userId).maybeSingle(),
        supabase.from("providers").select("id").eq("id", userId).maybeSingle(),
      ]);

      if (adminData) {
        setUserType("admin");
      } else if (providerData) {
        setUserType("provider");
      } else if (clientData) {
        setUserType("client");
      } else {
        setUserType(null);
      }
    };

    determineUserType();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      determineUserType();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);

  const dashboardLink =
    userType === "admin"
      ? "/admin/dashboard"
      : userType === "provider"
      ? "/provider/dashboard"
      : userType === "client"
      ? "/client/dashboard"
      : "/";

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

        <nav className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link href={dashboardLink} className="text-sm font-medium hover:text-primary">
                Profile
              </Link>
              <button
                onClick={async () => {
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
              <Link href="/login" className="text-sm font-medium hover:text-primary">
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

        <button className="md:hidden" onClick={toggleMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <nav className="flex flex-col space-y-4 p-4">
            {isLoggedIn ? (
              <>
                <Link
                  href={dashboardLink}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={async () => {
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