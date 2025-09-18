import React from 'react';
import { AnalysisResult } from '../types';
import { Icon } from './Icon';

interface AnalysisResultDisplayProps {
    result: AnalysisResult;
}

const ResultSection: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-6">
        <h4 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <Icon name={icon} className="w-6 h-6 mr-3 text-blue-600" />
            {title}
        </h4>
        {children}
    </div>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="space-y-2 pl-5">
        {items.map((item, index) => (
            <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                <Icon name="bullet" className="w-4 h-4 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
    return (
        <div className="animate-fade-in h-full overflow-y-auto pr-2">
            <ResultSection title="Summary" icon="summary">
                <p className="text-gray-600 dark:text-gray-300">{result.summary}</p>
            </ResultSection>

            <ResultSection title="Key Requirements" icon="requirements">
                <BulletList items={result.keyRequirements} />
            </ResultSection>

            <ResultSection title="Risks & Challenges" icon="risks">
                <BulletList items={result.risks} />
            </ResultSection>

            <ResultSection title="Recommendations" icon="recommendations">
                <BulletList items={result.recommendations} />
            </ResultSection>
        </div>
    );
};