import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
})

export async function runOpusWorkflow(workflow: string, input: string, geminiData?: any) {
  const prompts: Record<string, string> = {
    'doc-summary': `You are an expert document analyzer. Based on this analysis, create a professional summary and actionable recommendations.

Gemini Analysis:
${JSON.stringify(geminiData, null, 2)}

Original Input:
${input}

Create a comprehensive output that includes:
1. Executive summary
2. Key findings
3. Recommended actions
4. Next steps

Format as clear, professional text.`,
    'url-extract': `You are a content analyst. Process this information and create an email-ready summary.

Extracted Data:
${JSON.stringify(geminiData, null, 2)}

Original Content:
${input}

Create:
1. Brief overview
2. Key takeaways
3. Action items
4. Email-friendly format`,
    'data-insights': `You are a data analyst. Transform these insights into a clear report.

Analysis:
${JSON.stringify(geminiData, null, 2)}

Raw Data:
${input}

Provide:
1. Executive summary
2. Key insights
3. Data-driven recommendations
4. Visualization suggestions`,
    'chat-draft': `You are a professional communication expert. Refine this email draft.

Draft Data:
${JSON.stringify(geminiData, null, 2)}

Original Conversation:
${input}

Create a polished, professional email ready to send.`,
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo-key') {
    // Demo mode - return mock response
    return `[Demo Mode - Add ANTHROPIC_API_KEY to enable Claude]\n\nWorkflow: ${workflow}\n\nProcessed with Gemini data:\n${JSON.stringify(geminiData, null, 2)}`
  }

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompts[workflow] || input }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
