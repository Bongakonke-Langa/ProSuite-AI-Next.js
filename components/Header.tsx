'use client'

import Image from 'next/image'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/prosuite-management/auth'
import { LogOut, Building, Briefcase, PanelLeft, Bell } from 'lucide-react'
import ReusableModal from '@/components/prosuite-management/modals/ReusableModal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface HeaderProps {
  isMobile?: boolean
  onToggleMobileSidebar?: () => void
  moduleStatuses?: {alias_name: string; status_slug: string; is_disable: number}[]
}

export default function Header({ isMobile = false, onToggleMobileSidebar, moduleStatuses = [] }: HeaderProps) {
  const auth = useAuth()
  const { user, logout, userRoles, company } = auth
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { isSecondarySidebarPinned, setIsSecondarySidebarPinned } = useAppStore()

  const handlePanelLeftClick = () => {
    if (isMobile) {
      onToggleMobileSidebar?.()
    } else {
      setIsSecondarySidebarPinned(!isSecondarySidebarPinned)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex py-2 items-center border-b bg-white px-4 md:px-6 lg:px-8 border-gray-200">
      <div className="flex flex-1 items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePanelLeftClick}
            className="h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <PanelLeft className={`h-4 w-4 ${isSecondarySidebarPinned ? 'text-[#006EAD]' : ''}`} />
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-16 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-prosuite-500 text-sm"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 ml-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-0 h-10 w-10 rounded-full">
                <div className="bg-gradient-to-br from-prosuite-500 to-prosuite-700 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white" align="end">
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {userRoles && userRoles.length > 0 && (
                <>
                  {userRoles.map((role, index) => (
                    <DropdownMenuItem key={index} className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span className="text-sm">{role}</span>
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              {company && (
                <DropdownMenuItem className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span className="text-sm">{company}</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ReusableModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onSubmit={() => {
              setIsLogoutModalOpen(false)
              logout()
            }}
            title="Log Out"
            description="Are you sure you want to log out?"
            submitButtonText="Log Out"
            cancelButtonText="Cancel"
            type="confirm"
            size="small"
          />
        </div>
      </div>
    </header>
  )
}
