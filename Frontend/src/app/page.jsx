'use client';
import { usePathname } from 'next/navigation';
import App from '../pages/App';

export default function HomePage() {
  const pathname = usePathname();
  
  // Extract page from pathname
  const page = pathname === '/' ? 'home' : pathname.slice(1);
  
  return <App initialPage={page} />;
}
