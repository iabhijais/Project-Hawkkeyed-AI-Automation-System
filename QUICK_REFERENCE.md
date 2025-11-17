# ⚡ Quick Reference - Project Hawkkeyed

## 🚀 Quick Start (30 seconds)

```bash
npm install
# Add API keys to .env.local
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Required Environment Variables

```env
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

**Optional:**
- `ANTHROPIC_API_KEY` (runs in demo mode without it)
- Other Firebase config variables

---

## 📁 Project Structure

```
app/
├── page.tsx              # Main dashboard
├── layout.tsx            # Root layout
├── history/              # History page
└── api/
    └── run-workflow/     # Workflow API
components/
├── WorkflowCard.tsx      # Workflow selector
├── InputSection.tsx      # Input form
├── OutputSection.tsx     # Results display
└── Loader.tsx            # Loading state
lib/
├── firebase.ts           # Firebase setup
├── geminiClient.ts       # Gemini API
└── opusClient.ts         # Claude API
```

---

## 🎯 4 Workflow Types

| Icon | Name | Use Case |
|------|------|----------|
| 📄 | Document → Summary → PDF | Reports, briefs, docs |
| 🔗 | URL → Key Facts → Email | Articles, web content |
| 📊 | Data → Insights → Chart | Analytics, metrics |
| 💬 | Chat → Draft Email | Conversations, notes |

---

## 🔄 Workflow Processing Steps

1. **Extracting & Cleaning** - Input processing
2. **HawkVision (Gemini)** - Structured extraction
3. **Opus Processing** - Deep reasoning
4. **Building Output** - Final formatting

---

## 🧪 Test Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Type check
npx tsc --noEmit
```

---

## 📊 API Endpoint

**POST** `/api/run-workflow`

**Body (FormData):**
```javascript
{
  workflow: 'doc-summary' | 'url-extract' | 'data-insights' | 'chat-draft',
  input: string,
  file?: File,
  userId?: string
}
```

**Response:**
```javascript
{
  ok: boolean,
  id: string,
  workflow: string,
  steps: Array<{name, status, result, timestamp}>,
  geminiData: object,
  opusOutput: string,
  timestamp: string
}
```

---

## 🔥 Firebase Collections

### `workflowRuns`
```javascript
{
  workflow: string,
  input: string,
  status: 'starting' | 'processing' | 'completed' | 'error',
  steps: array,
  result: object,
  createdAt: timestamp,
  finishedAt: timestamp,
  userId: string
}
```

---

## 🎨 Key Components

### WorkflowCard
```tsx
<WorkflowCard
  workflow={{id, name, icon}}
  isSelected={boolean}
  onSelect={() => void}
/>
```

### InputSection
```tsx
<InputSection
  onRun={(input, file?) => void}
  isRunning={boolean}
  disabled={boolean}
/>
```

### OutputSection
```tsx
<OutputSection
  output={object}
  isRunning={boolean}
/>
```

---

## 🐛 Common Issues & Fixes

### Build Error
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Firebase Error
- Check all `NEXT_PUBLIC_FIREBASE_*` variables
- Verify Firestore is enabled
- Check security rules

### Gemini API Error
- Verify `GEMINI_API_KEY` is correct
- Check quota in Google AI Studio
- Ensure API is enabled

### TypeScript Errors
```bash
npx tsc --noEmit
# Fix errors shown
```

---

## 🚀 Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# In Vercel:
# 1. Import repository
# 2. Add environment variables
# 3. Deploy
```

**Environment variables needed in Vercel:**
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY` (optional)
- All `NEXT_PUBLIC_FIREBASE_*` variables

---

## 📝 Sample Test Input

```
This is a project brief for building an AI analytics platform.

Goals:
- Real-time match statistics
- Automated highlight generation
- AI-powered insights

Deliverables:
- Frontend dashboard
- Backend API
- ML models

Timeline: 8 weeks
Budget: $30,000
```

---

## 🔗 Important Links

- **Gemini API:** https://makersuite.google.com/app/apikey
- **Anthropic:** https://console.anthropic.com
- **Firebase:** https://console.firebase.google.com
- **Vercel:** https://vercel.com
- **Next.js Docs:** https://nextjs.org/docs

---

## 📚 Documentation Files

- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Step-by-step setup
- `TEST_DATA.md` - Sample test inputs
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_SUMMARY.md` - Hackathon submission

---

## 💡 Pro Tips

1. **Demo Mode:** Works without Anthropic key
2. **Test Data:** Use samples from `TEST_DATA.md`
3. **History:** Check `/history` for past runs
4. **Firestore:** Monitor in Firebase Console
5. **Logs:** Check browser console for errors

---

## 🎯 Key Features to Demo

1. ✅ Select workflow
2. ✅ Paste input
3. ✅ Watch real-time processing
4. ✅ View structured Gemini output
5. ✅ See final Claude output
6. ✅ Check Firestore history

---

## 📊 Performance Targets

- **API Response:** < 5 seconds
- **Success Rate:** > 95%
- **Lighthouse Score:** > 90
- **Bundle Size:** < 500KB

---

## 🔐 Security Checklist

- ✅ API keys in environment variables
- ✅ No secrets in code
- ✅ Firestore security rules
- ✅ Input validation
- ✅ Error sanitization

---

## 🎬 3-Minute Demo Script

**[0:00-0:30]** "Project Hawkkeyed - AI automation system"
**[0:30-1:00]** Show dashboard, explain 4 workflows
**[1:00-2:00]** Run live demo with test data
**[2:00-2:30]** Show real-time processing steps
**[2:30-3:00]** Display results, check Firestore

---

## 📞 Support

- Check `README.md` for detailed docs
- See `SETUP_GUIDE.md` for setup help
- Use `TEST_DATA.md` for sample inputs
- Review `DEPLOYMENT.md` for deployment

---

**Quick Start:** `npm install && npm run dev` 🚀
