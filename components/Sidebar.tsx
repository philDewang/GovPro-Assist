import React from 'react';
import { Page } from '../types';
import { NAV_ITEMS } from '../constants';
import { Icon } from './Icon';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
            <div className="flex items-center justify-center h-20 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <Icon name="logo" className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 ml-3">GovPro</h1>
            </div>
            <nav className="flex-1 px-4 py-6">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setCurrentPage(item.name)}
                        className={`flex items-center w-full px-4 py-3 my-1 text-left rounded-lg transition-colors duration-200 ${
                            currentPage === item.name
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        <Icon name={item.icon} className="w-6 h-6 mr-4" />
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    GovPro Assistant © 2024
                </p>
            </div>
        </div>
    );
};