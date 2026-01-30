'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { MenuItem } from '@/types/menu'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/components/ui/button'
import React, { useState, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/prosuite-management/auth'
import { usePathname, useSearchParams } from 'next/navigation'
import { filterMenuItemsByPermissions } from '@/utils/prosuite/permissions'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface ModuleStatus {
    alias_name: string
    status_slug: string
    is_disable: number
}

interface SecondarySidebarProps {
    activeItem: MenuItem | null
    visible: boolean
    toggleIsMobileSidebarOpen?: () => void
    onSecondaryItemClick?: (item: MenuItem) => void
    moduleStatuses?: ModuleStatus[]
}

export function SecondarySidebar({
                                     activeItem,
                                     visible,
                                     onSecondaryItemClick,
                                     toggleIsMobileSidebarOpen,
                                     moduleStatuses = [],
                                 }: SecondarySidebarProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
    const { userRoles, company, permissions } = useAuth()

    const {
        setIsHovering,
        hoverTimeoutId,
        setHoverTimeout,
        setIsSecondarySidebarVisible,
        isSecondarySidebarPinned,
    } = useAppStore()

    const handleMouseEnter = useCallback(() => {
        if (isSecondarySidebarPinned) return
        if (hoverTimeoutId) {
            clearTimeout(hoverTimeoutId)
            setHoverTimeout(null)
        }
        setIsHovering(true)
    }, [hoverTimeoutId, setHoverTimeout, setIsHovering, isSecondarySidebarPinned])

    const handleMouseLeave = useCallback(() => {
        if (isSecondarySidebarPinned) return
        if (hoverTimeoutId) clearTimeout(hoverTimeoutId)

        const timeoutId = setTimeout(() => {
            setIsHovering(false)
            setIsSecondarySidebarVisible(false, true)
            setHoverTimeout(null)
        }, 300)

        toggleIsMobileSidebarOpen?.()

        setHoverTimeout(timeoutId)
    }, [hoverTimeoutId, setHoverTimeout, setIsHovering, setIsSecondarySidebarVisible, isSecondarySidebarPinned, toggleIsMobileSidebarOpen])

    const toggleDropdown = (label: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [label]: !prev[label],
        }))
    }

    const filteredSecondaryMenu = React.useMemo(() => {
        if (!activeItem?.secondaryMenu || !permissions || !userRoles) {
            return []
        }
        return filterMenuItemsByPermissions(activeItem.secondaryMenu, permissions, userRoles, moduleStatuses)
    }, [activeItem?.secondaryMenu, permissions, userRoles, moduleStatuses])
    
    if (!activeItem?.secondaryMenu || filteredSecondaryMenu.length <= 1) {
        return null
    }

    const isMenuItemActive = (itemPath?: string) => {
        if (!itemPath) return false
        if (!itemPath.includes('?')) return pathname === itemPath

        const [basePath, queryString] = itemPath.split('?')
        if (pathname !== basePath) return false

        const itemParams = new URLSearchParams(queryString)
        let allParamsMatch = true

        itemParams.forEach((value, key) => {
            if (searchParams?.get(key) !== value) {
                allParamsMatch = false
            }
        })

        return allParamsMatch
    }

    return (
        <motion.div
            className={cn('flex h-screen flex-col bg-[#187DB7] text-white relative')}
            initial={{ width: 0, opacity: 0 }}
            animate={{
                width: visible ? 240 : 0,
                opacity: visible ? 1 : 0,
                transition: {
                    duration: 0.1,
                    ease: 'easeInOut',
                },
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: visible ? 'flex' : 'none' }}
        >
            {visible ? (
                <div className="w-full">
                    <Button
                        variant="ghost"
                        className="rounded-full w-10 h-10 lg:hidden fixed inset-0 top-2 left-[250px] p-0 bg-gray-100 hover:bg-gray-200"
                        onClick={toggleIsMobileSidebarOpen}
                    >
                        <X className="h-4 w-4 text-gray-600 hover:text-blue-custom-2" />
                    </Button>
                    <div className="flex h-14 items-center px-4 justify-between">
            <span className="text-xl font-semibold block overflow-hidden text-ellipsis whitespace-nowrap">
              {userRoles?.includes('Super Admin') ? 'Promilezi' : company}
            </span>
                    </div>
                    <ScrollArea className="flex-1">
                        <nav className="flex flex-col gap-1 p-2">
                            {filteredSecondaryMenu.map((item, index) => {
                                const isActive = isMenuItemActive(item.path)
                                const Icon = item.icon
                                const isOpen = openDropdowns[item.label] || false

                                if (item.dropdown && item.dropdownItems) {
                                    const filteredDropdownItems = filterMenuItemsByPermissions(
                                        item.dropdownItems,
                                        permissions || [],
                                        userRoles || [],
                                    )

                                    if (filteredDropdownItems.length === 0) return null

                                    return (
                                        <Collapsible
                                            key={index}
                                            open={isOpen}
                                            onOpenChange={() => toggleDropdown(item.label)}
                                            className="w-full"
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant={'ghost'}
                                                    className="w-full justify-start items-center"
                                                >
                                                    <div className="flex items-center">
                                                        <Icon className="mr-2 h-5 w-5" />
                                                        <span>{item.label}</span>
                                                    </div>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="ml-6 mt-1">
                                                {filteredDropdownItems.map((dropdownItem, dropdownIndex) => {
                                                    const isDropdownItemActive = isMenuItemActive(dropdownItem.path)
                                                    const DropdownIcon = dropdownItem.icon

                                                    return (
                                                        <div
                                                            key={dropdownIndex}
                                                            className={`w-full text-left mb-1 text-sm py-3 px-3 hover:bg-[#FFFFFF4D] transition-colors rounded flex items-center justify-between ${isDropdownItemActive ? 'bg-[#FFFFFF4D] font-medium' : 'hover:bg-[#FFFFFF4D]'}`}
                                                        >
                                                            <Link
                                                                href={dropdownItem.path || '#'}
                                                                className="flex items-center"
                                                                onClick={() => {
                                                                    if (dropdownItem.path) {
                                                                        onSecondaryItemClick?.(dropdownItem)
                                                                    }
                                                                }}
                                                            >
                                                                <DropdownIcon className="mr-2 h-4 w-4" />
                                                                <span>{dropdownItem.label}</span>
                                                            </Link>
                                                        </div>
                                                    )
                                                })}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`w-full text-left mb-1 text-sm py-3 px-3 hover:bg-[#FFFFFF4D] transition-colors rounded flex items-center justify-between ${isActive ? 'bg-[#FFFFFF4D] font-medium' : 'hover:bg-[#FFFFFF4D]'}`}
                                    >
                                        <Link
                                            href={item.path || '#'}
                                            className="flex items-center w-full"
                                            onClick={() => {
                                                if (item.path) {
                                                    onSecondaryItemClick?.(item)
                                                }
                                            }}
                                        >
                                            <Icon className="mr-2 h-5 w-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </div>
                                )
                            })}
                        </nav>
                    </ScrollArea>
                </div>
            ) : (
                <div className="flex flex-col items-center pt-14">
                    <ScrollArea className="flex-1 w-full">
                        <nav className="flex flex-col gap-4 items-center py-4">
                            {filteredSecondaryMenu.map((item, index) => {
                                const isActive = pathname === item.path
                                const Icon = item.icon

                                return (
                                    <Button
                                        key={index}
                                        variant={isActive ? 'secondary' : 'ghost'}
                                        size="icon"
                                        className="w-10 h-10 rounded-md"
                                        asChild
                                    >
                                        <Link
                                            href={item.path || '#'}
                                            title={item.label}
                                            onClick={() => {
                                                if (item.path) {
                                                    onSecondaryItemClick?.(item)
                                                }
                                            }}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )
                            })}
                        </nav>
                    </ScrollArea>
                </div>
            )}
        </motion.div>
    )
}
