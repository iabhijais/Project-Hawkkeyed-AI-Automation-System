# Test Data for Project Hawkkeyed

## Test Input 1: Document Summary

```
This is a comprehensive project brief for building an AI-powered esports analytics platform called "GameVision Pro".

Project Goals:
- Provide real-time match statistics and player performance metrics
- Automatically generate highlight reels from live streams
- Create post-match analysis reports with AI insights
- Build a dashboard for coaches and analysts

Key Deliverables:
1. Frontend dashboard with React/Next.js
2. Backend pipeline using Firebase and Cloud Functions
3. Integration with Twitch API for stream data
4. Machine learning model for highlight detection
5. Automated report generation system

Timeline: 12 weeks
Budget: $50,000
Team: 4 developers, 1 designer, 1 ML engineer

Success Metrics:
- Process 100+ matches per day
- Generate highlights within 5 minutes of match end
- 95% accuracy in key moment detection
- Support for 5 major esports titles
```

**Expected Output:** Summary + action items + key points

---

## Test Input 2: URL Content

```
Article: "The Future of AI in Gaming"

Key points from the article:
- AI is revolutionizing game development with procedural content generation
- Machine learning models can now create realistic NPC behaviors
- Cloud gaming combined with AI enables personalized gaming experiences
- Esports analytics powered by AI helps teams improve performance
- Ethical considerations around AI-generated content in games
- Industry expected to invest $10B in gaming AI by 2025

Main takeaway: AI is becoming integral to every aspect of gaming, from development to player experience to competitive analysis.
```

**Expected Output:** Key facts + summary + action items

---

## Test Input 3: Data Analysis

```
Monthly User Engagement Data:

Week 1: 1,250 active users, 45 min avg session, 3.2 sessions/user
Week 2: 1,480 active users, 52 min avg session, 3.8 sessions/user
Week 3: 1,720 active users, 48 min avg session, 4.1 sessions/user
Week 4: 2,100 active users, 55 min avg session, 4.5 sessions/user

Top Features Used:
1. Live match tracking (78%)
2. Player stats (65%)
3. Highlight clips (52%)
4. Team comparisons (41%)

User Feedback:
- "Love the real-time updates" (4.5/5)
- "Highlights are amazing" (4.8/5)
- "Need more historical data" (3.2/5)
- "Mobile app needed" (3.8/5)
```

**Expected Output:** Insights + recommendations + trends

---

## Test Input 4: Chat to Email

```
Chat conversation:

John: Hey team, we need to finalize the Q4 roadmap by Friday
Sarah: Agreed. I think we should prioritize the mobile app and API improvements
Mike: What about the ML model updates? That's been on hold for 2 months
John: Good point. Let's make that a priority too
Sarah: So top 3: Mobile app, API v2, ML model improvements?
John: Yes, and let's schedule a kickoff meeting for Monday 10am
Mike: Works for me. I'll prepare the technical specs
Sarah: I'll draft the project timeline
```

**Expected Output:** Professional email draft with subject, body, and action items

---

## Quick Test Commands

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test with sample data:**
   - Copy one of the test inputs above
   - Select a workflow (Document, URL, Data, or Chat)
   - Paste the input
   - Click "Run Workflow"
   - Watch the real-time processing steps

3. **Check Firestore:**
   - Go to Firebase Console
   - Navigate to Firestore Database
   - Check `workflowRuns` collection
   - Verify documents are being created with status updates

---

## Expected Workflow Steps

Each workflow should show these steps in real-time:

1. ✓ **Extracting & Cleaning** - Input processed successfully
2. ⟳ **HawkVision (Gemini Intelligence)** - Analyzing with deep intelligence...
3. ⟳ **Opus Workflow Processing** - Running AI workflow...
4. ✓ **Building Output** - Workflow completed successfully

---

## Demo Mode

If you don't have an Anthropic API key, the system runs in demo mode:
- Gemini still processes and extracts structured data
- Opus step returns a demo response showing the Gemini analysis
- All logging and history features work normally
