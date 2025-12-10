import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

 const publicRoutes = [
    '/', 
    '/about', 
    '/services',
    '/contact', 
    '/providers', 
    '/resources', 
    '/faq', 
    '/terms', 
    '/privacy',
    '/api/chat'
  ]
  
 const authPages = ['/login', '/signup', '/forgot-password']
  const isAuthPage = authPages.includes(pathname)
  
 
  const dashboardRoutes = ['/client/dashboard', '/provider/dashboard', '/admin/dashboard']
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route))
  
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

 if (user && isAuthPage) {
   
    const { data: clientData } = await supabase
      .from("clients")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    const { data: providerData } = await supabase
      .from("providers")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    const { data: adminData } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

   
    if (clientData) {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    } else if (providerData) {
      return NextResponse.redirect(new URL("/provider/dashboard", request.url));
    } else if (adminData) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

 if (!user && isDashboardRoute) {
   
    if (pathname === "/admin/login") {
      return response;
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user && !isPublicRoute && !isAuthPage && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}