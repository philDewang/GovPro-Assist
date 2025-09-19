
export type Role = string;

export interface RoleDefinition {
    id: string;
    name: string;
    persona: string;
}

export enum Page {
    DASHBOARD = "Dashboard",
    WORKFLOWS = "Workflows",
    DATA_CONNECTORS = "Data Connectors",
    SETTINGS = "Settings",
    DOCS = "Documentation",
}

export type Theme = 'light' | 'dark';

export interface AnalysisResult {
    summary: string;
    keyRequirements: string[];
    risks: string[];
    recommendations: string[];
}

export type TaskStatus = 'todo' | 'inprogress' | 'done' | 'blocked';

export interface Task {
    id: number;
    name: string;
    description: string;
    assignedToId: number; 
    status: TaskStatus;
    updates: string[];
    workflowStep: string; // e.g., 'drafting', 'review'
    blockReason?: string;
    dueDate?: string;
    dueDateTimezone?: string;
}

export interface TeamMember {
    id: number;
    name: string;
    role: Role;
    avatar: string;
    email: string;
    title: string;
    canManageRoles?: boolean;
}

export type UserProfile = TeamMember;

export interface PromptTemplate {
    id:string;
    title: string;
    description: string;
    icon: string;
    template: string;
}

export interface WorkflowStepDefinition {
    id: string;
    icon: string;
    title: string;
    description: string;
    isLast?: boolean;
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStepDefinition[];
    isCustom?: boolean;
}

// Data Connector Configuration Types
export interface SharePointConfig {
    sites: { id: number, url: string; isPrimary: boolean; type: 'primary' | 'knowledge' }[];
}

export interface TeamsConfig {
    selectedChannel: string;
    syncWithPlanner: boolean;
    syncWithForms: boolean;
}

export interface DriveConfig {
    folderPath: string;
}

export interface ConnectorConfigs {
    sharepoint: SharePointConfig;
    teams: TeamsConfig;
    onedrive: DriveConfig;
    googledrive: DriveConfig;
}

// AI Provider Configuration Types
export type AIProvider = 'google-gemini' | 'openai' | 'azure' | 'huggingface' | 'custom';

export interface AISettings {
    provider: AIProvider;
    customEndpoint?: string;
}

// New Project type
export interface Project {
    id: number;
    name: string;
    description: string;
    team: TeamMember[];
    tasks: Task[];
    files: File[];
    analysisResult: AnalysisResult | null;
    diagramPrompt: string;
    diagramCode: string | null;
    activeWorkflowTemplateId: string;
}
