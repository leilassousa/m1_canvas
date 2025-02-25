'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactForm } from '@/components/dashboard/contact-form';
import { Clock, Lock, User, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export function DashboardHeader() {
  const { user } = useAuth();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="reports" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white">
              <TabsTrigger value="reports">My Reports</TabsTrigger>
              <TabsTrigger value="account">My Account</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>
            <Button variant="outline" asChild>
              <Link href="/account/settings">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>

          <TabsContent value="reports" className="mt-0"></TabsContent>

          <TabsContent value="account">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">My Account</h3>
              
              {user ? (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <User className="h-6 w-6 text-gray-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Account Information</h4>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Lock className="h-6 w-6 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Password & Security</h4>
                      <p className="text-sm text-gray-600 mt-1">Manage your password and security settings</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 text-orange-600 border-orange-600 hover:bg-orange-50"
                        asChild
                      >
                        <Link href="/account/change-password">
                          Change Password
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <Clock className="h-12 w-12 text-orange-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Account Information</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Please wait while we load your account details.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="support">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}