import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function runGeminiReasoning(input: string, context: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' })

  const prompt = `Context: ${context}\n\nAnalyze and provide structured reasoning for: ${input}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

export async function extractStructuredData(input: string, workflowType: string) {
  // Try gemini-2.0-flash-001 as fallback if 2.5 is overloaded
  let model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' })

  const prompts: Record<string, string> = {
    'doc-summary': `Extract a concise summary (2-3 sentences) and a JSON list of action items from this document.

Input:
${input}

Return ONLY valid JSON in this format:
{
  "summary": "...",
  "tasks": [{"title": "...", "description": "...", "priority": "high|medium|low"}],
  "keyPoints": ["...", "..."]
}`,
    'url-extract': `Extract key facts and important information from this content.

Content:
${input}

Return ONLY valid JSON in this format:
{
  "summary": "...",
  "keyFacts": ["...", "...", "..."],
  "actionItems": ["...", "..."]
}`,
    'data-insights': `Analyze this data and provide insights.

Data:
${input}

Return ONLY valid JSON in this format:
{
  "summary": "...",
  "insights": ["...", "...", "..."],
  "recommendations": ["...", "..."]
}`,
    'chat-draft': `Convert this conversation into a professional email draft.

Conversation:
${input}

Return ONLY valid JSON in this format:
{
  "subject": "...",
  "body": "...",
  "tone": "professional|friendly|formal"
}`,
  }

  const prompt = prompts[workflowType] || prompts['doc-summary']
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  return { summary: text, raw: true }
}

export async function generateDetailedAnalysis(
  input: string,
  structuredData: any,
  workflowType: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' })

  const prompts: Record<string, string> = {
    'doc-summary': `You are an expert document analyzer. Based on this structured analysis, create a comprehensive professional report.

Structured Data:
${JSON.stringify(structuredData, null, 2)}

Original Input:
${input}

Create a detailed analysis that includes:
1. Executive Summary (2-3 sentences)
2. Key Findings (detailed explanation)
3. Actionable Recommendations
4. Next Steps

Format as clear, professional text.`,
    'url-extract': `You are a content analyst. Process this information and create an insightful summary.

Extracted Data:
${JSON.stringify(structuredData, null, 2)}

Original Content:
${input}

Create:
1. Brief Overview
2. Key Takeaways (detailed)
3. Important Action Items
4. Implications`,
    'data-insights': `You are a data analyst. Transform these insights into a comprehensive report.

Analysis:
${JSON.stringify(structuredData, null, 2)}

Raw Data:
${input}

Provide:
1. Executive Summary
2. Detailed Insights Analysis
3. Data-Driven Recommendations
4. Strategic Implications`,
    'chat-draft': `You are a professional communication expert. Create a polished, professional output.

Draft Data:
${JSON.stringify(structuredData, null, 2)}

Original Conversation:
${input}

Create a well-formatted professional communication with proper structure and tone.`,
  }

  const prompt = prompts[workflowType] || prompts['doc-summary']
  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}
