import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToastProvider } from '@/components/admin/ui/toast-provider'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === 'development'
  const isAdminEnabled = process.env.ENABLE_ADMIN_PANEL === 'true'

  if (!isDev && !isAdminEnabled) {
    notFound()
  }

  return <ToastProvider>{children}</ToastProvider>
}
