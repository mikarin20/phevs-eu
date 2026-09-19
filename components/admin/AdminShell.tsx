'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Car, Newspaper, GitCompareArrows, Video, LayoutDashboard, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/vehicles', label: 'Vehicles', icon: Car },
  { href: '/admin/blog', label: 'Blog Posts', icon: Newspaper },
  { href: '/admin/compare', label: 'Quick Compares', icon: GitCompareArrows },
  { href: '/admin/videos', label: 'Videos', icon: Video },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="font-bold text-slate-900">PHEVs.eu Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
