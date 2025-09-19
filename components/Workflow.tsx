
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { Role, TeamMember, Task, TaskStatus, WorkflowTemplate, WorkflowStepDefinition, UserProfile, TeamsConfig } from '../types';
import { Modal } from './Modal';
import { KanbanBoard } from './KanbanBoard';
import { TaskDetailModal } from './TaskDetailModal';
import { AddTaskModal } from './AddTaskModal';
import { BlockedStepModal } from './BlockedStepModal';

const TeamMemberCard: React.FC<{ member: TeamMember; taskCount: number; onRemove: () => void; onAddTask: () => void }> = ({ member, taskCount, onRemove, onAddTask }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {member.avatar}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{taskCount} task(s)</p>
            </div>
            <button onClick={onRemove} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                <Icon name="trash" className="w-5 h-5" />
            </button>
        </div>
        <div className="mt-4 flex-grow">
            <button onClick={onAddTask} className="w-full text-center px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                Add Task
            </button>
        </div>
    </div>
);

interface WorkflowProps {
    currentUser: UserProfile;
    team: TeamMember[];
    setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    onUpdateTask: (task: Task) => void;
    onAddTask: (task: Omit<Task, 'id'>) => void;
    onRequestBlockTask: (taskId: number) => void;
    onNotifyBlockedStep: (step: WorkflowStepDefinition) => void;
    availableTemplates: WorkflowTemplate[];
    activeTemplate: WorkflowTemplate;
    onChangeTemplate: (templateId: string) => void;
    teamsConfig: TeamsConfig;
}

type StepStatus = 'blocked' | 'complete' | 'current' | 'todo' | 'upcoming';

