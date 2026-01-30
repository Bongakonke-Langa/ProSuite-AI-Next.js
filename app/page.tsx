'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader';
import { useAuth } from '@/hooks/prosuite-management/auth';
import { Clock } from 'lucide-react';

const getGreeting = (): string => {
    const now = new Date()
    const currentHour = now.getHours()

    if (currentHour >= 5 && currentHour < 12) return 'Good morning'
    else if (currentHour >= 12 && currentHour < 17) return 'Good afternoon'
    else return 'Good evening'
};

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<string>(getGreeting());

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Greeting Banner */}
        <div className="w-full relative bg-gradient-to-r from-[#017DC5] to-[#008EE0] rounded-lg px-4 sm:px-6 lg:px-10 py-6 sm:py-12 lg:py-16 overflow-hidden">
          <h2 className="text-white text-lg sm:text-2xl lg:text-4xl font-bold leading-tight">
            {user?.name ? (
              <>{greeting} {user.name}</>
            ) : (
              <span className="flex items-center gap-2 sm:gap-3">
                <span className="inline-block h-[1.75rem] sm:h-[2rem] lg:h-[2.5rem] w-[120px] sm:w-[160px] lg:w-[200px] bg-white/20 rounded animate-pulse" />
                <span className="inline-block h-[1.75rem] sm:h-[2rem] lg:h-[2.5rem] w-[100px] sm:w-[140px] lg:w-[180px] bg-white/20 rounded animate-pulse" />
              </span>
            )}
          </h2>
          <p className="text-blue-100 sm:text-blue-300 font-normal mt-2 text-sm sm:text-lg lg:text-xl leading-relaxed">
            Welcome to your <span className="italic font-bold">ProSuite</span> activity feed
          </p>
          <div className="absolute -right-1 sm:-right-2 top-2 sm:top-4">
            <Image
              src="/prosuite-logo.svg"
              alt="ProSuite"
              width={180}
              height={180}
              className="w-[60px] sm:w-[120px] lg:w-[180px] opacity-30 sm:opacity-50"
            />
          </div>
        </div>

      {/* Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <PageSectionHeader
            title="Activity"
            subTitle="Recent ProSuite events, actions, and incidents"
            showImportExport={false}
            removePadding={true}
          />
          <div className="space-y-3 mt-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full">
                  <span className="text-white text-lg">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <PageSectionHeader
            title="Tasks"
            subTitle="Outstanding ProSuite tasks and todos"
            showImportExport={false}
            customAction={{
              action: () => console.log('Add task'),
            }}
            removePadding={true}
          />
          
          <div className="flex items-center gap-3 mt-4 mb-4">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1">
              📝 New Tasks <span className="text-gray-500">3</span>
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1">
              🔄 In Progress <span className="text-gray-500">3</span>
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1">
              ✓ Completed <span className="text-gray-500">2</span>
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-900 flex-1">{task.title}</h4>
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-pink-500 text-white text-xs font-semibold rounded-full ml-2">
                    JA
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">{task.desc}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    📅 {task.due}
                  </span>
                  <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${task.priorityColor} bg-opacity-10 font-medium`}>
                    � {task.priority}
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
    </AppLayout>
  );
}
