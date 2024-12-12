'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/assessment', label: 'Assessment' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const moreLinks = [
    { href: '/onboarding', label: 'Onboarding' },
    { href: '/admin', label: 'Admin' },
    { href: '/about/solutions', label: 'Solutions' },
    { href: '/about/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Pencil className="h-6 w-6 text-gray-800" />
            <span className="text-xl font-bold text-gray-800">SketchMyBiz</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Links */}
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'text-orange-600'
                    : 'text-gray-600 hover:text-orange-600'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-orange-600">
                <span>More</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        'w-full',
                        pathname === link.href && 'text-orange-600'
                      )}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Login Button */}
          <Link href="/auth">
            <Button
              variant="outline"
              className="hidden md:inline-flex border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
            >
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}