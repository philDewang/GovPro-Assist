
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Workflow } from './components/Workflow';
import { DataConnectors } from './components/DataConnectors';
import { Docs } from './components/Docs';
import { Page, AnalysisResult, Theme, TeamMember, Task, RoleDefinition, WorkflowTemplate, AISettings, ConnectorConfigs, WorkflowStepDefinition, Project } from './types';
import * as aiService from './services/ai/aiService';
import { BlockReasonModal } from './components/BlockReasonModal';
import { CreateProjectModal } from './components/CreateProjectModal';

// Initial data is now structured within Projects
const initialProjects: Project[] = [
    {
        id: 1,
        name: "Project Phoenix RFI",
        description: "Response to the Request for Information for the Phoenix cloud migration initiative.",
        team: [
            { id: 1, name: 'Alex Johnson', role: "Capture Manager", avatar: 'AJ', email: 'alex.j@govpro.com', title: 'Lead Capture Manager', canManageRoles: true },
            { id: 2, name: 'Brenda Smith', role: "Writer", avatar: 'BS', email: 'brenda.s@govpro.com', title: 'Senior Proposal Writer' },
        ],
        tasks: [
            { id: 101, name: "Finalize Win Themes", description: "Finalize win themes for the proposal based on executive feedback.", assignedToId: 1, status: 'inprogress', updates: [], workflowStep: 'assignment', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), dueDateTimezone: 'America/New_York' },
            { id: 102, name: "Draft Section C", description: "Draft the full technical approach for Section C.", assignedToId: 2, status: 'todo', updates: [], workflowStep: 'drafting', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), dueDateTimezone: 'America/Los_Angeles' },
        ],
        files: [],
        analysisResult: null,
        diagramPrompt: '',
        diagramCode: null,
        activeWorkflowTemplateId: 'standard-rfi'
    },
    {
        id: 2,
        name: "CyberGuard RFP",
        description: "Full proposal for the CyberGuard security infrastructure contract.",
        team: [
             { id: 1, name: 'Alex Johnson', role: "Capture Manager", avatar: 'AJ', email: 'alex.j@govpro.com', title: 'Lead Capture Manager', canManageRoles: true },
             { id: 3, name: 'Charles Lee', role: "Technical Solutions", avatar: 'CL', email: 'charles.l@govpro.com', title: 'Solutions Architect' },
             { id: 4, name: 'Diana Ross', role: "Strategic Reviewer", avatar: 'DR', email: 'diana.r@govpro.com', title: 'Director of Strategy' },
        ],
        tasks: [
             { id: 103, name: "Review Compliance Matrix", description: "Perform a line-by-line review of the compliance matrix against the RFP.", assignedToId: 4, status: 'blocked', blockReason: 'Waiting for legal clarification on clause 5.2.', updates: [], workflowStep: 'red-team', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), dueDateTimezone: 'UTC' },
             { id: 104, name: "Create Architecture Diagram", description: "Create the primary system architecture diagram for the technical volume.", assignedToId: 3, status: 'done', updates: ['Initial draft complete, pending review.'], workflowStep: 'tech-volume' },
        ],
        files: [],
        analysisResult: null,
        diagramPrompt: '',
        diagramCode: null,
        activeWorkflowTemplateId: 'complex-rfp'
    }
];


const initialRoles: RoleDefinition[] = [
    { id: 'capture_manager', name: "Capture Manager", persona: "You are a Capture Manager following Shipley Associates best practices. Focus on overall strategy, win themes, team composition, and resource allocation. Provide a high-level executive summary." },
    { id: 'writer', name: "Writer", persona: "You are a Proposal Writer following Shipley Associates best practices. Focus on compliance, narrative structure, tone of voice, and identifying sections that require specific subject matter expert input." },
    { id: 'technical_solutions', name: "Technical Solutions", persona: "You are a Technical Solutions Architect. Focus on technical requirements, solution feasibility, identifying necessary technologies, potential innovations, and implementation challenges." },
    { id: 'strategic_reviewer', name: "Strategic Reviewer", persona: "You are a Strategic Reviewer (e.g., Pink Team/Red Team lead). Critically evaluate the RFI against our company's strategic goals, competitive positioning, and probability of winning. Identify weaknesses and strategic gaps." },
    { id: 'program_manager', name: "Program Manager", persona: "You are a Program Manager. Focus on project scope, timeline, deliverables, potential staffing needs, and identifying project management risks based on the RFI." },
    { id: 'contracts_team', name: "Contracts Team", persona: "You are a Contracts Specialist. Focus on contractual obligations, terms and conditions, potential legal risks, compliance requirements (FAR/DFARS clauses), and data rights issues." },
];

