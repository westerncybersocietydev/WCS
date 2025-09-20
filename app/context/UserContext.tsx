"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

  // 🚀 DEV BYPASS - Set to true for development testing (no login required)
  // Set to false when ready for production
  const DEV_MODE = false;

  const fetchUser = async () => {
    // DEV BYPASS - Skip authentication in development
    if (DEV_MODE) {
      console.log("🚀 DEV MODE: Bypassing authentication");
      setUser({ userId: "507f1f77bcf86cd799439011" }); // Valid MongoDB ObjectId for dev
      setProfileData({
        firstName: "Dev",
        lastName: "User",
        uwoEmail: "dev@uwo.ca",
        preferredEmail: "dev@example.com",
        currentYear: "3",
        program: "Computer Science",
        plan: "VIP",
        description: "Development test user",
        avatar: "/defaultPfp.png",
      });
      return;
    }

    try {
      const response = await fetch("/api/getToken", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.status === 401) {
        // No valid token - user is not logged in
        console.log("No valid token - user not logged in");
        setUser(null);
        setProfileData(null);
      } else if (response.status === 200) {
        setUser(data.userId ? { userId: data.userId } : null);
        // Optionally set profile data if available
        if (data.profileData) {
          setProfileData(data.profileData);
        }
      } else {
        console.error("Error:", data.message);
        setUser(null);
        setProfileData(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null); // Reset user on error
      setProfileData(null);
    }
  };

  const updateUser = (
    newData: User | null,
    newProfileData?: ProfileData | null
  ) => {
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
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
