'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { Card } from '@/components/ui/card'
import { prosuiteData } from '@/lib/prosuite-data'

export default function RisksPage() {
    const risks = prosuiteData.risk?.risks || []
    const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')

    const getImpactLabel = (impactId: number): string => {
        const impactMap: { [key: number]: string } = {
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Critical'
        }
        return impactMap[impactId] || 'Unknown'
    }

    const getImpactColor = (impactId: number): string => {
        const colorMap: { [key: number]: string } = {
            1: 'bg-green-100 text-green-800',
            2: 'bg-blue-100 text-blue-800',
            3: 'bg-orange-100 text-orange-800',
            4: 'bg-red-100 text-red-800'
        }
        return colorMap[impactId] || 'bg-gray-100 text-gray-800'
    }

    const getStatusLabel = (isArchived: boolean): string => {
        return isArchived ? 'Archived' : 'Active'
    }

    const filteredRisks = risks.filter(risk => {
        if (filter === 'all') return true
        const impact = getImpactLabel(risk.impact_rating_id).toLowerCase()
        return impact === filter
    })

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <PageSectionHeader
                    title="Risk Management"
                    subTitle="Manage and track organizational risks"
                    showImportExport={false}
                    showAddButton={true}
                    onAddClick={() => console.log('Add new risk')}
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
                        All Risks ({risks.length})
                    </button>
                    <button
                        onClick={() => setFilter('critical')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'critical' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Critical
                    </button>
                    <button
                        onClick={() => setFilter('high')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'high' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        High
                    </button>
                    <button
                        onClick={() => setFilter('medium')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'medium' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Medium
                    </button>
                    <button
                        onClick={() => setFilter('low')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'low' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Low
                    </button>
                </div>

                {/* Risks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRisks.map((risk) => (
                        <Card key={risk.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 flex-1">
                                    {risk.title || `Risk #${risk.id}`}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getImpactColor(risk.impact_rating_id)}`}>
                                    {getImpactLabel(risk.impact_rating_id)}
                                </span>
                            </div>
                            
                            {risk.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {risk.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Status: {getStatusLabel(risk.is_archived)}</span>
                                <span>Risk Score: {risk.inherit_risk_score}</span>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredRisks.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No risks found for the selected filter.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
