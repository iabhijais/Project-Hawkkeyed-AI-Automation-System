# 🦅 Project Hawkkeyed

**AI Automation & Workflow Intelligence System**

Project Hawkkeyed transforms a single user instruction into a complete multi-step workflow using Opus + Gemini. It features a real-time workflow runner built with Next.js + Firebase, intelligent reasoning powered by Gemini, and a sleek dashboard for viewing logs and outputs.

## 🔥 Key Features

- **Multi-Step Opus Workflows** - Predefined AI workflows for documents, URLs, data, and chat
- **Real-Time Workflow Runner UI** - Live status updates with Next.js
- **HawkVision (Gemini Intelligence)** - Deep reasoning and structured extraction
- **File & Link Processing** - Upload files or paste URLs
- **History & Saved Logs** - Every run saved in Firestore

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Storage)
- **AI**: Anthropic Claude (Opus), Google Gemini 1.5 Flash

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Storage (optional)
4. Get your Firebase config from Project Settings

### 3. Get API Keys

**Google Gemini (Required):**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env.local` as `GEMINI_API_KEY`

**Anthropic Claude (Optional):**
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Get API key from settings
3. Add to `.env.local` as `ANTHROPIC_API_KEY`
4. Note: System works in demo mode without this key

### 4. Configure environment variables

Edit `.env.local` with your keys:

```env
# Google Gemini API (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# Anthropic API (Optional - runs in demo mode without it)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run development server
```bash
npm run dev
```

### 6. Test the system

1. Open `http://localhost:3000`
2. Select a workflow
3. Use test data from `TEST_DATA.md`
4. Watch real-time processing
5. Check Firestore for saved runs

## 📁 Project Structure

```
project-hawkkeyed/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── history/              # History page
│   └── api/
│       └── run-workflow/     # Workflow API endpoint
├── components/
│   ├── WorkflowCard.tsx      # Workflow selection cards
│   ├── InputSection.tsx      # Input form
│   ├── OutputSection.tsx     # Results display
│   └── Loader.tsx            # Loading animation
├── lib/
│   ├── firebase.ts           # Firebase setup
│   ├── opusClient.ts         # Anthropic Claude client
│   └── geminiClient.ts       # Google Gemini client
└── README.md
```

## 🎯 How It Works

1. User selects a workflow (Document, URL, Data, or Chat)
2. Enters input or uploads a file
3. Clicks "Run Workflow"
4. System processes through multiple AI steps:
   - Extracting & Cleaning
   - Opus Workflow Processing
   - Gemini Reasoning
   - Building Output
5. Results displayed in real-time
6. Workflow saved to Firestore history

## 🦅 Workflows Available

- **Document → Summary → PDF** - Analyze documents and create summaries
- **URL → Key Facts → Email** - Extract insights from web content
- **Data → Insights → Chart** - Analyze data and generate reports
- **Chat → Draft Email → Store** - Convert conversations to emails

## 📝 License

MIT


## 🧪 Testing

See `TEST_DATA.md` for sample inputs to test each workflow type.

### Quick Test Flow

1. Start server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Select "Document → Summary → PDF" workflow
4. Paste test data from `TEST_DATA.md`
5. Click "Run Workflow"
6. Watch real-time steps execute
7. View structured output from Gemini + Claude

### Verify in Firebase

1. Go to Firebase Console
2. Open Firestore Database
3. Check `workflowRuns` collection
4. Each run should have:
   - `status`: "completed" or "error"
   - `steps`: Array of processing steps
   - `result`: Final output data
   - `createdAt` and `finishedAt` timestamps

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `ANTHROPIC_API_KEY` (optional)
   - All `NEXT_PUBLIC_FIREBASE_*` variables
4. Deploy

### Firebase Security Rules

Add these rules to Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workflowRuns/{document=**} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
  }
}
```

## 🎯 Workflow Types

### 1. Document → Summary → PDF
- Extracts summary, tasks, and key points
- Formats for professional output
- Ideal for: Reports, briefs, documentation

### 2. URL → Key Facts → Email
- Extracts key facts from content
- Identifies action items
- Creates email-ready format
- Ideal for: Articles, research, web content

### 3. Data → Insights → Chart
- Analyzes data patterns
- Provides insights and recommendations
- Suggests visualizations
- Ideal for: Analytics, metrics, reports

### 4. Chat → Draft Email → Store
- Converts conversations to emails
- Professional tone and formatting
- Extracts action items
- Ideal for: Meeting notes, discussions

## 🔧 Architecture Details

### AI Processing Flow

```
User Input
    ↓
Step 1: Extract & Clean
    ↓
Step 2: Gemini Intelligence (HawkVision)
    - Structured data extraction
    - JSON parsing
    - Context analysis
    ↓
Step 3: Opus/Claude Processing
    - Deep reasoning
    - Professional formatting
    - Final output generation
    ↓
Step 4: Save to Firestore
    - Log workflow run
    - Store results
    - Track status
    ↓
Display Results
```

### API Endpoints

- `POST /api/run-workflow` - Execute workflow
  - Body: FormData with `workflow`, `input`, optional `file`
  - Returns: Workflow results with steps and outputs

## 📊 Monitoring

### Check Workflow Status

```javascript
// In Firebase Console or client code
const runs = await db.collection('workflowRuns')
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get()
```

### View History

Navigate to `/history` page to see all past workflow runs.

## 🐛 Troubleshooting

### "Error evaluating Node.js code"
- Make sure all dependencies are installed: `npm install`
- Check that `.env.local` has valid API keys

### "Firebase not initialized"
- Verify Firebase config in `.env.local`
- Check Firebase project is active

### "Gemini API error"
- Verify `GEMINI_API_KEY` is correct
- Check API quota in Google AI Studio

### Workflows not saving
- Check Firestore is enabled in Firebase Console
- Verify Firebase security rules allow server writes

## 📝 License

MIT
