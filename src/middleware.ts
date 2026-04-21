import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'

import type { NextRequest } from 'next/server'

export const middleware = auth((req: NextRequest & { auth: object | null }) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname

  const isPublicRoute =
    pathname === '/' || pathname === '/login' || pathname.startsWith('/api/auth')

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
