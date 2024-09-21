"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  userId?: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  uwoEmail: string;
  preferredEmail: string;
  currentYear: string;
  program: string;
  plan: string;
  description: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  profileData: ProfileData | null;
  fetchUser: () => Promise<void>;
  updateUser: (newData: User | null, profileData?: ProfileData | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/getToken', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.status === 401 && data.message === 'Token expired') {
        toast.error("Session expired. Please sign in again.");
        router.push('/sign-in');
      } else if (response.status === 200) {
        setUser(data.userId ? { userId: data.userId } : null);
        // Optionally set profile data if available
        if (data.profileData) {
          setProfileData(data.profileData);
        }
      } else {
        console.error('Error:', data.message);
        setUser(null);
      }

    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null); // Reset user on error
    }
  };

  const updateUser = (newData: User | null, newProfileData?: ProfileData | null) => {
    setUser((prev) => ({ ...prev, ...newData }));
    if (newProfileData) {
      setProfileData(newProfileData);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  return (
    <UserContext.Provider value={{ user, profileData, fetchUser, updateUser }}>
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