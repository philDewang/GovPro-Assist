import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { UnifiedChat } from './UnifiedChat';
import { Modal } from './Modal';
import { SharePointConfig, TeamsConfig, DriveConfig, ConnectorConfigs } from '../types';

interface Connector {
  id: keyof ConnectorConfigs;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
}

const initialConnectors: Connector[] = [
    { id: 'sharepoint', name: 'SharePoint', icon: 'sharepoint', description: 'Access documents from your SharePoint sites.', connected: true },
    { id: 'teams', name: 'Microsoft Teams', icon: 'teams', description: 'Integrate with your Teams channels.', connected: true },
    { id: 'onedrive', name: 'OneDrive', icon: 'onedrive', description: 'Connect to your OneDrive for file access.', connected: false },
    { id: 'googledrive', name: 'Google Drive', icon: 'google-drive', description: 'Access documents stored in Google Drive.', connected: false },
];

interface DataConnectorsProps {
    configs: ConnectorConfigs;
    onConfigsChange: (newConfigs: ConnectorConfigs) => void;
}

export const DataConnectors: React.FC<DataConnectorsProps> = ({ configs, onConfigsChange }) => {
    const [connectors, setConnectors] = useState<Connector[]>(initialConnectors);
    const [selectedConnectorId, setSelectedConnectorId] = useState<keyof ConnectorConfigs>('teams');
    const [activeConnectors, setActiveConnectors] = useState<Set<string>>(new Set(['teams', 'sharepoint']));
    const [isConfigModalOpen, setConfigModalOpen] = useState(false);

    const selectedConnector = connectors.find(c => c.id === selectedConnectorId);

    const handleToggleActive = (connector: Connector) => {
        if (!connector.connected) {
            setSelectedConnectorId(connector.id);
            setConfigModalOpen(true);
            return;
        }
        const newActiveConnectors = new Set(activeConnectors);
        if (newActiveConnectors.has(connector.id)) newActiveConnectors.delete(connector.id);
        else newActiveConnectors.add(connector.id);
        setActiveConnectors(newActiveConnectors);
    };

    const handleConnect = () => {
        setConnectors(connectors.map(c => c.id === selectedConnectorId ? { ...c, connected: true } : c));
        // Also make it active upon connecting for the first time
        if(selectedConnectorId) {
           const newActiveConnectors = new Set(activeConnectors);
           newActiveConnectors.add(selectedConnectorId);
           setActiveConnectors(newActiveConnectors);
        }
        setConfigModalOpen(false);
    };

    const activeConnectorNames = useMemo(() => connectors.filter(c => activeConnectors.has(c.id)).map(c => c.name), [activeConnectors, connectors]);
    
    const handleAddSharePointSite = () => {
        const newSite = { id: Date.now(), url: '', isPrimary: false, type: 'knowledge' as const };
        onConfigsChange({
            ...configs,
            sharepoint: {
                ...configs.sharepoint,
                sites: [...configs.sharepoint.sites, newSite]
            }
        });
    };

    const renderConfigModalContent = () => {
        switch(selectedConnectorId) {
            case 'sharepoint':
                return (
                    <div>
                        <h4 className="font-semibold mb-2 dark:text-gray-200">SharePoint Sites</h4>
                        {configs.sharepoint.sites.map((site, index) => (
                             <div key={site.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-2">
                                 <input type="text" value={site.url} onChange={(e) => {
                                    const newSites = [...configs.sharepoint.sites];
                                    newSites[index].url = e.target.value;
                                    onConfigsChange({...configs, sharepoint: {...configs.sharepoint, sites: newSites}});
                                 }} placeholder="https://..." className="text-sm flex-grow bg-transparent focus:outline-none dark:text-gray-200"/>
                                 <span className={`text-xs px-2 py-1 rounded-full ${site.isPrimary ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>{site.type}</span>
                             </div>
                        ))}
                        <button onClick={handleAddSharePointSite} className="text-sm text-blue-600 hover:underline">+ Add Knowledge Source</button>
                    </div>
                );
            case 'teams':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select a Teams Channel</label>
                            <select value={configs.teams.selectedChannel} onChange={e => onConfigsChange({...configs, teams: { ...configs.teams, selectedChannel: e.target.value }})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3">
                                <option>General</option>
                                <option>Proposal Drafts</option>
                                <option>Red Team Review</option>
                            </select>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                             <h4 className="font-semibold mb-2 dark:text-gray-200">Integrations</h4>
                             <div className="space-y-2">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={configs.teams.syncWithPlanner}
                                        onChange={e => onConfigsChange({...configs, teams: { ...configs.teams, syncWithPlanner: e.target.checked }})}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">Synchronize Kanban board with Microsoft Planner</span>
                                </label>
                                 <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={configs.teams.syncWithForms}
                                        onChange={e => onConfigsChange({...configs, teams: { ...configs.teams, syncWithForms: e.target.checked }})}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-800 dark:text-gray-200">Create Microsoft Form for task intake (mock)</span>
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Note: Full integration requires backend setup and Microsoft Graph API authentication.</p>
                             </div>
                        </div>
                    </div>
                );
            case 'onedrive':
            case 'googledrive':
                 const configKey = selectedConnectorId as 'onedrive' | 'googledrive';
                 return (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Folder Location</label>
                        <input type="text" value={configs[configKey].folderPath} onChange={e => onConfigsChange({...configs, [configKey]: { folderPath: e.target.value }})} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm py-2 px-3"/>
                     </div>
                 );
            default: return <p>This connector has no configurable options.</p>
        }
    };

    return (
        <>
            <Modal isOpen={isConfigModalOpen} onClose={() => setConfigModalOpen(false)} title={`Configure ${selectedConnector?.name}`}>
                <div className="space-y-4">
                   {renderConfigModalContent()}
                   <button onClick={handleConnect} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        Save Configuration
                    </button>
                </div>
            </Modal>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Data Connectors</h2>
                    <p className="text-gray-600 dark:text-gray-400">Ground your AI assistant by connecting to your existing tools and data stores.</p>
                </div>
                <div className="flex flex-col md:flex-row h-[65vh] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                        <ul className="p-4 space-y-1">
                            {connectors.map(connector => (
                                <li key={connector.id}>
                                    <div className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedConnectorId === connector.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''}`}>
                                        <input type="checkbox" checked={activeConnectors.has(connector.id)} onChange={() => handleToggleActive(connector)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                        <button onClick={() => setSelectedConnectorId(connector.id)} className="flex-1 flex items-center space-x-3 text-left">
                                            <Icon name={connector.icon} className="w-8 h-8 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">{connector.name}</h4>
                                                    <span className={`w-2.5 h-2.5 rounded-full ${connector.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                </div>
                                                {!connector.connected ? 
                                                    <button onClick={(e) => { e.stopPropagation(); setSelectedConnectorId(connector.id); setConfigModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Connect Now</button> :
                                                    <button onClick={(e) => { e.stopPropagation(); setSelectedConnectorId(connector.id); setConfigModalOpen(true); }} className="text-xs text-gray-500 hover:underline">Configure</button>
                                                }
                                            </div>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="w-full md:w-2/3 flex flex-col">
                        <UnifiedChat activeConnectors={activeConnectorNames} />
                     </div>
                </div>
            </div>
        </>
    );
};