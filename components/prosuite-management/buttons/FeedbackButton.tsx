'use client'

import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'

export default function FeedbackButton() {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => console.log('Feedback button clicked')}
        >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="text-sm">Feedback</span>
        </Button>
    )
}
