import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Icon } from './Icon';

const DOCS = [
    { name: 'User\'s Guide', path: '/docs/users_guide/USERS_GUIDE.md' },
    { name: 'Requirements', path: '/docs/requirements/REQUIREMENTS.md' },
    { name: 'Refactor Summary', path: '/docs/reviews/REFACTOR_SUMMARY.md' },
    { name: 'Detailed Code Review', path: '/docs/reviews/DETAILED_CODE_REVIEW.md' },
];

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
                    {listItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            );
            listItems = [];
        }
    };
    
    const flushCodeBlock = () => {
        if (codeBlockContent) {
            elements.push(
                <pre key={`pre-${elements.length}`} className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-md text-sm text-gray-800 dark:text-gray-200 overflow-x-auto mb-4">
                    <code>{codeBlockContent.trim()}</code>
                </pre>
            );
            codeBlockContent = '';
        }
    }


    lines.forEach((line, index) => {
         if (line.startsWith('```')) {
            if (inCodeBlock) {
                flushCodeBlock();
            } else {
                flushList();
            }
            inCodeBlock = !inCodeBlock;
            return;
        }

        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            return;
        }

        if (line.startsWith('# ')) {
            flushList();
            elements.push(<h1 key={index} className="text-3xl font-bold mb-4 mt-6 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">{line.substring(2)}</h1>);
        } else if (line.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={index} className="text-2xl font-semibold mb-3 mt-5 text-gray-900 dark:text-gray-100">{line.substring(3)}</h2>);
        } else if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={index} className="text-xl font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100">{line.substring(4)}</h3>);
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            listItems.push(line.substring(2));
        } else if (line.trim() === '') {
            flushList();
            // We can add a vertical spacer for empty lines if desired, but for now we'll just break the paragraph.
        } else {
            flushList();
            elements.push(<p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>);
        }
    });

    flushList(); // Make sure any trailing list gets rendered
    flushCodeBlock(); // Make sure any trailing code block gets rendered

    return <>{elements}</>;
};

export const Docs: React.FC = () => {
    const [selectedDoc, setSelectedDoc] = useState(DOCS[0]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDoc = useCallback(async (path: string) => {
        setIsLoading(true);
        setError(null);
        setContent('');
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load document: ${response.status} ${response.statusText}`);
            }
            const text = await response.text();
            setContent(text);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred while fetching the document.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedDoc) {
            fetchDoc(selectedDoc.path);
        }
    }, [selectedDoc, fetchDoc]);

    return (
        <div className="flex flex-col md:flex-row h-full max-h-[85vh] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                    <Icon name="info" className="w-6 h-6 mr-3 text-blue-600" />
                    Documentation
                </h2>
                <ul className="space-y-1">
                    {DOCS.map(doc => (
                        <li key={doc.path}>
                            <button 
                                onClick={() => setSelectedDoc(doc)}
                                className={`w-full text-left p-2 rounded-md text-sm font-medium transition-colors ${
                                    selectedDoc.path === doc.path 
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                aria-current={selectedDoc.path === doc.path ? 'page' : undefined}
                            >
                                {doc.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            
            <main className="flex-1 p-6 md:p-8 overflow-y-auto" aria-live="polite">
                {isLoading && (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <Icon name="loading" className="animate-spin w-8 h-8 mr-3" />
                        <span>Loading document...</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && (
                     <article>
                        <MarkdownRenderer content={content} />
                     </article>
                )}
            </main>
        </div>
    );
};