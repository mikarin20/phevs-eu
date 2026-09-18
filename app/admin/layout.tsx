import type { Metadata } from 'next'
import { ToastProvider } from '@/components/admin/ui/toast-provider'

export const metadata: Metadata = {
  title: 'Admin | PHEVs.eu',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
