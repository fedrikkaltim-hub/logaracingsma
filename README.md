<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2e024eef-fb98-4bc8-84e6-f71822d9c963

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Deploy Vercel
1. Upload repository ke GitHub.
2. Buka https://vercel.com lalu Import Project.
3. Framework Preset: Vite.
4. Build Command: npm run build.
5. Output Directory: dist.
6. Deploy.

Versi ini menggunakan mode client-side agar kompatibel dengan Vercel Serverless.
