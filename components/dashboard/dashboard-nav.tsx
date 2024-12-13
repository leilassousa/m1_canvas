'use client';

import { FileText, User, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'reports' | 'account' | 'support';

interface DashboardNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const DashboardNav = ({ activeTab, onTabChange }: DashboardNavProps) => {
  const navItems = [
    {
      id: 'reports' as TabType,
      label: 'My Reports',
      icon: FileText,
      disabled: false,
    },
    {
      id: 'account' as TabType,
      label: 'My Account',
      icon: User,
      disabled: true,
    },
    {
      id: 'support' as TabType,
      label: 'Support',
      icon: LifeBuoy,
      disabled: false,
    },
  ];

  return (
    <nav className="flex space-x-2 border-b border-gray-200">
      {navItems.map((item) => (
        <div
          key={item.id}
          onClick={() => !item.disabled && onTabChange(item.id)}
          role="tab"
          aria-selected={activeTab === item.id}
          tabIndex={item.disabled ? -1 : 0}
          className={cn(
            'flex items-center space-x-2 px-4 py-2 cursor-pointer',
            'border-b-2 -mb-[1px]',
            activeTab === item.id 
              ? 'border-gray-900 text-gray-900' 
              : 'border-transparent text-gray-500',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
          {item.disabled && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              Coming Soon
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};