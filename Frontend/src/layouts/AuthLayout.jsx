import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {children}
    </div>
  );
};

export default AuthLayout;
