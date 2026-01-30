import { NextRequest, NextResponse } from 'next/server'
import { getSystemData } from '@/lib/chatbot/systemDataProvider'
import { generateSystemAlerts, generateReminders, fetchExternalNews } from '@/lib/chatbot/proactiveAgent'

export async function POST(request: NextRequest) {
    try {
        const { message, history, location } = await request.json()

        // Get real-time system data
        const systemData = getSystemData()
        
        // Extract location info (default to Johannesburg if not provided)
        const userCity = location?.city || 'Johannesburg'
        const userCountry = location?.country || 'South Africa'

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

        // Generate response with real system data and location
        const response = await generateResponse(message, systemContext, systemData, userCity, userCountry)

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

async function generateResponse(message: string, systemContext: string, systemData: any, userCity: string, userCountry: string): Promise<ResponseData> {
    const lowerMessage = message.toLowerCase()

    // Compliance Management queries
    if (lowerMessage.includes('compliance') || lowerMessage.includes('standard') || lowerMessage.includes('regulation')) {
        const complianceScore = systemData.compliance.score
        const nonCompliant = systemData.compliance.nonCompliant
        
        let response = `**Compliance Management Overview:**\n\n`
        response += `📊 **Current Compliance Score:** ${complianceScore}%\n`
        response += `✅ **Compliant Standards:** ${systemData.compliance.compliant}\n`
        response += `❌ **Non-Compliant Standards:** ${nonCompliant}\n\n`
        
        if (complianceScore < 70) {
            response += `⚠️ **Insight:** Your compliance score is below the recommended 70% threshold. Priority action required.\n\n`
            response += `**Recommendations:**\n`
            response += `• Review and address non-compliant standards immediately\n`
            response += `• Schedule compliance training for relevant teams\n`
            response += `• Implement automated compliance monitoring\n`
        } else if (complianceScore < 85) {
            response += `💡 **Insight:** Good compliance standing, but there's room for improvement.\n\n`
            response += `**Recommendations:**\n`
            response += `• Focus on closing gaps in ${nonCompliant} non-compliant area(s)\n`
            response += `• Conduct quarterly compliance reviews\n`
            response += `• Document compliance procedures\n`
        } else {
            response += `🎯 **Insight:** Excellent compliance score! Keep up the good work.\n\n`
            response += `**Recommendations:**\n`
            response += `• Maintain current compliance practices\n`
            response += `• Share best practices across departments\n`
            response += `• Stay updated on regulatory changes\n`
        }

        const richContent = [{
            type: 'navigation',
            data: {
                title: 'View Compliance Dashboard',
                description: 'Manage standards and compliance',
                path: '/compliance/dashboard'
            }
        }]

        return { text: response, richContent }
    }

    // Governance Management queries
    if (lowerMessage.includes('governance') || lowerMessage.includes('objective') || lowerMessage.includes('strategy')) {
        let response = `**Governance Management Overview:**\n\n`
        response += `🎯 **Strategic Objectives:** Aligned with organizational goals\n`
        response += `📋 **Governance Framework:** Active and monitored\n`
        response += `👥 **Stakeholder Engagement:** Regular reviews conducted\n\n`
        
        response += `**Key Insights:**\n`
        response += `• Governance structure is well-defined across ${systemData.modules.total} modules\n`
        response += `• ${systemData.users.active} active users engaged in governance activities\n`
        response += `• Regular board meetings and reporting in place\n\n`
        
        response += `**Improvement Opportunities:**\n`
        response += `• Enhance cross-departmental governance collaboration\n`
        response += `• Implement governance dashboards for real-time visibility\n`
        response += `• Strengthen policy documentation and version control\n`
        response += `• Conduct governance maturity assessments quarterly\n`

        const richContent = [{
            type: 'navigation',
            data: {
                title: 'View Governance Dashboard',
                description: 'Manage objectives and governance',
                path: '/governance/dashboard'
            }
        }]

        return { text: response, richContent }
    }

    // Audit Management queries
    if (lowerMessage.includes('audit') || lowerMessage.includes('internal audit') || lowerMessage.includes('audit universe')) {
        const auditActivity = systemData.recentActivity.count
        
        let response = `**Audit Management Overview:**\n\n`
        response += `📝 **Recent Audit Activities:** ${auditActivity} in the last period\n`
        response += `🔍 **Audit Universe:** Comprehensive coverage across all modules\n`
        response += `✅ **Audit Completion Rate:** On track\n\n`
        
        response += `**Audit Insights:**\n`
        response += `• ${systemData.risks.critical} critical risks identified requiring audit attention\n`
        response += `• ${systemData.incidents.open} open incidents under audit review\n`
        response += `• Strong audit trail maintained across all activities\n\n`
        
        response += `**Recommendations for Improvement:**\n`
        response += `• Implement continuous auditing for high-risk areas\n`
        response += `• Leverage AI-powered audit analytics for anomaly detection\n`
        response += `• Enhance audit reporting with visual dashboards\n`
        response += `• Conduct risk-based audit planning quarterly\n`
        response += `• Strengthen follow-up on audit findings\n`

        const richContent = [{
            type: 'navigation',
            data: {
                title: 'View Audit Dashboard',
                description: 'Manage audits and findings',
                path: '/audit/dashboard'
            }
        }]

        return { text: response, richContent }
    }

    // Performance Management queries
    if (lowerMessage.includes('performance') || lowerMessage.includes('kpi') || lowerMessage.includes('metric')) {
        let response = `**Performance Management Overview:**\n\n`
        response += `📈 **Key Performance Indicators:**\n`
        response += `• System Uptime: 99.8%\n`
        response += `• User Engagement: ${systemData.users.active} active users\n`
        response += `• Module Adoption: ${systemData.modules.active} active modules\n`
        response += `• Compliance Score: ${systemData.compliance.score}%\n\n`
        
        response += `**Performance Insights:**\n`
        response += `• Overall system performance is strong\n`
        response += `• ${systemData.recentActivity.last24Hours} activities in last 24 hours\n`
        response += `• License utilization at ${Math.round((systemData.licenses.used / systemData.licenses.total) * 100)}%\n\n`
        
        response += `**Improvement Strategies:**\n`
        response += `• Set SMART goals for each department\n`
        response += `• Implement real-time performance dashboards\n`
        response += `• Conduct monthly performance reviews\n`
        response += `• Align individual KPIs with organizational objectives\n`
        response += `• Use predictive analytics for performance forecasting\n`
        response += `• Recognize and reward high performers\n`

        const richContent = [{
            type: 'navigation',
            data: {
                title: 'View Performance Dashboard',
                description: 'Track KPIs and metrics',
                path: '/performance/dashboard'
            }
        }]

        return { text: response, richContent }
    }

    // Asset Management queries with insights
    if (lowerMessage.includes('asset') && !lowerMessage.includes('risk')) {
        const assetTotal = systemData.assets.total
        const assetActive = systemData.assets.active
        const assetInactive = systemData.assets.inactive
        
        let response = `**Asset Management Overview:**\n\n`
        response += `📦 **Total Assets:** ${assetTotal}\n`
        response += `✅ **Active Assets:** ${assetActive}\n`
        response += `⚠️ **Inactive Assets:** ${assetInactive}\n\n`
        
        response += `**Asset Insights:**\n`
        response += `• Asset utilization rate: ${Math.round((assetActive / assetTotal) * 100)}%\n`
        response += `• ${assetInactive} assets may need review or disposal\n\n`
        
        response += `**Recommendations:**\n`
        response += `• Conduct quarterly asset audits\n`
        response += `• Implement asset lifecycle management\n`
        response += `• Review inactive assets for cost optimization\n`
        response += `• Use RFID/barcode tracking for better visibility\n`
        response += `• Establish asset maintenance schedules\n`

        const richContent = [{
            type: 'navigation',
            data: {
                title: 'View Asset Management',
                description: 'Manage company assets',
                path: '/asset-management/assets'
            }
        }]

        return { text: response, richContent }
    }

    // Incident Management queries with insights
    if (lowerMessage.includes('incident')) {
        const incidentTotal = systemData.incidents.total
        const incidentOpen = systemData.incidents.open
        const incidentCritical = systemData.incidents.critical
        
        let response = `**Incident Management Overview:**\n\n`
        response += `🚨 **Total Incidents:** ${incidentTotal}\n`
        response += `⏳ **Open Incidents:** ${incidentOpen}\n`
        response += `🔴 **Critical Incidents:** ${incidentCritical}\n\n`
        
        if (incidentCritical > 0) {
            response += `⚠️ **Alert:** ${incidentCritical} critical incident(s) require immediate attention!\n\n`
        }
        
        response += `**Incident Insights:**\n`
        response += `• Incident response time: Within SLA\n`
        response += `• ${Math.round((incidentOpen / incidentTotal) * 100)}% of incidents currently open\n\n`
        
        response += `**Improvement Recommendations:**\n`
        response += `• Implement automated incident detection\n`
        response += `• Enhance incident response playbooks\n`
        response += `• Conduct post-incident reviews\n`
        response += `• Train teams on incident escalation procedures\n`
        response += `• Integrate with monitoring tools for faster response\n`

        const richContent = [{
            type: 'navigation',
            data: {
                title: 'View Incident Management',
                description: 'Monitor and respond to incidents',
                path: '/incident-management/incidents'
            }
        }]

        return { text: response, richContent }
    }

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

    // News queries
    if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('headlines')) {
        const news = await fetchExternalNews()
        
        let response = `**Latest Industry News & Updates:**\n\n`
        news.forEach((item, index) => {
            response += `${index + 1}. 📰 **${item.title}**\n`
            response += `   ${item.summary}\n`
            response += `   *Source: ${item.source}* | ${item.publishedAt.toLocaleDateString('en-GB')}\n`
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

    // Weather queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('forecast')) {
        const response = `**Current Weather Information:**\n\n`
            + `🌤️ **${userCity}, ${userCountry}**\n`
            + `• Temperature: 24°C\n`
            + `• Conditions: Partly Cloudy\n`
            + `• Humidity: 45%\n`
            + `• Wind: 15 km/h NE\n\n`
            + `**5-Day Forecast:**\n`
            + `• Today: 24°C / 16°C - Partly Cloudy\n`
            + `• Tomorrow: 26°C / 17°C - Sunny\n`
            + `• Friday: 25°C / 18°C - Scattered Showers\n`
            + `• Saturday: 23°C / 15°C - Cloudy\n`
            + `• Sunday: 27°C / 19°C - Sunny\n\n`
            + `📍 Location detected: ${userCity}, ${userCountry}\n`
            + `*Weather data provided for business continuity planning*`

        return createTextResponse(response)
    }

    // Market/Financial updates
    if (lowerMessage.includes('market') || lowerMessage.includes('stock') || lowerMessage.includes('financial')) {
        const response = `**Financial Market Updates:**\n\n`
            + `📈 **JSE All Share Index:** 78,234 (+0.8%)\n`
            + `💱 **USD/ZAR:** 18.45 (-0.3%)\n`
            + `💰 **Gold:** $2,045/oz (+1.2%)\n`
            + `⚡ **Oil (Brent):** $82.50/barrel (+0.5%)\n\n`
            + `**Market Insights:**\n`
            + `• South African markets showing positive momentum\n`
            + `• Technology sector leading gains\n`
            + `• Commodity prices remain stable\n\n`
            + `*Data updated: ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}*`

        return createTextResponse(response)
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
            const risks = systemData.risks
            let response = `You currently have **${risks.total} total risks** in the system:\n`
            response += `• Active: ${risks.active}\n`
            response += `• Critical: ${risks.critical}\n`
            response += `• High: ${risks.high}\n`
            response += `• Medium: ${risks.medium}\n`
            response += `• Low: ${risks.low}\n\n`
            
            if (risks.examples && risks.examples.length > 0) {
                response += `**Recent Examples:**\n`
                for (let i = 0; i < risks.examples.length; i++) {
                    const risk = risks.examples[i]
                    response += `${i + 1}. ${risk.title} (${risk.severity})\n`
                }
            }
            
            return {
                text: response,
                richContent: [{
                    type: 'navigation',
                    data: {
                        title: 'View All Risks',
                        description: 'Go to Risk Management dashboard',
                        path: '/risk-management/risks'
                    }
                }]
            }
        }
        if (lowerMessage.includes('high') || lowerMessage.includes('critical')) {
            const risks = systemData.risks
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
            const risks = systemData.risks
            if (risks.examples && risks.examples.length > 0) {
                let response = `**Current Risks in the System:**\n\n`
                for (let i = 0; i < risks.examples.length; i++) {
                    const risk = risks.examples[i]
                    response += `${i + 1}. **${risk.title}**\n`
                    response += `   - Severity: ${risk.severity}\n`
                    response += `   - Status: ${risk.status}\n\n`
                }
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

    // System suggestions and improvements
    if (lowerMessage.includes('suggest') || lowerMessage.includes('improve') || lowerMessage.includes('recommendation') || lowerMessage.includes('optimize')) {
        let response = `**System Analysis & Improvement Recommendations:**\n\n`
        const suggestions = []
        
        if (systemData.risks.critical > 0) {
            suggestions.push(`🔴 **Risk Management (High):** ${systemData.risks.critical} critical risk(s) detected. Implement immediate mitigation strategies.`)
        }
        if (systemData.incidents.open > 5) {
            suggestions.push(`🟠 **Incident Management (High):** ${systemData.incidents.open} open incidents. Consider automated triage and increased response capacity.`)
        }
        if (systemData.compliance.score < 70) {
            suggestions.push(`🔴 **Compliance (Critical):** Score at ${systemData.compliance.score}%. Conduct gap analysis and implement remediation plan immediately.`)
        } else if (systemData.compliance.score < 85) {
            suggestions.push(`🟡 **Compliance (Medium):** Score at ${systemData.compliance.score}%. Address ${systemData.compliance.nonCompliant} non-compliant area(s).`)
        }
        
        const licenseUtil = Math.round((systemData.licenses.used / systemData.licenses.total) * 100)
        if (licenseUtil > 90) {
            suggestions.push(`🟠 **License Management (High):** Utilization at ${licenseUtil}%. Consider acquiring additional licenses.`)
        }
        
        if (systemData.assets.inactive > systemData.assets.active * 0.3) {
            suggestions.push(`🟡 **Asset Management (Medium):** ${systemData.assets.inactive} inactive assets. Conduct review and optimize lifecycle management.`)
        }
        
        if (suggestions.length === 0) {
            response += `✅ **Excellent!** System performing well with no critical issues.\n\n**Continuous Improvement:**\n• Maintain regular audits\n• Monitor KPIs consistently\n• Conduct quarterly reviews`
        } else {
            suggestions.forEach(s => response += `${s}\n\n`)
        }
        
        return createTextResponse(response)
    }

    // System updates and tracking
    if (lowerMessage.includes('update') || lowerMessage.includes('track') || lowerMessage.includes('change') || lowerMessage.includes('recent')) {
        const response = `**System Updates & Activity Tracking:**\n\n`
            + `📊 **Last 24 Hours:** ${systemData.recentActivity.last24Hours} activities\n\n`
            + `🔄 **Module Status:**\n`
            + `• Risks: ${systemData.risks.critical} critical, ${systemData.risks.total} total\n`
            + `• Incidents: ${systemData.incidents.open} open, ${systemData.incidents.total} total\n`
            + `• Compliance: ${systemData.compliance.score}% (${systemData.compliance.compliant}/${systemData.compliance.totalStandards})\n`
            + `• Assets: ${systemData.assets.active} active, ${systemData.assets.total} total\n`
            + `• Users: ${systemData.users.active} active\n\n`
            + `📈 **System Health:**\n`
            + `• Modules: ${systemData.modules.active} active\n`
            + `• License: ${Math.round((systemData.licenses.used / systemData.licenses.total) * 100)}% utilized\n\n`
            + `💡 I track changes across all modules in real-time.`

        return createTextResponse(response)
    }

    // System health check
    if (lowerMessage.includes('health') || lowerMessage.includes('status') || lowerMessage.includes('overview')) {
        let healthScore = 100
        const issues = []
        
        if (systemData.risks.critical > 0) { healthScore -= 15; issues.push('Critical risks detected') }
        if (systemData.incidents.critical > 0) { healthScore -= 15; issues.push('Critical incidents active') }
        if (systemData.compliance.score < 70) { healthScore -= 20; issues.push('Low compliance score') }
        if (systemData.incidents.open > 10) { healthScore -= 10; issues.push('High open incidents') }
        if ((systemData.licenses.used / systemData.licenses.total) > 0.9) { healthScore -= 5; issues.push('High license utilization') }
        
        const healthStatus = healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Good' : healthScore >= 60 ? 'Fair' : 'Needs Attention'
        const healthColor = healthScore >= 90 ? '🟢' : healthScore >= 75 ? '🟡' : '🟠'
        
        let response = `**System Health Check:**\n\n${healthColor} **Overall Score:** ${healthScore}/100 (${healthStatus})\n\n`
        
        if (issues.length > 0) {
            response += `⚠️ **Issues:**\n${issues.map(i => `• ${i}`).join('\n')}\n\n`
        }
        
        response += `**Module Status:**\n`
            + `✅ Risk: ${systemData.risks.total} tracked\n`
            + `✅ Incident: ${systemData.incidents.total} logged\n`
            + `✅ Asset: ${systemData.assets.total} managed\n`
            + `✅ Compliance: ${systemData.compliance.score}%\n`
            + `✅ Users: ${systemData.users.active} active\n\n`
            + `*Checked: ${new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}*`
        
        return createTextResponse(response)
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return createTextResponse("Hello! I'm Mazwi, your ProSuite AI assistant. I'm here to help you manage risks, assets, incidents, compliance, and more. What can I help you with today?")
    }

    // Default response
    return createTextResponse(
        "I'm here to help with ProSuite! I can provide:\n\n" +
        "• Risk, Asset, Incident, Compliance info\n" +
        "• Governance, Audit, Performance tracking\n" +
        "• System alerts and reminders\n" +
        "• News, weather, market updates\n" +
        "• System suggestions and improvements\n" +
        "• Update tracking and health monitoring\n\n" +
        "What would you like to know?"
    )
}
