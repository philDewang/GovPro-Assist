
import React from 'react';
import { Modal } from './Modal';
import { Task } from '../types';
import { Icon } from './Icon';

interface BlockedStepModalProps {
    isOpen: boolean;
    onClose: () => void;
    stepTitle: string;
    tasks: Task[];
}

export const BlockedStepModal: React.FC<BlockedStepModalProps> = ({ isOpen, onClose, stepTitle, tasks }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Blocked Stage: ${stepTitle}`}>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        This workflow step is blocked. The following tasks must be resolved before progress can continue.
                    </p>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-red-50 dark:bg-red-900/40 p-3 rounded-md border-l-4 border-red-500">
                            <h4 className="font-semibold text-red-800 dark:text-red-200">{task.name}</h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                <strong>Reason:</strong> {task.blockReason}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 p-3 rounded-md text-sm flex items-center">
                     <Icon name="info" className="w-5 h-5 mr-3 flex-shrink-0" />
                     <span>The Capture Manager and Strategic Reviewer have been notified of this blockage.</span>
                </div>
            </div>
        </Modal>
    );
};
