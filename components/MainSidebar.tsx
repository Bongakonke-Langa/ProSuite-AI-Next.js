'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'
import { sidebarLogo } from '@/assets/logo'
import type { MenuItem } from '@/types/menu'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { bottomMenuItems } from '@/lib/menu-items'
import { MoreHorizontal, LogOut } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/prosuite-management/auth'
import { useState, useEffect, useCallback, useRef } from 'react'
import ReusableModal from '@/components/prosuite-management/modals/ReusableModal'
import Modal from '@/components/prosuite-management/modals/Modal'
import FeedbackModal from '@/components/prosuite-management/buttons/FeedbackModal'

interface MainSidebarProps {
    items: MenuItem[]
    onMenuItemClick: (item: MenuItem) => void
    activeItem: MenuItem | null
    isHydrated?: boolean
    setIsMobileSidebarOpen?: () => void
}

const MainSidebar = ({
                         items,
                         onMenuItemClick,
                         activeItem,
                         isHydrated = true,
                         setIsMobileSidebarOpen,
                     }: MainSidebarProps) => {
    const pathname = usePathname()
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [searchTerm, _setSearchTerm] = useState('')
    const [arrangedItems, setArrangedItems] = useState<MenuItem[]>([])
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [isActiveStates, setIsActiveStates] = useState<Record<string, boolean>>({})
    const [visibleItemsCount, setVisibleItemsCount] = useState(5)
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

    const sidebarRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const navRef = useRef<HTMLElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const resizeObserverRef = useRef<ResizeObserver | null>(null)
    const moreButtonRef = useRef<HTMLButtonElement>(null)
    const helpButtonRef = useRef<HTMLDivElement>(null)
    const [moreButtonPos, setMoreButtonPos] = useState<{ top: number; left: number } | null>(null)
    const [helpButtonPos, setHelpButtonPos] = useState<{ bottom: number; left: number } | null>(null)

    const { logout } = useAuth()

    const {
        setIsSecondarySidebarVisible,
        setIsHovering,
        hoverTimeoutId,
        setHoverTimeout,
        isSecondarySidebarPinned,
        isSecondarySidebarVisible,
    } = useAppStore()

    const helpItems = [
        {
            label: 'Help Center',
            path: 'https://www.prosuite.co.za/#help',
            hasExternalIcon: true,
            isTopSection: true,
        },
        {
            label: 'Release notes',
            path: 'https://www.prosuite.co.za/#release-notes',
            hasExternalIcon: true,
            isTopSection: true,
        },
        {
            label: 'Legal',
            path: 'https://www.prosuite.co.za/#legal',
            hasExternalIcon: true,
            isTopSection: true,
        },
        {
            label: 'Submit feedback',
            path: '/feedback',
            hasExternalIcon: false,
            isTopSection: false,
        },
    ]

    const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

    const calculateVisibleItems = useCallback(() => {
        if (!sidebarRef.current || !headerRef.current || !bottomRef.current || !navRef.current) {
            return
        }

        const sidebarHeight = sidebarRef.current.clientHeight
        const headerHeight = headerRef.current.clientHeight
        const bottomHeight = bottomRef.current.clientHeight
        const navPadding = 32

        const availableNavSpace = sidebarHeight - headerHeight - bottomHeight - navPadding - 168

        const itemHeight = 56
        const moreButtonHeight = 56

        const maxItemsWithoutMore = Math.floor(availableNavSpace / itemHeight)
        const maxItemsWithMore = Math.floor((availableNavSpace - moreButtonHeight) / itemHeight)

        let newVisibleCount = items.length

        if (items.length > maxItemsWithoutMore) {
            newVisibleCount = Math.max(1, maxItemsWithMore)
        } else {
            newVisibleCount = items.length
        }

        setVisibleItemsCount(newVisibleCount)
    }, [items.length])

    useEffect(() => {
        if (!sidebarRef.current) return

        resizeObserverRef.current = new ResizeObserver(() => {
            requestAnimationFrame(calculateVisibleItems)
        })

        resizeObserverRef.current.observe(sidebarRef.current)

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect()
            }
        }
    }, [calculateVisibleItems])

    useEffect(() => {
        calculateVisibleItems()
    }, [items, calculateVisibleItems])

    useEffect(() => {
        const handleResize = () => {
            requestAnimationFrame(calculateVisibleItems)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [calculateVisibleItems])

    const handleMouseEnter = useCallback((item: MenuItem) => {
        if (!item.secondaryMenu || item.secondaryMenu.length <= 1 || isSecondarySidebarPinned) return

        if (!isSecondarySidebarPinned && isSecondarySidebarVisible) return

        if (hoverTimeoutId) {
            clearTimeout(hoverTimeoutId)
            setHoverTimeout(null)
        }

        setIsHovering(true)
        setIsSecondarySidebarVisible(true, true)
    }, [hoverTimeoutId, setHoverTimeout, setIsHovering, setIsSecondarySidebarVisible, isSecondarySidebarPinned, isSecondarySidebarVisible])

    const handleMouseLeave = useCallback(() => {
        if (isSecondarySidebarPinned) return

        if (!isSecondarySidebarPinned && isSecondarySidebarVisible) return

        if (hoverTimeoutId) {
            clearTimeout(hoverTimeoutId)
        }

        const timeoutId = setTimeout(() => {
            setIsHovering(false)
            setIsSecondarySidebarVisible(false, true)
            setHoverTimeout(null)
        }, 300)

        setHoverTimeout(timeoutId)
    }, [hoverTimeoutId, setHoverTimeout, setIsHovering, setIsSecondarySidebarVisible, isSecondarySidebarPinned, isSecondarySidebarVisible])

    useEffect(() => {
        if (!items || items.length === 0) {
            setArrangedItems([])
            return
        }

        const moduleLabels = ['Risk', 'Asset', 'Incident', 'Compliance', 'Governance', 'Performance', 'Audit']

        const modules = items.filter(item => moduleLabels.includes(item.label))
        const nonModules = items.filter(item => !moduleLabels.includes(item.label))
        const sortedModules = modules.sort((a, b) => a.label.localeCompare(b.label))
        const sortedItems = [...nonModules, ...sortedModules]

        if (!activeItem) {
            setArrangedItems(sortedItems)
            return
        }

        const activeIndex = sortedItems.findIndex((item) => item.label === activeItem.label)

        if (activeIndex >= visibleItemsCount) {
            const newItems = [...sortedItems]
            const [activeMenuItem] = newItems.splice(activeIndex, 1)

            const isActiveModule = moduleLabels.includes(activeMenuItem.label)

            let insertPosition
            if (isActiveModule) {
                const firstModuleIndex = newItems.findIndex(item => moduleLabels.includes(item.label))

                if (firstModuleIndex !== -1 && firstModuleIndex < visibleItemsCount) {
                    insertPosition = firstModuleIndex
                } else {
                    insertPosition = Math.min(visibleItemsCount - 1, newItems.length)
                }
            } else {
                insertPosition = Math.min(visibleItemsCount - 1, newItems.length)
            }

            newItems.splice(insertPosition, 0, activeMenuItem)
            setArrangedItems(newItems)
        } else {
            setArrangedItems(sortedItems)
        }
    }, [activeItem, items, visibleItemsCount])

    useEffect(() => {
        if (!items || items.length === 0) {
            setIsActiveStates({})
            return
        }

        const newActiveStates: Record<string, boolean> = {}
        items.forEach((item) => {
            newActiveStates[item.label] = item.path
                ? pathname === item.path
                : activeItem?.label === item.label
        })
        setIsActiveStates(newActiveStates)
    }, [items, pathname, activeItem])

    const homeItem = items.find(item => item.label === 'Home')
    const visibleItems = arrangedItems.slice(0, visibleItemsCount)
    const moreItems = arrangedItems.slice(visibleItemsCount)
    const filteredMoreItems = moreItems.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const moduleLabels = ['Risk', 'Asset', 'Incident', 'Compliance', 'Governance', 'Performance', 'Audit']
    const hasModules = items.some(item => moduleLabels.includes(item.label))

    const activeMenuLabel = useAppStore((state) => state.activeMenuLabel)

    const handleMenuItemClick = (item: MenuItem) => {
        try {
            onMenuItemClick(item)
            setIsMoreOpen(false)
            setIsHelpOpen(false)

            if (item.path && !item.path.startsWith('/')) {
                throw new Error(`Invalid path: ${item.path}`)
            }
            if (item.path && (item.path.includes('..') || item.path.includes('//'))) {
                throw new Error(`Invalid path: ${item.path}`)
            }
        } catch (error) {
            console.error('Error handling menu item click:', error)
        }
    }

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true)
    }

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false)
        logout()
    }

    const handleHelpClick = () => {
        if (helpButtonRef.current) {
            const rect = helpButtonRef.current.getBoundingClientRect()
            setHelpButtonPos({
                bottom: window.innerHeight - rect.bottom,
                left: rect.left + rect.width + 12,
            })
        }
        setIsHelpOpen(true)
    }

    const handleHelpItemClick = (path: string, label: string) => {
        if (label === 'Submit feedback') {
            setIsFeedbackModalOpen(true)
        } else {
            if (path.startsWith('/')) {
                window.location.href = path
            } else {
                window.open(path, '_blank')
            }
        }
        setIsHelpOpen(false)
    }

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
            requestAnimationFrame(calculateVisibleItems)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [calculateVisibleItems])

    const renderMenuItem = (item: MenuItem) => {
        const Icon = item.icon
        const isActive = activeMenuLabel === item.label
        const hasSecondaryMenu = item.secondaryMenu && item.secondaryMenu.length > 0
        const isSystemSettings = item.label === 'System Settings'
        const shouldShowDivider = isSystemSettings && hasModules

        return (
            <div key={item.label} className="flex flex-col items-center w-full">
                <div
                    className="flex flex-col items-center relative mx-auto mb-1 cursor-pointer"
                    onClick={() => handleMenuItemClick(item)}
                    role="button"
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                >
                    <span
                        className={cn(
                            'mx-auto w-10 h-10 text-white rounded-lg flex items-center justify-center transition-colors',
                            isActive ? 'bg-[#1A88C8]' : 'hover:bg-[#1A88C8]',
                        )}
                    >
                        {isHydrated ? (
                            <Icon className="h-5 w-5 mx-auto" strokeWidth={isActive ? 2 : 1} />
                        ) : (
                            <Skeleton className="h-5 w-5 mx-auto" />
                        )}
                        {hasSecondaryMenu && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 " />
                        )}
                    </span>
                    <span className="text-[9px] mt-1 leading-tight text-center w-[60px] whitespace-normal break-words">
                        {isHydrated ? item.label : <Skeleton className="h-2 w-8" />}
                    </span>
                </div>
                {shouldShowDivider && (
                    <div className="w-[40px] bg-white h-[1px] mt-2 " />
                )}
            </div>
        )
    }

    if (!isHydrated) {
        return (
            <div className="flex h-screen flex-col bg-[#006EAD] text-white w-[70px] py-2 relative">
                <div className="flex flex-col items-center mt-3">
                    <div className="w-[50px] overflow-hidden flex flex-col items-center justify-center text-white mb-2">
                        <Skeleton className="w-10 h-10 bg-white/50 rounded-lg mb-2" />
                        <Skeleton className="w-8/12 h-[1px] mt-2 bg-gray-50" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center mt-5 space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <Skeleton className="w-10 h-10 bg-white/50 rounded-lg" />
                            <Skeleton className="w-8 h-2 bg-white/50 rounded" />
                        </div>
                    ))}
                </div>

                <div className="mt-auto text-white w-16 mx-auto space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <Skeleton className="w-10 h-10 bg-white/50 rounded-lg" />
                            <Skeleton className="w-8 h-2 bg-white/50 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div ref={sidebarRef} className="flex h-screen flex-col bg-[#006EAD] text-white w-[70px] py-2 relative">
            {setIsMobileSidebarOpen && (
                <Button
                    variant="ghost"
                    className="rounded-full w-10 h-10 fixed inset-0 top-2 left-20 p-0 bg-gray-100 hover:bg-gray-200"
                    onClick={setIsMobileSidebarOpen}
                >
                    <X className="h-4 w-4 text-gray-600 hover:text-blue-custom-2" />
                </Button>
            )}

            <div ref={headerRef} className="flex flex-col items-center mt-3">
                <div
                    className="w-[50px] overflow-hidden flex flex-col items-center justify-center text-white mb-2 cursor-pointer">
                    <Link
                        href="/"
                        onClick={() => {
                            if (homeItem) {
                                handleMenuItemClick(homeItem)
                            }
                        }}
                    >
                        <Image src={sidebarLogo} alt="Sidebar Logo" width={28} height={28} className="mb-2 cursor-pointer" />
                    </Link>
                    <div className="w-8/12 bg-white h-[1px] mt-2" />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <nav ref={navRef} className="flex flex-col items-center mt-3 space-y-2">
                    {visibleItems.map((item) => renderMenuItem(item))}

                    {moreItems.length > 0 && (
                        <Button
                            ref={moreButtonRef}
                            variant="ghost"
                            className="flex flex-col items-center justify-center p-1 h-auto min-h-[48px] w-[48px]"
                            onClick={() => {
                                if (moreButtonRef.current) {
                                    const rect = moreButtonRef.current.getBoundingClientRect()
                                    setMoreButtonPos({
                                        top: rect.top + rect.height - 45,
                                        left: rect.left + rect.width + 12,
                                    })
                                }
                                setIsMoreOpen(true)
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative p-1 rounded hover:bg-[#1A88C8]">
                                    <MoreHorizontal className="h-6 w-7 mx-auto" strokeWidth={1} />
                                </div>
                                <span className="text-[9px] text-center leading-tight">More</span>
                            </div>
                        </Button>
                    )}
                </nav>
            </ScrollArea>

            <div ref={bottomRef} className="mt-auto text-white w-16 mx-auto">
                {bottomMenuItems.map((item) => {
                    const isActive = activeMenuLabel === item.label
                    const isHelpItem = item.label === 'Help'

                    return (
                        <div
                            key={item.label}
                            ref={isHelpItem ? helpButtonRef : null}
                            className="flex flex-col items-center relative mx-auto mb-1 cursor-pointer"
                            onClick={() => {
                                if (isHelpItem) {
                                    handleHelpClick()
                                } else {
                                    handleMenuItemClick(item)
                                }
                            }}
                        >
                            <span
                                className={cn(
                                    'mx-auto w-10 h-10 text-white rounded-lg flex items-center justify-center',
                                    isActive ? 'bg-[#1A88C8]' : 'hover:bg-[#1A88C8]',
                                )}
                            >
                                {item.icon && (
                                    <item.icon
                                        className="h-5 w-5 mx-auto"
                                        strokeWidth={isActive ? 2 : 1}
                                    />
                                )}
                            </span>
                            <span className="text-[9px] mt-1 leading-tight">
                                {item.label}
                            </span>
                        </div>
                    )
                })}
                <button
                    onClick={handleLogoutClick}
                    className="mx-auto text-[9px] flex flex-col items-center relative mb-1"
                >
                    <span
                        className="mx-auto w-10 h-10 text-white rounded-lg hover:bg-[#1A88C8] flex items-center justify-center">
                        <LogOut className="h-6 w-6 mx-auto rotate-180" strokeWidth={1} />
                    </span>
                    Logout
                </button>
                <ReusableModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onSubmit={handleConfirmLogout}
                    title="Confirm Logout"
                    description="Are you sure you want to log out?"
                    submitButtonText="Logout"
                    cancelButtonText="Cancel"
                    type="confirm"
                    size="small"
                />
            </div>

            <Modal
                isVisible={isMoreOpen}
                onClose={() => setIsMoreOpen(false)}
                items={filteredMoreItems}
                handlePrimaryMenuItemClick={handleMenuItemClick}
                activeMenuItem={activeItem?.label}
                position={moreButtonPos}
            />

            {isHelpOpen && helpButtonPos && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsHelpOpen(false)}
                    />
                    <div
                        className={`fixed z-[1000] bg-[#006EAD] rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[90vw] xxxs:w-[65vw] xxs:w-60 xs:w-64 sm:w-72`}
                        style={{
                            ...(screenWidth < 375
                                ? {
                                    bottom: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, 50%)',
                                }
                                : {
                                    bottom: helpButtonPos.bottom,
                                    left: helpButtonPos.left,
                                }),
                        }}
                    >
                        <div className="px-0">
                            <div className="space-y-1">
                                {helpItems.filter(item => item.isTopSection).map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleHelpItemClick(item.path, item.label)}
                                        className="w-full px-6 py-3 text-left text-white hover:bg-white/10 transition-colors duration-150 flex items-center justify-between group"
                                    >
                                        <span className="text-[15px] font-normal leading-relaxed">
                                            {item.label}
                                        </span>
                                        {item.hasExternalIcon && (
                                            <ExternalLink
                                                className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="my-4 mx-6">
                                <div className="h-[1px] bg-white/30" />
                            </div>

                            <div className="space-y-1">
                                {helpItems.filter(item => !item.isTopSection).map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleHelpItemClick(item.path, item.label)}
                                        className="w-full px-6 py-3 text-left text-white hover:bg-white/10 transition-colors duration-150"
                                    >
                                        <span className="text-[15px] font-normal leading-relaxed">
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
        </div>
    )
}

export default MainSidebar
