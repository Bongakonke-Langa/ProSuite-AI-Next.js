'use client'

import { useState, useEffect } from 'react'

export interface User {
    id: number
    name: string
    email: string
    roles?: any[]
    modules?: any[]
}

export default function useUserManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const mockUsers: User[] = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    roles: [{ name: 'Admin' }, { name: 'Risk Manager' }],
                    modules: [{ name: 'Risk Management' }, { name: 'Compliance' }]
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    roles: [{ name: 'User' }],
                    modules: [{ name: 'Asset Management' }]
                },
                {
                    id: 3,
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    roles: [{ name: 'Admin' }],
                    modules: [{ name: 'Risk Management' }, { name: 'Asset Management' }, { name: 'Compliance' }]
                },
                {
                    id: 4,
                    name: 'Alice Williams',
                    email: 'alice@example.com',
                    roles: [{ name: 'Compliance Officer' }],
                    modules: [{ name: 'Compliance' }]
                },
                {
                    id: 5,
                    name: 'Charlie Brown',
                    email: 'charlie@example.com',
                    roles: [{ name: 'User' }, { name: 'Asset Manager' }],
                    modules: [{ name: 'Asset Management' }, { name: 'Risk Management' }]
                },
            ]
            
            setUsers(mockUsers)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        users,
        loading,
        refetch: fetchUsers
    }
}
