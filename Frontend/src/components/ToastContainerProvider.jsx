'use client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import '../styles/components/Toast.css';

const ToastContainerProvider = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default ToastContainerProvider;

