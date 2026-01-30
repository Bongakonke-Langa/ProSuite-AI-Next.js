'use client'

import { useState, useEffect } from 'react'

export interface License {
    id: number
    name: string
    subscriptions?: any[]
}

export function useLicenses(includeTenant: boolean = false) {
    const [licenses, setLicenses] = useState<License[]>([])
    const [tenantLicenses, setTenantLicenses] = useState<License[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLicenses()
    }, [])

    const fetchLicenses = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const mockLicenses: License[] = [
                {
                    id: 1,
                    name: 'Risk Management License',
                    subscriptions: [
                        {
                            module: {
                                module_license: {
                                    license: { name: 'Risk Management' },
                                    total_user_limit: 50,
                                    user_count: 35,
                                    total_admin_count: 5,
                                    userRequest: { status: 'Approved' }
                                }
                            },
                            status: { name: 'Active' }
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'Asset Management License',
                    subscriptions: [
                        {
                            module: {
                                module_license: {
                                    license: { name: 'Asset Management' },
                                    total_user_limit: 30,
                                    user_count: 28,
                                    total_admin_count: 3,
                                    userRequest: { status: 'Approved' }
                                }
                            },
                            status: { name: 'Active' }
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'Compliance License',
                    subscriptions: [
                        {
                            module: {
                                module_license: {
                                    license: { name: 'Compliance' },
                                    total_user_limit: 40,
                                    user_count: 15,
                                    total_admin_count: 2,
                                    userRequest: { status: 'Pending' }
                                }
                            },
                            status: { name: 'Active' }
                        }
                    ]
                },
            ]
            
            setLicenses(mockLicenses)
            if (includeTenant) {
                setTenantLicenses(mockLicenses)
            }
        } catch (error) {
            console.error('Error fetching licenses:', error)
        } finally {
            setLoading(false)
        }
    }

    return {
        licenses,
        tenantLicenses,
        loading,
        refetch: fetchLicenses
    }
}
