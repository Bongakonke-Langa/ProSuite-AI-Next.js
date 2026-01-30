export interface Task {
    id: number
    title: string
    description: string
    status: 'New' | 'In Progress' | 'Completed'
    priority: 'Low' | 'Medium' | 'High'
    due_date: string
    category?: string
    assigned_to?: string
    created_at?: string
    updated_at?: string
    subtasks_completed?: number
    subtasks_total?: number
}

export interface CreateTaskData {
    title: string
    description: string
    status?: 'New' | 'In Progress' | 'Completed'
    priority?: 'Low' | 'Medium' | 'High'
    due_date?: string
    category?: string
    assigned_to?: string
}

export interface UpdateTaskData {
    title?: string
    description?: string
    status?: 'New' | 'In Progress' | 'Completed'
    priority?: 'Low' | 'Medium' | 'High'
    due_date?: string
    category?: string
    assigned_to?: string
}
