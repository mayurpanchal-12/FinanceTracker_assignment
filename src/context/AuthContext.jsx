import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const LOCAL_USER = {
  uid: 'local-user',
  email: 'local@device',
  displayName: 'You',
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('demo_role') || 'admin';
  });

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('demo_role', newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user: LOCAL_USER,
        role,
        switchRole,
        linkedAdminUid: null,
        adminEmail: null,
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
