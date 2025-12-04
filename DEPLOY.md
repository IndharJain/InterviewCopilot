# Deployment Guide 🚀

This guide will help you deploy **Interview Copilot** to **Netlify**.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Netlify](https://www.netlify.com/) account.
3.  Your Google Gemini API Key.
4.  Your Clerk API Keys (Publishable Key and Secret Key).

## Deployment Options

You can deploy in two ways:
1. **Automatic CI/CD** (Recommended): Using GitHub Actions workflows
2. **Manual Netlify Integration**: Direct Netlify + GitHub connection

---

## Option 1: GitHub Actions CI/CD (Recommended)

This repository includes GitHub Actions workflows for continuous integration and deployment.

### Step 1: Configure GitHub Secrets

Go to your repository **Settings** > **Secrets and variables** > **Actions** and add:

| Secret Name | Description |
|------------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key (starts with `pk_`) |
| `CLERK_SECRET_KEY` | Your Clerk secret key (starts with `sk_`) |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API key |
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token |
| `NETLIFY_SITE_ID` | Your Netlify site ID |

### Step 2: Get Netlify Credentials

1. **Netlify Auth Token**: Go to [Netlify User Settings](https://app.netlify.com/user/applications) > **Personal access tokens** > **New access token**
2. **Netlify Site ID**: Create a new site in Netlify, then find it in **Site settings** > **General** > **Site ID**

### Step 3: Push and Deploy

Push to the `main` branch and the deployment will happen automatically!

The CI workflow will:
- Run linting
- Build the application
- Deploy to Netlify on successful builds

---

## Option 2: Manual Netlify Integration

### Step 1: Push to GitHub

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

### Step 2: Deploy on Netlify

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
    *   Key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    *   Value: `pk_test_...` (Found in your Clerk Dashboard)
    *   Key: `CLERK_SECRET_KEY`
    *   Value: `sk_test_...` (Found in your Clerk Dashboard)
7.  Click **Deploy**.

## Step 3: Verification

Once deployed, Netlify will give you a URL (e.g., `https://interview-copilot.netlify.app`).
1.  Open the URL.
2.  Grant Microphone/Screen permissions.
3.  Test the "Ask AI Now" button.

## Troubleshooting

*   **Build Failures**: Ensure you have the `netlify.toml` file in your project root (I have added this for you).
*   **PDF Worker Error**: If PDF parsing fails, check the console. The `netlify.toml` includes headers to help with file serving.
