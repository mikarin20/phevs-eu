'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface Toast {
  id: number
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'w-80 rounded-lg border p-4 shadow-lg text-sm',
              t.variant === 'destructive'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-white text-slate-900 border-slate-200'
            )}
          >
            <p className="font-semibold">{t.title}</p>
            {t.description && <p className="mt-1 opacity-90">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
