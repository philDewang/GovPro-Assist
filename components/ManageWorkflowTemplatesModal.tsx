import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { WorkflowTemplate, WorkflowStepDefinition } from '../types';

interface ManageWorkflowTemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: WorkflowTemplate[];
    onUpdateTemplates: (templates: WorkflowTemplate[]) => void;
}

const emptyCustomTemplate: WorkflowTemplate = {
    id: `custom_${Date.now()}`,
    name: 'New Custom Template',
    description: 'A new workflow for our team.',
    steps: [{ id: 'step_1', icon: 'edit', title: 'New Step', description: 'Describe this step.' }],
    isCustom: true,
};

export const ManageWorkflowTemplatesModal: React.FC<ManageWorkflowTemplatesModalProps> = ({ isOpen, onClose, templates, onUpdateTemplates }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate>(templates[0]);
    const [editedTemplate, setEditedTemplate] = useState<WorkflowTemplate>(templates[0]);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initialTemplate = templates.length > 0 ? templates[0] : emptyCustomTemplate;
            setSelectedTemplate(initialTemplate);
            setEditedTemplate(initialTemplate);
            setIsCreatingNew(false);
        }
    }, [isOpen, templates]);

    const handleSelectTemplate = (template: WorkflowTemplate) => {
        setSelectedTemplate(template);
        setEditedTemplate(template);
        setIsCreatingNew(false);
    };

    const handleCreateNew = () => {
        const newTemplate = { ...emptyCustomTemplate, id: `custom_${Date.now()}` };
        setSelectedTemplate(newTemplate);
        setEditedTemplate(newTemplate);
        setIsCreatingNew(true);
    };
    
    const handleSave = () => {
        let newTemplates;
        if (isCreatingNew) {
            newTemplates = [...templates, { ...editedTemplate, isCustom: true }];
        } else {
            newTemplates = templates.map(t => t.id === editedTemplate.id ? editedTemplate : t);
        }
        onUpdateTemplates(newTemplates);
        onClose();
    };

    const handleDelete = (templateId: string) => {
        const newTemplates = templates.filter(t => t.id !== templateId);
        onUpdateTemplates(newTemplates);
        if (selectedTemplate.id === templateId) {
           onClose(); // Close if we deleted the one we are viewing
        }
    };
    
    const handleStepChange = (index: number, field: keyof WorkflowStepDefinition, value: string) => {
        const newSteps = [...editedTemplate.steps];
        // @ts-ignore
        newSteps[index][field] = value;
        setEditedTemplate({ ...editedTemplate, steps: newSteps });
    };

    const addStep = () => {
        const newStep: WorkflowStepDefinition = { id: `step_${Date.now()}`, icon: 'edit', title: 'New Step', description: '' };
        setEditedTemplate({ ...editedTemplate, steps: [...editedTemplate.steps, newStep] });
    };
    
    const removeStep = (index: number) => {
        const newSteps = editedTemplate.steps.filter((_, i) => i !== index);
        setEditedTemplate({ ...editedTemplate, steps: newSteps });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Workflow Templates">
            <div className="flex flex-col md:flex-row gap-6 max-h-[70vh]">
                <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4 overflow-y-auto">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Templates</h4>
                    <ul className="space-y-2">
                        {templates.map(t => (
                            <li key={t.id}>
                                <button onClick={() => handleSelectTemplate(t)} className={`w-full text-left p-2 rounded-md ${selectedTemplate.id === t.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    {t.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleCreateNew} className="w-full text-left p-2 rounded-md mt-4 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40">
                        + Create New Template
                    </button>
                </div>

                <div className="w-full md:w-2/3 overflow-y-auto pr-2">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template Name</label>
                            <input 
                                type="text" 
                                value={editedTemplate.name}
                                onChange={e => setEditedTemplate({...editedTemplate, name: e.target.value})}
                                disabled={!editedTemplate.isCustom && !isCreatingNew}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md py-2 px-3 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                rows={2}
                                value={editedTemplate.description}
                                onChange={e => setEditedTemplate({...editedTemplate, description: e.target.value})}
                                disabled={!editedTemplate.isCustom && !isCreatingNew}
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md py-2 px-3 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                            />
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Workflow Steps</h4>
                            <div className="space-y-3">
                                {editedTemplate.steps.map((step, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-bold text-gray-500">STEP {index + 1}</p>
                                            { (editedTemplate.isCustom || isCreatingNew) && 
                                                <button onClick={() => removeStep(index)} className="text-gray-400 hover:text-red-500">
                                                    <Icon name="trash" className="w-4 h-4" />
                                                </button>
                                            }
                                        </div>
                                        <input type="text" placeholder="Step Title" value={step.title} onChange={e => handleStepChange(index, 'title', e.target.value)} disabled={!editedTemplate.isCustom && !isCreatingNew} className="w-full text-sm font-semibold border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"/>
                                        <textarea rows={2} placeholder="Step Description" value={step.description} onChange={e => handleStepChange(index, 'description', e.target.value)} disabled={!editedTemplate.isCustom && !isCreatingNew} className="w-full text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md p-1"/>
                                    </div>
                                ))}
                                { (editedTemplate.isCustom || isCreatingNew) &&
                                    <button onClick={addStep} className="w-full text-center py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-md">
                                        + Add Step
                                    </button>
                                }
                            </div>
                        </div>

                         <div className="flex justify-end items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                             { (editedTemplate.isCustom || isCreatingNew) ? (
                                <>
                                { !isCreatingNew && 
                                    <button onClick={() => handleDelete(editedTemplate.id)} className="text-sm font-medium text-red-600 hover:text-red-800">
                                        Delete Template
                                    </button>
                                }
                                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                    {isCreatingNew ? 'Create Template' : 'Save Changes'}
                                </button>
                                </>
                             ) : (
                                <p className="text-xs text-gray-500 dark:text-gray-400">Pre-built templates cannot be edited.</p>
                             )}
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
};