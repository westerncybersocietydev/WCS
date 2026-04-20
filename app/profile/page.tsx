"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import {
  getProfile,
  updateBasic,
  updatePassword,
  // updatePlan,
} from "../lib/actions/user.action";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import { toast } from "react-hot-toast";
import Avatar from "../dataFiles/avatars";
import { Basic, VIP } from "../dataFiles/perks";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function Profile() {
  const { user, updateUser } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("basic");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const getProfileData = useCallback(async () => {
    if (!user?.userId) {
      console.log("Profile Loading...");
      return;
    }

    try {
      const profile = await getProfile(user.userId);
      setProfileData(profile);
      setFirstName(profile?.firstName);
      setLastName(profile?.lastName);
    } catch (error) {
      toast.error("Couldn't retrieve profile data. Please try again.");
    }
  }, [user?.userId]);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "oldPassword") {
      setOldPassword(value);
    }
    if (name === "newPassword") {
      setNewPassword(value);
    }
    if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setProfileData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleAvatarChange = (avatar: string) => {
    setProfileData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        avatar: avatar,
      };
    });
  };

  const isFormComplete = useCallback(() => {
    return (
      profileData &&
      Object.values(profileData).every((value) => value.trim() !== "")
    );
  }, [profileData]);

  const handleBasicSubmit = async () => {
    if (!profileData || !user?.userId) return;

    setLoading(true);
    if (!isFormComplete()) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await updateBasic(
        user.userId,
        profileData?.firstName,
        profileData?.lastName,
        profileData?.uwoEmail,
        profileData?.preferredEmail || "",
        profileData?.currentYear,
        profileData?.program,
        profileData?.description,
        profileData?.avatar
      );

      toast.success("User information updated successfully.");
      setFirstName(profileData?.firstName);
      setLastName(profileData?.lastName);

      updateUser(user, profileData);
    } catch (error) {
      toast.error("Failed to update basic information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!profileData || !user?.userId) return;

    setLoading(true);

    try {
      if (newPassword !== confirmNewPassword) {
        toast.error("Password does not match.");
        return;
      }

      await updatePassword(user.userId, oldPassword, newPassword);

      toast.success("Password successfully changed.");

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error("Old Password Incorrect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToVIP = () => {
    // Navigate to membership page instead of direct checkout
    router.push("/membership");
  };

  const renderTab = () => {
    switch (selectedTab) {
      case "basic":
        return (
          <form className="space-y-6 w-full bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-10 text-black">
            {/* Form fields */}
            <div className="space-y-2">
              <label
                htmlFor="avatar"
                className="text-black/60 font-medium text-xs uppercase tracking-wider"
              >
                Avatar <span className="font-normal">(required)</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {Avatar.map((imgSrc, index) => (
                  <div
                    key={index}
                    className={`relative w-14 h-14 cursor-pointer transition-all duration-300 hover:scale-110 rounded-full overflow-hidden ring-2 ${profileData?.avatar === imgSrc
                      ? "ring-violet-500 shadow-md scale-110"
                      : "ring-transparent hover:ring-violet-200"
                      }`}
                    onClick={() => handleAvatarChange(imgSrc)}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Profile ${index + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              {/* First Name */}
              <div className="flex flex-col space-y-1 w-1/2 text-black">
                <label
                  htmlFor="firstName"
                  className="text-black/60 font-medium text-xs uppercase tracking-wider"
                >
                  First Name <span className="font-normal">(required)</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData?.firstName || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col space-y-1 w-1/2 text-black">
                <label
                  htmlFor="lastName"
                  className="text-black/60 font-medium text-xs uppercase tracking-wider"
                >
                  Last Name <span className="font-normal">(required)</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData?.lastName || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  required
                />
              </div>
            </div>

            {/* About me */}
            <div className="flex flex-col space-y-1 text-black">
              <label
                htmlFor="description"
                className="text-black/60 font-medium text-xs uppercase tracking-wider"
              >
                About Me <span className="font-normal">(required)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={profileData?.description || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                required
                rows={3}
              />
            </div>

            {/* UWO Email */}
            <div className="flex flex-col space-y-1 text-black">
              <label
                htmlFor="uwoEmail"
                className="text-black/60 font-medium text-xs uppercase tracking-wider"
              >
                UWO Email <span className="font-normal">(required)</span>
              </label>
              <input
                type="email"
                id="uwoEmail"
                name="uwoEmail"
                value={profileData?.uwoEmail || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                required
              />
            </div>

            {/* Preferred Email */}
            <div className="flex flex-col space-y-1 text-black">
              <label
                htmlFor="preferredEmail"
                className="text-black/60 font-medium text-xs uppercase tracking-wider"
              >
                Personal Email <span className="font-normal">(required)</span>
              </label>
              <input
                type="email"
                id="preferredEmail"
                name="preferredEmail"
                value={profileData?.preferredEmail || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
              />
              <label className="text-gray-500 text-xs">
                Provide a personal email address to have receive WCS
                communications
              </label>
            </div>

            {/* Current Year */}
            <div className="flex flex-col space-y-1 text-black">
              <label
                htmlFor="currentYear"
                className="text-black/60 font-medium text-xs uppercase tracking-wider"
              >
                Current Year{" "}
                <span className="font-normal text-gray-500">(required)</span>
              </label>
              <select
                id="currentYear"
                name="currentYear"
                value={profileData?.currentYear || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30 appearance-none"
                required
              >
                <option value="" disabled>
                  Select Year
                </option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year or higher</option>
                <option value="6">HBA 1</option>
                <option value="7">HBA 2</option>
              </select>
            </div>

            {/* Program */}
            <div className="flex flex-col space-y-1 text-black">
              <label
                htmlFor="program"
                className="text-black/60 font-medium text-xs uppercase tracking-wider"
              >
                Program <span className="font-normal">(required)</span>
              </label>
              <input
                type="text"
                id="program"
                name="program"
                value={profileData?.program || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                required
              />
              <label className="text-gray-500 text-xs">
                Provide your full program and any additional majors/minors you
                are pursuing
              </label>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleBasicSubmit}
              className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md"
            >
              {loading ? "Saving..." : "Update Information"}
            </button>
          </form>
        );
      case "password":
        return (
          <form className="space-y-6 w-full bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-10 text-black">
            {/* Form fields */}
            <div className="flex flex-col space-y-4">
              {/* Current Password */}
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="oldPassword"
                  className="text-black/60 font-medium text-xs uppercase tracking-wider"
                >
                  Current Password{" "}
                  <span className="font-normal">(required)</span>
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={handlePassword}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  required
                />
              </div>

              {/* New Password */}
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="newPassword"
                  className="text-black/60 font-medium text-xs uppercase tracking-wider"
                >
                  New Password <span className="font-normal">(required)</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePassword}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  required
                />
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="confirmNewPassword"
                  className="text-black/60 font-medium text-xs uppercase tracking-wider"
                >
                  Confirm New Password{" "}
                  <span className="font-normal">(required)</span>
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={handlePassword}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  required
                />
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handlePasswordSubmit}
                className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md"
              >
                {loading ? "Saving..." : "Update Password"}
              </button>
            </div>
          </form>
        );
      case "plan":
      case "plan":
        return (
          <div className="relative space-y-4 w-full bg-white/80 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 md:p-10 text-black">
            <div>
              <p className="text-gray-400" style={{ fontSize: "11px" }}>
                Current Plan
              </p>
              <h1 className="text-black font-bold text-2xl">
                {profileData?.plan}
              </h1>
              {profileData?.plan === "Basic" ? (
                <>
                  <p className="mt-3 mb-3 text-gray-700 text-xs md:max-w-[24vw]">
                    The Basic Plan is ideal for students beginning their
                    journey.
                  </p>
                  <ul>
                    {Basic.map((benefit, index) => (
                      <li
                        key={index}
                        className="mt-1 flex font-semibold text-xs items-center text-gray-500 text-md"
                      >
                        <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </>
              ) : profileData?.plan === "VIP" ? (
                <>
                  <p className="mt-3 mb-3 text-gray-700 text-xs">
                    The VIP Plan is ideal for students who want to go places in
                    their career journey and make an impact.
                  </p>
                  <ul>
                    {Basic.map((benefit, index) => (
                      <li
                        key={index}
                        className="mt-1 flex font-semibold text-xs items-center text-gray-500 text-md"
                      >
                        <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                    {VIP.map((benefit, index) => (
                      <li
                        key={index}
                        className="mt-1 flex font-semibold text-xs items-center text-gray-500 text-md"
                      >
                        <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            {profileData?.plan === "Basic" && (
              <button
                 className="mt-4 md:mt-0 md:absolute md:top-10 md:right-8 w-full md:w-auto rounded-full font-medium text-white bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-[1.02] hover:from-violet-600 hover:to-purple-600 px-6 py-2.5 transition-all duration-300 ease-in-out shadow-md text-sm"
                onClick={handleUpgradeToVIP}
              >
                <i className="fa-solid fa-rocket"></i> BECOME A VIP
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
    renderTab();
  };

  return (
    <>
      <main className="relative min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="relative z-10 pt-28 flex flex-col min-h-screen">
          <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-4 md:px-8 gap-8 pb-12">
            {/* Left Column: Profile Summary */}
            <div className="w-full md:w-1/3 flex flex-col items-center bg-white/80 backdrop-blur-xl border border-black/5 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
              <div className="relative w-32 h-32 mb-6">
                <Image
                  src={profileData?.avatar || "/default-avatar.png"}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-md"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold text-black/90 mb-2 tracking-tight text-center" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                {firstName} {lastName}
              </h1>
              <p className="text-sm text-black/50 text-center mb-6 leading-relaxed">
                {profileData?.description}
              </p>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm ${profileData?.plan === "VIP" ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white" : "bg-black/5 text-black/60"}`}>
                {profileData?.plan} Plan
              </div>
            </div>

            {/* Right Column: Main Content */}
            <div className="w-full md:w-2/3 flex flex-col">
              {/* Tabs */}
              <div className="flex flex-wrap items-center text-xs font-medium border-b border-black/5 gap-6 md:gap-8 uppercase tracking-wider mb-8">
                <button
                  className={`py-3 focus:outline-none transition-all border-b-2 ${selectedTab === "basic" ? "border-violet-500 text-violet-600 font-bold" : "border-transparent text-black/40 hover:text-black/70"}`}
                  onClick={() => handleTabClick("basic")}
                >
                  Edit Profile
                </button>
                <button
                  className={`py-3 focus:outline-none transition-all border-b-2 ${selectedTab === "password" ? "border-violet-500 text-violet-600 font-bold" : "border-transparent text-black/40 hover:text-black/70"}`}
                  onClick={() => handleTabClick("password")}
                >
                  Change Password
                </button>
                <button
                  className={`py-3 focus:outline-none transition-all border-b-2 ${selectedTab === "plan" ? "border-violet-500 text-violet-600 font-bold" : "border-transparent text-black/40 hover:text-black/70"}`}
                  onClick={() => handleTabClick("plan")}
                >
                  Membership Plan
                </button>
              </div>

              {/* Tab Content */}
              <div className="w-full">
                {renderTab()}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
