import React, { useState } from 'react';
import { TeamMember, Task, TaskStatus, UserProfile, TeamsConfig } from '../types';
import { Icon } from './Icon';

interface KanbanBoardProps {
    tasks: Task[];
    team: TeamMember[];
    currentUser: UserProfile;
    onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
    onRemoveTask: (taskId: number) => void;
    onSelectTask: (task: Task) => void;
    onAddTask: (defaults: { status: TaskStatus }) => void;
    teamsConfig: TeamsConfig;
}

const statusMap: { [key in TaskStatus]: { title: string; color: string; } } = {
    todo: { title: 'To Do', color: 'bg-gray-400' },
    inprogress: { title: 'In Progress', color: 'bg-blue-500' },
    blocked: { title: 'Blocked', color: 'bg-red-500' },
    done: { title: 'Done', color: 'bg-green-500' },
};

const TaskCard: React.FC<{ task: Task; team: TeamMember[]; onSelect: () => void; isDraggable: boolean }> = ({ task, team, onSelect, isDraggable }) => {
    const assignedMember = team.find(m => m.id === task.assignedToId);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (!isDraggable) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData("taskId", task.id.toString());
    };

    const getDueDateStatus = (task: Task): { status: 'normal' | 'due-soon' | 'overdue', display: string } => {
        if (!task.dueDate) return { status: 'normal', display: '' };

        const now = new Date();
        const dueDateObj = new Date(task.dueDate);
        const diffHours = (dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        let displayDate = dueDateObj.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        if (task.dueDateTimezone) {
            displayDate += ` ${task.dueDateTimezone.replace(/_/g, ' ')}`;
        }

        if (diffHours < 0) {
            return { status: 'overdue', display: displayDate };
        }
        if (diffHours <= 48) {
            return { status: 'due-soon', display: displayDate };
        }
        return { status: 'normal', display: displayDate };
    };

    const { status: dueDateStatus, display: displayDate } = getDueDateStatus(task);

    const statusClasses = {
        'overdue': 'border-l-4 border-red-500',
        'due-soon': 'border-l-4 border-yellow-400',
        'normal': 'border-l-4 border-transparent',
    };
    
    const statusTextClasses = {
        'overdue': 'text-red-600 dark:text-red-400',
        'due-soon': 'text-yellow-600 dark:text-yellow-400',
        'normal': 'text-gray-500 dark:text-gray-400',
    };

    return (
        <div 
            draggable={isDraggable}
            onDragStart={handleDragStart}
            onClick={onSelect}
            className={`bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm space-y-2 hover:shadow-lg dark:hover:border-gray-500 transition-shadow ${isDraggable ? 'cursor-grab' : 'cursor-pointer'} ${statusClasses[dueDateStatus]}`}
        >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{task.name}</p>
            {task.status === 'blocked' && task.blockReason && (
                 <p className="text-xs text-red-600 dark:text-red-400 p-1.5 bg-red-50 dark:bg-red-900/40 rounded-md">
                     <strong>Blocked:</strong> {task.blockReason}
                 </p>
            )}
            <div className="flex justify-between items-center pt-2">
                {assignedMember && (
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                            {assignedMember.avatar}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{assignedMember.name}</span>
                    </div>
                )}
                 {displayDate && (
                    <div className={`flex items-center text-xs font-medium ${statusTextClasses[dueDateStatus]}`}>
                        <Icon name="clock" className="w-3 h-3 mr-1" />
                        <span>{displayDate}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ 
    status: TaskStatus; 
    tasks: Task[]; 
    team: TeamMember[];
    currentUser: UserProfile;
    onSelectTask: (task: Task) => void;
    onDrop: (status: TaskStatus, e: React.DragEvent<HTMLDivElement>) => void;
    onAddTask: (status: TaskStatus) => void;
}> = ({ status, tasks, team, currentUser, onSelectTask, onDrop, onAddTask }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };
    
    const handleDragLeave = () => setIsOver(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(status, e);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 w-1/4 flex flex-col">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 px-1 mb-3 flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${statusMap[status].color}`}></span>
                {statusMap[status].title}
                <span className="ml-2 text-sm text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full px-2">{tasks.length}</span>
            </h3>
            <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`space-y-3 flex-grow overflow-y-auto pr-1 rounded-md transition-colors ${isOver ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}
            >
                {tasks.map(task => (
                    <TaskCard 
                        key={task.id} 
                        task={task}
                        team={team}
                        onSelect={() => onSelectTask(task)}
                        isDraggable={task.assignedToId === currentUser.id}
                    />
                ))}
            </div>
            <button 
                onClick={() => onAddTask(status)}
                className="mt-3 w-full text-center px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
            >
                + Add Task
            </button>
        </div>
    );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, team, currentUser, onUpdateTaskStatus, onSelectTask, onAddTask, teamsConfig }) => {

    const tasksByStatus = {
        todo: tasks.filter(t => t.status === 'todo'),
        inprogress: tasks.filter(t => t.status === 'inprogress'),
        blocked: tasks.filter(t => t.status === 'blocked'),
        done: tasks.filter(t => t.status === 'done'),
    };
    
    const handleDrop = (newStatus: TaskStatus, e: React.DragEvent<HTMLDivElement>) => {
        const taskIdStr = e.dataTransfer.getData("taskId");
        if (taskIdStr) {
            const taskId = parseInt(taskIdStr, 10);
            const task = tasks.find(t => t.id === taskId);
            if (task && task.status !== newStatus && task.assignedToId === currentUser.id) {
                onUpdateTaskStatus(taskId, newStatus);
            }
        }
    };
    
    const handleAddTask = (status: TaskStatus) => {
        onAddTask({ status });
    };

    return (
        <div>
             {teamsConfig.syncWithPlanner && (
                <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-3 rounded-md mb-4 flex items-center text-sm">
                    <Icon name="check" className="w-5 h-5 mr-3" />
                    This board is synchronized with Microsoft Planner in the '{teamsConfig.selectedChannel}' channel. (Mock UI)
                </div>
            )}
            <div className="flex space-x-4 h-[65vh]">
                {(Object.keys(statusMap) as TaskStatus[]).map(status => (
                    <KanbanColumn 
                        key={status} 
                        status={status} 
                        tasks={tasksByStatus[status]}
                        team={team}
                        currentUser={currentUser}
                        onSelectTask={onSelectTask}
                        onDrop={handleDrop}
                        onAddTask={handleAddTask}
                    />
                ))}
            </div>
        </div>
    );
};