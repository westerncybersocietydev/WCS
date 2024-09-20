"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/getToken', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.status === 401 && data.message === 'Token expired') {
        // Handle expired token case
        toast.error("Session expired. Please sign in again.");
        router.push('/sign-in');
      } else if (response.status === 200) {
        // Token is valid, set user
        setUser(data.userId ? { userId: data.userId } : null);
      } else {
        // Handle other errors
        console.error('Error:', data.message);
        setUser(null);
      }

    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null); // Reset user on error
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