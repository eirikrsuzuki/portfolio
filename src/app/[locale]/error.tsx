'use client'

import { useEffect } from 'react'

/**
 * Route-level error boundary for the locale segment.
 *
 * The repo had no error.tsx, so any client-side render error fell through to
 * Next's built-in screen: "Application error: a client-side exception has
 * occurred (see the browser console for more information)". This replaces that
 * with something on-brand and, critically, a way back — plus the digest, which
 * is what you need to find the matching entry in production logs.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[route error]', error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#0f1c2b] px-6 py-24 text-center text-white">
      <h1 className="text-theme-heading-xs font-poppins mb-3">
        Something went wrong.
      </h1>
      <p className="text-theme-sm mb-8 max-w-[480px] opacity-[0.7]">
        This page hit an unexpected error. Trying again usually clears it.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] px-5 py-2 text-theme-sm transition-colors hover:bg-[rgba(255,255,255,0.1)]"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-md px-5 py-2 text-theme-sm opacity-[0.7] transition-opacity hover:opacity-100"
        >
          Back home
        </a>
      </div>

      {error.digest && (
        <p className="mt-8 font-mono text-theme-xs opacity-[0.35]">
          Reference: {error.digest}
        </p>
      )}
    </main>
  )
}
