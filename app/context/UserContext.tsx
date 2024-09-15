"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  userId?: string;
}

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/getToken', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setUser(result.userId ? { userId: result.userId } : null);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
