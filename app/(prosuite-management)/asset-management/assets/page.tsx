'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { Card } from '@/components/ui/card'
import { prosuiteData } from '@/lib/prosuite-data'

export default function AssetsPage() {
    const assets = prosuiteData.asset?.assets || []
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

    const getStatusColor = (status: string): string => {
        const statusLower = status.toLowerCase()
        if (statusLower.includes('active')) return 'bg-green-100 text-green-800'
        if (statusLower.includes('inactive')) return 'bg-gray-100 text-gray-800'
        return 'bg-blue-100 text-blue-800'
    }

    const filteredAssets = assets.filter(asset => {
        if (filter === 'all') return true
        const statusLower = asset.assetStatus_name.toLowerCase()
        if (filter === 'active') return statusLower.includes('active')
        if (filter === 'inactive') return statusLower.includes('inactive')
        return true
    })

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <PageSectionHeader
                    title="Asset Management"
                    subTitle="Manage and track company assets"
                    showImportExport={false}
                    showAddButton={true}
                    onAddClick={() => console.log('Add new asset')}
                    removePadding={false}
                />

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-6 bg-gray-50 rounded-lg p-1 w-fit">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        All Assets ({assets.length})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('inactive')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'inactive' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Inactive
                    </button>
                </div>

                {/* Assets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssets.map((asset) => (
                        <Card key={asset.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 flex-1">
                                    Asset #{asset.assetTag}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(asset.assetStatus_name)}`}>
                                    {asset.assetStatus_name}
                                </span>
                            </div>
                            
                            {asset.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {asset.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Category: {asset.category_name}</span>
                                <span>Cost: ${asset.cost}</span>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredAssets.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No assets found for the selected filter.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
