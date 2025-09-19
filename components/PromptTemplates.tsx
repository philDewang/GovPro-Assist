import React from 'react';
import { Icon } from './Icon';
import { PromptTemplate } from '../types';

interface PromptTemplatesProps {
    onSelectTemplate: (template: PromptTemplate) => void;
}

const templates: PromptTemplate[] = [
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
];

const TemplateCard: React.FC<{ template: PromptTemplate; onSelect: () => void }> = ({ template, onSelect }) => (
    <button onClick={onSelect} className="w-full text-left bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:border-gray-500 transition-shadow">
        <div className="flex items-center space-x-3">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-lg p-2">
                <Icon name={template.icon} className="w-5 h-5" />
            </div>
            <div>
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{template.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
            </div>
        </div>
    </button>
);


export const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectTemplate }) => {
    return (
        <div className="space-y-3">
            {templates.map(template => (
                <TemplateCard key={template.id} template={template} onSelect={() => onSelectTemplate(template)} />
            ))}
        </div>
    );
};
