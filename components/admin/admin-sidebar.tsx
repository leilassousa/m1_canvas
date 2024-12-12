'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FolderTree, HelpCircle } from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/questions', label: 'Questions', icon: HelpCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      <nav className="space-y-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center px-4 py-2 text-sm font-medium rounded-lg',
              pathname === link.href
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}