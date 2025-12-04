# Interview Copilot 🧠

**Interview Copilot** is an AI-powered assistant designed to help you ace your technical interviews. It listens to your interview in real-time, analyzes the context against your resume, and provides smart, concise suggestions to help you answer difficult questions.

![Interview Copilot](https://placehold.co/1200x630/06b6d4/000000?text=Interview+Copilot)

## 🚀 Features

*   **Real-time Transcription**: Captures both your voice and the interviewer's audio.
*   **AI Brain**: Powered by Google Gemini 1.5 Flash for instant, context-aware answers.
*   **Resume Integration**: Upload your resume (PDF/TXT) to get personalized answers based on your experience.
*   **Manual Context**: Type specific questions or job descriptions to guide the AI.
*   **Mic-Only Mode**: "Ask AI Now" works with just the microphone—no screen share required.
*   **Smart Rate Limiting**: Optimizes API usage to stay within free tier limits.
*   **Privacy First**: Your API key is stored locally in your browser/env.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API
*   **State Management**: Zustand
*   **PDF Parsing**: PDF.js

## 🏃‍♂️ Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/interview-copilot.git
    cd interview-copilot
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev -- --webpack
    ```

5.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for deployment on **GitHub Pages** using GitHub Actions.

1.  Push your code to a GitHub repository.
2.  Enable GitHub Pages in your repository Settings > Pages > Set source to "GitHub Actions".
3.  Add the required secrets in Settings > Secrets and variables > Actions:
    - `NEXT_PUBLIC_GEMINI_API_KEY`
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
4.  Push to the `main` branch and the deployment will happen automatically!

For detailed instructions, see [DEPLOY.md](DEPLOY.md).

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
