import { GoogleGenAI, Type } from "@google/genai";
import type { PoemAnalysis, GenerationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

export const extractPoemFromImage = async (imageFile: File): Promise<string> => {
    const base64Image = await fileToBase64(imageFile);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    text: "You are an expert Optical Character Recognition (OCR) service. Analyze the provided image and extract any and all text you find. The text is a poem. Present the text exactly as it appears, preserving line breaks and formatting. If no text is found, return an empty string.",
                },
                {
                    inlineData: {
                        mimeType: imageFile.type,
                        data: base64Image,
                    },
                },
            ],
        },
    });

    return response.text.trim();
};

export const analyzePoemAndGenerateImage = async (poem: string): Promise<GenerationResult> => {
    // Step 1: Analyze the poem to get artistic direction and text layout
    const analysisResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an AI that transforms poems into visually striking posters. Your task is to analyze the provided poem, format it into a proper free verse style, and determine the best visual elements for its poster.

        Poem Text:
        ---
        ${poem}
        ---

        **Part 1: Poem Formatting**
        Reformat the provided text into a complete free verse poem. This means:
        - It must have a title and an author. If not explicitly provided, create a suitable title based on the poem's content and use "Anonymous" for the author.
        - The body of the poem should have meaningful line breaks and natural stanza spacing to enhance its poetic form.
        - **Crucially, you must not add any new words, phrases, or sentences to the poem's body.** Your task is only to reformat the existing text provided by the user. Preserve the original text's essence completely.

        **Part 2: Poster Analysis & Output**
        Based on the formatted poem, provide a single JSON object with the following details:
        1. "title": The final, formatted title of the poem.
        2. "author": The final author of the poem.
        3. "body": The full body of the poem, correctly formatted in free verse style with line breaks preserved (use '\\n' for line breaks).
        4. "emotions": An array of 1-3 dominant emotions (e.g., "peaceful", "melancholic", "joyful").
        5. "imagery": An array of 2-4 key visual elements (e.g., "starry night", "ancient forest", "crashing waves").
        6. "atmosphere": A single descriptive word for the overall mood (e.g., "dreamy", "mysterious", "hopeful").
        7. "artStyle": A concise art style description (e.g., "ethereal watercolor", "dramatic oil painting", "moody abstract", "soft pastel drawing").
        8. "textPlacement": The optimal placement for the poem text on the background to ensure readability. Choose from: 'center', 'top-center', 'bottom-center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'. The chosen area should be where the background is least detailed.
        9. "textStyle": The best styling to apply to the text to ensure it stands out clearly. Choose from: 'shadow', 'glow', or 'overlay'.
        
        Respond ONLY with the single JSON object.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    author: { type: Type.STRING },
                    body: { type: Type.STRING },
                    emotions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    imagery: { type: Type.ARRAY, items: { type: Type.STRING } },
                    atmosphere: { type: Type.STRING },
                    artStyle: { type: Type.STRING },
                    textPlacement: { type: Type.STRING, enum: ['center', 'top-center', 'bottom-center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] },
                    textStyle: { type: Type.STRING, enum: ['shadow', 'glow', 'overlay'] },
                },
                required: ["title", "author", "body", "emotions", "imagery", "atmosphere", "artStyle", "textPlacement", "textStyle"],
            },
        },
    });

    const analysisJsonString = analysisResponse.text.trim();
    const analysis: PoemAnalysis = JSON.parse(analysisJsonString);

    // Step 2: Generate the image based on the analysis, ensuring negative space
    const imagePrompt = `Create a high-quality, artistic background image.
    Style: ${analysis.artStyle}.
    Subject: ${analysis.imagery.join(', ')}.
    Mood: Evoke an atmosphere of "${analysis.atmosphere}" and feelings of ${analysis.emotions.join(', ')}.

    **CRITICAL RULES:**
    1.  **NO TEXT:** This is a background image ONLY. Under NO circumstances should you generate any text, words, letters, or characters in the image. The image must be purely visual, without any typography.
    2.  **PALE & SOFT COLORS:** The overall color palette must be soft, pale, and light. This is essential to ensure that dark text, which will be added on top later, is clearly visible and readable.
    3.  **TEXT-FRIENDLY COMPOSITION:** The composition must include a clean, uncluttered, soft, or blurred area, specifically in the ${analysis.textPlacement.replace('-', ' ')} region, to provide a perfect space for text overlay.`;

    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '9:16', // Good for phone backgrounds
        },
    });

    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;

    return {
        title: analysis.title,
        author: analysis.author,
        body: analysis.body,
        backgroundImage: base64ImageBytes,
        fontColor: '#1A202C', // Always use a strong, dark color for high contrast
        textPlacement: analysis.textPlacement,
        textStyle: analysis.textStyle,
    };
};