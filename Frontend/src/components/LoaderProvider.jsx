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
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, mounted]);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  const value = {
    isLoading,
    showLoader,
    hideLoader,
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <Loader isLoading={isLoading} />
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;