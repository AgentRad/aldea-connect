# Aldea Connect

A pediatric-care matching site for Florida families — autism & ADHD evaluations, ABA, speech, OT, learning support and parent coaching. No waitlist, hand-matched in 48 hours.

This is a fully static site — pure HTML, CSS and a single JS file. No build step. Deploys directly to Vercel, Cloudflare Pages, Netlify or any static host.

## Local preview

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
# then open http://localhost:8000/
```

## File layout

```
.
├── index.html              Home: hero, services, providers, intake form, FAQ
├── providers.html          Searchable, filterable provider directory
├── for-providers.html      Clinician sign-up + pricing
├── how-it-works.html       3-step explainer + timeline
├── screeners.html          Interactive autism/ADHD parent screener
├── about.html              Mission + principles
├── contact.html            Offices + contact form
├── login.html              Auth shell (wire up Supabase/Auth.js later)
├── privacy.html            Starter privacy policy
├── terms.html              Starter ToS
├── 404.html
├── assets/
│   ├── styles.css          Design tokens + components
│   ├── app.js              Mobile nav, form handling, filters, screener quiz
│   └── favicon.svg
├── vercel.json             Clean URLs + security headers
├── robots.txt
├── sitemap.xml
└── serve.ps1               Tiny PowerShell static server for local preview
```

## Deploying to Vercel via GitHub

1. **Create an empty GitHub repo** at <https://github.com/new>
   - Name: `aldea-connect`
   - Visibility: Private (recommended while you iterate)
   - **Do not** initialize with README/.gitignore — this folder already has them.
2. **Push this folder.** From the project directory:
   ```bash
   git remote add origin https://github.com/<your-username>/aldea-connect.git
   git branch -M main
   git push -u origin main
   ```
3. **Import on Vercel** at <https://vercel.com/new>
   - Pick the `aldea-connect` repo.
   - Framework Preset: **Other** (it's a static site).
   - Build Command: *(leave blank)*
   - Output Directory: *(leave blank)*
   - Click **Deploy**.
4. You'll get a URL like `https://aldea-connect.vercel.app/` — share it with her for feedback.

Every push to `main` will redeploy automatically.

## Hooking up a real domain later

When you're ready to move from `aldea-connect.vercel.app` to a custom domain:

- **GoDaddy domain → Vercel:** in Vercel project → Settings → Domains, add the domain. Vercel will show you either an A record (`76.76.21.21`) or two CNAME records. Add those in GoDaddy DNS.
- **Cloudflare in front:** keep proxy *off* (gray cloud) for the validation records until Vercel verifies; then you can turn proxy on if you want CF features.

## What's wired up (and what isn't)

Wired up:

- All UI, navigation, copy and design.
- Mobile nav, intake form validation, provider search + filters, autism/ADHD screener quiz.
- Local-storage queue for intake submissions (so nothing is lost while you wire up a real backend).

Not wired up (intentional — bring your own):

- Real auth (`login.html` is a shell). Drop in Supabase Auth, Auth0 or Clerk.
- Real intake submission. Easiest path: add `/api/intake.js` as a Vercel serverless function that emails you, or POST to Formspree/Resend/Loops.
- Payments / insurance verification.
- Provider data — currently 9 example cards in `providers.html`. Move to a JSON file or a CMS when ready.

## Brand notes

- Teal `#0a8a8a` primary, cream `#fff7e6` warm accent, sand `#fbf6ee` neutral.
- Display font: Fraunces (serif). Body font: DM Sans.
- Tone: warm, plainspoken, evidence-led. Avoid clinical jargon in family-facing copy.
