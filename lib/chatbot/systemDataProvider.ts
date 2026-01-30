import { prosuiteData } from '@/lib/prosuite-data'

export interface SystemData {
    risks: {
        total: number
        active: number
        critical: number
        high: number
        medium: number
        low: number
        examples: Array<{
            id: number
            title: string
            severity: string
            status: string
        }>
    }
    assets: {
        total: number
        active: number
        inactive: number
        examples: Array<{
            id: number
            name: string
            type: string
            status: string
        }>
    }
    incidents: {
        total: number
        open: number
        closed: number
        critical: number
        examples: Array<{
            id: number
            title: string
            severity: string
            status: string
        }>
    }
    compliance: {
        score: number
        totalStandards: number
        compliant: number
        nonCompliant: number
        examples: Array<{
            standard: string
            status: string
            score: number
        }>
    }
    modules: {
        total: number
        active: number
        pending: number
        disabled: number
        list: Array<{
            name: string
            status: string
        }>
    }
    users: {
        total: number
        active: number
        inactive: number
    }
    licenses: {
        total: number
        used: number
        available: number
    }
    recentActivity: {
        count: number
        last24Hours: number
        examples: Array<{
            action: string
            module: string
            timestamp: string
        }>
    }
}

export function getSystemData(): SystemData {
    // Get real data from prosuiteData
    const risks = prosuiteData.risk?.risks || []
    const assets = prosuiteData.asset?.assets || []
    const incidents = prosuiteData.incident?.incidents || []

    // Calculate risk statistics
    const activeRisks = risks.filter((r: any) => r.status_id !== 4)
    const risksBySeverity = {
        critical: risks.filter((r: any) => r.severity_id === 4).length,
        high: risks.filter((r: any) => r.severity_id === 3).length,
        medium: risks.filter((r: any) => r.severity_id === 2).length,
        low: risks.filter((r: any) => r.severity_id === 1).length,
    }

    // Calculate incident statistics
    const openIncidents = incidents.filter((i: any) => i.status_id !== 4)
    const criticalIncidents = incidents.filter((i: any) => i.severity_id === 4)

    return {
        risks: {
            total: risks.length,
            active: activeRisks.length,
            critical: risksBySeverity.critical,
            high: risksBySeverity.high,
            medium: risksBySeverity.medium,
            low: risksBySeverity.low,
            examples: risks.slice(0, 3).map((r: any) => ({
                id: r.id,
                title: r.title || r.name || 'Untitled Risk',
                severity: getSeverityLabel(r.severity_id),
                status: getStatusLabel(r.status_id)
            }))
        },
        assets: {
            total: assets.length,
            active: assets.filter((a: any) => a.status_id === 1).length,
            inactive: assets.filter((a: any) => a.status_id !== 1).length,
            examples: assets.slice(0, 3).map((a: any) => ({
                id: a.id,
                name: a.name || a.title || 'Untitled Asset',
                type: a.type || 'General',
                status: getStatusLabel(a.status_id)
            }))
        },
        incidents: {
            total: incidents.length,
            open: openIncidents.length,
            closed: incidents.length - openIncidents.length,
            critical: criticalIncidents.length,
            examples: incidents.slice(0, 3).map((i: any) => ({
                id: i.id,
                title: i.title || i.name || 'Untitled Incident',
                severity: getSeverityLabel(i.severity_id),
                status: getStatusLabel(i.status_id)
            }))
        },
        compliance: {
            score: 78.5,
            totalStandards: 10,
            compliant: 8,
            nonCompliant: 2,
            examples: [
                { standard: 'ISO 27001', status: 'Compliant', score: 95 },
                { standard: 'GDPR', status: 'Compliant', score: 88 },
                { standard: 'SOC 2', status: 'In Progress', score: 65 }
            ]
        },
        modules: {
            total: 7,
            active: 5,
            pending: 1,
            disabled: 1,
            list: [
                { name: 'Risk Management', status: 'Active' },
                { name: 'Asset Management', status: 'Active' },
                { name: 'Incident Management', status: 'Pending' },
                { name: 'Compliance', status: 'Active' },
                { name: 'Governance', status: 'Active' },
                { name: 'Audit', status: 'Active' },
                { name: 'Performance', status: 'Disabled' }
            ]
        },
        users: {
            total: 5,
            active: 4,
            inactive: 1
        },
        licenses: {
            total: 7,
            used: 3,
            available: 4
        },
        recentActivity: {
            count: 24,
            last24Hours: 8,
            examples: [
                { action: 'Risk assessment updated', module: 'Risk', timestamp: '2 hours ago' },
                { action: 'New asset registered', module: 'Asset', timestamp: '5 hours ago' },
                { action: 'Incident resolved', module: 'Incident', timestamp: '1 day ago' }
            ]
        }
    }
}

function getSeverityLabel(severityId: number): string {
    const severityMap: { [key: number]: string } = {
        1: 'Low',
        2: 'Medium',
        3: 'High',
        4: 'Critical'
    }
    return severityMap[severityId] || 'Unknown'
}

function getStatusLabel(statusId: number): string {
    const statusMap: { [key: number]: string } = {
        1: 'Active',
        2: 'In Progress',
        3: 'Pending',
        4: 'Closed'
    }
    return statusMap[statusId] || 'Unknown'
}
