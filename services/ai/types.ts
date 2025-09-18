import { AnalysisResult, AISettings } from '../../types';

export interface AIProviderService {
  analyzeDocument: (
    documentContent: string,
    persona: string,
    settings: AISettings,
    customPrompt?: string
  ) => Promise<AnalysisResult>;

  generateDiagram: (
    prompt: string,
    settings: AISettings
  ) => Promise<string>;
}
