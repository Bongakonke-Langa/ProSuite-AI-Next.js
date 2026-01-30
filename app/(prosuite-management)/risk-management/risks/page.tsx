'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { prosuiteData } from '@/lib/prosuite-data'
import { AlertTriangle, AlertCircle, CheckCircle, ListTodo } from 'lucide-react'

export default function RisksPage() {
    const risks = prosuiteData.risk?.risks || []
    const [searchQuery, setSearchQuery] = useState('')

    const getImpactLabel = (impactId: number): string => {
        const impactMap: { [key: number]: string } = {
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Critical'
        }
        return impactMap[impactId] || 'Unknown'
    }

    const getRiskCounts = () => {
        const counts = {
            total: risks.length,
            critical: risks.filter(r => r.impact_rating_id === 4).length,
            high: risks.filter(r => r.impact_rating_id === 3).length,
            medium: risks.filter(r => r.impact_rating_id === 2).length,
            low: risks.filter(r => r.impact_rating_id === 1).length,
        }
        return counts
    }

    const riskCounts = getRiskCounts()

    const statsItems = [
        {
            title: 'Total Risks',
            number: riskCounts.total,
            statColor: 'text-gray-600',
            icon: <ListTodo size={20} />,
        },
        {
            title: 'Critical Risks',
            number: riskCounts.critical,
            statColor: 'text-red-600',
            icon: <AlertCircle size={20} />,
        },
        {
            title: 'High Risks',
            number: riskCounts.high,
            statColor: 'text-orange-600',
            icon: <AlertTriangle size={20} />,
        },
        {
            title: 'Low Risks',
            number: riskCounts.low,
            statColor: 'text-green-600',
            icon: <CheckCircle size={20} />,
        },
    ]

    const filteredRisks = risks.filter(risk => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            risk.title?.toLowerCase().includes(query) ||
            risk.description?.toLowerCase().includes(query) ||
            risk.risk_number?.toLowerCase().includes(query)
        )
    })

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <PageSectionHeader
                    title="Risk Register"
                    subTitle="View and manage all active risks"
                    showImportExport={false}
                    removePadding={false}
                />

                <StatsGrid stats={statsItems} />

                {/* Risks Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Risk Number
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Impact Level
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Risk Score
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRisks.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                            No risks found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRisks.map((risk) => {
                                        const impactLabel = getImpactLabel(risk.impact_rating_id)
                                        const colorClass = risk.impact_rating_id === 4 ? 'bg-red-100 text-red-800' :
                                                          risk.impact_rating_id === 3 ? 'bg-orange-100 text-orange-800' :
                                                          risk.impact_rating_id === 2 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                        const bgColor = risk.impact_rating_id === 4 ? 'bg-red-500' :
                                                       risk.impact_rating_id === 3 ? 'bg-orange-500' :
                                                       risk.impact_rating_id === 2 ? 'bg-blue-500' : 'bg-green-500'
                                        
                                        return (
                                            <tr key={risk.id} className="hover:bg-gray-50 cursor-pointer">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {risk.risk_number || `STR-${String(risk.id).padStart(3, '0')}`}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {risk.title || `Risk #${risk.id}`}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                                                    {risk.description || '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                                                        {impactLabel}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${bgColor}`}>
                                                            {risk.inherit_risk_score || '-'}
                                                        </div>
                                                    </div>
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
                            Showing {filteredRisks.length} of {risks.length} risks
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
