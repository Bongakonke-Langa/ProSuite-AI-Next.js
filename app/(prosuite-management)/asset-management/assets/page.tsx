'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { prosuiteData } from '@/lib/prosuite-data'
import { Package, CheckCircle, XCircle, ListTodo } from 'lucide-react'

export default function AssetsPage() {
    const assets = prosuiteData.asset?.assets || []
    const [searchQuery, setSearchQuery] = useState('')

    const getStatusColor = (status: string): string => {
        const statusLower = status.toLowerCase()
        if (statusLower.includes('active')) return 'bg-green-100 text-green-800'
        if (statusLower.includes('inactive')) return 'bg-gray-100 text-gray-800'
        return 'bg-blue-100 text-blue-800'
    }

    const getAssetCounts = () => {
        const counts = {
            total: assets.length,
            active: assets.filter(a => a.assetStatus_name?.toLowerCase().includes('active')).length,
            inactive: assets.filter(a => a.assetStatus_name?.toLowerCase().includes('inactive')).length,
            highValue: assets.filter(a => a.cost > 10000).length,
        }
        return counts
    }

    const assetCounts = getAssetCounts()

    const statsItems = [
        {
            title: 'Total Assets',
            number: assetCounts.total,
            statColor: 'text-gray-600',
            icon: <ListTodo size={20} />,
        },
        {
            title: 'Active Assets',
            number: assetCounts.active,
            statColor: 'text-green-600',
            icon: <CheckCircle size={20} />,
        },
        {
            title: 'Inactive Assets',
            number: assetCounts.inactive,
            statColor: 'text-gray-600',
            icon: <XCircle size={20} />,
        },
        {
            title: 'High Value Assets',
            number: assetCounts.highValue,
            statColor: 'text-blue-600',
            icon: <Package size={20} />,
        },
    ]

    const filteredAssets = assets.filter(asset => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            asset.assetTag?.toLowerCase().includes(query) ||
            asset.description?.toLowerCase().includes(query) ||
            asset.category_name?.toLowerCase().includes(query)
        )
    })

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <PageSectionHeader
                    title="Asset Management"
                    subTitle="Manage and track company assets"
                    showImportExport={false}
                    removePadding={false}
                />

                <StatsGrid stats={statsItems} />

                {/* Assets Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Asset Tag
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cost
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAssets.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No assets found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAssets.map((asset) => {
                                        const statusColorClass = getStatusColor(asset.assetStatus_name)
                                        
                                        return (
                                            <tr key={asset.id} className="hover:bg-gray-50 cursor-pointer">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {asset.assetTag || `AST-${String(asset.id).padStart(3, '0')}`}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                                                    {asset.description || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {asset.category_name || '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColorClass}`}>
                                                        {asset.assetStatus_name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ${asset.cost?.toLocaleString() || '0'}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="bg-white px-4 py-3 border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Showing {filteredAssets.length} of {assets.length} assets
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
