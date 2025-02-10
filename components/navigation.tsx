'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Pencil, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Signed out navigation items
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
  ];

  // Signed in navigation items
  const privateLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const currentLinks = user ? privateLinks : publicLinks;

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Navigation Links */}
            {currentLinks.map((link) => (
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

            {/* Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/onboarding">Onboarding</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white transition-all backdrop-blur-sm bg-white/50"
                >
                  Log in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {currentLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'text-sm font-medium transition-colors duration-200 hover:opacity-80 p-2 rounded-md',
                        pathname === link.href
                          ? 'text-orange-700 bg-orange-50'
                          : 'text-gray-700 hover:text-orange-700 hover:bg-orange-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Link
                        href="/onboarding"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-gray-700 hover:text-orange-700 p-2 rounded-md hover:bg-orange-50"
                      >
                        Onboarding
                      </Link>
                      <Button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        variant="ghost"
                        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Button
                        className="w-full border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white"
                        variant="outline"
                      >
                        Log in
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}