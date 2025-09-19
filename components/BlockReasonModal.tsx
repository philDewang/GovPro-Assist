import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Task } from '../types';

interface BlockReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    task: Task | null;
}

export const BlockReasonModal: React.FC<BlockReasonModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReason('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('A reason is required to block a task.');
            return;
        }
        onSubmit(reason.trim());
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Block Task: ${task?.name}`}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="block-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Please provide a reason for blocking this task.
                    </label>
                    <textarea
                        id="block-reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 ${
                            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        } bg-white dark:bg-gray-700`}
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Confirm Block
                    </button>
                </div>
            </div>
        </Modal>
    );
};
