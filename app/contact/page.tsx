import type { Metadata } from 'next';
import Link from 'next/link';
import ContactFormClient from '@/components/ContactFormClient';
import {
  EnvelopeIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  ClockIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contact Us — PHEVs.eu Editorial & Automotive Research Desk',
  description:
    'Contact the PHEVs.eu editorial team, submit manufacturer homologation sheets, suggest new plug-in hybrid models, or inquire about European automotive research and data partnerships.',
  alternates: {
    canonical: 'https://www.phevs.eu/contact/',
  },
  openGraph: {
    title: 'Contact Us — PHEVs.eu Editorial & Automotive Research Desk',
    description:
      'Official contact channels for PHEVs.eu: general inquiries, manufacturer technical data submissions, and editorial review.',
    url: 'https://www.phevs.eu/contact/',
    type: 'website',
    siteName: 'PHEVs.eu',
    images: [
      {
        url: 'https://www.phevs.eu/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact PHEVs.eu — European Plug-in Hybrid Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — PHEVs.eu Editorial & Automotive Research Desk',
    description:
      'Official contact channels for PHEVs.eu: general inquiries, manufacturer technical data submissions, and editorial review.',
    images: ['https://www.phevs.eu/images/og-image.jpg'],
  },
};

export default function ContactPage() {
  const baseUrl = 'https://www.phevs.eu';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${baseUrl}/contact/#webpage`,
        url: `${baseUrl}/contact/`,
        name: 'Contact Us — PHEVs.eu Editorial & Automotive Research Desk',
        description:
          'Official contact channels for PHEVs.eu: general inquiries, manufacturer technical data submissions, and editorial review.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'PHEVs.eu',
          url: `${baseUrl}/`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'PHEVs.eu',
        url: `${baseUrl}/`,
        logo: `${baseUrl}/favicon.svg`,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            email: 'info@phevs.eu',
            contactType: 'customer support',
            availableLanguage: ['English', 'German', 'Turkish', 'Polish', 'French', 'Spanish'],
          },
          {
            '@type': 'ContactPoint',
            email: 'editor@phevs.eu',
            contactType: 'editorial desk',
            availableLanguage: ['English', 'German'],
          },
          {
            '@type': 'ContactPoint',
            email: 'data@phevs.eu',
            contactType: 'technical support',
            availableLanguage: ['English', 'German'],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contact Us',
            item: `${baseUrl}/contact/`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Bar */}
      <div className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Contact & Editorial Desk</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <EnvelopeIcon className="w-4 h-4 text-emerald-400" />
              Direct Communication Channels
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Contact PHEVs.eu
            </h1>

            <p className="text-lg text-indigo-100/90 leading-relaxed mb-6">
              Have questions, feedback, or a technical suggestion? Whether you are a car buyer, automotive
              manufacturer submitting WLTP homologation sheets, or fleet manager, our research team is here to assist.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-200/70">
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4 text-emerald-400" />
                Response Time: Within 24–48 Hours
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                Independent Research & Data Verification
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Direct Inboxes & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Official Inboxes
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                To help us route your message to the appropriate specialist, please use the relevant departmental channel:
              </p>
            </div>

            {/* General Inquiries */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    General Inquiries & Feedback
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                    General questions, reader suggestions, usability feedback, or partnership requests.
                  </p>
                  <a
                    href="mailto:info@phevs.eu"
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    info@phevs.eu
                  </a>
                </div>
              </div>
            </div>

            {/* Technical Data Corrections */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <DocumentCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Manufacturer Data & Homologation
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                    Automotive manufacturers and engineers submitting official WLTP test sheets, battery updates, or crash ratings.
                  </p>
                  <a
                    href="mailto:data@phevs.eu"
                    className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    data@phevs.eu
                  </a>
                </div>
              </div>
            </div>

            {/* Editorial & Press */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Editorial & Press Desk
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                    Media inquiries, press releases for upcoming PHEV unveilings, and article syndication.
                  </p>
                  <a
                    href="mailto:editor@phevs.eu"
                    className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                  >
                    editor@phevs.eu
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Banner */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <BuildingOffice2Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                PHEVs.eu Independent Research Initiative
              </div>
              <p className="leading-relaxed">
                We maintain complete editorial independence. Technical data corrections must be supported by official
                EC-WVTA homologation sheets or manufacturer technical releases.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Corporate Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
                Fill in the form below and our team will review your message promptly.
              </p>

              <ContactFormClient />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
