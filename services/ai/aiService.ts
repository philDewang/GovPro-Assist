import { AISettings, AnalysisResult } from '../../types';
import * as googleGeminiService from './googleGeminiService';
import * as openAIService from './openAIService';
import * as azureService from './azureService';
import * as huggingFaceService from './huggingFaceService';
import * as customService from './customService';
import { AIProviderService } from './types';

const getProvider = (settings: AISettings): AIProviderService => {
    switch (settings.provider) {
        case 'openai':
            return openAIService;
        case 'azure':
            return azureService;
        case 'huggingface':
            return huggingFaceService;
        case 'custom':
            return customService;
        case 'google-gemini':
        default:
            return googleGeminiService;
    }
};

export const analyzeDocument = async (
    documentContent: string,
    persona: string,
    settings: AISettings,
    customPrompt?: string,
): Promise<AnalysisResult> => {
    const provider = getProvider(settings);
    return provider.analyzeDocument(documentContent, persona, settings, customPrompt);
};

export const generateDiagram = async (
    prompt: string,
    settings: AISettings,
): Promise<string> => {
    const provider = getProvider(settings);
    return provider.generateDiagram(prompt, settings);
};
