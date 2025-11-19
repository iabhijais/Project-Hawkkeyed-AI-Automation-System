import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function runGeminiReasoning(input: string, context: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' })

  const prompt = `Context: ${context}\n\nAnalyze and provide structured reasoning for: ${input}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

export async function extractStructuredData(
  input: string,
  workflowType: string,
  fileData?: { mimeType: string; data: string }
) {
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
    'url-extract': `Analyze this web content and extract structured intelligence.
    
    Content:
    ${input}
    
    Return ONLY valid JSON in this exact format:
    {
      "summary": "A concise 2-3 sentence summary of the content.",
      "keyFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5"],
      "insights": {
        "opportunities": ["..."],
        "risks": ["..."],
        "entities": ["..."],
        "actions": ["..."]
      }
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
  "emailDraft": {
    "subject": "...",
    "body": "...",
    "tone": "professional|friendly|formal"
  }
}`,
  }

  const promptText = prompts[workflowType] || prompts['doc-summary']

  const parts: any[] = [promptText]
  if (fileData) {
    parts.push({
      inlineData: {
        mimeType: fileData.mimeType,
        data: fileData.data
      }
    })
  }

  const result = await model.generateContent(parts)
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
  workflowType: string,
  fileData?: { mimeType: string; data: string }
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' })

  const prompts: Record<string, string> = {
    'doc-summary': `You are generating a clean, professional 1-page report in Markdown format.
    
    Rules:
    - DO NOT include any markdown code block fences (like \`\`\`markdown).
    - DO NOT add headings like "Detailed Analysis", "Generated at", "Page 1 of 3", etc.
    - Keep all content within 1 page (maximum 2 short pages).
    - Use only these sections in this exact order:
      1. Executive Summary
      2. Key Insights (5 short bullets)
      3. Performance Metrics (compact table)
      4. Recommendations (4–6 bullets)
      5. Conclusion (2 lines)
    
    Formatting:
    - Use standard Markdown for bolding (**text**) and lists.
    - Keep paragraphs short (2–3 sentences maximum).
    - No long explanations.
    - No unnecessary details.
    - No repeated content.
    
    Structured Data:
    ${JSON.stringify(structuredData, null, 2)}
    
    Original Input:
    ${input}`,
    'url-extract': `You are a strategic analyst. Provide a high-level Executive Summary of this content.
    
    Extracted Data:
    ${JSON.stringify(structuredData, null, 2)}
    
    Original Content:
    ${input}
    
    Write a 2-3 paragraph narrative summary that:
    1. Explains the core purpose/value of the content.
    2. Highlights the most critical opportunity or risk.
    3. Concludes with a strategic recommendation.
    
    Do NOT use bullet points here (we have them in the structured data). Write in clear, professional paragraphs.`,
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

  const promptText = prompts[workflowType] || prompts['doc-summary']

  const parts: any[] = [promptText]
  if (fileData) {
    parts.push({
      inlineData: {
        mimeType: fileData.mimeType,
        data: fileData.data
      }
    })
  }

  const result = await model.generateContent(parts)
  const response = await result.response
  return response.text()
}
