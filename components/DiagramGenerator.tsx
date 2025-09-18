
import React from 'react';
import { Icon } from './Icon';

interface DiagramGeneratorProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    diagramCode: string | null;
    isLoading: boolean;
    error: string | null;
    onGenerate: () => void;
}

export const DiagramGenerator: React.FC<DiagramGeneratorProps> = ({
    prompt,
    onPromptChange,
    diagramCode,
    isLoading,
    error,
    onGenerate
}) => {
    
    const handleCopyToClipboard = () => {
        if (diagramCode) {
            navigator.clipboard.writeText(`\`\`\`mermaid\n${diagramCode}\n\`\`\``);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. Describe Your Diagram</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Explain the process, architecture, or flowchart you want to visualize. The AI will generate the diagram in MermaidJS syntax.
                </p>
                <textarea
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    rows={8}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Create a sequence diagram for a user logging into a web application."
                />
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="mt-4 w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                       <Icon name="loading" className="animate-spin w-5 h-5 mr-3" />
                    ) : (
                       <Icon name="diagram" className="w-5 h-5 mr-3" />
                    )}
                    <span>{isLoading ? 'Generating...' : 'Generate Diagram'}</span>
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. Generated Diagram Code</h3>
                 <div className="h-full min-h-[300px]">
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {!isLoading && !diagramCode && !error && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                            <Icon name="diagram" className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-500"/>
                            <h4 className="text-lg font-medium">Diagram code will appear here.</h4>
                            <p className="text-sm">Describe your diagram and click "Generate".</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                            <Icon name="loading" className="animate-spin w-16 h-16 text-blue-500" />
                            <p className="mt-4 font-medium">AI is generating diagram...</p>
                        </div>
                    )}
                    {diagramCode && (
                        <div className="relative h-full">
                            <button onClick={handleCopyToClipboard} className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-600 dark:text-gray-100 rounded hover:bg-gray-200 dark:hover:bg-gray-500">
                                Copy Code
                            </button>
                            <pre className="bg-gray-900 text-white p-4 rounded-lg h-full overflow-auto text-sm">
                                <code>{diagramCode}</code>
                            </pre>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This is MermaidJS syntax. You can paste it into any Mermaid-compatible renderer.</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};
