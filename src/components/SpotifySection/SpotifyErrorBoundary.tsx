'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Section-level error boundary.
 *
 * Without this, a render error anywhere inside the Spotify widget propagates to
 * the route boundary and blanks the entire page with Next's generic
 * "Application error: a client-side exception has occurred" screen. Containing
 * it here means a bad Spotify payload costs one card, not the whole portfolio.
 *
 * Must be a class component — React has no hook equivalent for
 * componentDidCatch / getDerivedStateFromError.
 */
class SpotifyErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('[SpotifySection] render failed:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <p className="text-theme-sm text-white opacity-[0.4]">
          Spotify data is unavailable right now.
        </p>
      </div>
    )
  }
}

export default SpotifyErrorBoundary
