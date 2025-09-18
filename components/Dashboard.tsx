import React, { useState } from 'react';
import { Role, AnalysisResult, AIProvider } from '../types';
import { FileUpload } from './FileUpload';
import { AnalysisResultDisplay } from './AnalysisResultDisplay';
import { Icon } from './Icon';
import { DiagramGenerator } from './DiagramGenerator';
import { PromptTemplateStoreModal } from './PromptTemplateStoreModal';


interface DashboardProps {
    currentRole: Role;
    files: File[];
    isLoading: boolean;
    error: string | null;
    analysisResult: AnalysisResult | null;
    handleFileSelect: (files: File[]) => void;
    handleAnalyze: (customPrompt?: string) => void;
    clearFiles: () => void;
    diagramPrompt: string;
    setDiagramPrompt: (prompt: string) => void;
    diagramCode: string | null;
    isDiagramLoading: boolean;
    diagramError: string | null;
    handleGenerateDiagram: () => void;
    aiProvider: AIProvider;
}

type Tab = 'Analysis' | 'Diagrams';

export const Dashboard: React.FC<DashboardProps> = (props) => {
    const {
        currentRole, files, isLoading, error, analysisResult,
        handleFileSelect, handleAnalyze, clearFiles,
        diagramPrompt, setDiagramPrompt, diagramCode,
        isDiagramLoading, diagramError, handleGenerateDiagram,
        aiProvider
    } = props;

    const [activeTab, setActiveTab] = useState<Tab>('Analysis');
    const [isPromptStoreOpen, setPromptStoreOpen] = useState(false);

    const handleAnalyzeWithTemplate = (finalPrompt: string) => {
        handleAnalyze(finalPrompt);
        setPromptStoreOpen(false);
    };


    const handleExport = () => {
        if (!analysisResult) return;
        
        const content = `
# AI Analysis Report

## Summary
${analysisResult.summary}

## Key Requirements
${analysisResult.keyRequirements.map(item => `- ${item}`).join('\n')}

## Risks & Challenges
${analysisResult.risks.map(item => `- ${item}`).join('\n')}

## Recommendations
${analysisResult.recommendations.map(item => `- ${item}`).join('\n')}
        `;

        const blob = new Blob([content.trim()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GovPro-Analysis-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const getProviderName = (provider: AIProvider) => {
        const names = {
            'google-gemini': 'Google Gemini',
            'openai': 'OpenAI',
            'azure': 'Azure AI',
            'huggingface': 'HuggingFace',
            'custom': 'Custom Model'
        };
        return names[provider];
    };

    const renderTabs = () => {
        const tabs: { id: Tab; label: string; icon: string, condition: boolean }[] = [
            { id: 'Analysis', label: 'AI Analysis', icon: 'ai', condition: true },
            { id: 'Diagrams', label: 'Diagram Generator', icon: 'diagram', condition: currentRole === "Technical Solutions" },
        ];

        return (
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.filter(tab => tab.condition).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                           <Icon name={tab.icon} className="mr-2 w-5 h-5" />
                           {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        );
    };

    const renderAnalysisPane = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">1. Upload Documents</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop RFI/RFP files. Analysis runs on text-based files.
                  </p>
                </div>
                {files.length > 0 ? (
                    <div className="space-y-2">
                        <div className="flex justify-end">
                            <button onClick={clearFiles} className="text-sm font-medium text-red-500 hover:text-red-700">
                                Clear All
                            </button>
                        </div>
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
                            {files.map(file => (
                                <div key={file.name} className="flex items-center justify-between text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        <Icon name="file" className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <span className="font-medium text-sm truncate" title={file.name}>{file.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <FileUpload onFileSelect={handleFileSelect} />
                )}
                 
                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">2. Choose Analysis Type</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select a pre-built template or fuse multiple templates for a more complex query.
                    </p>
                    <button 
                        onClick={() => setPromptStoreOpen(true)}
                        className="w-full text-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900"
                    >
                        Open Prompt Template Store
                    </button>
                 </div>
                 
                 <div className="flex-grow flex items-end">
                    <button
                        onClick={() => handleAnalyze()}
                        disabled={files.length === 0 || isLoading}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                           <Icon name="loading" className="animate-spin w-5 h-5 mr-3" />
                        ) : (
                           <Icon name="sparkles" className="w-5 h-5 mr-3" />
                        )}
                        <span>{isLoading ? 'Analyzing...' : `Analyze with ${getProviderName(aiProvider)}`}</span>
                    </button>
                 </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">3. AI Analysis Output</h3>
                    {analysisResult && (
                        <button onClick={handleExport} className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            <Icon name="export" className="w-4 h-4 mr-2" />
                            Export
                        </button>
                    )}
                 </div>
                <div className="h-full min-h-[300px]">
                  {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {!isLoading && !analysisResult && !error && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                            <Icon name="ai" className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-500"/>
                            <h4 className="text-lg font-medium">Analysis will appear here.</h4>
                            <p className="text-sm">Upload a document and choose an analysis type to get started.</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                            <Icon name="loading" className="animate-spin w-16 h-16 text-blue-500" />
                            <p className="mt-4 font-medium">AI is thinking...</p>
                            <p className="text-sm">This may take a moment.</p>
                        </div>
                    )}
                    {analysisResult && <AnalysisResultDisplay result={analysisResult} />}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <PromptTemplateStoreModal
                isOpen={isPromptStoreOpen}
                onClose={() => setPromptStoreOpen(false)}
                onSubmit={handleAnalyzeWithTemplate}
                isLoading={isLoading}
                role={currentRole}
                aiProvider={aiProvider}
            />

            {renderTabs()}
            <div className="mt-6">
                {activeTab === 'Analysis' && renderAnalysisPane()}
                {activeTab === 'Diagrams' && currentRole === "Technical Solutions" && (
                    <DiagramGenerator
                        prompt={diagramPrompt}
                        onPromptChange={setDiagramPrompt}
                        diagramCode={diagramCode}
                        isLoading={isDiagramLoading}
                        error={diagramError}
                        onGenerate={handleGenerateDiagram}
                    />
                )}
            </div>
        </div>
    );
};