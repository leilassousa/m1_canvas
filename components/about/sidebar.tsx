'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Building, Lightbulb, Phone } from 'lucide-react';

const sidebarLinks = [
  {
    href: '/about',
    label: 'SketchMyBiz',
    icon: Building,
    description: 'Learn about our company'
  },
  {
    href: '/about/solutions',
    label: 'Solutions',
    icon: Lightbulb,
    description: 'Explore our services'
  },
  {
    href: '/about/contact',
    label: 'Contact',
    icon: Phone,
    description: 'Get in touch with us'
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">About Us</h2>
      <nav className="space-y-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-start p-3 rounded-lg transition-colors group hover:bg-orange-50',
              pathname === link.href ? 'bg-orange-50' : ''
            )}
          >
            <link.icon className={cn(
              'h-5 w-5 mr-3 mt-0.5',
              pathname === link.href ? 'text-orange-600' : 'text-gray-400 group-hover:text-orange-600'
            )} />
            <div>
              <div className={cn(
                'font-medium',
                pathname === link.href ? 'text-orange-600' : 'text-gray-900'
              )}>
                {link.label}
              </div>
              <p className="text-sm text-gray-500">{link.description}</p>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}