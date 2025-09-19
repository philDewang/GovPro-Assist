import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Task, TeamMember } from '../types';
import { Icon } from './Icon';
import { timezones } from '../constants';


interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    team: TeamMember[];
    onUpdateTask: (task: Task) => void;
    onRequestBlockTask: (taskId: number) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task, team, onUpdateTask, onRequestBlockTask }) => {
    const [newUpdate, setNewUpdate] = useState('');
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        // When the modal is opened with a new task, reset the internal state
        if (isOpen) {
            setEditedTask(task);
        }
    }, [isOpen, task]);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddUpdate = () => {
        if (newUpdate.trim()) {
            const updatedTask = { ...editedTask, updates: [...editedTask.updates, newUpdate.trim()] };
            setEditedTask(updatedTask);
            onUpdateTask(updatedTask);
            setNewUpdate('');
        }
    };
    
    const handleReassign = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAssigneeId = parseInt(e.target.value, 10);
        const updatedTask = { ...editedTask, assignedToId: newAssigneeId };
        setEditedTask(updatedTask);
        onUpdateTask(updatedTask);
    };

    const handleDateChange = (field: 'dueDate' | 'dueDateTimezone', value: string) => {
        const updatedTask = { ...editedTask, [field]: value ? (field === 'dueDate' ? new Date(value).toISOString() : value) : undefined };
        setEditedTask(updatedTask);
        onUpdateTask(updatedTask);
    };
    
    const handleSendInvite = (target: 'assignee' | 'team') => {
        // This is a mocked function.
        // In a real app, you would use the MS Graph API to create a calendar event.
        const assigneeName = team.find(m => m.id === editedTask.assignedToId)?.name || 'the assignee';
        const message = target === 'assignee' 
            ? `(Mock) Calendar invite sent to ${assigneeName}.`
            : `(Mock) Calendar invite sent to the entire team.`;
        showNotification(message);
    };

    const handleBlockClick = () => {
        onRequestBlockTask(task.id);
        onClose();
    };

    const getFormattedDueDate = (isoString?: string) => {
        if (!isoString) return '';
        try {
            const date = new Date(isoString);
            const offset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - offset);
            return localDate.toISOString().slice(0, 16);
        } catch (e) {
            return '';
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={editedTask.name}>
             {notification && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 text-sm rounded-md shadow-lg animate-fade-in z-50">
                    {notification}
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <p className="text-sm text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 p-3 rounded-md mt-1">
                        {editedTask.description || 'No description provided.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</label>
                        <select value={editedTask.assignedToId} onChange={handleReassign} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3">
                            {team.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                    </div>
                    <div />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                        <input 
                            type="datetime-local"
                            value={getFormattedDueDate(editedTask.dueDate)}
                            onChange={(e) => handleDateChange('dueDate', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                         <select 
                            value={editedTask.dueDateTimezone || ''} 
                            onChange={(e) => handleDateChange('dueDateTimezone', e.target.value)} 
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md py-2 px-3 text-sm"
                         >
                             <option value="">-- Select Timezone --</option>
                            {timezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                </div>

                 <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Calendar</h4>
                    <div className="flex space-x-2">
                        <button onClick={() => handleSendInvite('assignee')} className="flex-1 text-sm py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">Send Invite to Assignee</button>
                        <button onClick={() => handleSendInvite('team')} className="flex-1 text-sm py-2 px-4 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Send Invite to Team</button>
                    </div>
                </div>

                 <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Actions</h4>
                    <button 
                        onClick={handleBlockClick}
                        className="w-full text-sm py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700 flex items-center justify-center space-x-2"
                    >
                        <Icon name="risks" className="w-4 h-4" />
                        <span>Block This Task</span>
                    </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Updates & Comments</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {editedTask.updates.length > 0 ? (
                            editedTask.updates.map((update, index) => (
                                <div key={index} className="text-sm bg-blue-50 dark:bg-blue-900/50 p-2 rounded-md text-blue-800 dark:text-blue-200">
                                    {update}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No updates yet.</p>
                        )}
                    </div>
                    <div className="flex space-x-2 mt-4">
                        <input 
                            type="text" 
                            value={newUpdate} 
                            onChange={(e) => setNewUpdate(e.target.value)}
                            placeholder="Add an update..."
                            className="flex-grow mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"
                        />
                        <button onClick={handleAddUpdate} className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">Add</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};