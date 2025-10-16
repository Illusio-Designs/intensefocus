'use client';
import { usePathname } from 'next/navigation';
import App from '../../pages/App';

export default function DynamicPage() {
  const pathname = usePathname();
  
  // Extract page from pathname
  const page = pathname.slice(1);
  
  return <App initialPage={page} />;
}
