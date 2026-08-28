export default defineEventHandler((event) => {
  const path = event.path || event.node.req.url || ''

  // Only guard /api/ routes
  if (!path.startsWith('/api/')) {
    return
  }

  // Allow internal sitemap generation route
  if (path.startsWith('/api/sitemap-urls')) {
    return
  }

  // Bypass guard for internal Nitro SSR requests
  // During SSR, Nuxt forwards incoming browser headers (including sec-fetch-dest: document)
  // to internal $fetch calls. Internal dispatches do not have a real network socket remoteAddress.
  if (!event.node.req.socket?.remoteAddress) {
    return
  }

  const req = event.node.req
  const headers = req.headers

  // If request is made directly via browser address bar (document navigation)
  // redirect to relevant canonical page or return 403 Forbidden
  const secFetchDest = headers['sec-fetch-dest']
  const accept = String(headers['accept'] || '')
  if (secFetchDest === 'document' || (accept.includes('text/html') && !accept.includes('application/json'))) {
    // If user tried to visit /api/pincode/560001 directly in browser
    const pincodeMatch = path.match(/^\/api\/pincode\/(\d{6})/)
    if (pincodeMatch) {
      return sendRedirect(event, `/pincode/${pincodeMatch[1]}`, 302)
    }
    const stateMatch = path.match(/^\/api\/state\/([a-z0-9-]+)/)
    if (stateMatch) {
      return sendRedirect(event, `/state/${stateMatch[1]}/pincodes`, 302)
    }
    const distMatch = path.match(/^\/api\/district\/([a-z0-9-]+)/)
    if (distMatch) {
      return sendRedirect(event, `/district/${distMatch[1]}/pincodes`, 302)
    }
    const poMatch = path.match(/^\/api\/post-office\/([a-z0-9-]+)/)
    if (poMatch) {
      return sendRedirect(event, `/post-office/${poMatch[1]}`, 302)
    }

    throw createError({
      statusCode: 403,
      statusMessage: 'Direct browser access to API endpoints is disabled.',
    })
  }

  // Block cross-site fetch / external scrapers
  const secFetchSite = headers['sec-fetch-site']
  if (secFetchSite === 'cross-site') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cross-origin access to Pin Directory API is forbidden.',
    })
  }

  // Verify Origin if provided (CORS protection)
  const host = headers['host']
  const origin = headers['origin']
  if (origin) {
    const originHost = origin.replace(/^https?:\/\//, '').split('/')[0]
    if (originHost && host && originHost !== host) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Unauthorized API Origin.',
      })
    }
  }

  // Block known scraping clients and generic bot agents
  const userAgent = String(headers['user-agent'] || '').toLowerCase()
  if (
    userAgent.startsWith('curl/') ||
    userAgent.startsWith('python-requests') ||
    userAgent.startsWith('postman') ||
    userAgent.startsWith('insomnia') ||
    userAgent.includes('scrapy') ||
    userAgent.includes('httpclient')
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Automated API access is not permitted.',
    })
  }
})
