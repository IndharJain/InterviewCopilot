import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyA6x6FdamhyA-haaKcDI5qUoEsZDaRwdys");

async function run() {
    try {
        genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct "listModels" on the client instance in some versions, 
        // but let's try to just generate content with a known fallback or use the model manager if available.
        // Actually, the SDK usually has a ModelManager.
        // Let's try to just hit the API directly if the SDK is obscure.

        // But wait, the error message says: "Call ListModels to see the list of available models".
        // In the Node SDK:
        // const genAI = new GoogleGenerativeAI(API_KEY);
        // const model = genAI.getGenerativeModel({ model: "MODEL_NAME" });

        // There is no direct listModels on genAI. 
        // It's usually a separate call or via REST.

        // Let's try a simple fetch to the list models endpoint.
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyA6x6FdamhyA-haaKcDI5qUoEsZDaRwdys");
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}

run();
