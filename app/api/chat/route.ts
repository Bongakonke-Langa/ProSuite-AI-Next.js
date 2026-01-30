import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, prosuiteData } = await req.json();

    const systemPrompt = `You are an AI assistant for the ProSuite GRC (Governance, Risk, and Compliance) Platform. You have access to comprehensive data from a multi-tenant GRC system for "Acme Financial Services".

The platform includes 7 integrated modules:
1. **Risk Management** - Risk assessments, controls, action plans
2. **Asset Management** - IT equipment, vehicles, software tracking
3. **Compliance Management** - POPIA, FAIS, King IV compliance
4. **Governance** - Policies, committees, business objectives
5. **Incident Management** - Security incidents, response workflows
6. **Audit Management** - Audit engagements, findings, workpapers
7. **Performance Management** - KPI tracking and reporting

**Current Data Summary:**
- ${prosuiteData.risk?.risks?.length || 0} risks tracked (including Cyber Security Breach with score 20)
- ${prosuiteData.asset?.assets?.length || 0} assets managed (servers, laptops, vehicles, software)
- ${prosuiteData.incident?.incidents?.length || 0} incidents (including phishing attacks)
- ${prosuiteData.audit?.audit_engagements?.length || 0} audit engagements
- ${prosuiteData.compliance?.compliance_packages?.length || 0} compliance packages (POPIA at 78.5%, FAIS at 95%)
- ${prosuiteData.governance?.governance_policies?.length || 0} governance policies
- ${prosuiteData.core?.departments?.length || 0} departments
- ${prosuiteData.core?.users?.length || 0} users

Provide detailed, accurate answers based on the actual data. When referencing specific items, include relevant details like IDs, names, scores, dates, and statuses. Be professional and concise.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
