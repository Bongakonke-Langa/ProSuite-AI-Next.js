'use client'

import { Bell, Eye, CheckCircle, Users } from 'lucide-react'

const activities = [
    {
        icon: <Bell className="w-5 h-5 text-blue-500" />,
        title: 'Notifications Viewed',
        description: 'Successfully reviewed last 100 notifications',
        time: '4 days ago',
        bgColor: 'bg-blue-50',
    },
    {
        icon: <Eye className="w-5 h-5 text-emerald-500" />,
        title: 'Subscriptions Viewed',
        description: 'Reviewed all team subscriptions status',
        time: '4 days ago',
        bgColor: 'bg-emerald-50',
    },
    {
        icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
        title: 'Tasks Viewed',
        description: 'Successfully reviewed list of tasks',
        time: '4 days ago',
        bgColor: 'bg-purple-50',
    },
    {
        icon: <Users className="w-5 h-5 text-orange-500" />,
        title: 'Users List Viewed',
        description: 'Reviewed active user accounts',
        time: '5 days ago',
        bgColor: 'bg-orange-50',
    },
]

export default function RecentActivities() {
    return (
        <div className="space-y-3 mt-4">
            {activities.map((activity, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                    <div className={`shrink-0 w-10 h-10 flex items-center justify-center ${activity.bgColor} rounded-full`}>
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
    )
}
