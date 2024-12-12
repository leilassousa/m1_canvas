import Link from 'next/link';

const footerLinks = {
  product: [
    { href: '/assessment', label: 'Assessment' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/onboarding', label: 'Onboarding' },
    { href: '/about/solutions', label: 'Solutions' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/about/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin Portal' },
    { href: '/auth', label: 'Sign In' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

export function FooterLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
        <ul className="space-y-3">
          {footerLinks.product.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-gray-600 hover:text-orange-600 text-sm">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
        <ul className="space-y-3">
          {footerLinks.company.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-gray-600 hover:text-orange-600 text-sm">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
        <ul className="space-y-3">
          {footerLinks.legal.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-gray-600 hover:text-orange-600 text-sm">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}