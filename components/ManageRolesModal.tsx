import React, { useState } from 'react';
import { Modal } from './Modal';
import { RoleDefinition } from '../types';
import { Icon } from './Icon';

interface ManageRolesModalProps {
    isOpen: boolean;
    onClose: () => void;
    roles: RoleDefinition[];
    onAddRole: (role: Omit<RoleDefinition, 'id'>) => void;
    onUpdateRole: (role: RoleDefinition) => void;
    onDeleteRole: (roleId: string) => void;
}

const RoleItem: React.FC<{ role: RoleDefinition, onUpdate: (role: RoleDefinition) => void, onDelete: () => void }> = ({ role, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRole, setEditedRole] = useState(role);

    const handleSave = () => {
        onUpdate(editedRole);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-md space-y-2 border border-blue-200 dark:border-blue-800">
                <input 
                    type="text" 
                    value={editedRole.name}
                    onChange={e => setEditedRole({...editedRole, name: e.target.value})}
                    className="w-full text-sm font-semibold border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
                />
                <textarea 
                    rows={3}
                    value={editedRole.persona}
                    onChange={e => setEditedRole({...editedRole, persona: e.target.value})}
                    className="w-full text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md p-1"
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsEditing(false)} className="text-xs text-gray-600 dark:text-gray-300">Cancel</button>
                    <button onClick={handleSave} className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md">Save</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md flex items-start justify-between">
            <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{role.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{role.persona}</p>
            </div>
            <div className="flex space-x-2 ml-4">
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500"><Icon name="edit" className="w-4 h-4"/></button>
                <button onClick={onDelete} className="text-gray-400 hover:text-red-500"><Icon name="trash" className="w-4 h-4"/></button>
            </div>
        </div>
    );
};

export const ManageRolesModal: React.FC<ManageRolesModalProps> = ({ isOpen, onClose, roles, onAddRole, onUpdateRole, onDeleteRole }) => {
    const [newRoleName, setNewRoleName] = useState('');
    const [newRolePersona, setNewRolePersona] = useState('');
    
    const handleAddRole = () => {
        if (!newRoleName.trim() || !newRolePersona.trim()) return;
        onAddRole({ name: newRoleName.trim(), persona: newRolePersona.trim() });
        setNewRoleName('');
        setNewRolePersona('');
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Workspace Roles">
            <div className="space-y-4">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {roles.map(role => (
                        <RoleItem 
                            key={role.id}
                            role={role}
                            onUpdate={onUpdateRole}
                            onDelete={() => onDeleteRole(role.id)}
                        />
                    ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Add New Role</h4>
                    <input 
                        type="text" 
                        placeholder="Role Name (e.g., Compliance Officer)"
                        value={newRoleName}
                        onChange={e => setNewRoleName(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md py-2 px-3"
                    />
                    <textarea 
                        rows={3}
                        placeholder="Describe the AI persona for this role..."
                        value={newRolePersona}
                        onChange={e => setNewRolePersona(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md py-2 px-3"
                    />
                     <button onClick={handleAddRole} className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Add Role
                    </button>
                </div>
            </div>
        </Modal>
    );
};