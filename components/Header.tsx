
import React, { useState } from 'react';
import { Role, TeamMember, RoleDefinition, Page, Project } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
    currentRole: Role;
    setCurrentRole: (role: Role) => void;
    team: TeamMember[];
    roles: RoleDefinition[];
    setCurrentPage: (page: Page) => void;
    projects: Project[];
    activeProjectId: number;
    setActiveProjectId: (id: number) => void;
    onCreateProject: () => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
    const { 
        currentRole, setCurrentRole, team, roles, setCurrentPage,
        projects, activeProjectId, setActiveProjectId, onCreateProject
    } = props;
    
    const [isProjectDropdownOpen, setProjectDropdownOpen] = useState(false);
    
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentRole(e.target.value as Role);
    };
    
    const currentUser = team[0]; // Mock current user
    const activeProject = projects.find(p => p.id === activeProjectId);

    return (
        <header className="h-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
            <div className="flex items-center space-x-4">
                 <div className="relative">
                    <button 
                        onClick={() => setProjectDropdownOpen(!isProjectDropdownOpen)}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Icon name="workflow" className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{activeProject?.name || 'Mission Control'}</h2>
                        <Icon name="chevron-down" className={`w-5 h-5 text-gray-500 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProjectDropdownOpen && (
                        <div 
                            className="absolute mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20"
                            onMouseLeave={() => setProjectDropdownOpen(false)}
                        >
                            <div className="p-2">
                                <p className="text-xs font-semibold text-gray-400 px-2 mb-1">PROJECTS</p>
                                {projects.map(project => (
                                    <button
                                        key={project.id}
                                        onClick={() => { setActiveProjectId(project.id); setProjectDropdownOpen(false); }}
                                        className={`w-full text-left px-2 py-1.5 text-sm rounded-md flex justify-between items-center ${
                                            project.id === activeProjectId ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <span>{project.name}</span>
                                        {project.id === activeProjectId && <Icon name="check" className="w-4 h-4 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                                <button
                                    onClick={() => { onCreateProject(); setProjectDropdownOpen(false); }}
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    + Create New Project
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <label htmlFor="role-select" className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Current Role:</label>
                    <select
                        id="role-select"
                        value={currentRole}
                        onChange={handleRoleChange}
                        className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                       <Icon name="chevron-down" className="w-4 h-4" />
                    </div>
                </div>
                 <button
                    onClick={() => setCurrentPage(Page.DOCS)}
                    title="Information"
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="View documentation"
                >
                    <Icon name="info" className="w-6 h-6" />
                </button>
                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {currentUser?.avatar || currentRole.substring(0, 1)}
                </div>
            </div>
        </header>
    );
};
