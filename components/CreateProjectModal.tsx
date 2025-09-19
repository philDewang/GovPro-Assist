
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { WorkflowTemplate } from '../types';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string, templateId: string) => void;
    templates: WorkflowTemplate[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate, templates }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [templateId, setTemplateId] = useState<string>(templates.length > 0 ? templates[0].id : '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setTemplateId(templates.length > 0 ? templates[0].id : '');
            setError('');
        }
    }, [isOpen, templates]);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Project name is required.');
            return;
        }
        onCreate(name.trim(), description.trim(), templateId);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700`}
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Workflow Template</label>
                    <select
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md"
                    >
                        {templates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
                    </select>
                </div>
                <button onClick={handleSubmit} className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Create Project
                </button>
            </div>
        </Modal>
    );
};
