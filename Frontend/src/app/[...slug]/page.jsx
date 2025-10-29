'use client';
import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import App from '../../pages/App';

function DynamicPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Extract page from pathname - handle root path
  const page = pathname === '/' ? 'home' : (pathname.slice(1) || 'home');
  
  // Extract productId from query params if available
  const productId = searchParams.get('id') ? parseInt(searchParams.get('id')) : null;
  
  return <App initialPage={page} productId={productId} />;
}

export default function DynamicPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicPageContent />
    </Suspense>
  );
}
