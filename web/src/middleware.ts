import {defineMiddleware} from 'astro:middleware'

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io; media-src 'self' https://cdn.sanity.io; font-src 'self'; frame-src https://player.vimeo.com https://www.youtube-nocookie.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests",
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Keep one public canonical host. Cloudflare still accepts www, but visitors
  // are redirected to the cleaner apex domain.
  if (context.url.hostname === 'www.ramygeorge.com') {
    const target = new URL(context.url)
    target.hostname = 'ramygeorge.com'
    return Response.redirect(target.toString(), 308)
  }

  const response = await next()
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name, value)
  return response
})
