import { AnalysisResult } from '../../types';
import { AIProviderService } from "./types";

const mockDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzeDocument: AIProviderService['analyzeDocument'] = async (
    documentContent,
    persona,
    settings,
    customPrompt,
): Promise<AnalysisResult> => {
    const endpoint = settings.customEndpoint;
    if (!endpoint) {
        throw new Error("Custom endpoint is not configured.");
    }
    console.log(`Using Custom Service at: ${endpoint}`);
    // TODO: Implement actual fetch/API call to the custom endpoint.
    // The request body would likely include the document content, persona, and prompt.
    /*
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.CUSTOM_API_KEY}` },
        body: JSON.stringify({ documentContent, persona, customPrompt })
    });
    if (!response.ok) {
        throw new Error(`Custom endpoint request failed: ${response.statusText}`);
    }
    return await response.json();
    */
    await mockDelay(1500);

    return {
        summary: `[Mock Custom Endpoint] Analysis from ${endpoint} for a ${persona}.`,
        keyRequirements: [
            "[Mock Custom Endpoint] Requirement 1.",
        ],
        risks: [
            "[Mock Custom Endpoint] Risk 1.",
        ],
        recommendations: [
            "[Mock Custom Endpoint] Recommendation 1.",
        ],
    };
};

export const generateDiagram: AIProviderService['generateDiagram'] = async (prompt, settings): Promise<string> => {
    const endpoint = settings.customEndpoint;
    if (!endpoint) {
        throw new Error("Custom endpoint is not configured.");
    }
    console.log(`Using Custom Service at: ${endpoint} for diagrams`);
    // TODO: Implement API call to a diagram generation endpoint.
    await mockDelay(1000);

    return `\`\`\`mermaid
graph TD
    A[Custom Endpoint] --> B{Diagram Prompt};
    B --> C[Result from ${endpoint}];
\`\`\``;
};
