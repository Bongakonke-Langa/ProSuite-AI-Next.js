'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { topBarButtons } from '@/config/menu-items'
import CreateNewButton from './buttons/CreateNewButton'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/prosuite-management/auth'
import { LogOut, Building, Briefcase, PanelLeft } from 'lucide-react'
import { ACCOUNT_SETTINGS_PATH } from '@/utils/prosuite/navigationUtils'
import { filterMenuItemsByPermissions } from '@/utils/prosuite/permissions'
import ReusableModal from '@/components/prosuite-management/modals/ReusableModal'
import FeedbackButton from '@/components/prosuite-management/buttons/FeedbackButton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu'
import NotificationPopover from '@/components/prosuite-management/layout/NotificationPopover'

const GlobalSearch = dynamic(
    () => import('@/components/prosuite-management/layout/global-search').then((mod) => mod.GlobalSearch),
    { ssr: false, loading: () => null },
)

const GlobalSearchTrigger = dynamic(
    () => import('@/components/prosuite-management/layout/global-search').then((mod) => mod.GlobalSearchTrigger),
    { ssr: false, loading: () => null },
)

interface HeaderProps {
    isMobile?: boolean
    onToggleMobileSidebar?: () => void
    onToggleSecondarySidebar?: () => void
    moduleStatuses: {alias_name: string; status_slug: string; is_disable: number}[]
}

