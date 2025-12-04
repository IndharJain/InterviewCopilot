# Deployment Guide 🚀

This guide will help you deploy **Interview Copilot** to **GitHub Pages**.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  Your Google Gemini API Key.

---

## Deployment with GitHub Actions CI/CD

This repository includes GitHub Actions workflows for continuous integration and deployment to GitHub Pages.

### Step 1: Enable GitHub Pages

1. Go to your repository **Settings** > **Pages**
2. Under **Build and deployment**, select **GitHub Actions** as the source

### Step 2: Configure GitHub Secrets

Go to your repository **Settings** > **Secrets and variables** > **Actions** and add:

| Secret Name | Description |
|------------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API key |

### Step 3: Push and Deploy

Push to the `main` branch and the deployment will happen automatically!

The workflow will:
- Run linting
- Build the application
- Deploy to GitHub Pages

Your site will be available at: `https://<username>.github.io/<repository-name>/`

---

## Verification

Once deployed, GitHub will give you a URL (e.g., `https://yourusername.github.io/interview-copilot/`).
1.  Open the URL.
2.  Grant Microphone/Screen permissions.
3.  Test the "Ask AI Now" button.

## Troubleshooting

*   **Build Failures**: Check the GitHub Actions logs in the **Actions** tab of your repository.
*   **404 Errors**: Make sure GitHub Pages is enabled and set to use GitHub Actions as the source.
*   **PDF Worker Error**: If PDF parsing fails, check the browser console for errors.
