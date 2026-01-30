import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json()

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
- Provide insights and analytics

Be helpful, professional, and concise. Always relate your responses to ProSuite's context.`

        // For now, provide intelligent responses based on keywords
        // In production, this would call OpenAI/Anthropic API
        const response = await generateResponse(message, systemContext)

        return NextResponse.json({ response })
    } catch (error) {
        console.error('Mazwi API Error:', error)
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        )
    }
}

async function generateResponse(message: string, systemContext: string): Promise<string> {
    const lowerMessage = message.toLowerCase()

    // Risk-related queries
    if (lowerMessage.includes('risk')) {
        if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
            return "Based on the current data, you have 2 active risks in the system. Would you like me to provide more details about specific risks or their severity levels?"
        }
        if (lowerMessage.includes('high') || lowerMessage.includes('critical')) {
            return "There are currently no critical risks flagged in the system. However, I recommend reviewing the risk register regularly to ensure all assessments are up to date."
        }
        return "I can help you with risk management. You can ask me about risk counts, severity levels, mitigation strategies, or specific risk details. What would you like to know?"
    }

    // Asset-related queries
    if (lowerMessage.includes('asset')) {
        if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
            return "You currently have 2 active assets registered in the system. These assets are being tracked for compliance and lifecycle management."
        }
        return "I can assist with asset management queries. Ask me about asset counts, status, maintenance schedules, or specific asset details."
    }

    // Incident-related queries
    if (lowerMessage.includes('incident')) {
        if (lowerMessage.includes('open') || lowerMessage.includes('active')) {
            return "There are currently 2 open incidents that require attention. Would you like me to provide details about these incidents or their priority levels?"
        }
        return "I can help with incident management. You can ask about open incidents, incident history, response times, or specific incident details."
    }

    // Compliance-related queries
    if (lowerMessage.includes('compliance')) {
        if (lowerMessage.includes('score') || lowerMessage.includes('status')) {
            return "Your current compliance score is 78.5%. This indicates good overall compliance, but there are areas for improvement. Would you like me to identify specific compliance gaps?"
        }
        return "I can assist with compliance queries. Ask me about compliance scores, regulatory requirements, audit findings, or specific compliance standards."
    }

    // Dashboard and overview queries
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview') || lowerMessage.includes('summary')) {
        return "Here's a quick overview:\n• Active Modules: 1\n• Total Users: 5\n• Total Licenses: 3\n• Recent Activity: 8 logs in the last 24 hours\n\nWould you like details on any specific area?"
    }

    // Module-related queries
    if (lowerMessage.includes('module')) {
        return "ProSuite currently has 5 modules configured:\n• Risk Management (Active)\n• Asset Management (Active)\n• Incident Management (Pending)\n• Compliance (Active)\n• User Management (Disabled)\n\nWhich module would you like to know more about?"
    }

    // User and license queries
    if (lowerMessage.includes('user') || lowerMessage.includes('license')) {
        return "You have 5 total users across the system with 3 active licenses. License utilization varies by module. Would you like specific details about user distribution or license usage?"
    }

    // Help and navigation
    if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('navigate')) {
        return "I'm here to help! I can assist you with:\n• Checking status of risks, assets, and incidents\n• Viewing compliance scores and audit logs\n• Understanding module data and analytics\n• Navigating the ProSuite system\n\nWhat specific help do you need?"
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm Mazwi, your ProSuite AI assistant. I'm here to help you manage risks, assets, incidents, compliance, and more. What can I help you with today?"
    }

    // Default response
    return "I understand you're asking about ProSuite. I can help you with information about risks, assets, incidents, compliance, modules, users, and system analytics. Could you please be more specific about what you'd like to know?"
}
