import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AISettings } from '../../types';
import { AIProviderService } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeDocument: AIProviderService['analyzeDocument'] = async (
    documentContent,
    persona,
    settings,
    customPrompt,
): Promise<AnalysisResult> => {
    
    const prompt = `${customPrompt ? customPrompt : 'Analyze the following RFI/RFP document.'}
Document Content:
---
${documentContent}
---
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: {
                type: Type.STRING,
                description: "A concise summary of the document's purpose and key objectives.",
            },
            keyRequirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A bulleted list of the most critical requirements mentioned.",
            },
            risks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A bulleted list of potential risks, challenges, or ambiguities.",
            },
            recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A bulleted list of actionable next steps and recommendations relevant to my role.",
            },
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: persona,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        let parsedResult;

        try {
            parsedResult = JSON.parse(jsonText);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", jsonText);
            throw new Error("The AI returned a response that was not valid JSON. Please try again.");
        }

        // Basic validation
        if (
            !parsedResult.summary ||
            !Array.isArray(parsedResult.keyRequirements) ||
            !Array.isArray(parsedResult.risks) ||
            !Array.isArray(parsedResult.recommendations)
        ) {
            throw new Error("AI response did not match the expected format.");
        }
        
        return parsedResult as AnalysisResult;

    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        // Pass the more specific error message if it exists, otherwise use a generic one.
        throw new Error(error.message || "Failed to analyze the document. Please check the API key and network connection.");
    }
};

export const generateDiagram: AIProviderService['generateDiagram'] = async (prompt, settings): Promise<string> => {
    const systemInstruction = `You are a diagramming assistant. Your task is to generate diagram code using MermaidJS syntax based on the user's request.
Only output the MermaidJS code block. Do not include any other explanatory text.
For example, if the user asks for a flowchart, your output should start with \`\`\`mermaid\` and end with \`\`\`.\`

Example Request: "Create a flowchart for a login process."
Example Output:
\`\`\`mermaid
graph TD
    A[Start] --> B{User enters credentials};
    B --> C{Are credentials valid?};
    C -- Yes --> D[Logged In];
    C -- No --> E[Show error message];
    E --> B;
\`\`\`
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for diagram generation:", error);
        throw new Error("Failed to generate the diagram. Please try again.");
    }
};