const initialWorkflowTemplates: WorkflowTemplate[] = [
    {
        id: 'standard-rfi',
        name: 'Standard RFI Response',
        description: 'A standard workflow for responding to Requests for Information.',
        steps: [
            { id: 'intake', icon: 'file', title: 'Document Intake & Analysis', description: 'RFI document uploaded and initial AI analysis completed.' },
            { id: 'assignment', icon: 'users', title: 'Team Assignment', description: 'Assign Writers, Technical Solutions, and Reviewers to the project.' },
            { id: 'drafting', icon: 'edit', title: 'Drafting & Content Creation', description: 'Writers and Technical team collaborate on the initial draft.' },
            { id: 'review', icon: 'review', title: 'Strategic Review (Pink Team)', description: 'Review panel assesses the draft for strategic alignment.' },
            { id: 'contracts', icon: 'contracts', title: 'Contracts & Compliance Review', description: 'Contracts team reviews for legal and compliance issues.', isLast: true },
        ]
    },
    {
        id: 'complex-rfp',
        name: 'Complex RFP',
        description: 'A detailed workflow for complex Requests for Proposal with multiple volumes.',
        steps: [
            { id: 'kickoff', icon: 'users', title: 'Kickoff Meeting', description: 'Formal kickoff with all stakeholders.' },
            { id: 'tech-volume', icon: 'diagram', title: 'Technical Volume', description: 'Development of the technical solution and narrative.' },
            { id: 'management-volume', icon: 'dashboard', title: 'Management Volume', description: 'Development of the project management plan.' },
            { id: 'cost-volume', icon: 'summary', title: 'Cost Volume', description: 'Development of the cost proposal.' },
            { id: 'red-team', icon: 'review', title: 'Red Team Review', description: 'Final adversarial review of all volumes.' },
            { id: 'submission', icon: 'upload', title: 'Final Submission', description: 'Final formatting and submission of the proposal.', isLast: true },
        ]
    }
];

const initialConnectorConfigs: ConnectorConfigs = {
    sharepoint: { sites: [
        { id: 1, url: 'https://acmecorp.sharepoint.com/sites/GovProposals', isPrimary: true, type: 'primary' },
        { id: 2, url: 'https://acmecorp.sharepoint.com/sites/PastPerformance', isPrimary: false, type: 'knowledge' }
    ]},
    teams: { selectedChannel: 'General', syncWithPlanner: true, syncWithForms: false },
    onedrive: { folderPath: '/Apps/GovProAssistant' },
    googledrive: { folderPath: '/My Drive/GovPro' },
};


