"use client";
import React, { Suspense, useCallback, useState } from "react";
import Navbar from "../components/LandingNavbar";
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
    <main className="relative min-h-screen bg-[#fafafa]">
      <Navbar />



      <div className="relative z-10 pt-28 pb-12 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white/80 backdrop-blur-xl text-black rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 p-8 md:p-10 w-full max-w-lg">
          { step === 2 && (
            <button
              className='mb-4 text-black/60 hover:text-black cursor-pointer transition-colors'
              onClick={() => handleBack()}
            >
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
          ) }

          <h2 className="text-3xl md:text-4xl mb-10 font-semibold text-center text-black/80 tracking-tight" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>Reset Your Password</h2>

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={checkEmail} className="space-y-5">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  UWO Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  placeholder="you@uwo.ca"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {loading ? "Checking..." : "Reset Password"}
              </button>
              <p className="mt-6 text-center text-sm text-black/60" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                Remember your password? <button type="button" onClick={() => router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)} className="text-purple-600 hover:text-purple-700 font-medium transition-colors">Login</button>
              </p>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={verifyCode} className="space-y-5">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="code" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={userInputCode}
                  onChange={(e) => setUserInputCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  placeholder="Enter code"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <p className="text-center text-xs text-black/40 mt-4">This may take a few minutes. Please wait patiently and do not leave this page. If you do not see an email after a while, please check your junk folder or try again later.</p>
              <p className="mt-6 text-center text-sm text-black/60" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                Remember your password? <button type="button" onClick={() => router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)} className="text-purple-600 hover:text-purple-700 font-medium transition-colors">Login</button>
              </p>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="newPassword" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="confirmNewPassword" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <p className="mt-6 text-center text-sm text-black/60" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                Remember your password? <button type="button" onClick={() => router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)} className="text-purple-600 hover:text-purple-700 font-medium transition-colors">Login</button>
              </p>
            </form>
          )}
           {error && <p className="text-center text-red-500 mt-4 font-medium text-sm">{error}</p>}
        </div>
      </div>
      <Footer />
    </main>
  );
}