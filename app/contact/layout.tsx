import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | PHEVs.eu',
  description: 'Get in touch with PHEVs.eu team. Send us your questions, feedback, or suggestions about plug-in hybrid vehicles.',
  keywords: [
    'contact PHEVs.eu',
    'PHEV support',
    'plug-in hybrid help',
    'PHEV questions',
    'contact form'
  ],
  openGraph: {
    title: 'Contact Us | PHEVs.eu',
    description: 'Get in touch with PHEVs.eu team. Send us your questions or feedback.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://phevs.eu/contact',
    languages: {
      'x-default': 'https://phevs.eu/contact',
      en: 'https://phevs.eu/contact',
      tr: 'https://phevs.eu/contact?lang=tr',
      de: 'https://phevs.eu/contact?lang=de',
      pl: 'https://phevs.eu/contact?lang=pl',
    },
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

