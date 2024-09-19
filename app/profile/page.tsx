"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { getProfile, updateBasic, updatePassword, updatePlan } from "../lib/actions/user.action";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { toast } from 'react-hot-toast';
import BecomeVIP from "../components/becomeVIP";

const Basic = [
  'Ad-free experience',
  'Early access to new features',
  'Advanced analytics and insights',
];

const VIP = [
  'Ad-free experience',
  'Early access to new features',
  'Advanced analytics and insights',
  'Multi-device sync',
  'Offline mode',
  'Community support',
  'Limited storage',
];

interface ProfileData {
  firstName: string;
  lastName: string;
  uwoEmail: string;
  preferredEmail?: string;
  currentYear: string;
  program: string;
  plan?: string;
}

export default function Profile() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState("basic");
  const [selectedTab, setSelectedTab] = useState('basic');
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProfileData = useCallback(async () => {
    if (!user?.userId) {
      setError("User ID not found.");
      return;
    }

    try {
      const profile = await getProfile(user.userId);
      setProfileData(profile);
      setFirstName(profile?.firstName)
      setError('');
    } catch (error) {
      setError("Couldn't retrieve profile data. Please try again.");
    }
  }, [user?.userId]);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "oldPassword") {
      setOldPassword(value);} 
    if (name === "newPassword") {
      setNewPassword(value);
    }
    if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setProfileData((prev) => {
      if (!prev) return prev; // Prevent updating if prev is null

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleBasicSubmit = async () => {
    if (!profileData || !user?.userId) return;

    setLoading(true);

    try {
        await updateBasic(
            user.userId,
            profileData?.firstName,
            profileData?.lastName,
            profileData?.uwoEmail,
            profileData?.preferredEmail || "",
            profileData?.currentYear,
            profileData?.program,
            );
        toast.success("User information updated successfully.")
        setFirstName(profileData?.firstName)
    } catch (error) {
      setError("Failed to update basic information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!profileData || !user?.userId) return;

    setLoading(true);

    try {
        if (newPassword !== confirmNewPassword) {
            setError("New passwords don't match.");
            return;
        }

        // Call the updatePassword function with the old and new passwords
        await updatePassword(
            user.userId,
            oldPassword,
            newPassword
        );

        toast.success("Password successfully changed.")

        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    } catch (error) {
        setError("Old Password Incorrect. Please try again.");
    } finally {
        setLoading(false);
    }
};

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handlePlanSubmit = async () => {
    if (!user?.userId) return;
  
    setLoading(true);
    setError("");
  
    try {
      await updatePlan(user.userId, "VIP");
      await getProfileData();
      onClose();
      toast.success("Congratulations! You are now a VIP!")
    } catch (error) {
      setError("Failed to update the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTab = () => {
    switch (selectedTab) {
      case 'basic':
        return (
          <form className="space-y-4 max-w-lg bg-white rounded-lg shadow-md p-9">
          {/* Form fields */}
          <div className="space-y-2">
          <label htmlFor="firstName" className="text-gray-600 font-bold text-sm">Avatar <span className='font-normal'>(required)</span></label>
            <div className="flex space-x-2">
              <img 
                src='/profileImg.jpg' 
                alt="Profile" 
                className="w-12 h-12 rounded object-cover mb-4"
              />
              <img 
                src='/profileImg.jpg' 
                alt="Profile" 
                className="w-12 h-12 rounded object-cover mb-4"
              />
              <img 
                src='/profileImg.jpg' 
                alt="Profile" 
                className="w-12 h-12 rounded object-cover mb-4"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            {/* First Name */}
            <div className="flex flex-col space-y-1 w-1/2 text-black">
            <label htmlFor="firstName" className="text-gray-600 font-bold text-sm">First Name <span className='font-normal'>(required)</span></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData?.firstName || ""}
                onChange={handleInputChange}
                className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                required
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col space-y-1 w-1/2 text-black">
            <label htmlFor="lastName" className="text-gray-600 font-bold text-sm">Last Name <span className='font-normal'>(required)</span></label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData?.lastName || ""}
                onChange={handleInputChange}
                className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                required
              />
            </div>
          </div>

          {/* About me */}
          <div className="flex flex-col space-y-1 text-black">
            <label htmlFor="aboutMe" className="text-gray-600 font-bold text-sm">
              About Me <span className='font-normal'>(required)</span>
            </label>
            <textarea
              id="aboutMe"
              name="aboutMe"

              className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              required
              rows={2} // Adjust the number of rows to control the height of the textarea
            />
          </div>

          {/* UWO Email */}
          <div className="flex flex-col space-y-1 text-black">
          <label htmlFor="uwoEmail" className="text-gray-600 font-bold text-sm">UWO Email <span className='font-normal'>(required)</span></label>
            <input
              type="email"
              id="uwoEmail"
              name="uwoEmail"
              value={profileData?.uwoEmail || ""}
              onChange={handleInputChange}
              className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          {/* Preferred Email */}
          <div className="flex flex-col space-y-1 text-black">
          <label htmlFor="preferredEmail" className="text-gray-600 font-bold text-sm">Preferred Email <span className='font-normal'>(optional)</span></label>
            <input
              type="email"
              id="preferredEmail"
              name="preferredEmail"
              value={profileData?.preferredEmail || ""}
              onChange={handleInputChange}
              className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Current Year */}
          <div className="flex flex-col space-y-1 text-black">
          <label htmlFor="currentYear" className="text-gray-700 font-semibold text-sm">Current Year <span className='font-normal text-gray-500'>(required)</span></label>
            <select
              id="currentYear"
              name="currentYear"
              value={profileData?.currentYear || ""}
              onChange={handleInputChange}
              className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
              required
            >
              <option value="" disabled>Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year or higher</option>
            </select>
          </div>

          {/* Program */}
          <div className="flex flex-col space-y-1 text-black">
          <label htmlFor="program" className="text-gray-600 font-bold text-sm">Program <span className='font-normal'>(required)</span></label>
            <input
              type="text"
              id="program"
              name="program"
              value={profileData?.program || ""}
              onChange={handleInputChange}
              className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              required
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleBasicSubmit}
            className="w-full rounded-xl text-white bg-blue-600 border hover:bg-blue-800 hover:text-white px-4 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
          >
            {loading ? "Saving..." : "Update Information"}
          </button>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </form>
        );
      case 'password':
        return (
          <form className="space-y-4 bg-white rounded-lg max-w-lg shadow-md p-9">
          {/* Form fields */}
          <div className="flex flex-col space-y-4">
              {/* Current Password */}
              <div className="flex flex-col space-y-1">
              <label htmlFor="oldPassword" className="text-gray-600 font-bold text-sm">Current Password <span className='font-normal'>(required)</span></label>
              <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={handlePassword}
                  className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  required
              />
              </div>

              {/* New Password */}
              <div className="flex flex-col space-y-1">
              <label htmlFor="newPassword" className="text-gray-600 font-bold text-sm">New Password <span className='font-normal'>(required)</span></label>
              <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePassword}
                  className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  required
              />
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col space-y-1">
              <label htmlFor="confirmNewPassword" className="text-gray-600 font-bold text-sm">Confirm New Password <span className='font-normal'>(required)</span></label>
              <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={handlePassword}
                  className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  required
              />
              </div>

            <button
              type="button"
              disabled={loading}
              onClick={handlePasswordSubmit}
              className="w-full rounded-xl text-white bg-blue-600 border hover:bg-blue-800 hover:text-white px-4 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          </div>
        </form>
        );
      case 'plan':
        case 'plan':
          return (
            <div className="relative space-y-2 bg-white rounded-lg max-w-lg shadow-md p-9">
              <div>
                <p className="text-gray-400" style={{ fontSize: '11px' }}>Current Plan</p>
                <h1 className="text-black font-bold text-2xl">{profileData?.plan}</h1>
                {profileData?.plan === 'Basic' ? (
                  <>
                    <p className="mt-3 mb-3 text-gray-700 text-xs w-[24vw]">
                      The Basic Plan is ideal for students beginning their journey.
                    </p>
                    <ul>
                      {Basic.map((benefit, index) => (
                        <li key={index} className="mt-1 flex font-semibold text-xs items-center text-gray-500 text-md">
                          <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : profileData?.plan === 'VIP' ? (
                  <>
                    <p className="mt-3 mb-3 text-gray-700 text-xs w-[24vw]">
                      The VIP Plan is ideal for students who want to go places in their career journey and make an impact.
                    </p>
                    <ul>
                      {VIP.map((benefit, index) => (
                        <li key={index} className="mt-1 flex font-semibold text-xs items-center text-gray-500 text-md">
                        <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
        
              {profileData?.plan === 'Basic' && (
                <button
                  className="absolute top-10 right-5 rounded text-white
                  border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
                  px-6 py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                  style={{ fontSize: '10px' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <i className="fa-solid fa-rocket"></i> UPGRADE PLAN
                </button>
              )}
            </div>
          );
        default:
        return null;
    }
  };  

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    renderTab()
  };
  
  return (
    <div>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <div className="flex w-full">

          <div className="w-full"> 
          <div className="absolute flex flex-col">
          <div className="flex flex-col items-center translate-x-20 translate-y-5">
            <img 
              src='/profileImg.jpg' 
              alt="Profile" 
              className="w-36 h-36 rounded-full object-cover mb-4"
            />
            <h1 className="text-center text-black font-bold" style={{ fontFamily: 'Panton' }}>{profileData?.firstName} {profileData?.lastName}</h1>
            <p className="mt-1 w-[20vw] text-gray-500 font-semibold text-center text-xs">This is my description. I know it isn't really a real description but it is what it is. Am I right?</p>
            <p className={`mt-3 py-1 px-2 text-white rounded text-xs ${profileData?.plan === "VIP" ? "bg-violet-500" : "bg-gray-500"}`}>
            {profileData?.plan}
          </p>
          </div>
        </div>
          <div className="flex text-sm font-bold border-b pt-10 border-gray-300">
            <button
              className={`ml-96 px-4 py-2 focus:outline-none ${selectedTab === 'basic' ? 'border-b-2 border-violet-500 text-violet-500' : 'text-gray-500'}`}
              onClick={() => handleTabClick('basic')}
            >
              Edit Your Profile
            </button>
            <button
              className={`px-4 py-2 focus:outline-none ${selectedTab === 'password' ? 'border-b-2 border-violet-500 text-violet-500' : 'text-gray-500'}`}
              onClick={() => handleTabClick('password')}
            >
              Change Your Password
            </button>
            <button
              className={`px-4 py-2 focus:outline-none ${selectedTab === 'plan' ? 'border-b-2 border-violet-500 text-violet-500' : 'text-gray-500'}`}
              onClick={() => handleTabClick('plan')}
            >
              Plan
            </button>
          </div>
          <div className="p-4 pl-96 bg-gray-100">{renderTab()}</div>
        </div>
          </div>
      </div>
      <Footer />
      {/* Modal */}
      <BecomeVIP isOpen={isModalOpen} onClose={onClose} onComplete={handlePlanSubmit} />
    </div>
  );
}