export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

export async function onRequestError(err: unknown, request: Request, context: Record<string, unknown>) {
  // Log error for debugging - Sentry integration can be improved later
  console.error('Request error:', {
    error: err,
    url: request.url,
    method: request.method,
    context
  })
}