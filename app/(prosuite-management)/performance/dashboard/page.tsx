'use client'

import { useMemo } from 'react'
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { UniversalChart } from '@/components/prosuite-management/eCharts/UniversalChart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function PerformanceDashboard() {
    // Mock performance data - in production, this would come from API/database
    const performanceData = {
        totalKPIs: 32,
        onTrackKPIs: 24,
        atRiskKPIs: 6,
        offTrackKPIs: 2,
        kpis: [
            { id: 1, name: 'Customer Satisfaction Score', department: 'Customer Service', target: 90, actual: 88, unit: '%', status: 'On Track', owner: 'CMO' },
            { id: 2, name: 'Revenue Growth', department: 'Finance', target: 15, actual: 17, unit: '%', status: 'Exceeding', owner: 'CFO' },
            { id: 3, name: 'Employee Retention Rate', department: 'Human Resources', target: 85, actual: 82, unit: '%', status: 'At Risk', owner: 'CHRO' },
            { id: 4, name: 'System Uptime', department: 'Information Technology', target: 99.9, actual: 99.8, unit: '%', status: 'On Track', owner: 'CTO' },
            { id: 5, name: 'Project Delivery On-Time', department: 'Operations', target: 80, actual: 75, unit: '%', status: 'At Risk', owner: 'COO' },
            { id: 6, name: 'Cost Reduction', department: 'Finance', target: 10, actual: 12, unit: '%', status: 'Exceeding', owner: 'CFO' },
            { id: 7, name: 'Training Completion Rate', department: 'Human Resources', target: 95, actual: 92, unit: '%', status: 'On Track', owner: 'CHRO' },
            { id: 8, name: 'Incident Response Time', department: 'Information Technology', target: 30, actual: 45, unit: 'min', status: 'Off Track', owner: 'CTO' },
        ]
    }

    const stats = useMemo(() => [
        {
            title: 'Total KPIs',
            number: performanceData.totalKPIs,
            icon: <BarChart3 className="h-5 w-5" />,
            statColor: 'text-blue-600',
            lastMonthDifference: performanceData.totalKPIs
        },
        {
            title: 'On Track',
            number: performanceData.onTrackKPIs,
            icon: <Target className="h-5 w-5" />,
            statColor: 'text-green-600',
            lastMonthDifference: performanceData.onTrackKPIs
        },
        {
            title: 'At Risk',
            number: performanceData.atRiskKPIs,
            icon: <TrendingUp className="h-5 w-5" />,
            statColor: 'text-orange-600',
            lastMonthDifference: performanceData.atRiskKPIs
        },
        {
            title: 'Off Track',
            number: performanceData.offTrackKPIs,
            icon: <Award className="h-5 w-5" />,
            statColor: 'text-red-600',
            lastMonthDifference: performanceData.offTrackKPIs
        }
    ], [performanceData])

    const kpiStatusData = useMemo(() => [
        { name: 'On Track', value: performanceData.onTrackKPIs, color: '#10B981' },
        { name: 'At Risk', value: performanceData.atRiskKPIs, color: '#F59E0B' },
        { name: 'Off Track', value: performanceData.offTrackKPIs, color: '#DC2626' }
    ], [performanceData])

    const performanceByDepartmentData = useMemo(() => {
        const deptPerformance = performanceData.kpis.reduce((acc, kpi) => {
            if (!acc[kpi.department]) {
                acc[kpi.department] = { total: 0, achieved: 0 }
            }
            acc[kpi.department].total++
            if (kpi.status === 'On Track' || kpi.status === 'Exceeding') {
                acc[kpi.department].achieved++
            }
            return acc
        }, {} as Record<string, { total: number; achieved: number }>)

        return Object.entries(deptPerformance)
            .map(([name, data]) => ({
                name: name.length > 15 ? name.substring(0, 15) + '...' : name,
                value: Math.round((data.achieved / data.total) * 100)
            }))
            .sort((a, b) => b.value - a.value)
    }, [performanceData])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Exceeding':
                return 'bg-green-100 text-green-800'
            case 'On Track':
                return 'bg-blue-100 text-blue-800'
            case 'At Risk':
                return 'bg-orange-100 text-orange-800'
            case 'Off Track':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getPerformanceIndicator = (target: number, actual: number, unit: string) => {
        const isTimeMetric = unit === 'min' || unit === 'hrs'
        const percentage = isTimeMetric 
            ? ((target - actual) / target) * 100  // Lower is better for time metrics
            : ((actual - target) / target) * 100  // Higher is better for other metrics
        
        if (percentage >= 10) return { color: 'text-green-600', icon: '↑' }
        if (percentage >= -5) return { color: 'text-blue-600', icon: '→' }
        if (percentage >= -15) return { color: 'text-orange-600', icon: '↓' }
        return { color: 'text-red-600', icon: '↓↓' }
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                <PageSectionHeader
                    title="Performance Management"
                    subTitle="Track KPIs and organizational performance metrics"
                    showImportExport={false}
                    removePadding={false}
                />

                <StatsGrid stats={stats} />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">KPI status distribution</h2>
                                <span className="text-sm text-gray-500">{performanceData.totalKPIs} KPIs</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="donut"
                                data={kpiStatusData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: kpiStatusData.map(item => item.color),
                                    loading: false,
                                    height: 300
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="overflow-visible">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Department performance</h2>
                                <span className="text-sm text-gray-500">Achievement %</span>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-visible">
                            <UniversalChart
                                type="bar"
                                data={performanceByDepartmentData}
                                config={{
                                    xAxisKey: 'name',
                                    yAxisKeys: [{ dataKey: 'value', name: 'Performance', color: '#3B82F6' }],
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
                        <h2 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h2>
                        <p className="text-sm text-gray-500 mt-1">Monitor and track organizational KPIs</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        KPI Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Target
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actual
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Owner
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {performanceData.kpis.map((kpi) => {
                                    const indicator = getPerformanceIndicator(kpi.target, kpi.actual, kpi.unit)
                                    return (
                                        <tr key={kpi.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {kpi.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {kpi.department}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {kpi.target}{kpi.unit}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">
                                                        {kpi.actual}{kpi.unit}
                                                    </span>
                                                    <span className={`text-lg font-bold ${indicator.color}`}>
                                                        {indicator.icon}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(kpi.status)}`}>
                                                    {kpi.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {kpi.owner}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
