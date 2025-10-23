'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface MobileAccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  textColor?: string
  iconColor?: string
}

export default function MobileAccordion({ 
  title, 
  children, 
  defaultOpen = false,
  className = "",
  textColor = "text-gray-900 dark:text-white",
  iconColor = "text-gray-500"
}: MobileAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <span className={`font-medium ${textColor}`}>{title}</span>
        {isOpen ? (
          <ChevronUpIcon className={`h-5 w-5 ${iconColor}`} />
        ) : (
          <ChevronDownIcon className={`h-5 w-5 ${iconColor}`} />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}
