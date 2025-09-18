import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Task, TeamMember, TaskStatus, WorkflowStepDefinition } from '../types';
import { timezones } from '../constants';


interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: TeamMember[];
    onAddTask: (task: Omit<Task, 'id'>) => void;
    workflowSteps: WorkflowStepDefinition[];
    defaults?: { assignedToId?: number; status?: TaskStatus };
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, team, onAddTask, workflowSteps, defaults }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [assignedToId, setAssignedToId] = useState<number>(defaults?.assignedToId || (team.length > 0 ? team[0].id : 0));
    const [workflowStep, setWorkflowStep] = useState<string>(workflowSteps.length > 0 ? workflowSteps[0].id : '');
    const [status, setStatus] = useState<TaskStatus>(defaults?.status || 'todo');
    const [dueDate, setDueDate] = useState('');
    const [dueDateTimezone, setDueDateTimezone] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setAssignedToId(defaults?.assignedToId || (team.length > 0 ? team[0].id : 0));
            setStatus(defaults?.status || 'todo');
            setWorkflowStep(workflowSteps.length > 0 ? workflowSteps[0].id : '');
            setDueDate('');
            setDueDateTimezone('');
            setError('');
        }
    }, [isOpen, defaults, team, workflowSteps]);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Task Name is a required field.');
            return;
        }
        if (!assignedToId) {
             setError('Please assign the task to a team member.');
            return;
        }
        onAddTask({
            name: name.trim(),
            description: description.trim(),
            assignedToId,
            status,
            updates: [],
            workflowStep,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            dueDateTimezone: dueDateTimezone || undefined
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700`}
                    />
                     {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                    <textarea 
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign To</label>
                    <select value={assignedToId} onChange={e => setAssignedToId(parseInt(e.target.value))} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md">
                        {team.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Workflow Step</label>
                    <select value={workflowStep} onChange={e => setWorkflowStep(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md">
                        {workflowSteps.map(step => <option key={step.id} value={step.id}>{step.title}</option>)}
                    </select>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                        <input 
                            type="datetime-local"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                         <select value={dueDateTimezone} onChange={e => setDueDateTimezone(e.target.value)} className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md py-2 px-3 text-sm">
                             <option value="">-- Select Timezone --</option>
                            {timezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={handleSubmit} className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Create Task
                </button>
            </div>
        </Modal>
    );
};