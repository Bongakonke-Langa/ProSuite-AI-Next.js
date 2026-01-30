'use client'

import { useMemo } from 'react'
import { Target, Users, FileText, TrendingUp } from 'lucide-react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { UniversalChart } from '@/components/prosuite-management/eCharts/UniversalChart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function GovernanceDashboard() {
    // Mock governance data - in production, this would come from API/database
    const governanceData = {
        totalObjectives: 12,
        activeObjectives: 10,
        completedObjectives: 8,
        stakeholders: 25,
        objectives: [
            { id: 1, title: 'Digital Transformation Initiative', status: 'In Progress', progress: 75, owner: 'CTO', dueDate: '2026-03-31' },
            { id: 2, title: 'Customer Experience Enhancement', status: 'In Progress', progress: 60, owner: 'CMO', dueDate: '2026-04-15' },
            { id: 3, title: 'Operational Efficiency Program', status: 'Completed', progress: 100, owner: 'COO', dueDate: '2026-01-20' },
            { id: 4, title: 'Sustainability Goals 2026', status: 'In Progress', progress: 45, owner: 'CEO', dueDate: '2026-12-31' },
            { id: 5, title: 'Market Expansion Strategy', status: 'Planning', progress: 25, owner: 'CEO', dueDate: '2026-06-30' },
            { id: 6, title: 'Talent Development Program', status: 'In Progress', progress: 80, owner: 'CHRO', dueDate: '2026-05-15' },
            { id: 7, title: 'Risk Management Framework', status: 'Completed', progress: 100, owner: 'CRO', dueDate: '2026-01-10' },
            { id: 8, title: 'Innovation Lab Setup', status: 'In Progress', progress: 55, owner: 'CTO', dueDate: '2026-07-01' },
        ]
    }

    const stats = useMemo(() => [
        {
            title: 'Total Objectives',
            number: governanceData.totalObjectives,
            icon: <Target className="h-5 w-5" />,
            statColor: 'text-blue-600',
            lastMonthDifference: governanceData.totalObjectives
        },
        {
            title: 'Active Objectives',
            number: governanceData.activeObjectives,
            icon: <TrendingUp className="h-5 w-5" />,
            statColor: 'text-green-600',
            lastMonthDifference: governanceData.activeObjectives
        },
        {
            title: 'Completed',
            number: governanceData.completedObjectives,
            icon: <FileText className="h-5 w-5" />,
            statColor: 'text-purple-600',
            lastMonthDifference: governanceData.completedObjectives
        },
        {
            title: 'Stakeholders',
            number: governanceData.stakeholders,
            icon: <Users className="h-5 w-5" />,
            statColor: 'text-orange-600',
            lastMonthDifference: governanceData.stakeholders
        }
    ], [governanceData])

    const objectiveStatusData = useMemo(() => {
        const statusCount = governanceData.objectives.reduce((acc, obj) => {
            acc[obj.status] = (acc[obj.status] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        return [
            { name: 'In Progress', value: statusCount['In Progress'] || 0, color: '#3B82F6' },
            { name: 'Completed', value: statusCount['Completed'] || 0, color: '#10B981' },
            { name: 'Planning', value: statusCount['Planning'] || 0, color: '#F59E0B' }
        ].filter(item => item.value > 0)
    }, [governanceData])

    const objectiveProgressData = useMemo(() => {
        return governanceData.objectives
            .sort((a, b) => b.progress - a.progress)
            .map(obj => ({
                name: obj.title.length > 20 ? obj.title.substring(0, 20) + '...' : obj.title,
                value: obj.progress
            }))
    }, [governanceData])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800'
            case 'In Progress':
                return 'bg-blue-100 text-blue-800'
            case 'Planning':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-500'
        if (progress >= 50) return 'bg-blue-500'
        if (progress >= 25) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <PageSectionHeader
                    title="Governance Dashboard"
                    subTitle="Manage strategic objectives and organizational governance"
                    showImportExport={false}
                    removePadding={false}
                />

                <StatsGrid stats={stats} />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Objective status</h2>
                                <span className="text-sm text-gray-500">{governanceData.totalObjectives} total</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="donut"
                                data={objectiveStatusData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: objectiveStatusData.map(item => item.color),
                                    loading: false,
                                    height: 300
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Objective progress</h2>
                                <span className="text-sm text-gray-500">Completion %</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="bar"
                                data={objectiveProgressData}
                                config={{
                                    xAxisKey: 'name',
                                    yAxisKeys: [{ dataKey: 'value', name: 'Progress', color: '#3B82F6' }],
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
                        <h2 className="text-lg font-semibold text-gray-900">Strategic Objectives</h2>
                        <p className="text-sm text-gray-500 mt-1">Track and manage organizational goals</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Objective
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Owner
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {governanceData.objectives.map((objective) => (
                                    <tr key={objective.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {objective.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {objective.owner}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(objective.status)}`}>
                                                {objective.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${getProgressColor(objective.progress)}`}
                                                        style={{ width: `${objective.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                                                    {objective.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(objective.dueDate).toLocaleDateString('en-GB')}
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
