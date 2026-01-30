'use client'

import { useState, useEffect } from 'react'
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task'

export default function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        setLoading(true)
        try {
            // Simulated API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Mock data
            const mockTasks: Task[] = [
                {
                    id: 1,
                    title: 'Plan Q4 Platform Update',
                    description: 'Coordinate with development team on feature releases.',
                    status: 'New',
                    priority: 'Medium',
                    due_date: '2025-01-26',
                    category: 'General',
                    assigned_to: 'JA',
                    subtasks_completed: 0,
                    subtasks_total: 3,
                },
                {
                    id: 2,
                    title: 'Conduct Quarterly User Access Review',
                    description: 'Verify roles and permissions for all active users.',
                    status: 'New',
                    priority: 'High',
                    due_date: '2026-01-19',
                    category: 'Governance Management',
                    assigned_to: 'JA',
                    subtasks_completed: 0,
                    subtasks_total: 4,
                },
            ]
            
            setTasks(mockTasks)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    const createTask = async (data: CreateTaskData) => {
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 300))
            
            const newTask: Task = {
                id: tasks.length + 1,
                ...data,
                status: data.status || 'New',
                priority: data.priority || 'Medium',
                due_date: data.due_date || '',
            }
            
            setTasks([...tasks, newTask])
            setValidationErrors({})
            return newTask
        } catch (error) {
            console.error('Error creating task:', error)
            return null
        }
    }

    const updateTask = async (taskId: number, data: UpdateTaskData) => {
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 300))
            
            setTasks(tasks.map(task => 
                task.id === taskId ? { ...task, ...data } : task
            ))
            setValidationErrors({})
            return true
        } catch (error) {
            console.error('Error updating task:', error)
            return null
        }
    }

    const updateTaskStatus = async (taskId: number, newStatus: 'In Progress' | 'Completed') => {
        try {
            await updateTask(taskId, { status: newStatus })
        } catch (error) {
            console.error('Error updating task status:', error)
        }
    }

    const refetch = async (params?: any, force?: boolean) => {
        await fetchTasks()
    }

    return {
        tasks,
        loading,
        createTask,
        updateTask,
        updateTaskStatus,
        validationErrors,
        refetch,
    }
}
