"use client";
import React, { Suspense, useCallback, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import toast from "react-hot-toast";
import { getNameAndUserId, resetPassword } from "../lib/actions/user.action";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsComponent />
      </Suspense>
    );
  }

function SearchParamsComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('event');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [userInputCode, setUserInputCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Utility function to generate a 6-digit random code
  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Step 1: Check if the email exists and send verification code
  const checkEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please fill in your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await getNameAndUserId(email)

      if (response) {
        toast.success("Account found. A verification code has been sent to your preferred email.");

        const code = generateCode();
        setGeneratedCode(code);

        // Email details
        const emailDetails = {
          from: "info@westerncybersociety.ca",
          to: response.preferredEmail.trim() === "" ? response.uwoEmail : response.preferredEmail,
          subject: "Password Reset Verification Code",
          message: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Update Your WCS Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f7;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                      <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                              <tr>
                                  <td style="padding: 20px 0; line-height: 1.7; font-size: 18px;">
                                      <p>Hi <span style="color: #a723b0; font-weight: 600;">${response.firstName}</span>,</p>
                                      <p style="margin-bottom: 1em;">You recently requested to reset your password for your Western Cyber Society account. Your six-digit verification code is <span style="color: #a723b0; font-weight: 600;">${code}</span></p>
                                      <p style="margin-bottom: 1em;">If you didn't request this, please ignore this email. </p>                 
                                    <p style="margin-bottom: -1em;">Keep innovating,</p>
                                  <p style="margin-bottom: 1em;">Western Cybern Society Team</p>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" style="margin-top: 60px; font-size: 12px; color: #86868b; border-top: 1px solid #e0e0e2; padding-top: 20px;">
                                      <p>&copy; 2024 Western Cyber Society. All rights reserved.</p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
            `,
        };

        const emailResponse = await fetch("/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailDetails }),
        });

        if (!emailResponse.ok) {
          throw new Error("Failed to send verification email.");
        }

        setStep(2);
      } else {
        toast.error("UWO email not found.");
      }
    } catch (error) {
      toast.error("UWO email not found.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Step 2: Verify the input code
  const verifyCode = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (userInputCode === generatedCode) {
        toast.success("Code verified successfully.");
        setStep(3);
      } else {
        toast.error("Invalid verification code.");
      }
    },
    [userInputCode, generatedCode]
  );

  // Step 3: Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
        setLoading(true);  
        await resetPassword(email, newPassword)
        toast.success("Password successfully reset. Please log in.");
        router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)
    } catch (error) {
      toast.error("An error occurred while resetting the password.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1); // Go back to the previous step
    }
  }, [step]);

  return (
    <main>
      <div>
        <Navbar />
        <div className="mt-16 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-lg bg-white text-black rounded-lg shadow-md p-8">
          { step === 2 && (
            <button
              className='mb-4 cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-125'
              onClick={() => handleBack()}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          ) }
            <h2 className="text-3xl mb-5 font-bold text-center text-gray-800">Reset Your Password</h2>

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={checkEmail} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-gray-600 font-bold text-sm">
                    UWO Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full tracking-widest rounded-full font-semibold text-white
                  border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
                  py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                >
                  {loading ? "Checking..." : "Reset Password"}
                </button>
                <p className="mb-5 mt-1 text-center text-sm">Remember your password? <a onClick={() => router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)} className="text-blue-500 cursor-pointer"><u>Login</u></a></p>
              </form>
            )}

            {/* Step 2: Verify Code */}
            {step === 2 && (
              <form onSubmit={verifyCode} className="space-y-4">
                <div>
                  <label htmlFor="code" className="text-gray-600 font-bold text-sm">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value)}
                    className="w-full shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full tracking-widest rounded-full font-semibold text-white
                  border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
                  py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
                <p className="text-center text-xs text-gray-500">This may take a few minutes. Please wait patiently and do not leave this page. If you do not see an email after a while, please check your junk folder or try again later.</p>
                <p className="mb-5 text-center text-sm">Remember your password? <a onClick={() => router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)} className="text-blue-500 cursor-pointer"><u>Login</u></a></p>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="text-gray-600 font-bold text-sm">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmNewPassword" className="text-gray-600 font-bold text-sm">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full tracking-widest rounded-full font-semibold text-white
                  border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
                  py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                <p className="mb-5 mt-1 text-center text-sm">Remember your password? <a onClick={() => router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)} className="text-blue-500 cursor-pointer"><u>Login</u></a></p>
              </form>
            )}
             {error && <p className="text-center text-red-500 mt-2">{error}</p>}
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}