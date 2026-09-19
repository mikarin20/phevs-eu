'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface YouTubeLiteEmbedProps {
  youtubeId: string
  title: string
  className?: string
  aspectRatio?: '16/9' | '4/3'
}

export default function YouTubeLiteEmbed({
  youtubeId,
  title,
  className = '',
  aspectRatio = '16/9',
}: YouTubeLiteEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Primary: maxresdefault, fallback: hqdefault
  const thumbnailUrl = imgError
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const aspectClass = aspectRatio === '16/9' ? 'aspect-video' : 'aspect-[4/3]'

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl bg-slate-900 shadow-xl ${className}`}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          className="group relative flex h-full w-full items-center justify-center cursor-pointer border-0 bg-transparent p-0 text-left focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail */}
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Big Play Button Badge */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-600/90 text-white shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600 group-active:scale-95">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8 sm:h-10 sm:w-10 translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Video Title Overlay (Top/Bottom) */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 text-white">
            <span className="inline-block rounded-full bg-red-600/80 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider mb-2">
              YouTube
            </span>
            <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-white drop-shadow-md">
              {title}
            </h3>
          </div>
        </button>
      )}
    </div>
  )
}
