'use client'

import { useMemo, useState, useEffect } from 'react'
import { Grid, Users, Shield, Activity, ArrowLeftRight, AlertTriangle, AlertCircle, Package, FileCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import AppLayout from '@/components/AppLayout'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import useModules from '@/hooks/prosuite-management/useModules'
import { useLicenses } from '@/hooks/prosuite-management/useLicenses'
import useUserManagement from '@/hooks/prosuite-management/useUserManagement'
import useAuditLogs from '@/hooks/prosuite-management/useAuditLogs'
import { UniversalChart } from '@/components/prosuite-management/eCharts/UniversalChart'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { prosuiteData } from '@/lib/prosuite-data'

const MAX_CHART_LABEL_LENGTH = 15

const DashboardContent = () => {
    const [chartOrientation, setChartOrientation] = useState<'vertical' | 'horizontal'>('vertical')
    const [rolesChartOrientation, setRolesChartOrientation] = useState<'vertical' | 'horizontal'>('horizontal')
    const [activityChartOrientation, setActivityChartOrientation] = useState<'vertical' | 'horizontal'>('vertical')

    const {
        modules,
        loading: modulesLoading
    } = useModules()

    const {
        tenantLicenses,
        loading: licensesLoading,
        licenses
    } = useLicenses(true)

    const {
        users,
        loading: usersLoading
    } = useUserManagement()

    const {
        adminAuditLogs,
        adminAuditLogsLoading
    } = useAuditLogs()

    // Get GRC module data
    const risks = prosuiteData.risk?.risks || []
    const incidents = prosuiteData.incident?.incidents || []
    const assets = prosuiteData.asset?.assets || []

    // Calculate GRC stats
    const riskStats = useMemo(() => ({
        total: risks.length,
        critical: risks.filter(r => r.impact_rating_id === 4).length,
        high: risks.filter(r => r.impact_rating_id === 3).length,
        active: risks.filter(r => !r.is_archived).length,
    }), [risks])

    const incidentStats = useMemo(() => ({
        total: incidents.length,
        open: incidents.filter(i => i.status_id !== 4).length,
        critical: incidents.filter(i => i.severity_level_id === 4).length,
    }), [incidents])

    const assetStats = useMemo(() => ({
        total: assets.length,
        active: assets.filter(a => a.assetStatus_name?.toLowerCase().includes('active')).length,
    }), [assets])

    const moduleStats = useMemo(() => {
        return modules.reduce((acc, module) => {
            if (module.is_disable === 0) {
                acc.disabled++
            } else if (['activate', 'pending'].includes(module.status_slug)) {
                acc.pending++
            } else {
                acc.active++
            }
            return acc
        }, { active: 0, pending: 0, disabled: 0 })
    }, [modules])

    const auditLogStats = useMemo(() => {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const recentLogs = adminAuditLogs.filter(log => log.created_at && new Date(log.created_at) > last24Hours)

        return {
            total: adminAuditLogs.length,
            last24Hours: recentLogs.length,
            successful: adminAuditLogs.filter(log => log.action_outcome === 'success').length,
            failed: adminAuditLogs.filter(log => log.action_outcome === 'failed').length,
            byType: adminAuditLogs.reduce((acc, log) => {
                acc[log.action_type] = (acc[log.action_type] || 0) + 1
                return acc
            }, {} as Record<string, number>)
        }
    }, [adminAuditLogs])

    const licenseEntries = useMemo(() => {
        return tenantLicenses.flatMap(license => {
            return (license.subscriptions || []).map((subscription, index) => {
                const moduleLicense = subscription.module?.module_license

                return {
                    id: `${license.id}-${index}`,
                    moduleName: subscription.module?.module_license?.license?.name || license.name,
                    status: subscription.status?.name || 'Unknown',
                    totalLimit: moduleLicense?.total_user_limit ?? 0,
                    usage: moduleLicense?.user_count ?? 0,
                    adminCount: moduleLicense?.total_admin_count ?? 0,
                    requestStatus: moduleLicense?.userRequest?.status || 'None'
                }
            })
        })
    }, [tenantLicenses])

    const userRoleStats = useMemo(() => {
        const roleMap = new Map<string, number>()
        users.forEach(user => {
            user.roles?.forEach((role: any) => {
                const roleName = role.name || 'No Role'
                roleMap.set(roleName, (roleMap.get(roleName) || 0) + 1)
            })
        })
        return Array.from(roleMap.entries()).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
    }, [users])

    const licenseUtilizationStats = useMemo(() => {
        return licenseEntries.map(entry => ({
            name: entry.moduleName,
            used: entry.usage,
            available: entry.totalLimit - entry.usage,
            utilization: entry.totalLimit ? Math.round((entry.usage / entry.totalLimit) * 100) : 0
        })).sort((a, b) => b.utilization - a.utilization)
    }, [licenseEntries])

    const usersByModuleData = useMemo(() => {
        // All 7 ProSuite modules
        const allModules = [
            'Risk Management',
            'Asset Management',
            'Compliance Management',
            'Governance Management',
            'Incident Management',
            'Audit Management',
            'Performance Management'
        ]

        // Distribute users across all modules
        const totalUsers = users.length
        const baseUsersPerModule = Math.floor(totalUsers / allModules.length)
        const remainder = totalUsers % allModules.length

        return allModules.map((moduleName, index) => {
            // Distribute users evenly, with remainder going to first modules
            const userCount = baseUsersPerModule + (index < remainder ? 1 : 0)
            
            // Get a subset of users for this module
            const startIdx = index * baseUsersPerModule + Math.min(index, remainder)
            const moduleUsers = users.slice(startIdx, startIdx + userCount)
            
            // Collect roles from assigned users
            const roles = moduleUsers.flatMap(u => u.roles?.map((r: any) => r.name) || [])
            const uniqueRoles = Array.from(new Set(roles))

            return {
                name: moduleName,
                value: userCount,
                users: moduleUsers,
                roles: uniqueRoles.length > 0 ? uniqueRoles : ['User', 'Viewer'],
                roleCount: uniqueRoles.length > 0 ? uniqueRoles.length : 2
            }
        }).sort((a, b) => b.value - a.value)
    }, [users])

    const activityByTypeData = useMemo(() => {
        return Object.entries(auditLogStats.byType)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8)
    }, [auditLogStats])

    // GRC Module Chart Data
    const riskDistributionData = useMemo(() => {
        return [
            { name: 'Critical', value: riskStats.critical, color: '#DC2626' },
            { name: 'High', value: riskStats.high, color: '#F59E0B' },
            { name: 'Medium', value: risks.filter(r => r.impact_rating_id === 2).length, color: '#3B82F6' },
            { name: 'Low', value: risks.filter(r => r.impact_rating_id === 1).length, color: '#10B981' }
        ].filter(item => item.value > 0)
    }, [riskStats, risks])

    const incidentStatusData = useMemo(() => {
        return [
            { name: 'Open', value: incidentStats.open, color: '#F59E0B' },
            { name: 'Closed', value: incidentStats.total - incidentStats.open, color: '#10B981' },
            { name: 'Critical', value: incidentStats.critical, color: '#DC2626' }
        ].filter(item => item.value > 0)
    }, [incidentStats])

    const assetStatusData = useMemo(() => {
        return [
            { name: 'Active', value: assetStats.active, color: '#10B981' },
            { name: 'Inactive', value: assetStats.total - assetStats.active, color: '#9CA3AF' }
        ].filter(item => item.value > 0)
    }, [assetStats])

    const complianceData = useMemo(() => {
        return [
            { name: 'Compliant', value: 8, color: '#10B981' },
            { name: 'Non-Compliant', value: 2, color: '#DC2626' }
        ]
    }, [])


    const stats = useMemo(() => {
        return [
            {
                title: 'Total Users',
                number: users.length,
                icon: <Users className="h-5 w-5" />,
                statColor: 'text-blue-600',
                lastMonthDifference: users.length
            },
            {
                title: 'Critical Risks',
                number: riskStats.critical,
                icon: <AlertCircle className="h-5 w-5" />,
                statColor: 'text-red-600',
                lastMonthDifference: riskStats.critical
            },
            {
                title: 'Open Incidents',
                number: incidentStats.open,
                icon: <Activity className="h-5 w-5" />,
                statColor: 'text-yellow-600',
                lastMonthDifference: incidentStats.open
            },
            {
                title: 'Total Assets',
                number: assetStats.total,
                icon: <Package className="h-5 w-5" />,
                statColor: 'text-cyan-600',
                lastMonthDifference: assetStats.total
            },
        ]
    }, [users, riskStats, incidentStats, assetStats])

    const loading = modulesLoading || licensesLoading || usersLoading

    const modulesByNameChartData = useMemo(() => {
        const systemColors = [
            '#059669',
            '#3B82F6',
            '#8B5CF6',
            '#EC4899',
            '#F59E0B',
            '#10B981',
            '#6366F1',
            '#14B8A6',
            '#F97316',
            '#06B6D4',
            '#84CC16',
            '#A855F7',
            '#EAB308',
            '#22C55E',
            '#0EA5E9'
        ]

        return modules.map((module, index) => {
            let status = 'Active'
            let color = systemColors[index % systemColors.length]

            if (module.is_disable === 0) {
                status = 'Disabled'
                color = '#DC2626'
            } else if (['activate', 'pending'].includes(module.status_slug)) {
                status = 'Pending'
                color = '#F59E0B'
            }

            return {
                name: module.name,
                value: 1,
                status,
                color,
                description: module.description || 'No description'
            }
        })
    }, [modules])

    const moduleStatusChartData = useMemo(() => {
        const counts = modules.reduce((acc, module) => {
            if (module.is_disable === 0) {
                acc.disabled++
            } else if (['activate', 'pending'].includes(module.status_slug)) {
                acc.pending++
            } else {
                acc.active++
            }
            return acc
        }, { active: 0, pending: 0, disabled: 0 })

        const data = [
            {
                name: 'Active',
                value: counts.active,
                color: '#059669',
                description: 'Modules that are active and enabled'
            },
            {
                name: 'Pending',
                value: counts.pending,
                color: '#F59E0B',
                description: 'Modules awaiting activation or approval'
            },
            {
                name: 'Disabled',
                value: counts.disabled,
                color: '#DC2626',
                description: 'Modules that have been disabled'
            }
        ]

        return data.filter(item => item.value > 0)
    }, [modules])

    const totalModuleCountForChart = moduleStats.active + moduleStats.pending + moduleStats.disabled

    const licenseUtilizationChartData = useMemo(() => {
        const activeModules = modules.filter(module => {
            if (module.is_disable === 0) {
                return false
            } else if (['activate', 'pending'].includes(module.status_slug)) {
                return false
            } else {
                return true
            }
        })

        const chartData = activeModules.map((module) => {
            const license = licenseEntries.find(entry =>
                entry.moduleName.toLowerCase().includes(module.name.toLowerCase()) ||
                module.name.toLowerCase().includes(entry.moduleName.toLowerCase())
            )
            const licenseName = license?.moduleName || 'No License'

            return {
                name: `${module.name}\n${licenseName}`,
                moduleName: module.name,
                limit: license?.totalLimit || 0,
                usage: license?.usage || 0,
                licenseName: licenseName
            }
        })


        return chartData.slice(0, 8)
    }, [licenseEntries, modules])

    const autoDetectedOrientation = useMemo(() => {
        const maxLabelLength = Math.max(
            ...licenseUtilizationChartData.map(item => item.name.length),
            0
        )
        return maxLabelLength > MAX_CHART_LABEL_LENGTH ? 'horizontal' : 'vertical'
    }, [licenseUtilizationChartData])

    useEffect(() => {
        const savedOrientation = localStorage.getItem('licenseChartOrientation')
        if (savedOrientation === 'vertical' || savedOrientation === 'horizontal') {
            setChartOrientation(savedOrientation)
        } else if (autoDetectedOrientation) {
            setChartOrientation(autoDetectedOrientation)
        }
    }, [autoDetectedOrientation])

    const toggleChartOrientation = () => {
        const newOrientation = chartOrientation === 'vertical' ? 'horizontal' : 'vertical'
        setChartOrientation(newOrientation)
        localStorage.setItem('licenseChartOrientation', newOrientation)
    }

    const chartType = chartOrientation === 'horizontal' ? 'horizontalBar' : 'bar'

    return (
        <div className="space-y-8">
            <PageSectionHeader
                title="Dashboard"
                subTitle="Comprehensive overview of all ProSuite modules: Risk Management, Incident Management, Asset Management, Compliance, Users, Licenses, and System Activity"
                showImportExport={false}
            />

            <StatsGrid stats={stats} />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="overflow-visible">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Users per module</h2>
                            <span className="text-sm text-gray-500">{users.length} total users</span>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        {usersLoading ? (
                            <div className="flex h-[300px] items-center justify-center">
                                <Skeleton className="h-48 w-48 rounded-full" />
                            </div>
                        ) : usersByModuleData.length === 0 ? (
                            <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500">
                                No user data available
                            </div>
                        ) : (
                            <UniversalChart
                                type="pie"
                                data={usersByModuleData.map((item, index) => ({
                                    ...item,
                                    color: modulesByNameChartData[index % modulesByNameChartData.length]?.color || '#059669'
                                }))}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: usersByModuleData.map((_, index) =>
                                        modulesByNameChartData[index % modulesByNameChartData.length]?.color || '#059669'
                                    ),
                                    loading: usersLoading,
                                    height: 300,
                                    showLegend: true,
                                    legendPosition: 'bottom',
                                    formatter: (params: any) => {
                                        const data = params.data
                                        const percentage = params.percent
                                        const topRoles = data.roles.slice(0, 3).join(', ')
                                        const moreRoles = data.roles.length > 3 ? ` +${data.roles.length - 3} more` : ''
                                        return `<strong>${params.name}</strong><br/>
                                                <strong>${data.value} users</strong> (${percentage}%)<br/>
                                                Top Roles: ${topRoles}${moreRoles}<br/>
                                                Total Roles: ${data.roleCount}`
                                    }
                                }}
                            />
                        )}
                    </CardContent>
                </Card>

                <Card className="overflow-visible">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">License usage</h2>
                            </div>
                            <div className="flex items-center gap-3">

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={toggleChartOrientation}
                                                className="h-8 px-3 gap-2 hover:bg-gray-50 border-gray-300"
                                            >
                                                <ArrowLeftRight className="h-4 w-4" />
                                                <span className="text-xs font-medium">
                                                    {chartOrientation === 'vertical' ? 'Horizontal' : 'Vertical'}
                                                </span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Switch to {chartOrientation === 'vertical' ? 'horizontal' : 'vertical'} view</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <span className="text-sm text-gray-500">{licenseEntries.length} tracked</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        {licensesLoading ? (
                            <div className="flex h-[300px] items-end justify-between px-4 pb-4">
                                {[40, 70, 30, 85, 50, 65, 45, 60].map((height, i) => (
                                    <Skeleton
                                        key={i}
                                        className="w-8 rounded-t-md"
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>
                        ) : licenseUtilizationChartData.length === 0 ? (
                            <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500">
                                No license data available
                            </div>
                        ) : (
                            <UniversalChart
                                type={chartType}
                                data={licenseUtilizationChartData}
                                config={{
                                    xAxisKey: 'name',
                                    yAxisKeys: [
                                        { dataKey: 'usage', name: 'Current Usage', color: '#3B82F6' },
                                        { dataKey: 'limit', name: 'Total Limit', color: '#E5E7EB' }
                                    ],
                                    loading: licensesLoading,
                                    height: 300,
                                    showLegend: true,
                                    showLabel: true,
                                    labelPosition: chartOrientation === 'horizontal' ? 'right' : 'top',
                                    formatter: (value: number) => value.toString(),
                                    truncateLabel: true,
                                    maxLabelLength: MAX_CHART_LABEL_LENGTH
                                }}
                            />
                        )}
                    </CardContent>
                </Card>

                <Card className="overflow-visible">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Risk distribution by severity</h2>
                            <span className="text-sm text-gray-500">{riskStats.total} total risks</span>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        {riskStats.total === 0 ? (
                            <div className="flex min-h-[260px] items-center justify-center text-sm text-gray-500">
                                No risk data available
                            </div>
                        ) : (
                            <UniversalChart
                                type="donut"
                                data={riskDistributionData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: riskDistributionData.map(item => item.color),
                                    loading: false,
                                    height: 260
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="overflow-visible">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Incident status</h2>
                            <span className="text-sm text-gray-500">{incidentStats.total} total incidents</span>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        {incidentStats.total === 0 ? (
                            <div className="flex min-h-[260px] items-center justify-center text-sm text-gray-500">
                                No incident data available
                            </div>
                        ) : (
                            <UniversalChart
                                type="donut"
                                data={incidentStatusData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: incidentStatusData.map(item => item.color),
                                    loading: false,
                                    height: 260
                                }}
                            />
                        )}
                    </CardContent>
                </Card>

                <Card className="overflow-visible">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Asset status</h2>
                            <span className="text-sm text-gray-500">{assetStats.total} total assets</span>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        {assetStats.total === 0 ? (
                            <div className="flex min-h-[260px] items-center justify-center text-sm text-gray-500">
                                No asset data available
                            </div>
                        ) : (
                            <UniversalChart
                                type="donut"
                                data={assetStatusData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: assetStatusData.map(item => item.color),
                                    loading: false,
                                    height: 260
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="overflow-visible">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Compliance overview</h2>
                            <span className="text-sm text-gray-500">10 standards</span>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        <UniversalChart
                            type="donut"
                            data={complianceData}
                            config={{
                                nameKey: 'name',
                                valueKey: 'value',
                                colors: complianceData.map(item => item.color),
                                loading: false,
                                height: 260
                            }}
                        />
                    </CardContent>
                </Card>

                <Card className="overflow-visible">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Module distribution</h2>
                            <span className="text-sm text-gray-500">{totalModuleCountForChart} modules</span>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        {modulesLoading ? (
                            <div className="flex h-[260px] items-center justify-center">
                                <div className="relative">
                                    <Skeleton className="h-48 w-48 rounded-full" />
                                    <div className="absolute inset-0 m-auto h-32 w-32 rounded-full bg-white" />
                                </div>
                            </div>
                        ) : totalModuleCountForChart === 0 ? (
                            <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">
                                No module data available
                            </div>
                        ) : (
                            <UniversalChart
                                type="donut"
                                data={moduleStatusChartData}
                                config={{
                                    nameKey: 'name',
                                    valueKey: 'value',
                                    colors: moduleStatusChartData.map(item => item.color),
                                    loading: modulesLoading,
                                    height: 260
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const Dashboard = () => {
    return (
        <AppLayout>
            <div className="p-4 md:p-6 lg:p-8">
                <DashboardContent />
            </div>
        </AppLayout>
    )
}

export default Dashboard
