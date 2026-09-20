import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best PHEV Comparison Videos & Range Tests | PHEVs.eu',
  description: 'Watch in-depth plug-in hybrid comparison videos, real-world electric range tests, charging speed analysis, and reviews of the latest PHEVs in Europe.',
  alternates: {
    canonical: 'https://www.phevs.eu/videos/',
    languages: {
      'x-default': 'https://www.phevs.eu/videos/',
      en: 'https://www.phevs.eu/videos/',
      tr: 'https://www.phevs.eu/videos/',
      de: 'https://www.phevs.eu/videos/',
      pl: 'https://www.phevs.eu/videos/',
    },
  },
  openGraph: {
    title: 'Best PHEV Comparison Videos & Range Tests | PHEVs.eu',
    description: 'Watch in-depth plug-in hybrid comparison videos, real-world electric range tests, charging speed analysis, and reviews of the latest PHEVs in Europe.',
    url: 'https://www.phevs.eu/videos/',
    siteName: 'PHEVs.eu',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best PHEV Comparison Videos & Range Tests | PHEVs.eu',
    description: 'Watch in-depth plug-in hybrid comparison videos, real-world electric range tests, charging speed analysis, and reviews of the latest PHEVs in Europe.',
  },
}

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
