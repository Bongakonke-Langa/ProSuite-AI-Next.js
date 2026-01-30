'use client'

import { useState, useEffect } from 'react'

export interface Module {
    id: number
    name: string
    description: string
    status_slug: string
    status_name: string
    is_disable: number
}

export default function useModules() {
    const [modules, setModules] = useState<Module[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchModules()
    }, [])

    const fetchModules = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const mockModules: Module[] = [
                {
                    id: 1,
                    name: 'Risk Management',
                    description: 'Manage organizational risks and mitigation strategies',
                    status_slug: 'active',
                    status_name: 'Active',
                    is_disable: 1
                },
                {
                    id: 2,
                    name: 'Asset Management',
                    description: 'Track and manage company assets',
                    status_slug: 'active',
                    status_name: 'Active',
                    is_disable: 1
                },
                {
                    id: 3,
                    name: 'Incident Management',
                    description: 'Monitor and respond to security incidents',
                    status_slug: 'pending',
                    status_name: 'Pending',
                    is_disable: 1
                },
                {
                    id: 4,
                    name: 'Compliance',
                    description: 'Ensure regulatory compliance',
                    status_slug: 'active',
                    status_name: 'Active',
                    is_disable: 1
                },
                {
                    id: 5,
                    name: 'User Management',
                    description: 'Manage users and permissions',
                    status_slug: 'active',
                    status_name: 'Active',
                    is_disable: 0
                },
            ]
            
            setModules(mockModules)
        } catch (error) {
            console.error('Error fetching modules:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        modules,
        loading,
        refetch: fetchModules
    }
}
