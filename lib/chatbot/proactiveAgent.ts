import { getSystemData } from './systemDataProvider'

export interface Alert {
    id: string
    type: 'critical' | 'warning' | 'info'
    module: string
    title: string
    message: string
    timestamp: Date
    actionRequired: boolean
    actionPath?: string
}

export interface Reminder {
    id: string
    title: string
    description: string
    dueDate: Date
    priority: 'high' | 'medium' | 'low'
    module: string
    completed: boolean
}

export interface ExternalNewsItem {
    id: string
    title: string
    summary: string
    source: string
    relevance: string
    url: string
    publishedAt: Date
}

/**
 * Monitors system for critical events and generates alerts
 */
export function generateSystemAlerts(): Alert[] {
    const systemData = getSystemData()
    const alerts: Alert[] = []

    // Check for critical risks
    if (systemData.risks.critical > 0) {
        alerts.push({
            id: `alert-risk-critical-${Date.now()}`,
            type: 'critical',
            module: 'Risk Management',
            title: `${systemData.risks.critical} Critical Risk${systemData.risks.critical > 1 ? 's' : ''} Detected`,
            message: `You have ${systemData.risks.critical} critical severity risk(s) that require immediate attention.`,
            timestamp: new Date(),
            actionRequired: true,
            actionPath: '/risk-management/risks'
        })
    }

    // Check for high risks
    if (systemData.risks.high > 3) {
        alerts.push({
            id: `alert-risk-high-${Date.now()}`,
            type: 'warning',
            module: 'Risk Management',
            title: `${systemData.risks.high} High Priority Risks`,
            message: `There are ${systemData.risks.high} high-severity risks that need review.`,
            timestamp: new Date(),
            actionRequired: true,
            actionPath: '/risk-management/risks'
        })
    }

    // Check for critical incidents
    if (systemData.incidents.critical > 0) {
        alerts.push({
            id: `alert-incident-critical-${Date.now()}`,
            type: 'critical',
            module: 'Incident Management',
            title: `${systemData.incidents.critical} Critical Incident${systemData.incidents.critical > 1 ? 's' : ''}`,
            message: `You have ${systemData.incidents.critical} critical incident(s) requiring immediate response.`,
            timestamp: new Date(),
            actionRequired: true,
            actionPath: '/incident-management/incidents'
        })
    }

    // Check for open incidents
    if (systemData.incidents.open > 5) {
        alerts.push({
            id: `alert-incident-open-${Date.now()}`,
            type: 'warning',
            module: 'Incident Management',
            title: `${systemData.incidents.open} Open Incidents`,
            message: `There are ${systemData.incidents.open} open incidents. Consider reviewing and prioritizing them.`,
            timestamp: new Date(),
            actionRequired: false,
            actionPath: '/incident-management/incidents'
        })
    }

    // Check compliance score
    if (systemData.compliance.score < 70) {
        alerts.push({
            id: `alert-compliance-low-${Date.now()}`,
            type: 'warning',
            module: 'Compliance',
            title: 'Low Compliance Score',
            message: `Your compliance score is ${systemData.compliance.score}%, which is below the recommended threshold of 70%.`,
            timestamp: new Date(),
            actionRequired: true,
            actionPath: '/compliance/dashboard'
        })
    }

    // Check license utilization
    const licenseUtilization = (systemData.licenses.used / systemData.licenses.total) * 100
    if (licenseUtilization > 90) {
        alerts.push({
            id: `alert-license-high-${Date.now()}`,
            type: 'warning',
            module: 'License Management',
            title: 'High License Utilization',
            message: `License utilization is at ${Math.round(licenseUtilization)}%. Consider acquiring additional licenses.`,
            timestamp: new Date(),
            actionRequired: false,
            actionPath: '/prosuite-management/dashboard'
        })
    }

    return alerts
}

/**
 * Generates reminders based on system state
 */
export function generateReminders(): Reminder[] {
    const systemData = getSystemData()
    const reminders: Reminder[] = []

    // Risk assessment reminders
    if (systemData.risks.total > 0) {
        reminders.push({
            id: `reminder-risk-review-${Date.now()}`,
            title: 'Quarterly Risk Assessment Review',
            description: 'Review and update all risk assessments for the current quarter',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            priority: 'high',
            module: 'Risk Management',
            completed: false
        })
    }

    // Compliance audit reminder
    if (systemData.compliance.nonCompliant > 0) {
        reminders.push({
            id: `reminder-compliance-${Date.now()}`,
            title: 'Address Non-Compliant Standards',
            description: `${systemData.compliance.nonCompliant} standard(s) are non-compliant and need attention`,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            priority: 'high',
            module: 'Compliance',
            completed: false
        })
    }

    // Asset maintenance reminder
    if (systemData.assets.total > 0) {
        reminders.push({
            id: `reminder-asset-review-${Date.now()}`,
            title: 'Asset Inventory Review',
            description: 'Conduct quarterly review of all registered assets',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            priority: 'medium',
            module: 'Asset Management',
            completed: false
        })
    }

    return reminders
}

/**
 * Fetches relevant external news and trends
 * In production, this would call actual news APIs
 */
export async function fetchExternalNews(topics: string[] = ['cybersecurity', 'compliance', 'risk management']): Promise<ExternalNewsItem[]> {
    // Mock implementation - in production, integrate with news APIs like NewsAPI, Google News, etc.
    const mockNews: ExternalNewsItem[] = [
        {
            id: 'news-1',
            title: 'New Cybersecurity Regulations Announced',
            summary: 'Regulatory bodies have announced new cybersecurity compliance requirements effective Q2 2026.',
            source: 'Security Weekly',
            relevance: 'May impact your compliance score and require policy updates',
            url: 'https://example.com/news/cybersecurity-regulations',
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'news-2',
            title: 'Rising Trend in Data Breach Incidents',
            summary: 'Industry reports show a 35% increase in data breach incidents in the past quarter.',
            source: 'Risk Management Today',
            relevance: 'Consider reviewing your data protection risks and incident response plans',
            url: 'https://example.com/news/data-breach-trends',
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'news-3',
            title: 'Best Practices for Asset Management in 2026',
            summary: 'New guidelines released for effective enterprise asset management and tracking.',
            source: 'Asset Management Journal',
            relevance: 'Could help optimize your current asset management processes',
            url: 'https://example.com/news/asset-management-2026',
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
    ]

    return mockNews
}

/**
 * Generates a proactive message for the chatbot based on system state
 */
export function generateProactiveMessage(): string | null {
    const alerts = generateSystemAlerts()
    const reminders = generateReminders()

    if (alerts.length === 0 && reminders.length === 0) {
        return null
    }

    let message = "👋 **Proactive Update from Mazwi:**\n\n"

    if (alerts.length > 0) {
        message += "**🚨 Alerts:**\n"
        alerts.slice(0, 3).forEach((alert, index) => {
            const emoji = alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '⚠️' : 'ℹ️'
            message += `${index + 1}. ${emoji} ${alert.title}\n   ${alert.message}\n\n`
        })
    }

    if (reminders.length > 0) {
        message += "**📅 Upcoming Reminders:**\n"
        reminders.slice(0, 2).forEach((reminder, index) => {
            message += `${index + 1}. ${reminder.title} (Due: ${reminder.dueDate.toLocaleDateString()})\n`
        })
    }

    message += "\nWould you like more details on any of these items?"

    return message
}
