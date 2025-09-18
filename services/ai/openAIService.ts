import { AnalysisResult } from '../../types';
import { AIProviderService } from "./types";

const mockDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzeDocument: AIProviderService['analyzeDocument'] = async (
    documentContent,
    persona,
    settings,
    customPrompt,
): Promise<AnalysisResult> => {
    console.log("Using Mock OpenAI Service");
    // TODO: Implement actual OpenAI API call here.
    // Assumes an API key is available via environment variables, e.g., process.env.OPENAI_API_KEY
    await mockDelay(1500);

    return {
        summary: `[Mock OpenAI] Based on your role as a ${persona}, this document outlines a new project opportunity.`,
        keyRequirements: [
            "[Mock OpenAI] Requirement A from the document.",
            "[Mock OpenAI] Requirement B, which seems critical.",
            "[Mock OpenAI] A deadline of Q4 is mentioned.",
        ],
        risks: [
            "[Mock OpenAI] The timeline appears aggressive.",
            "[Mock OpenAI] There is a potential dependency on a third-party vendor.",
        ],
        recommendations: [
            "[Mock OpenAI] Schedule a meeting to clarify Requirement B.",
            "[Mock OpenAI] Begin assembling a project team immediately.",
        ],
    };
};

export const generateDiagram: AIProviderService['generateDiagram'] = async (prompt, settings): Promise<string> => {
    console.log("Using Mock OpenAI Service for diagrams");
    // TODO: Implement actual OpenAI API call for diagram generation.
    await mockDelay(1000);

    return `\`\`\`mermaid
graph TD
    A[Mock OpenAI Start] --> B{User Prompt: ${prompt}};
    B --> C[Diagram Generated];
\`\`\``;
};
