'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('submitted');
      // Reset form after 2 seconds
      setTimeout(() => setFormStatus('idle'), 2000);
    }, 1000);
  };

  if (formStatus === 'submitted') {
    return (
      <Card className="p-8 bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <Send className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-600">
            Thank you for reaching out. We'll get back to you shortly.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <Input placeholder="How can we help you?" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input type="email" placeholder="your@email.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <Textarea 
            placeholder="Please describe your issue or question..."
            className="min-h-[150px]"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={formStatus === 'submitting'}
        >
          {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  );
}