const getDueDateStatus = (task: Task): { status: 'normal' | 'due-soon' | 'overdue', display: string } => {
    if (!task.dueDate) return { status: 'normal', display: '' };

    const now = new Date();
    const dueDateObj = new Date(task.dueDate);
    const diffHours = (dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let displayDate = dueDateObj.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    if (task.dueDateTimezone) {
        displayDate += ` ${task.dueDateTimezone}`;
    }

    if (diffHours < 0) {
        return { status: 'overdue', display: displayDate };
    }
    if (diffHours <= 48) {
        return { status: 'due-soon', display: displayDate };
    }
    return { status: 'normal', display: displayDate };
};


export const Workflow: React.FC<WorkflowProps> = (props) => {
    const { 
        currentUser, team, setTeam, tasks, setTasks, onUpdateTask, onAddTask, onRequestBlockTask, onNotifyBlockedStep,
        availableTemplates, activeTemplate, onChangeTemplate, teamsConfig 
    } = props;
    
    const WORKFLOW_STEPS = activeTemplate.steps;

    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [isBlockedStepModalOpen, setBlockedStepModalOpen] = useState(false);
    
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [activeWorkflowStep, setActiveWorkflowStep] = useState<WorkflowStepDefinition | null>(null);
    const [blockingTasks, setBlockingTasks] = useState<Task[]>([]);
    const [taskDefaults, setTaskDefaults] = useState<{ assignedToId?: number; status?: TaskStatus }>({});

    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<Role>("Writer");
    
    const [view, setView] = useState<'workflow' | 'kanban'>('workflow');
    const [boardView, setBoardView] = useState<'team' | 'my'>('team');

    const handleAssignMember = () => {
        if (!newMemberName) return;
        const newMember: TeamMember = {
            id: Date.now(), name: newMemberName, role: newMemberRole,
            avatar: newMemberName.split(' ').map(n => n[0]).join('').toUpperCase(),
            email: `${newMemberName.toLowerCase().replace(' ','_')}@govpro.com`,
            title: newMemberRole,
        };
        setTeam([...team, newMember]);
        setNewMemberName('');
        setNewMemberRole("Writer");
        setAssignModalOpen(false);
    };

    const handleRemoveMember = (memberId: number) => {
        setTeam(team.filter(m => m.id !== memberId));
        setTasks(tasks.filter(t => t.assignedToId !== memberId));
    };

    const handleRemoveTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };
    
    const handleUpdateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
        if (newStatus === 'blocked') {
            onRequestBlockTask(taskId);
            return;
        }
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            onUpdateTask({ ...task, status: newStatus, blockReason: undefined });
        }
    };

    const handleStepClick = (step: WorkflowStepDefinition) => {
        setActiveWorkflowStep(step);
        const status = workflowStatuses[step.id];

        if (status === 'blocked') {
            const stepBlockingTasks = tasks.filter(t => t.workflowStep === step.id && t.status === 'blocked');
            setBlockingTasks(stepBlockingTasks);
            setBlockedStepModalOpen(true);
            onNotifyBlockedStep(step);
        } else {
            setStatusModalOpen(true);
        }
    };
    
    const openTaskDetail = (task: Task) => {
        setSelectedTask(task);
        setDetailModalOpen(true);
    };

    const openAddTaskModal = (defaults: { assignedToId?: number; status?: TaskStatus }) => {
        setTaskDefaults(defaults);
        setAddTaskModalOpen(true);
    };
    
    const workflowStatuses = useMemo(() => {
        const statuses: { [key: string]: StepStatus } = {};
        
        for (const step of WORKFLOW_STEPS) {
            const stepTasks = tasks.filter(t => t.workflowStep === step.id);
            if (stepTasks.length === 0) {
                statuses[step.id] = 'upcoming';
                continue;
            }
            if (stepTasks.some(t => t.status === 'blocked')) {
                statuses[step.id] = 'blocked';
            } else if (stepTasks.every(t => t.status === 'done')) {
                statuses[step.id] = 'complete';
            } else if (stepTasks.some(t => t.status === 'inprogress')) {
                statuses[step.id] = 'current';
            } else if (stepTasks.every(t => t.status === 'todo' || t.status === 'done')) {
                 statuses[step.id] = 'todo';
            } else {
                 statuses[step.id] = 'current'; // Default for mixed states
            }
        }

        return statuses;
    }, [tasks, WORKFLOW_STEPS]);

    const tasksForBoard = boardView === 'my' ? tasks.filter(t => t.assignedToId === currentUser.id) : tasks;
    
    const tasksForStep = tasks.filter(t => t.workflowStep === activeWorkflowStep?.id);
    
    const activeTasksForStep = tasksForStep.filter(t => t.status === 'todo' || t.status === 'inprogress');

    return (
        <>
            <Modal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} title="Assign New Team Member">
                <div className="space-y-4">
                    <input type="text" placeholder="Full Name" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md py-2 px-3" />
                    <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value as Role)} className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md">
                        <option>Writer</option>
                        <option>Technical Solutions</option>
                        <option>Strategic Reviewer</option>
                    </select>
                    <button onClick={handleAssignMember} className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">Assign</button>
                </div>
            </Modal>
            
            <BlockedStepModal 
                isOpen={isBlockedStepModalOpen}
                onClose={() => setBlockedStepModalOpen(false)}
                stepTitle={activeWorkflowStep?.title || ''}
                tasks={blockingTasks}
            />

            <Modal isOpen={isStatusModalOpen} onClose={() => setStatusModalOpen(false)} title={`Status: ${activeWorkflowStep?.title}`}>
                <p className="text-sm text-gray-600 dark:text-gray-300">{activeWorkflowStep?.description}</p>
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Active Tasks for this Stage:</h4>
                     {activeTasksForStep.length > 0 ? (
                        <ul className="space-y-2">
                           {activeTasksForStep.map(task => {
                               const member = team.find(m => m.id === task.assignedToId);
                               const { status: dueDateStatus, display: displayDate } = getDueDateStatus(task);
                               const statusTextClasses = {
                                    'overdue': 'text-red-600 dark:text-red-400',
                                    'due-soon': 'text-yellow-600 dark:text-yellow-400',
                                    'normal': 'text-gray-500 dark:text-gray-400',
                                };
                               return (
                                   <li key={task.id} className="text-sm flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                                       <span className="text-gray-800 dark:text-gray-200 font-medium">{task.name}</span>
                                       <div className="flex items-center space-x-2">
                                            {displayDate && (
                                                <span className={`text-xs font-medium ${statusTextClasses[dueDateStatus]}`}>
                                                    {displayDate}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{member?.name}</span>
                                       </div>
                                   </li>
                               )
                           })}
                        </ul>
                     ) : (
                         <p className="text-sm text-gray-500 dark:text-gray-400">No active (To-Do or In-Progress) tasks for this stage.</p>
                     )}
                </div>
            </Modal>

            {selectedTask && (
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setDetailModalOpen(false)}
                    task={selectedTask}
                    team={team}
                    onUpdateTask={onUpdateTask}
                    onRequestBlockTask={onRequestBlockTask}
                />
            )}
            
            <AddTaskModal 
                isOpen={isAddTaskModalOpen}
                onClose={() => setAddTaskModalOpen(false)}
                team={team}
                onAddTask={onAddTask}
                defaults={taskDefaults}
                workflowSteps={WORKFLOW_STEPS}
            />


            <div className="space-y-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Proposal Workflow</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Track progress from initiation to submission.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select
                                id="template-select"
                                value={activeTemplate.id}
                                onChange={(e) => onChangeTemplate(e.target.value)}
                                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {availableTemplates.map((template) => (
                                    <option key={template.id} value={template.id}>{template.name}</option>
                                ))}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                               <Icon name="chevron-down" className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                            <button onClick={() => setView('workflow')} className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'workflow' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}><Icon name="workflow" className="w-5 h-5 inline mr-1" />Diagram</button>
                            <button onClick={() => setView('kanban')} className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'kanban' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}><Icon name="kanban" className="w-5 h-5 inline mr-1" />Kanban</button>
                        </div>
                    </div>
                </div>

                {view === 'workflow' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            {WORKFLOW_STEPS.map((step, index) => {
                                const status = workflowStatuses[step.id] || 'upcoming';
                                const statusClasses: { [key in StepStatus]: { bg: string; text: string; } } = {
                                    blocked: { bg: 'bg-red-500', text: 'text-red-500 dark:text-red-400' },
                                    complete: { bg: 'bg-green-500', text: 'text-green-500 dark:text-green-400' },
                                    current: { bg: 'bg-yellow-500', text: 'text-yellow-500 dark:text-yellow-400' },
                                    todo: { bg: 'bg-blue-500', text: 'text-blue-500 dark:text-blue-400' },
                                    upcoming: { bg: 'bg-gray-400 dark:bg-gray-600', text: 'text-gray-500 dark:text-gray-400' }
                                };
                                const isLastStep = index === WORKFLOW_STEPS.length - 1;
                                const isLineComplete = status === 'complete' || status === 'blocked';
                                
                                return (
                                    <div key={step.id} className="flex" >
                                        <div className="flex flex-col items-center mr-4">
                                            <button onClick={() => handleStepClick(step)} className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${statusClasses[status].bg} cursor-pointer transition-transform hover:scale-110`}>
                                                <Icon name={step.icon} className="w-5 h-5" />
                                            </button>
                                            {!isLastStep && <div className={`w-0.5 flex-grow mt-2 ${isLineComplete ? statusClasses[status].bg : 'bg-gray-300 dark:bg-gray-600'}`}></div>}
                                        </div>
                                        <div className="pb-8 w-full">
                                            <h4 className={`font-semibold ${statusClasses[status].text}`}>{step.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Team</h3>
                                <button onClick={() => setAssignModalOpen(true)} className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"><Icon name="user-plus" className="w-4 h-4 mr-1" />Assign</button>
                             </div>
                            {team.map(member => (
                                <TeamMemberCard 
                                    key={member.id} member={member}
                                    taskCount={tasks.filter(t => t.assignedToId === member.id).length}
                                    onRemove={() => handleRemoveMember(member.id)}
                                    onAddTask={() => openAddTaskModal({ assignedToId: member.id })}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-end mb-4">
                             <div className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-gray-700 p-1">
                                <button onClick={() => setBoardView('team')} className={`px-3 py-1 text-sm font-medium rounded-md ${boardView === 'team' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Team Board</button>
                                <button onClick={() => setBoardView('my')} className={`px-3 py-1 text-sm font-medium rounded-md ${boardView === 'my' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow' : 'text-gray-600 dark:text-gray-300'}`}>My Board</button>
                            </div>
                        </div>
                        <KanbanBoard 
                            tasks={tasksForBoard}
                            team={team}
                            onUpdateTaskStatus={handleUpdateTaskStatus}
                            onRemoveTask={handleRemoveTask}
                            onSelectTask={openTaskDetail}
                            onAddTask={openAddTaskModal}
                            currentUser={currentUser}
                            teamsConfig={teamsConfig}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
