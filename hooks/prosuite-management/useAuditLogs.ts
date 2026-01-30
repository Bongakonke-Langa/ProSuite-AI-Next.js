'use client'

import { useState, useEffect } from 'react'

export interface AuditLog {
    id: number
    action_type: string
    action_outcome: string
    created_at: string
    user_name?: string
    description?: string
}

export default function useAuditLogs() {
    const [adminAuditLogs, setAdminAuditLogs] = useState<AuditLog[]>([])
    const [adminAuditLogsLoading, setAdminAuditLogsLoading] = useState(true)

    useEffect(() => {
        fetchAuditLogs()
    }, [])

    const fetchAuditLogs = async () => {
        setAdminAuditLogsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const mockLogs: AuditLog[] = [
                {
                    id: 1,
                    action_type: 'User Login',
                    action_outcome: 'success',
                    created_at: new Date().toISOString(),
                    user_name: 'John Doe',
                    description: 'User logged in successfully'
                },
                {
                    id: 2,
                    action_type: 'Module Access',
                    action_outcome: 'success',
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    user_name: 'Jane Smith',
                    description: 'Accessed Risk Management module'
                },
                {
                    id: 3,
                    action_type: 'User Creation',
                    action_outcome: 'success',
                    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    user_name: 'Admin',
                    description: 'Created new user account'
                },
                {
                    id: 4,
                    action_type: 'Permission Change',
                    action_outcome: 'success',
                    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                    user_name: 'Admin',
                    description: 'Updated user permissions'
                },
                {
                    id: 5,
                    action_type: 'User Login',
                    action_outcome: 'failed',
                    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    user_name: 'Unknown',
                    description: 'Failed login attempt'
                },
                {
                    id: 6,
                    action_type: 'Module Access',
                    action_outcome: 'success',
                    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
                    user_name: 'Bob Johnson',
                    description: 'Accessed Compliance module'
                },
                {
                    id: 7,
                    action_type: 'Data Export',
                    action_outcome: 'success',
                    created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
                    user_name: 'Alice Williams',
                    description: 'Exported compliance report'
                },
                {
                    id: 8,
                    action_type: 'User Login',
                    action_outcome: 'success',
                    created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
                    user_name: 'Charlie Brown',
                    description: 'User logged in successfully'
                },
            ]
            
            setAdminAuditLogs(mockLogs)
        } catch (error) {
            console.error('Error fetching audit logs:', error)
        } finally {
            setAdminAuditLogsLoading(false)
        }
    }

    return {
        adminAuditLogs,
        adminAuditLogsLoading,
        refetch: fetchAuditLogs
    }
}
