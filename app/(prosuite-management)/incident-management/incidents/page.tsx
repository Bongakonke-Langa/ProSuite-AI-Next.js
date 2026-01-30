'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { Card } from '@/components/ui/card'
import { prosuiteData } from '@/lib/prosuite-data'

export default function IncidentsPage() {
    const incidents = prosuiteData.incident?.incidents || []
    const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all')

    const getStatusLabel = (statusId: number): string => {
        const statusMap: { [key: number]: string } = {
            1: 'Open',
            2: 'In Progress',
            3: 'Resolved',
            4: 'Closed'
        }
        return statusMap[statusId] || 'Unknown'
    }

    const getStatusColor = (statusId: number): string => {
        const colorMap: { [key: number]: string } = {
            1: 'bg-red-100 text-red-800',
            2: 'bg-yellow-100 text-yellow-800',
            3: 'bg-blue-100 text-blue-800',
            4: 'bg-gray-100 text-gray-800'
        }
        return colorMap[statusId] || 'bg-gray-100 text-gray-800'
    }

    const filteredIncidents = incidents.filter(incident => {
        if (filter === 'all') return true
        if (filter === 'open') return incident.status_id === 1 || incident.status_id === 2
        if (filter === 'closed') return incident.status_id === 4
        return true
    })

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <PageSectionHeader
                    title="Incident Management"
                    subTitle="Monitor and respond to security incidents"
                    showImportExport={false}
                    showAddButton={true}
                    onAddClick={() => console.log('Add new incident')}
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
                        All Incidents ({incidents.length})
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'open' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setFilter('closed')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === 'closed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Closed
                    </button>
                </div>

                {/* Incidents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIncidents.map((incident) => (
                        <Card key={incident.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 flex-1">
                                    {incident.title || `Incident #${incident.id}`}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(incident.status_id)}`}>
                                    {getStatusLabel(incident.status_id)}
                                </span>
                            </div>
                            
                            {incident.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {incident.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Occurred: {new Date(incident.date_occurred).toLocaleDateString()}</span>
                                <span>ID: {incident.id}</span>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredIncidents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No incidents found for the selected filter.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
