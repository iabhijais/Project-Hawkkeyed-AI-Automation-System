# 🚀 Quick Setup Guide - Project Hawkkeyed

## Prerequisites Checklist

- ✅ Node.js 18+ installed
- ✅ npm/yarn/pnpm installed
- ✅ VS Code (recommended)
- ✅ Firebase account
- ✅ Google Cloud account (for Gemini)
- ✅ Anthropic account (optional)

---

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install Dependencies

```bash
npm install
```

**Packages installed:**
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Firebase & Firebase Admin
- Anthropic SDK
- Google Generative AI
- Framer Motion

---

### 2️⃣ Setup Firebase (2 minutes)

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "hawkkeyed" or similar
   - Disable Google Analytics (optional)

2. **Enable Firestore:**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - Start in **test mode** (we'll add rules later)
   - Choose a location (us-central1 recommended)

3. **Get Firebase Config:**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Web" icon (</>) to add web app
   - Register app (name: "Hawkkeyed Web")
   - Copy the config object

4. **Add to .env.local:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

---

### 3️⃣ Get Gemini API Key (1 minute)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Select your Google Cloud project (or create new)
4. Copy the API key
5. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=AIza...your_key_here
   ```

**Note:** Gemini has a generous free tier (60 requests/minute)

---

### 4️⃣ Get Anthropic API Key (Optional - 1 minute)

**Option A: With Anthropic Key (Full Features)**
1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Go to "API Keys"
4. Create new key
5. Add to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...your_key_here
   ```

**Option B: Demo Mode (No Key Needed)**
- System works without Anthropic key
- Gemini still processes everything
- Opus step returns demo output
- Perfect for testing and development

---

### 5️⃣ Run the Project

```bash
npm run dev
```

Open http://localhost:3000

You should see the Hawkkeyed dashboard! 🦅

---

## 🧪 Test Your Setup

### Quick Test (30 seconds)

1. **Select a workflow:** Click "Document → Summary → PDF"

2. **Paste test input:**
   ```
   This is a project brief for building an AI analytics platform.
   Goals: Real-time stats, automated reports, AI insights.
   Deliverables: Frontend dashboard, backend API, ML models.
   Timeline: 8 weeks. Budget: $30,000.
   ```

3. **Click "Run Workflow"**

4. **Watch the magic:**
   - ✓ Extracting & Cleaning
   - ⟳ HawkVision (Gemini Intelligence)
   - ⟳ Opus Workflow Processing
   - ✓ Building Output

5. **View results:**
   - Structured JSON from Gemini
   - Professional output from Claude (or demo)
   - Run ID saved to Firestore

### Verify in Firebase

1. Go to Firebase Console
2. Open Firestore Database
3. Check `workflowRuns` collection
4. You should see your test run!

---

## 🎯 What Each Workflow Does

| Workflow | Input | Output |
|----------|-------|--------|
| **Document → Summary → PDF** | Documents, reports, briefs | Summary + tasks + key points |
| **URL → Key Facts → Email** | Web content, articles | Key facts + email format |
| **Data → Insights → Chart** | Analytics, metrics | Insights + recommendations |
| **Chat → Draft Email** | Conversations, notes | Professional email draft |

---

## 🔧 Environment Variables Reference

```env
# Required for AI processing
GEMINI_API_KEY=your_gemini_key

# Optional - enables full Claude features
ANTHROPIC_API_KEY=your_anthropic_key

# Required for data storage
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional - for server-side Firebase Admin
# FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

---

## 🚀 Deploy to Production

### Vercel (Recommended - 2 minutes)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

3. **Done!** Your app is live at `your-project.vercel.app`

---

## 📊 Monitor Your Workflows

### View History
- Navigate to `/history` in your app
- See all past workflow runs
- Check timestamps and status

### Firebase Console
- Real-time database updates
- Query workflow runs
- Monitor usage

---

## 🐛 Common Issues

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase connection issues
- Check all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Verify Firebase project is active
- Check Firestore is enabled

### Gemini API errors
- Verify API key is correct
- Check quota in Google AI Studio
- Ensure billing is enabled (if needed)

### Build errors
```bash
npm run build
```
Fix any TypeScript errors shown

---

## 🎉 You're Ready!

Your AI automation system is now running. Try different workflows, upload files, and watch the intelligent processing in action.

**Next Steps:**
1. Test all 4 workflow types
2. Check Firestore for saved runs
3. Customize workflows for your needs
4. Deploy to production
5. Share with your team!

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Need help?** Check `TEST_DATA.md` for sample inputs and `README.md` for detailed documentation.
