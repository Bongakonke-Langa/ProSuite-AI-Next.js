'use client';

import AppLayout from '@/components/AppLayout';
import WelcomeBanner from '@/components/WelcomeBanner';
import { prosuiteData } from '@/lib/prosuite-data';
import { AlertTriangle, Shield, Activity, FileText, TrendingUp, Clock } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      label: 'Total Risks',
      value: prosuiteData.risk?.risks?.length || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Active Assets',
      value: prosuiteData.asset?.assets?.length || 0,
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Open Incidents',
      value: prosuiteData.incident?.incidents?.filter((i: any) => i.status_id !== 4).length || 0,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Compliance Score',
      value: '78.5%',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const activities = [
    { title: 'Notifications Viewed', desc: 'Accessed 3 unread notifications', time: '2 days ago', icon: '🔔' },
    { title: 'Subscriptions Viewed', desc: 'Checked 10 items with new subscriber deals', time: '2 days ago', icon: '📋' },
    { title: 'Subscriptions Viewed', desc: 'Checked 10 items with new subscriber deals', time: '2 days ago', icon: '📋' },
    { title: 'Tasks Viewed', desc: 'Checked 4 unread of 8 tasks', time: '2 days ago', icon: '✓' },
    { title: 'Subscriptions Viewed', desc: 'Checked 10 items with new subscriber deals', time: '2 days ago', icon: '📋' },
    { title: 'Users List Viewed', desc: 'Updated 2 of 4 users', time: '2 days ago', icon: '👥' },
  ];

  const tasks = [
    {
      title: 'Plan Q4 Platform Update',
      desc: 'Coordinate with development team on feature releases.',
      due: 'Due 26 Jan 2026',
      priority: 'Medium Priority',
      priorityColor: 'text-orange-600',
      category: 'General',
      subtasks: '0/3 completed',
    },
    {
      title: 'Conduct Quarterly User Access Review',
      desc: 'Verify roles and permissions for all active users.',
      due: 'Due 25 Jan 2026',
      priority: 'High Priority',
      priorityColor: 'text-red-600',
      category: 'Governance Management',
      subtasks: '0/4 completed',
    },
  ];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
            <p className="text-sm text-gray-500">Live dashboard activity, actions, and incidents</p>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-prosuite-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                <p className="text-sm text-gray-500">12 ongoing from site tasks and todos</p>
              </div>
              <button className="w-8 h-8 bg-prosuite-600 text-white rounded-lg flex items-center justify-center hover:bg-prosuite-700 transition-colors">
                +
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                📝 New Tasks 3
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                🔄 In Progress 3
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                ✓ Completed 2
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map((task, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {task.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{task.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {task.due}
                    </span>
                    <span className={`flex items-center ${task.priorityColor}`}>
                      🔴 {task.priority}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    JA
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">Subtasks</p>
                  <p className="text-sm font-medium text-gray-700">{task.subtasks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
