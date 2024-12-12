import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        
        <div className="grid gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Textarea placeholder="How can we help you?" className="h-32" />
              </div>

              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Send Message
              </Button>
            </form>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-orange-800 mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-3 text-orange-700">
              <p>Email: contact@sketchmybiz.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Business Ave, Suite 100, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}