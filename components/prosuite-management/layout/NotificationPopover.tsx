'use client'

import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export default function NotificationPopover() {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-gray-900"
            onClick={() => console.log('Notifications clicked')}
        >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
    )
}
