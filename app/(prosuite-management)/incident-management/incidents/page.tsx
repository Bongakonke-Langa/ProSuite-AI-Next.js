'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { prosuiteData } from '@/lib/prosuite-data'
import { AlertCircle, Activity, CheckCircle, ListTodo } from 'lucide-react'

export default function IncidentsPage() {
    const incidents = prosuiteData.incident?.incidents || []
    const [searchQuery, setSearchQuery] = useState('')

    const getSeverityLabel = (severityId: number): string => {
        const severityMap: { [key: number]: string } = {
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Critical'
        }
        return severityMap[severityId] || 'Unknown'
    }

    const getStatusLabel = (statusId: number): string => {
        const statusMap: { [key: number]: string } = {
            1: 'Open',
            2: 'In Progress',
            3: 'Resolved',
            4: 'Closed'
        }
        return statusMap[statusId] || 'Unknown'
    }

    const getIncidentCounts = () => {
        const counts = {
            total: incidents.length,
            open: incidents.filter(i => i.status_id === 1 || i.status_id === 2).length,
            critical: incidents.filter(i => i.severity_level_id === 4).length,
            resolved: incidents.filter(i => i.status_id === 3).length,
        }
        return counts
    }

    const incidentCounts = getIncidentCounts()

    const statsItems = [
        {
            title: 'Total Incidents',
            number: incidentCounts.total,
            statColor: 'text-gray-600',
            icon: <ListTodo size={20} />,
        },
        {
            title: 'Open Incidents',
            number: incidentCounts.open,
            statColor: 'text-orange-600',
            icon: <Activity size={20} />,
        },
        {
            title: 'Critical Incidents',
            number: incidentCounts.critical,
            statColor: 'text-red-600',
            icon: <AlertCircle size={20} />,
        },
        {
            title: 'Resolved',
            number: incidentCounts.resolved,
            statColor: 'text-green-600',
            icon: <CheckCircle size={20} />,
        },
    ]

    const filteredIncidents = incidents.filter(incident => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            incident.title?.toLowerCase().includes(query) ||
            incident.description?.toLowerCase().includes(query) ||
            incident.id.toString().includes(query)
        )
    })

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <PageSectionHeader
                    title="Incident Management"
                    subTitle="Monitor and respond to security incidents"
                    showImportExport={false}
                    removePadding={false}
                />

                <StatsGrid stats={statsItems} />

                {/* Incidents Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Incident ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Severity
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date Occurred
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredIncidents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                            No incidents found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredIncidents.map((incident) => {
                                        const severityLabel = getSeverityLabel(incident.severity_level_id)
                                        const statusLabel = getStatusLabel(incident.status_id)
                                        const severityColorClass = incident.severity_level_id === 4 ? 'bg-red-100 text-red-800' :
                                                          incident.severity_level_id === 3 ? 'bg-orange-100 text-orange-800' :
                                                          incident.severity_level_id === 2 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                        const statusColorClass = incident.status_id === 1 ? 'bg-red-100 text-red-800' :
                                                                incident.status_id === 2 ? 'bg-yellow-100 text-yellow-800' :
                                                                incident.status_id === 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        
                                        return (
                                            <tr key={incident.id} className="hover:bg-gray-50 cursor-pointer">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    INC-{String(incident.id).padStart(3, '0')}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {incident.title || `Incident #${incident.id}`}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                                                    {incident.description || '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${severityColorClass}`}>
                                                        {severityLabel}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColorClass}`}>
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(incident.date_occurred).toLocaleDateString('en-GB')}
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
                            Showing {filteredIncidents.length} of {incidents.length} incidents
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
