# 🚀 Deployment Guide - Project Hawkkeyed

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase Firestore enabled and working
- [ ] Gemini API key tested
- [ ] Local testing completed successfully
- [ ] Code pushed to GitHub
- [ ] Production Firebase project created (optional - can use same)

---

## Option 1: Vercel (Recommended) ⚡

### Why Vercel?
- ✅ Optimized for Next.js
- ✅ Automatic deployments from GitHub
- ✅ Free tier available
- ✅ Built-in CI/CD
- ✅ Edge functions support

### Steps

1. **Prepare Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Project Hawkkeyed"
   git branch -M main
   git remote add origin https://github.com/yourusername/hawkkeyed.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables, add:

   ```
   GEMINI_API_KEY=your_gemini_key
   ANTHROPIC_API_KEY=your_anthropic_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

---

## Option 2: Firebase Hosting 🔥

### Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   
   Select:
   - Use existing project
   - Public directory: `out`
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No**

3. **Update package.json**
   ```json
   {
     "scripts": {
       "build": "next build && next export"
     }
   }
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

5. **Your app is live at:**
   `https://your-project-id.web.app`

---

## Option 3: Railway 🚂

### Steps

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Next.js
   - Add environment variables in Settings
   - Deploy automatically starts

4. **Custom Domain**
   - Go to Settings → Domains
   - Add custom domain or use Railway subdomain

---

## Production Firebase Setup

### 1. Firestore Security Rules

Update Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Workflow runs - read public, write server-only
    match /workflowRuns/{runId} {
      allow read: if true;
      allow create: if request.auth != null || request.resource.data.userId != null;
      allow update, delete: if false;
    }
  }
}
```

### 2. Firebase Storage Rules (if using file uploads)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Enable Required APIs

In Firebase Console:
- ✅ Firestore Database
- ✅ Storage (if using files)
- ✅ Authentication (optional)

---

## Environment Variables for Production

### Required Variables

```env
# AI APIs
GEMINI_API_KEY=your_production_gemini_key
ANTHROPIC_API_KEY=your_production_anthropic_key

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Optional Variables

```env
# Firebase Admin (for server-side operations)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Post-Deployment Testing

### 1. Smoke Test
- [ ] Homepage loads
- [ ] All 4 workflows visible
- [ ] Can select a workflow
- [ ] Input section works
- [ ] File upload works (if enabled)

### 2. Workflow Test
- [ ] Run a test workflow
- [ ] Check real-time status updates
- [ ] Verify output displays correctly
- [ ] Check Firestore for saved run
- [ ] Test history page

### 3. Performance Test
- [ ] Check Lighthouse score (aim for 90+)
- [ ] Test on mobile devices
- [ ] Verify API response times
- [ ] Check Firebase quota usage

---

## Monitoring & Analytics

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Firebase Analytics

In Firebase Console:
- Enable Google Analytics
- Add tracking code
- Monitor usage in Analytics dashboard

### 3. Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Firebase Crashlytics

---

## Scaling Considerations

### API Rate Limits

**Gemini API:**
- Free tier: 60 requests/minute
- Paid tier: Higher limits
- Monitor usage in Google Cloud Console

**Anthropic API:**
- Check your plan limits
- Implement rate limiting if needed
- Consider caching responses

### Firebase Limits

**Firestore:**
- Free tier: 50K reads/day, 20K writes/day
- Monitor in Firebase Console
- Upgrade to Blaze plan if needed

**Storage:**
- Free tier: 5GB
- Monitor file uploads
- Implement cleanup for old files

### Optimization Tips

1. **Enable caching:**
   ```typescript
   // In next.config.js
   module.exports = {
     headers: async () => [
       {
         source: '/:path*',
         headers: [
           { key: 'Cache-Control', value: 'public, max-age=3600' }
         ]
       }
     ]
   }
   ```

2. **Optimize images:**
   - Use Next.js Image component
   - Enable image optimization

3. **Code splitting:**
   - Already handled by Next.js
   - Use dynamic imports for heavy components

---

## Backup & Recovery

### 1. Firestore Backup

```bash
# Export Firestore data
gcloud firestore export gs://your-bucket/backups

# Import Firestore data
gcloud firestore import gs://your-bucket/backups/[EXPORT_PREFIX]
```

### 2. Code Backup

- Keep GitHub repository updated
- Tag releases: `git tag v1.0.0`
- Create release branches

---

## Security Checklist

- [ ] API keys stored in environment variables (not in code)
- [ ] Firestore security rules configured
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Dependencies updated regularly

---

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor API usage
- [ ] Review Firestore costs
- [ ] Check uptime

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review security advisories: `npm audit`
- [ ] Backup Firestore data
- [ ] Review analytics

### Quarterly
- [ ] Major dependency updates
- [ ] Performance optimization
- [ ] User feedback review
- [ ] Feature planning

---

## Rollback Plan

If deployment fails:

1. **Vercel:**
   - Go to Deployments
   - Find last working deployment
   - Click "Promote to Production"

2. **Firebase:**
   ```bash
   firebase hosting:rollback
   ```

3. **Railway:**
   - Go to Deployments
   - Redeploy previous version

---

## Support & Resources

- **Vercel Support:** https://vercel.com/support
- **Firebase Support:** https://firebase.google.com/support
- **Next.js Docs:** https://nextjs.org/docs
- **Community:** Discord, Stack Overflow

---

## 🎉 Deployment Complete!

Your AI automation system is now live and ready to process workflows at scale.

**Next Steps:**
1. Share the URL with your team
2. Monitor initial usage
3. Gather feedback
4. Iterate and improve

**Demo URL Format:**
- Vercel: `https://hawkkeyed.vercel.app`
- Firebase: `https://hawkkeyed.web.app`
- Railway: `https://hawkkeyed.up.railway.app`

Good luck with your hackathon! 🦅
