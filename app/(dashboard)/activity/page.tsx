'use client'
import { useState } from 'react'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { StatsGrid } from '@/components/prosuite-management/cards/StatsCard'
import { Bell, Eye, Users, CheckCircle } from 'lucide-react'

export default function ActivityPage() {
    const [showAddModal, setShowAddModal] = useState(false)

    const stats = [
        {
            title: 'Notifications Viewed',
            number: 88,
            icon: <Bell className="w-5 h-5" />,
            statColor: 'text-blue-500',
            lastMonthDifference: 12.5,
            trendChartColor: '#3B82F6',
        },
        {
            title: 'Subscriptions Viewed',
            number: 88,
            icon: <Eye className="w-5 h-5" />,
            statColor: 'text-emerald-500',
            lastMonthDifference: 8.3,
            trendChartColor: '#10B981',
        },
        {
            title: 'Tasks Viewed',
            number: 88,
            icon: <CheckCircle className="w-5 h-5" />,
            statColor: 'text-purple-500',
            lastMonthDifference: -3.2,
            trendChartColor: '#A855F7',
        },
        {
            title: 'Users List Viewed',
            number: 88,
            icon: <Users className="w-5 h-5" />,
            statColor: 'text-orange-500',
            lastMonthDifference: 15.7,
            trendChartColor: '#F97316',
        },
    ]

    const handleTemplateDownload = (format: 'csv' | 'xlsx') => {
        console.log(`Downloading ${format} template`)
    }

    const handleAddActivity = () => {
        setShowAddModal(true)
        console.log('Add activity clicked')
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Page Header */}
            <PageSectionHeader
                title="Activity Management"
                subTitle="Recent ProSuite events, actions, and incidents"
                showImportExport={true}
                onTemplateDownload={handleTemplateDownload}
                customAction={{
                    action: handleAddActivity,
                }}
                exportData={[
                    { id: 1, type: 'Notification', count: 88, trend: '+12.5%' },
                    { id: 2, type: 'Subscription', count: 88, trend: '+8.3%' },
                    { id: 3, type: 'Task', count: 88, trend: '-3.2%' },
                    { id: 4, type: 'User', count: 88, trend: '+15.7%' },
                ]}
                exportHeaders={[
                    { key: 'id', label: 'ID' },
                    { key: 'type', label: 'Type' },
                    { key: 'count', label: 'Count' },
                    { key: 'trend', label: 'Trend' },
                ]}
            />

            {/* Stats Grid */}
            <StatsGrid stats={stats} />

            {/* Activity Feed Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
                            <p className="text-sm text-gray-500">Recent ProSuite events, actions, and incidents</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                icon: <Bell className="w-5 h-5 text-blue-500" />,
                                title: 'Notifications Viewed',
                                description: 'Successfully reviewed last 100 notifications',
                                time: '4 days ago',
                            },
                            {
                                icon: <Eye className="w-5 h-5 text-emerald-500" />,
                                title: 'Subscriptions Viewed',
                                description: 'Reviewed all team subscriptions status',
                                time: '4 days ago',
                            },
                            {
                                icon: <Eye className="w-5 h-5 text-emerald-500" />,
                                title: 'Subscriptions Viewed',
                                description: 'Reviewed all team subscriptions status',
                                time: '4 days ago',
                            },
                            {
                                icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
                                title: 'Tasks Viewed',
                                description: 'Successfully reviewed list of tasks',
                                time: '4 days ago',
                            },
                        ].map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                            >
                                <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full">
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                            <p className="text-sm text-gray-500">Outstanding ProSuite tasks and todos</p>
                        </div>
                    </div>

                    {/* Task Tabs */}
                    <div className="flex items-center gap-4 border-b border-gray-200">
                        <button className="pb-2 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                            New Tasks <span className="ml-1 text-xs">3</span>
                        </button>
                        <button className="pb-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                            In Progress <span className="ml-1 text-xs">3</span>
                        </button>
                        <button className="pb-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                            Completed <span className="ml-1 text-xs">2</span>
                        </button>
                        <button className="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {[
                            {
                                title: 'Plan Q4 Platform Update',
                                description: 'Coordinate with development team on feature releases.',
                                dueDate: 'Due 26 Jan 2025',
                                priority: 'Medium Priority',
                                priorityColor: 'text-orange-600 bg-orange-50',
                                category: 'General',
                                subtasks: '0/3 completed',
                                avatar: 'JA',
                            },
                            {
                                title: 'Conduct Quarterly User Access Review',
                                description: 'Verify roles and permissions for all active users.',
                                dueDate: 'Due 19 Jan 2026',
                                priority: 'High Priority',
                                priorityColor: 'text-red-600 bg-red-50',
                                category: 'Governance Management',
                                subtasks: '0/4 completed',
                                avatar: 'JA',
                            },
                        ].map((task, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-sm text-gray-900">{task.title}</h4>
                                    <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-pink-500 text-white text-xs font-semibold rounded-full">
                                        {task.avatar}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <span>📅 {task.dueDate}</span>
                                    <span className={`px-2 py-0.5 rounded ${task.priorityColor} font-medium`}>
                                        🚩 {task.priority}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">{task.category}</span>
                                    <span className="text-gray-400">{task.subtasks}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
