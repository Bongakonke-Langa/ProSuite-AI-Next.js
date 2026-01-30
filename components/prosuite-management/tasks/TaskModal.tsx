'use client'

import { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateTaskData | UpdateTaskData) => void
    task: Task | null
    mode: 'create' | 'edit' | 'view'
    validationErrors?: Record<string, string>
    onModeChange: (mode: 'edit' | 'view') => void
}

export default function TaskModal({
    isOpen,
    onClose,
    onSubmit,
    task,
    mode,
    validationErrors = {},
    onModeChange,
}: TaskModalProps) {
    const [formData, setFormData] = useState<CreateTaskData>({
        title: '',
        description: '',
        status: 'New',
        priority: 'Medium',
        due_date: '',
        category: '',
        assigned_to: '',
    })

    useEffect(() => {
        if (task && (mode === 'edit' || mode === 'view')) {
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                due_date: task.due_date,
                category: task.category || '',
                assigned_to: task.assigned_to || '',
            })
        } else if (mode === 'create') {
            setFormData({
                title: '',
                description: '',
                status: 'New',
                priority: 'Medium',
                due_date: '',
                category: '',
                assigned_to: '',
            })
        }
    }, [task, mode])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {mode === 'create' ? 'Create Task' : mode === 'edit' ? 'Edit Task' : 'View Task'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            disabled={mode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                        {validationErrors.title && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={mode === 'view'}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                disabled={mode === 'view'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                disabled={mode === 'view'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                disabled={mode === 'view'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                disabled={mode === 'view'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        {mode === 'view' ? (
                            <Button type="button" onClick={() => onModeChange('edit')}>
                                Edit
                            </Button>
                        ) : (
                            <Button type="submit">
                                {mode === 'create' ? 'Create' : 'Save'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
