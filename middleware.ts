import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Allow from only your frontend domain in production
  response.headers.set('Access-Control-Allow-Origin', 'https://www.bridgeautodetailing.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request early
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: response.headers,
    })
  }

  return response
}

// Apply only to API routes
export const config = {
  matcher: '/api/:path*',
}