export default function Header({ isMobile = false, onToggleMobileSidebar, onToggleSecondarySidebar: _onToggleSecondarySidebar, moduleStatuses }: HeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const auth = useAuth()
    const { user, logout, permissions, userRoles } = auth
    const company = auth.company ? { id: 0, name: auth.company } : null
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { isSecondarySidebarPinned, setIsSecondarySidebarPinned, getActiveMenuItemWithFilteredSecondaryMenu } = useAppStore()
    const activeMenuItem = getActiveMenuItemWithFilteredSecondaryMenu(moduleStatuses)
    const hasSecondaryMenu = activeMenuItem?.secondaryMenu && activeMenuItem.secondaryMenu.length > 0
    const showSidebarToggle = isMobile || (pathname !== '/prosuite-management/home' && hasSecondaryMenu)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    useEffect(() => {
        if (user) {
            const mediaUrl = user.media?.[0]?.original_url
            if (mediaUrl) {
                setProfileImage(`${mediaUrl}?t=${Date.now()}&nocache=${Math.random().toString(36).substring(7)}`)
            } else {
                setProfileImage(null)
            }
        }
    }, [user])

    useEffect(() => {
        const handleProfileUpdated = () => {
            if (auth && typeof auth.mutate === 'function') {
                auth.mutate()
            }
        }

        window.addEventListener('account-settings-updated', handleProfileUpdated)

        return () => {
            window.removeEventListener('account-settings-updated', handleProfileUpdated)
        }
    }, [auth])

    useEffect(() => {
        setIsCreateNewModalOpen(false)
    }, [pathname])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsSearchOpen(true)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const getProfileImageSrc = () => {
        if (!profileImage) {
            return '/avatar-placeholder.svg'
        }
        if (typeof profileImage === 'string') {
            const hasParams = profileImage.includes('?')
            const separator = hasParams ? '&' : '?'
            return `${profileImage}${separator}refresh=${Date.now()}` 
        }
        return URL.createObjectURL(profileImage)
    }

    const filterMenuItemsByCurrentPath = (menuItems: any[], currentPath: string) => {
        const pathMatch = currentPath.match(/^\/([^/]+)/)

        if (!pathMatch) {
            return []
        }

        const pathSegment = pathMatch[1]

        const pathToPrimaryMenuItem = {
            'risk-management': 'Risk',
            'asset-management': 'Asset',
            'incident-management': 'Incident',
        }

        const allowedPrimaryMenuItem = pathToPrimaryMenuItem[pathSegment as keyof typeof pathToPrimaryMenuItem]

        if (!allowedPrimaryMenuItem) {
            return []
        }

        return menuItems.filter(item => item.primaryMenuItem === allowedPrimaryMenuItem)
    }

    const handlePanelLeftClick = () => {
        console.log('handlePanelLeftClick')
        if (isMobile) {
            onToggleMobileSidebar?.()
        } else {
            console.log('handlePanelLeftClick >> not mobile')
            setIsSecondarySidebarPinned(!isSecondarySidebarPinned)
        }
    }

    const menuItems = filterMenuItemsByPermissions(topBarButtons, permissions || [], userRoles, moduleStatuses)
    const filteredMenuItems = filterMenuItemsByCurrentPath(menuItems, pathname || '')

    return (
        <header
            className="sticky top-0 z-30 flex py-2 items-center border-b bg-white px-4 md:px-6 lg:px-8 border-gray-200 border-solid">
            <div className="flex flex-1 items-center justify-between">
                {/* Left section - Panel button and search */}
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                    {showSidebarToggle && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePanelLeftClick}
                            className="h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                        >
                            <PanelLeft className={`h-4 w-4 ${isSecondarySidebarPinned ? 'text-[#006EAD]' : ''}`} />
                        </Button>
                    )}

                    {/* Search section - responsive width */}
                    <div
                        className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                        <GlobalSearchTrigger
                            setIsOpen={setIsSearchOpen}
                            className="flex-1 h-full text-sm sm:text-base min-w-0"
                        />
                        <GlobalSearch
                            isOpen={isSearchOpen}
                            moduleStatuses={moduleStatuses}
                            setIsOpen={setIsSearchOpen}
                        />
                    </div>

                    {/* Create New Button - visible on all screens */}
                    <div className="flex-shrink-0">
                        <CreateNewButton
                            menuItems={filteredMenuItems}
                            isCreateNewModalOpen={isCreateNewModalOpen}
                            setIsCreateNewModalOpen={setIsCreateNewModalOpen}
                        />
                    </div>
                </div>

                {/* Right section - Feedback and Profile */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-2 sm:ml-4 flex-shrink-0">
                    <NotificationPopover/>
                    <div className="hidden sm:block">
                        <FeedbackButton />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative p-0 ml-2 h-full w-auto rounded-full overflow-visible flex-shrink-0"
                            >
                                <div
                                    className="bg-slate-200 w-10 h-10 rounded-full relative cursor-pointer overflow-hidden">
                                    <Image
                                        src={getProfileImageSrc() as string}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        fill
                                        sizes="(max-width: 640px) 32px, 40px"
                                        unoptimized={true}
                                        onError={() => {
                                            console.error('Avatar image failed to load')
                                        }}
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-xs">
                                    <svg
                                        className="fill-current h-3 w-3 sm:h-4 sm:w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 sm:w-64 bg-white" align="end" forceMount>
                            <DropdownMenuItem
                                className="flex flex-col items-start p-2"
                                onClick={() => router.push(ACCOUNT_SETTINGS_PATH)}
                            >
                                <p className="text-sm font-medium leading-none truncate w-full">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground truncate w-full">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="border-gray-100 border" />

                            {user?.roles && user.roles.length > 0 && (
                                <>
                                    {user.roles.map((role: any, index: number) => (
                                        <DropdownMenuItem key={index} className="flex items-center">
                                            <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="text-sm truncate">{role.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </>
                            )}

                            {company && (
                                <>
                                    <DropdownMenuItem className="flex items-center">
                                        <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <span className="text-sm truncate">{company.name}</span>
                                    </DropdownMenuItem>
                                </>
                            )}

                            {/* Mobile-only items */}
                            <div className="sm:hidden">
                                <DropdownMenuSeparator className="border-gray-100 border" />

                                <div className="py-1.5">
                                    <FeedbackButton />
                                </div>
                            </div>
                            <DropdownMenuSeparator className="border-gray-100 border" />


                            <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>
                                <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>
                                    Log out
                                </span>
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
