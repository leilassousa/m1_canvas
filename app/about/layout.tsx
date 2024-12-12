import { Sidebar } from '@/components/about/sidebar';
import { AboutLayout } from '@/components/about/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <AboutLayout>{children}</AboutLayout>
    </div>
  );
}