import { AnalysisResult } from '../../types';
import { AIProviderService } from "./types";

const mockDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzeDocument: AIProviderService['analyzeDocument'] = async (
    documentContent,
    persona,
    settings,
    customPrompt,
): Promise<AnalysisResult> => {
    console.log("Using Mock Azure AI Service");
    // TODO: Implement actual Azure OpenAI API call here.
    // This would use credentials from environment variables and potentially a custom endpoint if configured.
    await mockDelay(1500);

    return {
        summary: `[Mock Azure AI] The document has been analyzed from the perspective of a ${persona}. It focuses on a high-value contract.`,
        keyRequirements: [
            "[Mock Azure AI] Compliance with ISO 27001 is mandatory.",
            "[Mock Azure AI] The solution must be cloud-native.",
        ],
        risks: [
            "[Mock Azure AI] The budget is not clearly defined in the document.",
        ],
        recommendations: [
            "[Mock Azure AI] Form a working group to estimate the project cost.",
            "[Mock Azure AI] Verify our current ISO 27001 certification status.",
        ],
    };
};

export const generateDiagram: AIProviderService['generateDiagram'] = async (prompt, settings): Promise<string> => {
    console.log("Using Mock Azure AI Service for diagrams");
    // TODO: Implement actual Azure API call for diagram generation.
    await mockDelay(1000);

    return `\`\`\`mermaid
graph TD
    A[Mock Azure AI] --> B{Request: ${prompt}};
    B --> C[Mermaid Code Created];
\`\`\``;
};
