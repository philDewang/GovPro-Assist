
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Page, TeamMember, RoleDefinition, Project } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    currentRole: string;
    setCurrentRole: (role: string) => void;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    team: TeamMember[];
    roles: RoleDefinition[];
    projects: Project[];
    activeProjectId: number;
    setActiveProjectId: (id: number) => void;
    onCreateProject: () => void;
}

export const Layout: React.FC<LayoutProps> = (props) => {
    const {
        children, currentRole, setCurrentRole, currentPage, setCurrentPage,
        team, roles, projects, activeProjectId, setActiveProjectId, onCreateProject
    } = props;
    
    return (
        <div className="flex h-screen text-gray-800 dark:text-gray-200">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentRole={currentRole} 
                    setCurrentRole={setCurrentRole} 
                    team={team} 
                    roles={roles} 
                    setCurrentPage={setCurrentPage}
                    projects={projects}
                    activeProjectId={activeProjectId}
                    setActiveProjectId={setActiveProjectId}
                    onCreateProject={onCreateProject}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};
