// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware hit! Path:', request.nextUrl.pathname, 'Method:', request.method, 'Origin:', request.headers.get('origin'));

  const response = NextResponse.next();

  const allowedOrigins = [
    'https://www.bridgeautodetailing.com',
    'http://localhost:3000',
    'http://127.0.0.1:5501',
    'http://localhost:5501',
  ];

  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // Optionally, for strictness, you could set it to a default
    // known good origin if you want, but letting it be unset is okay.
    // For local dev, we need it to be dynamic.
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Ensure Content-Type is allowed. Add Authorization too if your frontend sends it.
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS request early
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No content, successful preflight
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};