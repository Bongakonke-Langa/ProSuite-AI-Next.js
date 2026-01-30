'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface CreateNewButtonProps {
    menuItems: any[]
    isCreateNewModalOpen: boolean
    setIsCreateNewModalOpen: (open: boolean) => void
}

export default function CreateNewButton({ menuItems, isCreateNewModalOpen, setIsCreateNewModalOpen }: CreateNewButtonProps) {
    return (
        <Button
            variant="default"
            size="sm"
            className="bg-[#006EAD] hover:bg-[#005a8c] text-white"
            onClick={() => setIsCreateNewModalOpen(!isCreateNewModalOpen)}
        >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Create New</span>
        </Button>
    )
}
