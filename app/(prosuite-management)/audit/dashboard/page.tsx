'use client'

import { useMemo } from 'react'
import { FileCheck, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { UniversalChart } from '@/components/prosuite-management/eCharts/UniversalChart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function AuditDashboard() {
    // Mock audit data - in production, this would come from API/database
    const auditData = {
        totalAudits: 24,
        completedAudits: 18,
        inProgressAudits: 4,
        plannedAudits: 2,
        audits: [
            { id: 1, title: 'IT Security Audit', department: 'Information Technology', status: 'Completed', findings: 3, priority: 'High', completedDate: '2026-01-15', auditor: 'Mike Auditor' },
            { id: 2, title: 'Financial Controls Review', department: 'Finance', status: 'In Progress', findings: 0, priority: 'Critical', completedDate: null, auditor: 'Sarah Compliance' },
            { id: 3, title: 'HR Compliance Audit', department: 'Human Resources', status: 'Completed', findings: 2, priority: 'Medium', completedDate: '2026-01-10', auditor: 'Mike Auditor' },
            { id: 4, title: 'Operational Efficiency Review', department: 'Operations', status: 'In Progress', findings: 1, priority: 'Medium', completedDate: null, auditor: 'Sarah Compliance' },
            { id: 5, title: 'Data Privacy Assessment', department: 'Legal & Compliance', status: 'Completed', findings: 5, priority: 'High', completedDate: '2026-01-20', auditor: 'Mike Auditor' },
            { id: 6, title: 'Vendor Management Audit', department: 'Procurement', status: 'Planned', findings: 0, priority: 'Low', completedDate: null, auditor: 'Sarah Compliance' },
            { id: 7, title: 'Business Continuity Review', department: 'Operations', status: 'Completed', findings: 4, priority: 'High', completedDate: '2026-01-18', auditor: 'Mike Auditor' },
            { id: 8, title: 'Asset Management Audit', department: 'Finance', status: 'In Progress', findings: 2, priority: 'Medium', completedDate: null, auditor: 'Sarah Compliance' },
        ]
    }

    const stats = useMemo(() => [
        {
            title: 'Total Audits',
            number: auditData.totalAudits,
            icon: <FileCheck className="h-5 w-5" />,
            statColor: 'text-blue-600',
            lastMonthDifference: auditData.totalAudits
        },
        {
            title: 'Completed',
            number: auditData.completedAudits,
            icon: <CheckCircle className="h-5 w-5" />,
            statColor: 'text-green-600',
            lastMonthDifference: auditData.completedAudits
        },
        {
            title: 'In Progress',
            number: auditData.inProgressAudits,
            icon: <Clock className="h-5 w-5" />,
            statColor: 'text-orange-600',
            lastMonthDifference: auditData.inProgressAudits
        },
        {
            title: 'Planned',
            number: auditData.plannedAudits,
            icon: <AlertCircle className="h-5 w-5" />,
            statColor: 'text-purple-600',
            lastMonthDifference: auditData.plannedAudits
        }
    ], [auditData])

    const auditStatusData = useMemo(() => [
        { name: 'Completed', value: auditData.completedAudits, color: '#10B981' },
        { name: 'In Progress', value: auditData.inProgressAudits, color: '#F59E0B' },
        { name: 'Planned', value: auditData.plannedAudits, color: '#8B5CF6' }
    ], [auditData])

    const findingsByDepartmentData = useMemo(() => {
        const deptFindings = auditData.audits.reduce((acc, audit) => {
            if (!acc[audit.department]) {
                acc[audit.department] = 0
            }
            acc[audit.department] += audit.findings
            return acc
        }, {} as Record<string, number>)

        return Object.entries(deptFindings)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
    }, [auditData])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800'
            case 'In Progress':
                return 'bg-orange-100 text-orange-800'
            case 'Planned':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical':
                return 'bg-red-100 text-red-800'
            case 'High':
                return 'bg-orange-100 text-orange-800'
            case 'Medium':
                return 'bg-blue-100 text-blue-800'
            case 'Low':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <PageSectionHeader
                    title="Audit Management"
                    subTitle="Conduct internal audits and manage audit universe"
                    showImportExport={false}
                    removePadding={false}
                />

                <StatsGrid stats={stats} />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Audit status</h2>
                                <span className="text-sm text-gray-500">{auditData.totalAudits} total</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="donut"
                                data={auditStatusData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: auditStatusData.map(item => item.color),
                                    loading: false,
                                    height: 300
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Findings by department</h2>
                                <span className="text-sm text-gray-500">Total findings</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="bar"
                                data={findingsByDepartmentData}
                                config={{
                                    xAxisKey: 'name',
                                    yAxisKeys: [{ dataKey: 'value', name: 'Findings', color: '#DC2626' }],
                                    loading: false,
                                    height: 300,
                                    showLegend: false,
                                    showLabel: true,
                                    labelPosition: 'top',
                                    formatter: (value: number) => value.toString()
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Audit Universe</h2>
                        <p className="text-sm text-gray-500 mt-1">Comprehensive audit tracking and management</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Audit Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Findings
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Auditor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Completed
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {auditData.audits.map((audit) => (
                                    <tr key={audit.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {audit.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {audit.department}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(audit.status)}`}>
                                                {audit.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(audit.priority)}`}>
                                                {audit.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`font-semibold ${audit.findings > 3 ? 'text-red-600' : audit.findings > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                                {audit.findings}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {audit.auditor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {audit.completedDate ? new Date(audit.completedDate).toLocaleDateString('en-GB') : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
