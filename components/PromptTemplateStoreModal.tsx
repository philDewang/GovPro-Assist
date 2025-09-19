import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from './Modal';
import { PromptTemplate, Role, AIProvider } from '../types';
import { Icon } from './Icon';

interface PromptTemplateStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (finalPrompt: string) => void;
    isLoading: boolean;
    role: Role;
    aiProvider: AIProvider;
}

const ALL_TEMPLATES: PromptTemplate[] = [
    {
        id: 'swot',
        title: 'SWOT Analysis',
        description: 'Analyze strengths, weaknesses, opportunities, and threats.',
        icon: 'risks',
        template: 'Perform a SWOT analysis based on the document. Our company strengths are [Our Strengths]. Our main competitor is [Competitor A].'
    },
    {
        id: 'compliance',
        title: 'Compliance Check',
        description: 'Identify all explicit requirements and constraints.',
        icon: 'requirements',
        template: 'Create a compliance matrix from the document. List every explicit requirement, constraint, and deliverable mentioned.'
    },
    {
        id: 'summary',
        title: 'Executive Summary',
        description: 'Generate a high-level summary for leadership.',
        icon: 'summary',
        template: 'Generate a one-page executive summary suitable for a CEO. Focus on the total contract value, key deadlines, and our strategic alignment with the opportunity.'
    },
     {
        id: 'tech_stack',
        title: 'Tech Stack Identification',
        description: 'Identify required technologies and platforms.',
        icon: 'diagram',
        template: 'Based on the technical requirements in the document, identify all mentioned or implied technologies, programming languages, cloud services, and software platforms. Our current primary tech stack is [Our Tech Stack].'
    },
];

const TemplateCard: React.FC<{ template: PromptTemplate; onSelect: () => void, isSelected: boolean, isDisabled: boolean }> = ({ template, onSelect, isSelected, isDisabled }) => (
    <div
      onClick={isDisabled && !isSelected ? undefined : onSelect}
      className={`w-full text-left bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 shadow-md'
          : isDisabled
          ? 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
          : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer'
      }`}
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                    <Icon name={template.icon} className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{template.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
                </div>
            </div>
            {isSelected && <Icon name="check" className="w-6 h-6 text-blue-500" />}
        </div>
    </div>
);

const TemplateForm: React.FC<{ template: PromptTemplate, formState: { [key: string]: string }, onInputChange: (placeholder: string, value: string) => void }> = ({ template, formState, onInputChange }) => {
    const placeholders = useMemo(() => {
        const regex = /\[(.*?)\]/g;
        return (template.template.match(regex) || []).map(match => match.slice(1, -1));
    }, [template.template]);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{template.title}</h4>
            {placeholders.map(placeholder => (
                 <div key={`${template.id}-${placeholder}`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{placeholder}</label>
                    <textarea
                        rows={2}
                        value={formState[placeholder] || ''}
                        onChange={(e) => onInputChange(placeholder, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            ))}
        </div>
    );
}

export const PromptTemplateStoreModal: React.FC<PromptTemplateStoreModalProps> = ({ isOpen, onClose, onSubmit, isLoading, role, aiProvider }) => {
    
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [formState, setFormState] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if(isOpen) {
            setSelectedIds(new Set());
            setFormState({});
        }
    }, [isOpen]);
    
    const selectedTemplates = useMemo(() => ALL_TEMPLATES.filter(t => selectedIds.has(t.id)), [selectedIds]);

    const handleSelectTemplate = (templateId: string) => {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(templateId)) {
            newSelectedIds.delete(templateId);
        } else if (newSelectedIds.size < 3) {
            newSelectedIds.add(templateId);
        }
        setSelectedIds(newSelectedIds);
    };

    const handleInputChange = (placeholder: string, value: string) => {
        setFormState(prev => ({ ...prev, [placeholder]: value }));
    };

    const handleSubmit = () => {
        const fusedPrompts = selectedTemplates.map(template => {
            let prompt = template.template;
            const placeholders = (template.template.match(/\[(.*?)\]/g) || []).map(m => m.slice(1,-1));
            placeholders.forEach(p => {
                prompt = prompt.replace(`[${p}]`, formState[p] || `(not provided)`);
            });
            return prompt;
        });

        const finalPrompt = `Perform the following analyses based on the document provided:\n\n--- Analysis 1 ---\n${fusedPrompts.join('\n\n--- Analysis 2 ---\n')}`;
        onSubmit(finalPrompt);
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Prompt Template Store">
            <div className="flex flex-col md:flex-row gap-6 max-h-[70vh]">
                <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4 overflow-y-auto">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Select up to 3 templates</h4>
                    <div className="space-y-3">
                        {ALL_TEMPLATES.map(template => (
                            <TemplateCard 
                                key={template.id}
                                template={template}
                                isSelected={selectedIds.has(template.id)}
                                isDisabled={selectedIds.size >= 3 && !selectedIds.has(template.id)}
                                onSelect={() => handleSelectTemplate(template.id)}
                            />
                        ))}
                    </div>
                </div>
                 <div className="w-full md:w-2/3 overflow-y-auto pr-2 space-y-4">
                     {selectedTemplates.length > 0 ? (
                        <>
                        {selectedTemplates.map(template => (
                            <TemplateForm key={template.id} template={template} formState={formState} onInputChange={handleInputChange} />
                        ))}
                         <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="mt-4 w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                               <Icon name="loading" className="animate-spin w-5 h-5 mr-3" />
                            ) : (
                               <Icon name="sparkles" className="w-5 h-5 mr-3" />
                            )}
                            <span>{isLoading ? 'Analyzing...' : `Analyze with ${getProviderName(aiProvider)}`}</span>
                        </button>
                        </>
                     ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                            <h4 className="text-lg font-medium">Select a template to begin.</h4>
                            <p className="text-sm">Your selected template forms will appear here.</p>
                        </div>
                     )}
                 </div>
            </div>
        </Modal>
    );
};