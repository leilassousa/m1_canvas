import { Pencil } from 'lucide-react';
import { FooterLinks } from './footer-links';
import { FooterSocial } from './footer-social';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Pencil className="h-6 w-6 text-gray-800" />
              <span className="text-xl font-bold text-gray-800">SketchMyBiz</span>
            </div>
            <p className="text-gray-600 text-sm">
              Transforming business ideas into reality through innovative solutions and strategic planning.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-3">
            <FooterLinks />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} SketchMyBiz. All rights reserved.
            </p>
            <FooterSocial />
          </div>
        </div>
      </div>
    </footer>
  );
}