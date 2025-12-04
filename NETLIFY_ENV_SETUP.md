# Fixing the Netlify Build Error

The error `Error: @clerk/clerk-react: Missing publishableKey` means Netlify cannot find your Clerk API key during the build process.

## 1. Get your Clerk Keys
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/).
2. Select your application.
3. Go to **API Keys** in the sidebar.
4. Copy the **Publishable Key** (starts with `pk_...`).
5. Copy the **Secret Key** (starts with `sk_...`).

## 2. Add to Netlify
1. Go to your [Netlify Dashboard](https://app.netlify.com/).
2. Select your `interview-copilot` site.
3. Click on **Site configuration** (or **Site settings**).
4. In the sidebar, select **Environment variables**.
5. Click **Add a variable** -> **Add a single variable**.
6. Add the Publishable Key:
   - **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value**: (Paste your `pk_...` key here)
7. Click **Create variable**.
8. Repeat for the Secret Key:
   - **Key**: `CLERK_SECRET_KEY`
   - **Value**: (Paste your `sk_...` key here)

## 3. Trigger a New Deploy
**Crucial Step:** Changing variables does not automatically restart the build.
1. Go to the **Deploys** tab in Netlify.
2. Click **Trigger deploy** -> **Clear cache and deploy site**.

This should resolve the error!
