import { GoogleGenerativeAI, Part } from '@google/generative-ai';

export async function generateAnswer(
    apiKey: string,
    transcript: string,
    imageBase64: string | null,
    audioBase64: string | null,
    resumeText: string,
    manualContext: string,
    onChunk: (text: string) => void
) {
    if (!apiKey) {
        onChunk("⚠️ Error: API Key is missing. Please enter it in the settings.");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
    You are an expert Senior Software Engineer and Interview Coach.
    You are listening to a live technical interview.
    
    Your Goal: Provide short, concise, and high - impact hints or answers to the user.
    
    The user is the candidate.
    If the text provided is the transcript of the conversation from the user, answer the interviewer's question.
    If there is an image provided(screenshot), analyze it(is it a coding problem on LeetCode ? A system design diagram ?) and suggest the algorithm or key syntax.
    Be brief.The user has to read quickly.Do NOT be chatty.Just give the answer or hint.
    
    User Mic Transcript(What the user said): ${audioBase64 ? '(Audio provided)' : 'None'}
    Additional Manual Context: ${manualContext}
    
    FOCUS ONLY ON THE LAST QUESTION ASKED.Do not answer previous questions unless relevant.
    If the interviewer asks a question, suggest a direct, professional answer.
    If there is a coding problem, suggest the approach or code snippet.

    Transcript(User Mic):
    ${transcript}
`;

    const parts: (string | Part)[] = [prompt];

    if (imageBase64) {
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg',
            },
        });
    }

    if (audioBase64) {
        const base64Data = audioBase64.split(',')[1] || audioBase64;
        parts.push({
            inlineData: {
                data: base64Data,
                mimeType: 'audio/webm',
            },
        });
    }

    try {
        const result = await model.generateContentStream(parts);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            onChunk(chunkText);
        }
    } catch (error: unknown) {
        console.error('Gemini API Error:', error);

        // Clear previous partial response if any, to show just the error
        // Note: We can't easily "clear" via onChunk unless we send a special signal, 
        // but typically we just append. Ideally, the UI handles this. 
        // For now, we'll just send a distinct error block.

        const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
        if (errorMessage.includes('429') || errorMessage.includes('Quota exceeded')) {
            onChunk('\n\n**⚠️ API Rate Limit Reached**\n\nPlease wait a moment before trying again. The free tier has limits.');
        } else {
            onChunk(`\n\n**⚠️ Error:** ${errorMessage}`);
        }
    }
}
