import { Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
];

export function FooterSocial() {
  return (
    <div className="flex space-x-6">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-orange-600 transition-colors"
          aria-label={social.label}
        >
          <social.icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}