import { NextRequest, NextResponse } from 'next/server'
import { getSystemData } from '@/lib/chatbot/systemDataProvider'
import { generateSystemAlerts, generateReminders, fetchExternalNews } from '@/lib/chatbot/proactiveAgent'

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json()

        // Get real-time system data
        const systemData = getSystemData()

        // System context about ProSuite modules
        const systemContext = `You are Mazwi, an intelligent AI assistant for ProSuite - a comprehensive enterprise risk and compliance management system.

ProSuite Modules you have access to:
1. Risk Management - Track, assess, and mitigate organizational risks
2. Asset Management - Manage and track company assets and their lifecycle
3. Incident Management - Monitor and respond to security incidents and events
4. Compliance - Ensure regulatory compliance and manage standards
5. Governance - Manage objectives, strategies, and organizational governance
6. Audit - Conduct internal audits and manage audit universe
7. Performance - Track KPIs and organizational performance metrics

Your capabilities:
- Provide updates on risks, assets, incidents, and compliance status
- Answer questions about specific modules and their data
- Offer clarity on processes and workflows
- Send notifications and alerts about important events
- Help users navigate the system
- Provide insights and analytics with real examples

Be helpful, professional, and concise. Always relate your responses to ProSuite's context.`

        // Generate response with real system data
        const response = await generateResponse(message, systemContext, systemData)

        return NextResponse.json({ 
            response: response.text,
            richContent: response.richContent 
        })
    } catch (error) {
        console.error('Mazwi API Error:', error)
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        )
    }
}

interface ResponseData {
    text: string
    richContent?: any[]
}

function createTextResponse(text: string): ResponseData {
    return { text }
}

