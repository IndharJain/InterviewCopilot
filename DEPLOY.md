# Deployment Guide 🚀

This guide will help you deploy **Interview Copilot** to **Netlify**.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Netlify](https://www.netlify.com/) account.
3.  Your Google Gemini API Key.

## Step 1: Push to GitHub

1.  Initialize git if you haven't already:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Link your local folder to the GitHub repo:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy on Netlify

1.  Log in to your [Netlify Dashboard](https://app.netlify.com/).
2.  Click **"Add new site"** -> **"Import from existing project"**.
3.  Select **GitHub**.
4.  Authorize Netlify and choose your `interview-copilot` repository.
5.  **Configure Build Settings**:
    *   **Base directory**: (leave empty)
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next` (Netlify usually auto-detects Next.js)
6.  **Environment Variables**:
    *   Click **"Add environment variables"**.
    *   Key: `NEXT_PUBLIC_GEMINI_API_KEY`
    *   Value: `your_actual_api_key_starting_with_AIza...`
7.  Click **Deploy**.

## Step 3: Verification

Once deployed, Netlify will give you a URL (e.g., `https://interview-copilot.netlify.app`).
1.  Open the URL.
2.  Grant Microphone/Screen permissions.
3.  Test the "Ask AI Now" button.

## Troubleshooting

*   **Build Failures**: Ensure you have the `netlify.toml` file in your project root (I have added this for you).
*   **PDF Worker Error**: If PDF parsing fails, check the console. The `netlify.toml` includes headers to help with file serving.
