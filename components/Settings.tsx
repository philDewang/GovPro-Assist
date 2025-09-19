import React, { useState } from 'react';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { Theme, UserProfile, RoleDefinition, WorkflowTemplate, AISettings, AIProvider } from '../types';
import { ManageRolesModal } from './ManageRolesModal';
import { ManageWorkflowTemplatesModal } from './ManageWorkflowTemplatesModal';


interface SettingsProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    currentUser: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
    roles: RoleDefinition[];
    onAddRole: (role: Omit<RoleDefinition, 'id'>) => void;
    onUpdateRole: (role: RoleDefinition) => void;
    onDeleteRole: (roleId: string) => void;
    workflowTemplates: WorkflowTemplate[];
    onUpdateWorkflowTemplates: (templates: WorkflowTemplate[]) => void;
    aiSettings: AISettings;
    onUpdateAISettings: (settings: AISettings) => void;
}

const SettingCard: React.FC<{ title: string; description: string; children: React.ReactNode; icon: string; }> = ({ title, description, children, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-start space-x-4">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full p-3">
                <Icon name={icon} className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                 <div className="mt-4">{children}</div>
            </div>
        </div>
    </div>
);

export const Settings: React.FC<SettingsProps> = (props) => {
    const { 
        theme, setTheme, currentUser, onUpdateUser, 
        roles, onAddRole, onUpdateRole, onDeleteRole,
        workflowTemplates, onUpdateWorkflowTemplates,
        aiSettings, onUpdateAISettings
    } = props;
    
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isTemplatesModalOpen, setTemplatesModalOpen] = useState(false);
    const [isApiModalOpen, setApiModalOpen] = useState(false);
    const [isRolesModalOpen, setRolesModalOpen] = useState(false);
    
    const [editedUser, setEditedUser] = useState<UserProfile>(currentUser);

    const handleProfileSave = () => {
        onUpdateUser(editedUser);
        setProfileModalOpen(false);
    };

    const handleAIProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdateAISettings({ ...aiSettings, provider: e.target.value as AIProvider });
    };

    const handleCustomEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateAISettings({ ...aiSettings, customEndpoint: e.target.value });
    };

    return (
        <>
            <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} title="Edit Profile">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" value={editedUser.name} onChange={e => setEditedUser({...editedUser, name: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                        <input type="text" value={editedUser.title} onChange={e => setEditedUser({...editedUser, title: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" value={editedUser.email} onChange={e => setEditedUser({...editedUser, email: e.target.value})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"/>
                    </div>
                    <button onClick={handleProfileSave} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </Modal>
            
            <ManageWorkflowTemplatesModal
                isOpen={isTemplatesModalOpen}
                onClose={() => setTemplatesModalOpen(false)}
                templates={workflowTemplates}
                onUpdateTemplates={onUpdateWorkflowTemplates}
            />

            <Modal isOpen={isApiModalOpen} onClose={() => setApiModalOpen(false)} title="Manage My API Keys">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add personal API keys for tools not managed by your organization.</p>
                    <div>
                        <label htmlFor="api-endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint Name</label>
                        <input type="text" id="api-endpoint" placeholder="e.g., Personal Jira" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
                        <input type="password" id="api-key" placeholder="••••••••••••••••••••" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                     <button onClick={() => setApiModalOpen(false)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        Save Key
                    </button>
                </div>
            </Modal>
            
            {currentUser.canManageRoles && (
                <ManageRolesModal 
                    isOpen={isRolesModalOpen}
                    onClose={() => setRolesModalOpen(false)}
                    roles={roles}
                    onAddRole={onAddRole}
                    onUpdateRole={onUpdateRole}
                    onDeleteRole={onDeleteRole}
                />
            )}

            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings & Configuration</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your workspace, integrations, and user preferences.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <SettingCard title="User Profile" description="Update your personal information and notification preferences." icon="user">
                        <button onClick={() => { setEditedUser(currentUser); setProfileModalOpen(true); }} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Edit Profile
                        </button>
                    </SettingCard>
                    <SettingCard title="AI Provider" description="Select the AI model for analysis and generation." icon="ai">
                        <div className="space-y-3">
                             <div>
                                <label htmlFor="ai-provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Provider</label>
                                <select 
                                    id="ai-provider" 
                                    value={aiSettings.provider} 
                                    onChange={handleAIProviderChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="google-gemini">Google Gemini</option>
                                    <option value="openai">OpenAI</option>
                                    <option value="azure">Microsoft Azure AI</option>
                                    <option value="huggingface">HuggingFace</option>
                                    <option value="custom">Custom Endpoint</option>
                                </select>
                             </div>
                             {aiSettings.provider === 'custom' && (
                                 <div>
                                    <label htmlFor="custom-endpoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Custom API Endpoint</label>
                                     <input 
                                        type="text" 
                                        id="custom-endpoint" 
                                        placeholder="https://your-api.com/v1/analyze" 
                                        value={aiSettings.customEndpoint || ''}
                                        onChange={handleCustomEndpointChange}
                                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                     />
                                 </div>
                             )}
                              <p className="text-xs text-gray-500 dark:text-gray-400">API keys for these providers should be configured by your administrator via environment variables.</p>
                        </div>
                    </SettingCard>
                     {currentUser.canManageRoles && (
                        <SettingCard title="Workspace Roles" description="Define roles and their AI analysis personas for your team." icon="users">
                            <button onClick={() => setRolesModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                Manage Roles
                            </button>
                        </SettingCard>
                     )}
                    <SettingCard title="My API Keys" description="Manage personal API keys for your own tool integrations." icon="key">
                         <button onClick={() => setApiModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Manage My Keys
                        </button>
                    </SettingCard>
                    <SettingCard title="Workflow Templates" description="Create and manage custom workflow templates for your team." icon="workflow">
                        <button onClick={() => setTemplatesModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Manage Templates
                        </button>
                    </SettingCard>
                    <SettingCard title="Theme" description="Customize the look and feel of your workspace." icon="theme">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setTheme('light')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${theme === 'light' ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                Light
                            </button>
                             <button onClick={() => setTheme('dark')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${theme === 'dark' ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                Dark
                            </button>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </>
    );
};