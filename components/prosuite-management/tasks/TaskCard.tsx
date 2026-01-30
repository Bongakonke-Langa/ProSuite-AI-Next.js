'use client'

import { Task } from '@/types/task'
import { Calendar, Flag } from 'lucide-react'

interface TaskCardProps {
    task: Task
    onClick: () => void
    onStatusChange: (taskId: number, newStatus: 'In Progress' | 'Completed') => void
}

export default function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'text-red-600 bg-red-50'
            case 'Medium':
                return 'text-orange-600 bg-orange-50'
            case 'Low':
                return 'text-blue-600 bg-blue-50'
            default:
                return 'text-gray-600 bg-gray-50'
        }
    }

    return (
        <div
            onClick={onClick}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm text-gray-900 flex-1">{task.title}</h4>
                {task.assigned_to && (
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-pink-500 text-white text-xs font-semibold rounded-full ml-2">
                        {task.assigned_to.substring(0, 2).toUpperCase()}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                {task.due_date && (
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                )}
                <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${getPriorityColor(task.priority)} font-medium`}>
                    <Flag className="w-3 h-3" />
                    {task.priority} Priority
                </span>
            </div>
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{task.category || 'General'}</span>
                {task.subtasks_total && task.subtasks_total > 0 && (
                    <span className="text-gray-400">
                        {task.subtasks_completed || 0}/{task.subtasks_total} completed
                    </span>
                )}
            </div>
        </div>
    )
}
