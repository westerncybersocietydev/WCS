"use client";
import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useUser } from "../context/UserContext";
import { getProfile, updateBasic, updatePassword, updatePlan } from "../lib/actions/user.action";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  uwoEmail: string;
  preferredEmail?: string;
  currentYear: string;
  program: string;
  plan?: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
const options:any = {
  mode: 'payment',
  amount: 15 * 100,
  currency: 'cad',
};

const planPerks: Record<string, string[]> = {
  Basic: [
    'Access to basic features',
    'Community support',
    'Limited storage',
  ],
  VIP: [
    'Access to basic features',
    'Community support',
    'Limited storage',
    'Priority support',
    'Unlimited storage',
    'Access to exclusive content',
  ],
};

export default function Profile() {
    
  const router = useRouter();

  const { user, fetchUser } = useUser();
  const [firstName, setFirstName] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState("basic");
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
  

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4" style={{ background: "#ededed" }}>
        <div className="flex w-full">
          {/* Sidebar for options */}
          <div className="w-1/4 p-4">
            <div className="flex flex-col space-y-1">
            <button
                className={`text-left text-gray-800 font-semibold rounded p-1 ${setting === "basic" ? "bg-gray-300" : ""}`}
                onClick={() => setSetting("basic")}
                >
                Basic Information
                </button>
                <button
                className={`text-left text-gray-800 font-semibold rounded p-1 ${setting === "password" ? "bg-gray-300" : ""}`}
                onClick={() => setSetting("password")}
                >
                Change Your Password
                </button>
                <button
                className={`text-left text-gray-800 font-semibold rounded p-1 ${setting === "plan" ? "bg-gray-300" : ""}`}
                onClick={() => setSetting("plan")}
                >
                Plan
                </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="w-3/4 max-w-lg">
          {user && (
            <h2 className="text-3xl mb-1 font-bold text-center text-gray-800">{firstName}'s Profile</h2>
          )}
            <h2 className="text-xl mb-5 font-bold text-center text-gray-800">
              {setting === "basic"
                ? "Basic Information"
                : setting === "password"
                ? "Change Password"
                : setting === "plan"
                ? "Plan"
                : ""}
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {setting === "basic" && (
              <form className="space-y-4 bg-white rounded shadow-md p-9">
                {/* Form fields */}
                <div className="flex space-x-4">
                  {/* First Name */}
                  <div className="flex flex-col space-y-1 w-1/2 text-black">
                    <label htmlFor="firstName" className="text-gray-600">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData?.firstName || ""}
                      onChange={handleInputChange}
                      className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col space-y-1 w-1/2 text-black">
                    <label htmlFor="lastName" className="text-gray-600">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData?.lastName || ""}
                      onChange={handleInputChange}
                      className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                      required
                    />
                  </div>
                </div>

                {/* UWO Email */}
                <div className="flex flex-col space-y-1 text-black">
                  <label htmlFor="uwoEmail" className="text-gray-600">UWO Email</label>
                  <input
                    type="email"
                    id="uwoEmail"
                    name="uwoEmail"
                    value={profileData?.uwoEmail || ""}
                    onChange={handleInputChange}
                    className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>

                {/* Preferred Email */}
                <div className="flex flex-col space-y-1 text-black">
                  <label htmlFor="preferredEmail" className="text-gray-600">Preferred Email (optional)</label>
                  <input
                    type="email"
                    id="preferredEmail"
                    name="preferredEmail"
                    value={profileData?.preferredEmail || ""}
                    onChange={handleInputChange}
                    className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  />
                </div>

                {/* Current Year */}
                <div className="flex flex-col space-y-1 text-black">
                  <label htmlFor="currentYear" className="text-gray-600 font-medium">Current Year</label>
                  <select
                    id="currentYear"
                    name="currentYear"
                    value={profileData?.currentYear || ""}
                    onChange={handleInputChange}
                    className="border border-gray-500 rounded-md pl-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:shadow-md hover:border-blue-400 hover:bg-white text-gray-700"
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
                  <label htmlFor="program" className="text-gray-600">Program</label>
                  <input
                    type="text"
                    id="program"
                    name="program"
                    value={profileData?.program || ""}
                    onChange={handleInputChange}
                    className="border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleBasicSubmit}
                  className="w-full bg-violet-800 text-white py-2 rounded-full hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Update Information"}
                </button>
              </form>
            )}
            {setting === "password" && (
                <form className="space-y-4 bg-white rounded shadow-md p-9">
                {/* Form fields */}
                <div className="flex flex-col space-y-4">
                    {/* Current Password */}
                    <div className="flex flex-col space-y-1">
                    <label htmlFor="oldPassword" className="text-gray-600">Current Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={handlePassword}
                        className="text-black border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        required
                    />
                    </div>

                    {/* New Password */}
                    <div className="flex flex-col space-y-1">
                    <label htmlFor="newPassword" className="text-gray-600">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={handlePassword}
                        className="text-black border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        required
                    />
                    </div>

                    {/* Confirm New Password */}
                    <div className="flex flex-col space-y-1">
                    <label htmlFor="confirmNewPassword" className="text-gray-600">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={handlePassword}
                        className="text-black border border-gray-500 rounded shadow-sm pl-3 px-1 py-1 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        required
                    />
                    </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handlePasswordSubmit}
                    className="w-full bg-violet-800 text-white py-2 rounded-full hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}

            {setting === "plan" && (
            <div className="space-y-4">
            <div className="space-x-4 text-black bg-white rounded p-5">
                <h1 className="text-lg font-bold">You are a {profileData?.plan} User</h1>
                <ul className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {profileData?.plan && planPerks[profileData?.plan]?.map((perk, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span><i className="fa-solid fa-check mr-2"></i>{perk}</span>
                    </li>
                  ))}
                </ul>
            </div>

            {profileData?.plan === "Basic" && (
                <div>
                <h1 className="text-black text-xl text-center mb-2"><i className="fa-solid fa-down-long"></i></h1>
                <div className="space-x-4 text-white bg-gradient-to-br from-slate-900 to-neutral-700 rounded p-5 transition-all duration-300 ease-in-out hover:scale-105">
                <h1 className="text-lg font-bold">Become a VIP Member Today!</h1>
                <ul className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {planPerks["VIP"].map((perk, index) => (
                    <li key={index} className="flex items-start space-x-2">
                    <span><i className="fa-solid fa-check mr-2"></i>{perk}</span>
                    </li>
                ))}
                </ul>
                <div className="flex justify-end">
                <button
                    className="text-sm mt-7 bg-white text-black rounded border border-gray-700 hover:scale-105 hover:bg-black hover:text-white px-5 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                    aria-label="Learn More"
                    onClick={() => setIsModalOpen(true)}
                    >
                    Upgrade
                    </button>
                </div>
            </div></div>
            )}

          </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg my-5">
            <span className="absolute top-0 right-0 p-2 cursor-pointer" onClick={onClose}>
              <i className="fa fa-times"></i>
            </span>
            <h2 className="text-lg font-bold text-black mb-4">Become a WCS VIP</h2>

            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm onPaymentSuccess={handlePlanSubmit} planPrice={15} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}