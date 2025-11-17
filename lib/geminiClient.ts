import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function runGeminiReasoning(input: string, context: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `Context: ${context}\n\nAnalyze and provide structured reasoning for: ${input}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

export async function extractStructuredData(input: string, workflowType: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

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
