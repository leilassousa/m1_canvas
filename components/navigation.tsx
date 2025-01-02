'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Pencil, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/lib/auth/auth-context';
import { useEffect } from 'react';

interface NavItem {
  href: string;
  label: string;
}

interface NavConfig {
  main: NavItem[];
  more: NavItem[];
}

interface NavConfigs {
  authenticated: NavConfig;
  public: NavConfig;
}

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('Navigation rendered:', {
      isAuthenticated,
      user,
      pathname
    });
  }, [user, isAuthenticated, pathname]);

  // Configuration for different navigation types
  const navConfigs: NavConfigs = {
    authenticated: {
      main: [
        { href: '/', label: 'Home' },
        { href: '/assessment', label: 'Assessment' },
        { href: '/dashboard', label: 'Dashboard' },
      ],
      more: [],
    },
    public: {
      main: [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About Us' },
        { href: '/about/contact', label: 'Contact Us' },
      ],
      more: [],
    }
  };

  // Get the appropriate navigation configuration based on auth status
  const { main: mainLinks, more: moreLinks } = navConfigs[isAuthenticated ? 'authenticated' : 'public'];

  // Debug current navigation state
  useEffect(() => {
    console.log('Current navigation state:', {
      isAuthenticated,
      mainLinks,
      moreLinks
    });
  }, [mainLinks, moreLinks, isAuthenticated]);

  // Determine if we should show the More dropdown
  const showMoreDropdown = moreLinks.length > 0;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Pencil className="h-6 w-6 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">My Business Canva</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 hover:opacity-80',
                  pathname === link.href
                    ? 'text-orange-700'
                    : 'text-gray-700 hover:text-orange-700'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* More Dropdown - Only show if there are more links */}
            {showMoreDropdown && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-orange-700">
                  <span>More</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 backdrop-blur-md bg-white/90 border-gray-200/50"
                >
                  {moreLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          'w-full transition-colors duration-200',
                          pathname === link.href ? 'text-orange-700' : 'text-gray-700'
                        )}
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Auth Button */}
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hidden md:inline-flex border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white transition-all backdrop-blur-sm bg-white/50"
            >
              Log out
            </Button>
          ) : (
            <Link href="/auth">
              <Button
                variant="outline"
                className="hidden md:inline-flex border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white transition-all backdrop-blur-sm bg-white/50"
              >
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}