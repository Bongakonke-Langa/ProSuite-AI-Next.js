'use client'

import { useMemo } from 'react'
import { FileCheck, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { UniversalChart } from '@/components/prosuite-management/eCharts/UniversalChart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ComplianceDashboard() {
    // Mock compliance data - in production, this would come from API/database
    const complianceData = {
        score: 78.5,
        totalStandards: 10,
        compliant: 8,
        nonCompliant: 2,
        standards: [
            { id: 1, name: 'ISO 27001', status: 'Compliant', score: 95, lastAudit: '2026-01-15' },
            { id: 2, name: 'GDPR', status: 'Compliant', score: 88, lastAudit: '2026-01-10' },
            { id: 3, name: 'SOC 2', status: 'In Progress', score: 65, lastAudit: '2025-12-20' },
            { id: 4, name: 'HIPAA', status: 'Compliant', score: 92, lastAudit: '2026-01-05' },
            { id: 5, name: 'PCI DSS', status: 'Compliant', score: 87, lastAudit: '2025-12-28' },
            { id: 6, name: 'ISO 9001', status: 'Compliant', score: 90, lastAudit: '2026-01-12' },
            { id: 7, name: 'NIST', status: 'Non-Compliant', score: 55, lastAudit: '2025-11-30' },
            { id: 8, name: 'COBIT', status: 'Compliant', score: 85, lastAudit: '2026-01-08' },
            { id: 9, name: 'FISMA', status: 'Compliant', score: 89, lastAudit: '2025-12-15' },
            { id: 10, name: 'FERPA', status: 'Compliant', score: 91, lastAudit: '2026-01-18' }
        ]
    }

    const stats = useMemo(() => [
        {
            title: 'Compliance Score',
            number: `${complianceData.score}%`,
            icon: <FileCheck className="h-5 w-5" />,
            statColor: 'text-blue-600',
            lastMonthDifference: 78.5
        },
        {
            title: 'Compliant Standards',
            number: complianceData.compliant,
            icon: <CheckCircle className="h-5 w-5" />,
            statColor: 'text-green-600',
            lastMonthDifference: complianceData.compliant
        },
        {
            title: 'Non-Compliant',
            number: complianceData.nonCompliant,
            icon: <AlertCircle className="h-5 w-5" />,
            statColor: 'text-red-600',
            lastMonthDifference: complianceData.nonCompliant
        },
        {
            title: 'Total Standards',
            number: complianceData.totalStandards,
            icon: <Clock className="h-5 w-5" />,
            statColor: 'text-purple-600',
            lastMonthDifference: complianceData.totalStandards
        }
    ], [complianceData])

    const complianceStatusData = useMemo(() => [
        { name: 'Compliant', value: complianceData.compliant, color: '#10B981' },
        { name: 'Non-Compliant', value: complianceData.nonCompliant, color: '#DC2626' }
    ], [complianceData])

    const standardsScoreData = useMemo(() => {
        return complianceData.standards
            .sort((a, b) => b.score - a.score)
            .map(standard => ({
                name: standard.name,
                value: standard.score
            }))
    }, [complianceData])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Compliant':
                return 'bg-green-100 text-green-800'
            case 'Non-Compliant':
                return 'bg-red-100 text-red-800'
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600'
        if (score >= 70) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <PageSectionHeader
                    title="Compliance Dashboard"
                    subTitle="Monitor regulatory compliance and manage standards across the organization"
                    showImportExport={false}
                    removePadding={false}
                />

                <StatsGrid stats={stats} />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Compliance status</h2>
                                <span className="text-sm text-gray-500">{complianceData.totalStandards} standards</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="donut"
                                data={complianceStatusData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: complianceStatusData.map(item => item.color),
                                    loading: false,
                                    height: 300
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Standards scores</h2>
                                <span className="text-sm text-gray-500">Performance overview</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="bar"
                                data={standardsScoreData}
                                config={{
                                    xAxisKey: 'name',
                                    yAxisKeys: [{ dataKey: 'value', name: 'Score', color: '#3B82F6' }],
                                    loading: false,
                                    height: 300,
                                    showLegend: false,
                                    showLabel: true,
                                    labelPosition: 'top',
                                    formatter: (value: number) => `${value}%`
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Compliance standards</h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed view of all tracked standards</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Standard
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Audit
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {complianceData.standards.map((standard) => (
                                    <tr key={standard.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{standard.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(standard.status)}`}>
                                                {standard.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-semibold ${getScoreColor(standard.score)}`}>
                                                {standard.score}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(standard.lastAudit).toLocaleDateString('en-GB')}
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