async function generateResponse(message: string, systemContext: string, systemData: any): Promise<ResponseData> {
    const lowerMessage = message.toLowerCase()

    // Alerts and notifications
    if (lowerMessage.includes('alert') || lowerMessage.includes('notification') || lowerMessage.includes('warning')) {
        const alerts = generateSystemAlerts()
        
        if (alerts.length === 0) {
            return createTextResponse("Good news! There are currently no critical alerts or warnings in the system. Everything is running smoothly.")
        }

        let response = `**System Alerts (${alerts.length}):**\n\n`
        alerts.forEach((alert, index) => {
            const emoji = alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '⚠️' : 'ℹ️'
            response += `${index + 1}. ${emoji} **${alert.title}** (${alert.module})\n`
            response += `   ${alert.message}\n\n`
        })

        const richContent = alerts.filter(a => a.actionPath).map(alert => ({
            type: 'navigation',
            data: {
                title: `View ${alert.module}`,
                description: alert.title,
                path: alert.actionPath
            }
        }))

        return { text: response, richContent }
    }

    // Reminders
    if (lowerMessage.includes('reminder') || lowerMessage.includes('upcoming') || lowerMessage.includes('due')) {
        const reminders = generateReminders()
        
        if (reminders.length === 0) {
            return createTextResponse("You have no upcoming reminders at the moment.")
        }

        let response = `**Upcoming Reminders (${reminders.length}):**\n\n`
        reminders.forEach((reminder, index) => {
            const priorityEmoji = reminder.priority === 'high' ? '🔴' : reminder.priority === 'medium' ? '🟡' : '🟢'
            response += `${index + 1}. ${priorityEmoji} **${reminder.title}**\n`
            response += `   ${reminder.description}\n`
            response += `   Due: ${reminder.dueDate.toLocaleDateString()}\n`
            response += `   Module: ${reminder.module}\n\n`
        })

        return createTextResponse(response)
    }

    // External news and trends
    if (lowerMessage.includes('news') || lowerMessage.includes('trend') || lowerMessage.includes('industry') || lowerMessage.includes('external')) {
        const news = await fetchExternalNews()
        
        let response = `**Industry News & Trends:**\n\n`
        response += `I've gathered relevant news that may impact your ProSuite operations:\n\n`
        
        news.forEach((item, index) => {
            response += `${index + 1}. **${item.title}**\n`
            response += `   ${item.summary}\n`
            response += `   📰 Source: ${item.source}\n`
            response += `   💡 Relevance: ${item.relevance}\n\n`
        })

        const richContent = news.map(item => ({
            type: 'link',
            data: {
                text: `Read more: ${item.title}`,
                url: item.url
            }
        }))

        return { text: response, richContent }
    }

    // Risk-related queries
    if (lowerMessage.includes('risk')) {
        if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
            const { risks } = systemData
            let response = `You currently have **${risks.total} total risks** in the system:\n`
            response += `• Active: ${risks.active}\n`
            response += `• Critical: ${risks.critical}\n`
            response += `• High: ${risks.high}\n`
            response += `• Medium: ${risks.medium}\n`
            response += `• Low: ${risks.low}\n\n`
            
            if (risks.examples.length > 0) {
                response += `**Recent Examples:**\n`
                risks.examples.forEach((risk: any, index: number) => {
                    response += `${index + 1}. "${risk.title}" - ${risk.severity} severity (${risk.status})\n`
                })
            }
            
            return {
                text: response,
                richContent: [
                    {
                        type: 'chart',
                        data: {
                            chartType: 'pie',
                            title: 'Risk Distribution by Severity',
                            data: [
                                { name: 'Critical', value: risks.critical, color: '#DC2626' },
                                { name: 'High', value: risks.high, color: '#F59E0B' },
                                { name: 'Medium', value: risks.medium, color: '#3B82F6' },
                                { name: 'Low', value: risks.low, color: '#10B981' }
                            ]
                        }
                    },
                    {
                        type: 'navigation',
                        data: {
                            title: 'View All Risks',
                            description: 'Go to Risk Management dashboard',
                            path: '/risk-management/risks'
                        }
                    }
                ]
            }
        }
        if (lowerMessage.includes('high') || lowerMessage.includes('critical')) {
            const { risks } = systemData
            let response = `**Critical & High Risks Overview:**\n`
            response += `• Critical risks: ${risks.critical}\n`
            response += `• High risks: ${risks.high}\n\n`
            
            if (risks.critical > 0 || risks.high > 0) {
                response += `I recommend immediate attention to these high-priority risks. Would you like specific details about any of them?`
            } else {
                response += `Good news! No critical or high-severity risks are currently flagged. Keep monitoring regularly.`
            }
            
            return createTextResponse(response)
        }
        if (lowerMessage.includes('example') || lowerMessage.includes('show me')) {
            const { risks } = systemData
            if (risks.examples.length > 0) {
                let response = `**Current Risks in the System:**\n\n`
                risks.examples.forEach((risk: any, index: number) => {
                    response += `${index + 1}. **${risk.title}**\n`
                    response += `   - Severity: ${risk.severity}\n`
                    response += `   - Status: ${risk.status}\n\n`
                })
                return createTextResponse(response)
            }
            return createTextResponse("No risk examples available at the moment.")
        }
        return createTextResponse(`I can help you with risk management. You have ${systemData.risks.total} risks in the system. Ask me about risk counts, severity levels, specific examples, or mitigation strategies.`)
    }

    // Asset-related queries
    if (lowerMessage.includes('asset')) {
        if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
            const { assets } = systemData
            let response = `You currently have **${assets.total} total assets** registered:\n`
            response += `• Active: ${assets.active}\n`
            response += `• Inactive: ${assets.inactive}\n\n`
            
            if (assets.examples.length > 0) {
                response += `**Recent Examples:**\n`
                assets.examples.forEach((asset: any, index: number) => {
                    response += `${index + 1}. "${asset.name}" - ${asset.type} (${asset.status})\n`
                })
            }
            
            return createTextResponse(response)
        }
        if (lowerMessage.includes('example') || lowerMessage.includes('show me')) {
            const { assets } = systemData
            if (assets.examples.length > 0) {
                let response = `**Current Assets in the System:**\n\n`
                assets.examples.forEach((asset: any, index: number) => {
                    response += `${index + 1}. **${asset.name}**\n`
                    response += `   - Type: ${asset.type}\n`
                    response += `   - Status: ${asset.status}\n\n`
                })
                return createTextResponse(response)
            }
            return createTextResponse("No asset examples available at the moment.")
        }
        return createTextResponse(`I can assist with asset management. You have ${systemData.assets.total} assets in the system (${systemData.assets.active} active). Ask me about asset counts, status, or specific examples.`)
    }

    // Incident-related queries
    if (lowerMessage.includes('incident')) {
        if (lowerMessage.includes('open') || lowerMessage.includes('active') || lowerMessage.includes('how many')) {
            const { incidents } = systemData
            let response = `**Incident Status Overview:**\n`
            response += `• Total incidents: ${incidents.total}\n`
            response += `• Open: ${incidents.open}\n`
            response += `• Closed: ${incidents.closed}\n`
            response += `• Critical: ${incidents.critical}\n\n`
            
            if (incidents.examples.length > 0) {
                response += `**Recent Incidents:**\n`
                incidents.examples.forEach((incident: any, index: number) => {
                    response += `${index + 1}. "${incident.title}" - ${incident.severity} (${incident.status})\n`
                })
            }
            
            return createTextResponse(response)
        }
        if (lowerMessage.includes('example') || lowerMessage.includes('show me')) {
            const { incidents } = systemData
            if (incidents.examples.length > 0) {
                let response = `**Current Incidents:**\n\n`
                incidents.examples.forEach((incident: any, index: number) => {
                    response += `${index + 1}. **${incident.title}**\n`
                    response += `   - Severity: ${incident.severity}\n`
                    response += `   - Status: ${incident.status}\n\n`
                })
                return createTextResponse(response)
            }
            return createTextResponse("No incident examples available at the moment.")
        }
        return createTextResponse(`I can help with incident management. You have ${systemData.incidents.total} incidents (${systemData.incidents.open} open). Ask me about incident details, severity levels, or specific examples.`)
    }

    // Compliance-related queries
    if (lowerMessage.includes('compliance')) {
        if (lowerMessage.includes('score') || lowerMessage.includes('status')) {
            const { compliance } = systemData
            let response = `**Compliance Status:**\n`
            response += `• Overall Score: ${compliance.score}%\n`
            response += `• Total Standards: ${compliance.totalStandards}\n`
            response += `• Compliant: ${compliance.compliant}\n`
            response += `• Non-Compliant: ${compliance.nonCompliant}\n\n`
            
            if (compliance.examples.length > 0) {
                response += `**Standards Overview:**\n`
                compliance.examples.forEach((std: any, index: number) => {
                    response += `${index + 1}. ${std.standard} - ${std.status} (${std.score}%)\n`
                })
            }
            
            return createTextResponse(response)
        }
        return createTextResponse(`I can assist with compliance queries. Your current compliance score is ${systemData.compliance.score}%. Ask me about compliance scores, regulatory requirements, or specific standards.`)
    }

    // Dashboard and overview queries
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview') || lowerMessage.includes('summary')) {
        const { modules, users, licenses, recentActivity, risks, assets, incidents } = systemData
        let response = `**ProSuite System Overview:**\n\n`
        response += `📊 **Modules:** ${modules.active}/${modules.total} active\n`
        response += `👥 **Users:** ${users.total} (${users.active} active)\n`
        response += `🔑 **Licenses:** ${licenses.used}/${licenses.total} used\n`
        response += `⚠️ **Risks:** ${risks.total} (${risks.critical} critical)\n`
        response += `📦 **Assets:** ${assets.total} (${assets.active} active)\n`
        response += `🚨 **Incidents:** ${incidents.open} open\n`
        response += `📈 **Compliance:** ${systemData.compliance.score}%\n\n`
        response += `**Recent Activity:** ${recentActivity.last24Hours} actions in last 24 hours\n\n`
        
        if (recentActivity.examples.length > 0) {
            response += `**Latest Actions:**\n`
            recentActivity.examples.forEach((activity: any, index: number) => {
                response += `${index + 1}. ${activity.action} (${activity.module}) - ${activity.timestamp}\n`
            })
        }
        
        return createTextResponse(response)
    }

    // Module-related queries
    if (lowerMessage.includes('module')) {
        const { modules } = systemData
        let response = `**ProSuite Modules Status:**\n`
        response += `Total: ${modules.total} | Active: ${modules.active} | Pending: ${modules.pending} | Disabled: ${modules.disabled}\n\n`
        
        modules.list.forEach((module: any, index: number) => {
            const statusEmoji = module.status === 'Active' ? '✅' : module.status === 'Pending' ? '⏳' : '❌'
            response += `${statusEmoji} ${module.name} - ${module.status}\n`
        })
        
        response += `\nWhich module would you like to know more about?`
        return createTextResponse(response)
    }

    // User and license queries with chart support
    if (lowerMessage.includes('user') || lowerMessage.includes('license')) {
        const { users, licenses } = systemData
        let response = `**User & License Overview:**\n\n`
        response += `👥 **Users:**\n`
        response += `• Total: ${users.total}\n`
        response += `• Active: ${users.active}\n`
        response += `• Inactive: ${users.inactive}\n\n`
        response += `🔑 **Licenses:**\n`
        response += `• Total: ${licenses.total}\n`
        response += `• Used: ${licenses.used}\n`
        response += `• Available: ${licenses.available}\n\n`
        response += `License utilization: ${Math.round((licenses.used / licenses.total) * 100)}%`
        
        // Add charts if requested
        if (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('visual')) {
            const richContent = [
                {
                    type: 'chart',
                    data: {
                        chartType: 'pie',
                        title: 'User Distribution',
                        data: [
                            { name: 'Active Users', value: users.active, color: '#10B981' },
                            { name: 'Inactive Users', value: users.inactive, color: '#EF4444' }
                        ]
                    }
                },
                {
                    type: 'chart',
                    data: {
                        chartType: 'bar',
                        title: 'License Usage',
                        data: [
                            { name: 'Used', value: licenses.used },
                            { name: 'Available', value: licenses.available }
                        ]
                    }
                }
            ]
            return { text: response, richContent }
        }
        
        return createTextResponse(response)
    }

    // Help and navigation
    if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('navigate')) {
        return createTextResponse("I'm here to help! I can assist you with:\n• Checking status of risks, assets, and incidents\n• Viewing compliance scores and audit logs\n• Understanding module data and analytics\n• Navigating the ProSuite system\n\nWhat specific help do you need?")
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return createTextResponse("Hello! I'm Mazwi, your ProSuite AI assistant. I'm here to help you manage risks, assets, incidents, compliance, and more. What can I help you with today?")
    }

    // Default response
    return createTextResponse("I understand you're asking about ProSuite. I can help you with information about risks, assets, incidents, compliance, modules, users, and system analytics. Could you please be more specific about what you'd like to know?")
}
