'use client'

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface GlobalSearchTriggerProps {
    setIsOpen: (open: boolean) => void
    className?: string
}

export function GlobalSearchTrigger({ setIsOpen, className }: GlobalSearchTriggerProps) {
    return (
        <Button
            variant="outline"
            className={`justify-start text-left font-normal ${className}`}
            onClick={() => setIsOpen(true)}
        >
            <Search className="mr-2 h-4 w-4" />
            <span className="text-gray-500">Search...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
                <span className="text-xs">⌘</span>K
            </kbd>
        </Button>
    )
}

interface GlobalSearchProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    moduleStatuses: {alias_name: string; status_slug: string; is_disable: number}[]
}

export function GlobalSearch({ isOpen, setIsOpen, moduleStatuses }: GlobalSearchProps) {
    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
            onClick={() => setIsOpen(false)}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center border-b pb-3">
                    <Search className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search ProSuite..."
                        className="flex-1 outline-none text-sm"
                        autoFocus
                    />
                </div>
                <div className="mt-4 text-sm text-gray-500 text-center py-8">
                    Global search functionality coming soon...
                </div>
            </div>
        </div>
    )
}