const App: React.FC = () => {
    // Global State (not project-specific)
    const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
    const [currentRole, setCurrentRole] = useState<string>(initialRoles[0].name);
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
    const [theme, setTheme] = useState<Theme>('dark');
    const [connectorConfigs, setConnectorConfigs] = useState<ConnectorConfigs>(initialConnectorConfigs);
    const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>(initialWorkflowTemplates);
    const [aiSettings, setAiSettings] = useState<AISettings>({ provider: 'google-gemini' });
    const [notification, setNotification] = useState<string | null>(null);

    // Project-specific State
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [activeProjectId, setActiveProjectId] = useState<number>(initialProjects[0].id);

    // Modals
    const [isBlockModalOpen, setBlockModalOpen] = useState(false);
    const [taskToBlock, setTaskToBlock] = useState<Task | null>(null);
    const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
    
    // Derived State for the active project
    const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId)!, [projects, activeProjectId]);

    // This is a helper function to update the active project state immutably
    const updateActiveProject = useCallback((updatedProjectData: Partial<Project>) => {
        setProjects(prevProjects =>
            prevProjects.map(p =>
                p.id === activeProjectId ? { ...p, ...updatedProjectData } : p
            )
        );
    }, [activeProjectId]);


    // Loading/Error state is now local to the component that needs it or could be part of the project
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDiagramLoading, setIsDiagramLoading] = useState<boolean>(false);
    const [diagramError, setDiagramError] = useState<string | null>(null);

    const currentUser = activeProject.team[0]; // Mock current user for the active project

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleFileSelect = useCallback((selectedFiles: File[]) => {
        updateActiveProject({ files: selectedFiles, analysisResult: null });
        setError(null);
    }, [updateActiveProject]);

    const handleAnalyze = useCallback(async (customPrompt?: string) => {
        if (activeProject.files.length === 0) {
            setError('No files to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        updateActiveProject({ analysisResult: null });

        const activeRole = roles.find(r => r.name === currentRole);
        if (!activeRole) {
            setError(`Role "${currentRole}" is not defined.`);
            setIsLoading(false);
            return;
        }

        try {
            const fileContents = await Promise.all(
                activeProject.files
                    .filter(file => file.type === 'text/plain' || file.type === 'text/markdown')
                    .map(file => file.text())
            );
            if (fileContents.length === 0) throw new Error("No compatible files found.");
            
            const combinedContent = fileContents.join('\n\n---\n\n');
            const result = await aiService.analyzeDocument(combinedContent, activeRole.persona, aiSettings, customPrompt);
            updateActiveProject({ analysisResult: result });
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [activeProject.files, roles, currentRole, aiSettings, updateActiveProject]);

    const clearFiles = useCallback(() => {
        updateActiveProject({ files: [], analysisResult: null });
        setError(null);
    }, [updateActiveProject]);

    const handleGenerateDiagram = useCallback(async () => {
        if (!activeProject.diagramPrompt) {
            setDiagramError('Please enter a description for the diagram.');
            return;
        }
        setIsDiagramLoading(true);
        setDiagramError(null);
        updateActiveProject({ diagramCode: null });

        try {
            const result = await aiService.generateDiagram(activeProject.diagramPrompt, aiSettings);
            const cleanedResult = result.replace(/^```mermaid\s*|```\s*$/g, '').trim();
            updateActiveProject({ diagramCode: cleanedResult });
        } catch (err: any) {
            setDiagramError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsDiagramLoading(false);
        }
    }, [activeProject.diagramPrompt, aiSettings, updateActiveProject]);

    const handleUpdateTask = useCallback((updatedTask: Task) => {
        const newTasks = activeProject.tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
        updateActiveProject({ tasks: newTasks });
    }, [activeProject.tasks, updateActiveProject]);
    
    const handleAddTask = useCallback((newTask: Omit<Task, 'id'>) => {
        const taskToAdd = { ...newTask, id: Date.now() };
        updateActiveProject({ tasks: [...activeProject.tasks, taskToAdd] });
        
        if (taskToAdd.dueDate && connectorConfigs.teams.syncWithPlanner) {
            const assignee = activeProject.team.find(m => m.id === taskToAdd.assignedToId);
            setNotification(`(Mock) Calendar invite sent to ${assignee?.name} for task: "${taskToAdd.name}".`);
        }
    }, [activeProject.team, activeProject.tasks, connectorConfigs, updateActiveProject]);
    
    const handleRequestBlockTask = useCallback((taskId: number) => {
        const task = activeProject.tasks.find(t => t.id === taskId);
        if (task) {
            setTaskToBlock(task);
            setBlockModalOpen(true);
        }
    }, [activeProject.tasks]);

    const handleConfirmBlockTask = useCallback((reason: string) => {
        if (taskToBlock) {
            handleUpdateTask({ ...taskToBlock, status: 'blocked', blockReason: reason });
        }
        setBlockModalOpen(false);
        setTaskToBlock(null);
    }, [taskToBlock, handleUpdateTask]);

    const handleNotifyBlockedStep = useCallback((step: WorkflowStepDefinition) => {
        const captureManager = activeProject.team.find(m => m.role === 'Capture Manager');
        const strategicReviewer = activeProject.team.find(m => m.role === 'Strategic Reviewer');
        let msg = `(Mock) Email sent for blocked step: "${step.title}".`;
        if (captureManager) msg += ` Notified ${captureManager.name}`;
        if (strategicReviewer) msg += ` and ${strategicReviewer.name}.`;
        setNotification(msg);
    }, [activeProject.team]);

    const handleUpdateProjectTeam = useCallback((newTeam: TeamMember[]) => {
        updateActiveProject({ team: newTeam });
    }, [updateActiveProject]);
    
    const handleUpdateProjectTasks = useCallback((newTasks: Task[]) => {
        updateActiveProject({ tasks: newTasks });
    }, [updateActiveProject]);

    const handleUpdateTeamMember = useCallback((updatedMember: TeamMember) => {
        setProjects(prevProjects => prevProjects.map(p => {
             // Update user globally across all projects if needed, or just active one
             const newTeam = p.team.map(member => member.id === updatedMember.id ? updatedMember : member);
             return { ...p, team: newTeam };
        }));
    }, []);

    const handleChangeActiveWorkflowTemplate = useCallback((templateId: string) => {
        updateActiveProject({ activeWorkflowTemplateId: templateId });
    }, [updateActiveProject]);
    
    const handleCreateProject = useCallback((name: string, description: string, templateId: string) => {
        const newProject: Project = {
            id: Date.now(),
            name,
            description,
            team: [initialProjects[0].team[0]], // Start with just the current user
            tasks: [],
            files: [],
            analysisResult: null,
            diagramPrompt: '',
            diagramCode: null,
            activeWorkflowTemplateId: templateId
        };
        setProjects(prev => [...prev, newProject]);
        setActiveProjectId(newProject.id);
        setCreateProjectModalOpen(false);
    }, []);

    const renderPage = () => {
        if (!activeProject) return <div>Loading Project...</div>;
        
        const activeTemplate = workflowTemplates.find(t => t.id === activeProject.activeWorkflowTemplateId) || workflowTemplates[0];

        switch (currentPage) {
            case Page.DASHBOARD:
                return (
                    <Dashboard
                        currentRole={currentRole}
                        files={activeProject.files}
                        isLoading={isLoading}
                        error={error}
                        analysisResult={activeProject.analysisResult}
                        handleFileSelect={handleFileSelect}
                        handleAnalyze={handleAnalyze}
                        clearFiles={clearFiles}
                        diagramPrompt={activeProject.diagramPrompt}
                        setDiagramPrompt={(p) => updateActiveProject({ diagramPrompt: p })}
                        diagramCode={activeProject.diagramCode}
                        isDiagramLoading={isDiagramLoading}
                        diagramError={diagramError}
                        handleGenerateDiagram={handleGenerateDiagram}
                        aiProvider={aiSettings.provider}
                    />
                );
            case Page.WORKFLOWS:
                return <Workflow 
                    currentUser={currentUser}
                    team={activeProject.team} 
                    setTeam={handleUpdateProjectTeam} 
                    tasks={activeProject.tasks} 
                    setTasks={handleUpdateProjectTasks} 
                    onUpdateTask={handleUpdateTask} 
                    onAddTask={handleAddTask} 
                    onRequestBlockTask={handleRequestBlockTask}
                    onNotifyBlockedStep={handleNotifyBlockedStep}
                    availableTemplates={workflowTemplates}
                    activeTemplate={activeTemplate}
                    onChangeTemplate={handleChangeActiveWorkflowTemplate}
                    teamsConfig={connectorConfigs.teams}
                />;
            case Page.DATA_CONNECTORS:
                return <DataConnectors configs={connectorConfigs} onConfigsChange={setConnectorConfigs} />;
            case Page.SETTINGS:
                return <Settings 
                    theme={theme} 
                    setTheme={setTheme} 
                    currentUser={currentUser} 
                    onUpdateUser={handleUpdateTeamMember} 
                    roles={roles} 
                    onAddRole={(r) => setRoles(prev => [...prev, {...r, id: r.name.toLowerCase().replace(' ', '_')}])} 
                    onUpdateRole={(ur) => setRoles(prev => prev.map(r => r.id === ur.id ? ur : r))}
                    onDeleteRole={(rId) => setRoles(prev => prev.filter(r => r.id !== rId))}
                    workflowTemplates={workflowTemplates}
                    onUpdateWorkflowTemplates={setWorkflowTemplates}
                    aiSettings={aiSettings}
                    onUpdateAISettings={setAiSettings}
                />;
            case Page.DOCS:
                return <Docs />;
            default:
                 return (
                    <Dashboard
                        currentRole={currentRole}
                        files={activeProject.files}
                        isLoading={isLoading}
                        error={error}
                        analysisResult={activeProject.analysisResult}
                        handleFileSelect={handleFileSelect}
                        handleAnalyze={handleAnalyze}
                        clearFiles={clearFiles}
                        diagramPrompt={activeProject.diagramPrompt}
                        setDiagramPrompt={(p) => updateActiveProject({ diagramPrompt: p })}
                        diagramCode={activeProject.diagramCode}
                        isDiagramLoading={isDiagramLoading}
                        diagramError={diagramError}
                        handleGenerateDiagram={handleGenerateDiagram}
                        aiProvider={aiSettings.provider}
                    />
                );
        }
    };

    return (
        <>
            {notification && (
                <div className="fixed top-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in z-50">
                    {notification}
                </div>
            )}
            <BlockReasonModal
                isOpen={isBlockModalOpen}
                onClose={() => setBlockModalOpen(false)}
                onSubmit={handleConfirmBlockTask}
                task={taskToBlock}
            />
            <CreateProjectModal 
                isOpen={isCreateProjectModalOpen}
                onClose={() => setCreateProjectModalOpen(false)}
                onCreate={handleCreateProject}
                templates={workflowTemplates}
            />
            <Layout
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                team={activeProject?.team || []}
                roles={roles}
                projects={projects}
                activeProjectId={activeProjectId}
                setActiveProjectId={setActiveProjectId}
                onCreateProject={() => setCreateProjectModalOpen(true)}
            >
                {renderPage()}
            </Layout>
        </>
    );
};

export default App;
