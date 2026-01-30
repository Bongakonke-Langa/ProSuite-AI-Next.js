'use client'
import { ReactNode } from "react"
import { ChevronDownIcon } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Cicleicon from '@/components/ui/circleicon'
import { PlusIcon, DownloadIcon, UploadIcon, FileDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import * as XLSX from 'xlsx'

interface PageActionButton {
    label: ReactNode
    path?: string
    action?: () => void
    icon?: React.ComponentType
    roles?: string[]
}

interface CustomAction {
    label?: string
    action: () => void
    buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost'
    icon?: React.ComponentType
    showBackButton?: boolean
    onBack?: () => void
}

interface FileField {
    id?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    disabled?: boolean;
}

interface PageSectionHeaderProps {
    title: string;
    subTitle?: string;
    fileField?: FileField;
    pageActionButtons?: PageActionButton[];
    basePath?: string;
    customAction?: CustomAction;
    showImportExport?: boolean;
    onTemplateDownload?: (format: 'csv' | 'xlsx') => void;
    onAddEmployee?: () => void;
    showAddEmployee?: boolean;
    showAddButton?: boolean;
    onAddClick?: () => void;
    dataType?: string;
    textColor?: string;
    accentColor?: string;
    exportData?: any[];
    exportHeaders?: { key: string; label: string }[];
    removePadding?: boolean
}

const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({
    title,
    fileField,
    subTitle,
    pageActionButtons = [],
    customAction,
    showImportExport = true,
    onTemplateDownload,
    onAddEmployee,
    showAddEmployee = true,
    showAddButton = false,
    onAddClick,
    textColor = '#006EAD',
    accentColor = '#91BC4D',
    exportData = [],
    exportHeaders = [],
    removePadding = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    const [pageTitleFirstWord, ...remainingPageTitleWords] = (title || '').split(' ')
    const remainingPageTitleString = remainingPageTitleWords.join(' ')

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (fileField?.onChange) {
            fileField.onChange(event)
        }
    }

    const handleExport = (format: 'csv' | 'xlsx' = 'csv') => {
        if (!exportData || exportData.length === 0 || !exportHeaders || exportHeaders.length === 0) {
            console.error('No data or headers provided for export')
            setIsOpen(false)
            return
        }

        try {
            const headers = exportHeaders.map(h => h.label)
            const data = exportData.map(item =>
                exportHeaders.map(header => item[header.key]?.toString() || '')
            )

            if (format === 'csv') {
                const csvContent = [
                    headers.join(','),
                    ...data.map(row =>
                        row.map(field =>
                            `"${field.replace(/"/g, '""')}"` 
                        ).join(',')
                    )
                ].join('\n')

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.setAttribute('href', url)
                link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            } else {
                const wsData = [
                    headers,
                    ...data
                ]
                const ws = XLSX.utils.aoa_to_sheet(wsData)
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
                XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.xlsx`)
            }
        } catch (error) {
            console.error('Export failed:', error)
        } finally {
            setIsOpen(false)
        }
    }

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
            fileInputRef.current.click()
        }
        setIsOpen(false)
    }

    const hasActions = (pageActionButtons && pageActionButtons.length > 0) || customAction || fileField || showAddButton

    const getAddActionLabel = () => {
        const baseName = title
            .replace(/management|list|page|system/gi, '')
            .trim()
            .replace(/s$/, '')
            .replace(/ies$/, 'y')
        return `Add ${baseName}` 
    }

    const handleAddAction = () => {
        const action = customAction?.action || onAddEmployee
        if (action) {
            action()
            setIsOpen(false)
        }
    }

    const getContextLabel = () => {
        return title
            .replace(/management|list|page|system/gi, '')
            .trim()
            .toLowerCase()
    }

    const actionOptions = [
        ...((customAction?.action || showAddEmployee) ? [{
            label: getAddActionLabel(),
            action: handleAddAction,
            icon: PlusIcon,
            show: true,
        }] : []),

        {
            label: `Import ${getContextLabel()}`,
            action: handleImportClick,
            show: showImportExport,
            icon: UploadIcon,
        },

        {
            label: `Export ${getContextLabel()}`,
            icon: FileDown,
            show: showImportExport,
            subItems: [
                {
                    label: 'CSV Format',
                    action: () => exportData.length > 0 ? handleExport('csv') : null,
                    disabled: exportData.length === 0
                },
                {
                    label: 'Excel Format',
                    action: () => exportData.length > 0 ? handleExport('xlsx') : null,
                    disabled: exportData.length === 0
                }
            ]
        },

        {
            label: `Download ${getContextLabel()} Template`,
            icon: DownloadIcon,
            show: showImportExport,
            subItems: [
                {
                    label: 'CSV Template',
                    action: () => {
                        if (onTemplateDownload) {
                            onTemplateDownload('csv')
                            setIsOpen(false)
                        }
                    },
                },
                {
                    label: 'Excel Template',
                    action: () => {
                        if (onTemplateDownload) {
                            onTemplateDownload('xlsx')
                            setIsOpen(false)
                        }
                    },
                }
            ]
        },

    ].filter(option => option.show !== false)

    return (
        <div>
            <div className={`w-full ${removePadding ? 'pb-0' : 'pb-4'} flex flex-col sm:flex-row items-start sm:items-center gap-2 gap-4`}>
                <div
                    className={`
                    flex items-center text-xl 
                    ${hasActions ? 'sm:w-7/12' : 'w-full'}
                    ${subTitle ? 'h-[38px]' : 'h-[32px]'}
                    `}
                    style={{ color: textColor }}
                >
                    <span
                        className="w-[4px] h-full mr-3"
                        style={{ backgroundColor: accentColor }}
                    />

                    <div className="text-left w-full flex flex-col justify-center w-auto">
                        <div className="leading-snug break-words text-[16px] sm:text-[18px] md:text-xl">
                            <span className="font-bold mr-[5px]">
                                {pageTitleFirstWord}
                            </span>

                            <span className="font-light">
                                {remainingPageTitleString}
                            </span>
                        </div>

                        {subTitle && (
                            <div className="w-auto text-[12px] leading-[12px] text-gray-500">
                                {subTitle}
                            </div>
                        )}
                    </div>
                </div>


                {hasActions && (
                    <div className="w-full flex justify-end items-center gap-2">
                        {customAction?.showBackButton && (
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={customAction.onBack}
                                className="flex items-center gap-2 hover:bg-gray-100"
                                aria-label="Go back"
                            >
                                Back
                            </Button>
                        )}

                        {showAddButton && onAddClick && (
                            <Button
                                type="button"
                                onClick={onAddClick}
                                className="flex items-center gap-2 bg-[#006EAD] text-white hover:bg-[#006EAD]/90 h-10 px-6 py-2"
                                aria-label="Add new item"
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span>Add</span>
                            </Button>
                        )}

                        {actionOptions.length > 0 && (
                            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                                <DropdownMenuTrigger asChild>
                                    <div
                                        className="flex items-center gap-2 bg-[#006EAD] text-white hover:bg-[#006EAD]/90 h-10 px-6 py-2 rounded-lg cursor-pointer"
                                        role="button"
                                        aria-label="Actions menu"
                                        aria-expanded={isOpen}
                                        aria-haspopup="true"
                                    >
                                        <Cicleicon aria-hidden="true" />
                                        <span>Actions</span>
                                        <ChevronDownIcon
                                            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                            aria-hidden="true"
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-64 rounded-md border border-gray-200 bg-white shadow-lg"
                                    onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
                                    onPointerDownOutside={() => setIsOpen(false)}
                                    onCloseAutoFocus={(e: Event) => e.preventDefault()}
                                >
                                    {actionOptions.map((option, index) => (
                                        option.subItems ? (
                                            <DropdownMenuSub key={`${option.label}-${index}`}>
                                                <DropdownMenuSubTrigger inset
                                                    className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                                >
                                                    {option.icon && <option.icon className="mr-3 h-4 w-4 text-gray-600" />}
                                                    <span className="font-medium">{option.label}</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent
                                                    className="w-56 rounded-md border border-gray-200 bg-white shadow-lg"
                                                >
                                                    {option.subItems.map((subItem, subIndex) => (
                                                        <DropdownMenuItem
                                                            key={`${subItem.label}-${subIndex}`}
                                                            onSelect={subItem.action}
                                                            disabled={'disabled' in subItem ? subItem.disabled : false}
                                                            className={`flex w-full items-center px-4 py-2.5 text-sm pl-8
                                                                ${'disabled' in subItem && subItem.disabled
                                                                    ? 'text-gray-400 cursor-not-allowed'
                                                                    : 'text-gray-700 hover:bg-gray-50 focus:bg-gray-50'}
                                                                focus:outline-none`}
                                                        >
                                                            <span className="font-medium">{subItem.label}</span>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuSub>
                                        ) : (
                                            <DropdownMenuItem
                                                key={`${option.label?.toString()}-${index}`}
                                                onSelect={option.action}
                                                className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                            >
                                                {option.icon && <option.icon className="mr-3 h-4 w-4 text-gray-600" />}
                                                <span className="font-medium">{option.label}</span>
                                            </DropdownMenuItem>
                                        )
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <input
                            id={fileField?.id || 'file-input'}
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                            onClick={(e) => {
                                const target = e.currentTarget
                                target.value = ''
                            }}
                            aria-label="File upload input"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PageSectionHeader
