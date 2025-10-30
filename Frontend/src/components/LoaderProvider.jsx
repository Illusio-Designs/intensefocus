'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loader from './Loader';

const LoaderContext = createContext();

export const useLoaderContext = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoaderContext must be used within a LoaderProvider');
  }
  return context;
};

const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // Show loader on initial mount
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Only render loader or content
  return isLoading ? <Loader isLoading={true} /> : <>{children}</>;
};

export default LoaderProvider;