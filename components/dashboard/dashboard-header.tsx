'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactForm } from '@/components/dashboard/contact-form';
import { Clock } from 'lucide-react';

export function DashboardHeader() {
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
            <Button variant="outline">Settings</Button>
          </div>

          <TabsContent value="reports" className="mt-0"></TabsContent>

          <TabsContent value="account">
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
              <Clock className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600 text-center max-w-md">
                We're working hard to bring you a personalized account management experience. 
                Stay tuned for updates!
              </p>
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