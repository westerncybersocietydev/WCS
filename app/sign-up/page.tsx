"use client";
import React, { Suspense, useCallback, useState } from "react";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import { createUser, loginUser } from "../lib/actions/user.action";
import { useUser } from "../context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import BecomeVIP from "../components/becomeVIP";
import toast from "react-hot-toast";
import { Basic, VIP } from "../dataFiles/perks";

export default function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
    </Suspense>
  );
}

function SearchParamsComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("event");

  const [loading, setLoading] = useState(false);
  const [basicLoading, setBasicLoading] = useState(false);
  const [vipLoading, setVipLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const { fetchUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    uwoEmail: "",
    currentYear: "",
    program: "",
    preferredEmail: "",
    password: "",
    confirmPassword: "",
  });

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    []
  );

  const isFormComplete = useCallback(() => {
    return Object.entries(formData).every(([, value]) => value.trim() !== "");
  }, [formData]);

  const handleNext = useCallback(async () => {
    setLoading(true);
    if (!isFormComplete()) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (step === 1) {
      try {
        const response = await fetch("/api/checkEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uwoEmail: formData.uwoEmail }),
        });

        // Check if the response is successful
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData?.error || "Error checking email. Please try again.";
          console.error("Email check error:", errorData);
          toast.error(errorMessage);
          setLoading(false);
          return;
        }

        const result = await response.json();
        if (result === true) {
          toast.error(
            "UWO email is taken. Please use a different uwo email or login."
          );
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Network error checking email:", error);
        toast.error(
          "Network error. Please check your connection and try again."
        );
        setLoading(false);
        return;
      }
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setStep((prevStep) => prevStep + 1);
    setLoading(false);
  }, [step, formData.uwoEmail, formData.password, formData.confirmPassword, isFormComplete]);

  const sendWelcomeEmail = useCallback(async () => {
    const recipientEmail =
      formData.preferredEmail.trim() === ""
        ? formData.uwoEmail
        : formData.preferredEmail;

    const emailDetails = {
      from: "info@westerncybersociety.ca",
      to: recipientEmail,
      subject: "Welcome to Western Cyber Society",
      message: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Western Cyber Society</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f7;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                  <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                          <tr>
                              <td align="center" style="padding-bottom: 30px;">
                                  <h1 style="color: #1d1d1f; font-size: 32px; font-weight: 600; margin: 0;">Welcome to Western Cyber Society</h1>
                                  <p style="font-size: 18px; color: #6e6e73; margin: 10px 0 0;">Your Journey into Innovation Begins Here</p>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 20px 0; line-height: 1.7; font-size: 18px;">
                                  <p>Hi <span style="color: #a723b0; font-weight: 600;">${formData.firstName}</span>,</p>
                                  <p style="margin-bottom: 1em;">Welcome to the <span style="color: #a723b0; font-weight: 600;">Western Cyber Society</span>! You are now part of an exclusive community that is dedicated to pushing the boundaries of technology and innovation.</p>
                                  <p style="margin-bottom: 1em;">Prepare to explore new horizons, collaborate with like-minded peers, and gain access to resources that will help you shape the future of tech.</p>
                                  <p>We're excited to have you on board, but remember, the choices you make today help shape the future you want tomorrow.</p>
                                <p style="margin-bottom: -1em;">Keep innovating,</p>
                              <p style="margin-bottom: 1em;">Western Cybern Society Team</p>
                              </td>
                          </tr>
                          <tr>
                              <td align="center" style="margin-top: 40px;">
                                  <a href="http://westerncybersociety.ca" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 18px; letter-spacing: 0.1em; margin-bottom: 2em;" >Explore Your Dashboard</a>
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

    try {
      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailDetails }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json().catch(() => ({}));
        console.error("Email API error:", errorData);
        // Don't throw - just log and show user-friendly message
        toast.error(
          "Registration complete, but we couldn't send the welcome email."
        );
        return;
      }

      await emailResponse.json();
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Welcome email error:", error);
      // Don't throw - registration was successful
      toast.error(
        "Registration complete, but we couldn't send the welcome email."
      );
    }
  }, [formData.firstName, formData.preferredEmail, formData.uwoEmail]);

  // handleSubmit is not currently used - kept for potential future use
  // const handleSubmit = useCallback(
  //   async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!isFormComplete()) {
  //       toast.error("Please fill in all required fields.");
  //       return;
  //     }

  //     setLoading(true);

  //     try {
  //       if (selectedPlan) {
  //         await createUser(
  //           formData.firstName,
  //           formData.lastName,
  //           formData.uwoEmail,
  //           formData.preferredEmail,
  //           formData.currentYear,
  //           formData.program,
  //           selectedPlan,
  //           formData.password
  //         );
  //       }

  //       const token = await loginUser(formData.uwoEmail, formData.password);
  //       document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;

  //       await fetchUser();

  //       toast.success("Registration Completed Successfully.");
  //       setStep(3);
  //       await sendWelcomeEmail();
  //     } catch (error) {
  //       console.error("Registration error:", error);
  //       if (
  //         error instanceof Error &&
  //         error.message.includes("already exists")
  //       ) {
  //         toast.error(
  //           "An account with this email already exists. Please sign in instead."
  //         );
  //       } else {
  //         toast.error("Error during registration. Please try again.");
  //       }
  //       setStep(3);
  //     } finally {
  //       setLoading(false);
  //       setBasicLoading(false);
  //       setVipLoading(false);
  //     }
  //   },
  //   [formData, selectedPlan, sendWelcomeEmail, isFormComplete, fetchUser]
  // );

  const handleVIP = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSelectedPlan("VIP");
      setIsModalOpen(false);
      setVipLoading(true);

      // Production mode - real user creation required

      try {
        // Create user with Basic plan first
        await createUser(
          formData.firstName,
          formData.lastName,
          formData.uwoEmail,
          formData.preferredEmail,
          formData.currentYear,
          formData.program,
          "Basic", // Start with Basic plan
          formData.password
        );

        // Log in the user
        const token = await loginUser(formData.uwoEmail, formData.password);
        document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;
        await fetchUser();

        // Get the user ID from the token
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userId = decoded.userId;

        // Then redirect to PayPal Checkout for VIP upgrade
        const res = await fetch("/api/upgrade/membership", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.uwoEmail,
            userId: userId,
          }),
        });

        // Check if the response is successful
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("VIP upgrade API error:", errorData);
          toast.error("Unable to start checkout. Please try again.");
          setVipLoading(false);
          return;
        }

        const data = await res.json();
        if (data?.url) {
          // Redirect to PayPal Checkout
          window.location.href = data.url;
        } else {
          console.error("No approval URL:", data);
          toast.error("Unable to start checkout. Please try again.");
          setVipLoading(false);
        }
      } catch (err) {
        console.error("VIP registration error:", err);
        // Check if it's a user already exists error
        if (err instanceof Error && err.message.includes("already exists")) {
          toast.error(
            "An account with this email already exists. Please sign in instead."
          );
        } else {
          toast.error(
            "An error occurred during registration. Please try again."
          );
        }
        setVipLoading(false);
        return; // Stop execution here
      }
    },
    [formData.firstName, formData.lastName, formData.uwoEmail, formData.preferredEmail, formData.currentYear, formData.program, formData.password, fetchUser]
  );

  const handleBasic = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsModalOpen(false);
      setBasicLoading(true);

      // Production mode - real user creation required
      try {
        // Create user with Basic plan
        await createUser(
          formData.firstName,
          formData.lastName,
          formData.uwoEmail,
          formData.preferredEmail,
          formData.currentYear,
          formData.program,
          "Basic",
          formData.password
        );

        // Log in the user
        const token = await loginUser(formData.uwoEmail, formData.password);
        document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;
        await fetchUser();

        toast.success("Registration Completed Successfully.");
        setStep(3);

        await sendWelcomeEmail();
      } catch (error) {
        console.error("Basic registration error:", error);
        // Check if it's a user already exists error
        if (
          error instanceof Error &&
          error.message.includes("already exists")
        ) {
          toast.error(
            "An account with this email already exists. Please sign in instead."
          );
        } else {
          toast.error("Error during registration. Please try again.");
        }
        setStep(3);
      } finally {
        setBasicLoading(false);
      }
    },
    [formData.firstName, formData.lastName, formData.uwoEmail, formData.preferredEmail, formData.currentYear, formData.program, formData.password, fetchUser, sendWelcomeEmail]
  );

  // useEffect(() => {
  //   const submitForm = async () => {
  //     if (selectedPlan && formEvent) {
  //       await handleSubmit(formEvent);
  //       setVipLoading(false);
  //     }
  //   };

  //   submitForm();
  // }, [selectedPlan, formEvent, handleSubmit]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1); // Go back to the previous step
    }
  }, [step]);

  return (
    <>
      <main className="relative min-h-screen bg-[#fafafa]">
        <Navbar />
        


        <div className="relative z-10 pt-28 pb-12 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full flex justify-center max-w-5xl">
            {step === 1 && (
              <div className="bg-white/80 backdrop-blur-xl text-black rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 p-8 md:p-10 w-full max-w-lg">

                <h2 className="text-3xl md:text-4xl mb-3 font-semibold text-center text-black/80 tracking-tight" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  Join Us
                </h2>
                <p className="flex justify-center text-sm text-black/50 mb-10 font-medium">
                  Become an innovator in our community.
                </p>
                <form className="space-y-6">
                  <div className="flex space-x-4">
                    {/* First Name */}
                    <div className="flex flex-col space-y-1.5 w-1/2">
                      <label htmlFor="firstName" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                        First Name <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                      </label>
                      <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30" required />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col space-y-1.5 w-1/2">
                      <label htmlFor="lastName" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                        Last Name <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                      </label>
                      <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30" required />
                    </div>
                  </div>

                  {/* UWO Email */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="uwoEmail" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      UWO Email <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                    </label>
                    <input type="email" id="uwoEmail" name="uwoEmail" value={formData.uwoEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30" placeholder="you@uwo.ca" required />
                  </div>

                  {/* Preferred Email */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="preferredEmail" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      Personal Email <span className="font-normal lowercase tracking-normal text-black/40">(optional)</span>
                    </label>
                    <input type="email" id="preferredEmail" name="preferredEmail" value={formData.preferredEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30" />
                    <label className="text-black/40 text-xs">Provide a personal email to receive WCS communications</label>
                  </div>

                  {/* Current Year */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="currentYear" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      Current Year <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                    </label>
                    <select id="currentYear" name="currentYear" value={formData.currentYear} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300" required>
                      <option value="" disabled>Select Year</option>
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
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="program" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      Program <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                    </label>
                    <input type="text" id="program" name="program" value={formData.program} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30" required />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="password" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      Password <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                    </label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30" required />
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="confirmPassword" className="text-black/60 font-medium text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      Confirm Password <span className="font-normal lowercase tracking-normal text-black/40">(required)</span>
                    </label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30" required />
                  </div>

                  <button type="button" onClick={handleNext} disabled={loading} className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                    {loading ? "Saving..." : "Continue"}
                  </button>
                  <p className="mt-6 text-center text-sm text-black/60" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                    Already have an account? <button type="button" onClick={() => router.push(`/sign-in?event=${encodeURIComponent(redirect || "")}`)} className="text-purple-600 hover:text-purple-700 font-medium transition-colors">Login</button>
                  </p>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="w-full max-w-5xl relative">
                <div className="w-full flex justify-start mb-4">
                  <button className="text-black/60 hover:text-black cursor-pointer transition-colors" onClick={() => handleBack()}>
                    <i className="fa-solid fa-arrow-left text-lg"></i>
                  </button>
                </div>
                <div className="flex flex-col md:flex-row w-full justify-center gap-6 md:gap-8">
                  {/* Basic Plan Card */}
                  <div className="w-full md:w-1/2 lg:w-2/5 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 order-2 md:order-1">
                    <p className="text-black/40 text-xs uppercase tracking-wider font-medium" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>Plan</p>
                    <h1 className="text-black/80 font-semibold text-3xl mt-1 tracking-tight" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>Basic</h1>
                    <p className="mt-3 mb-8 text-black/60 text-sm" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>The Basic Plan is ideal for students beginning their journey.</p>
                    {Basic.map((benefit) => (
                      <li key={benefit} className="mt-3 flex font-medium text-sm items-center text-black/70">
                        <i className="fa-solid fa-circle-check text-emerald-500 mr-3"></i>{benefit}
                      </li>
                    ))}
                    {VIP.map((benefit, index) => (
                      <li key={index} className="mt-3 flex font-medium text-sm items-center text-black/40">
                        <i className="fa-solid fa-circle-xmark text-red-400 mr-3"></i>{benefit}
                      </li>
                    ))}
                    <button className="mt-10 w-full py-3.5 rounded-2xl font-medium text-black/80 text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 border border-black/10 hover:bg-black/5" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }} onClick={handleBasic}>
                      {basicLoading ? "Creating Account..." : "Continue"}
                    </button>
                  </div>

                  {/* VIP Plan Card */}
                  <div className="w-full md:w-1/2 lg:w-2/5 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-purple-500/20 relative order-1 md:order-2">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">RECOMMENDED</span>
                    </div>
                    <p className="text-black/40 text-xs uppercase tracking-wider font-medium mt-2 md:mt-0" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>Plan</p>
                    <h1 className="text-black/80 font-semibold text-3xl mt-1 tracking-tight" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>VIP</h1>
                    <p className="mt-3 mb-8 text-black/60 text-sm" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>Unlock exclusive benefits and premium features with our VIP membership.</p>
                    {Basic.map((benefit, index) => (
                      <li key={index} className="mt-3 flex font-medium text-sm items-center text-black/70">
                        <i className="fa-solid fa-circle-check text-emerald-500 mr-3"></i>{benefit}
                      </li>
                    ))}
                    {VIP.map((benefit, index) => (
                      <li key={index} className="mt-3 flex font-medium text-sm items-center text-black/70">
                        <i className="fa-solid fa-circle-check text-emerald-500 mr-3"></i>{benefit}
                      </li>
                    ))}
                    <div className="mt-8 mb-4">
                      <span className="text-3xl font-bold text-purple-600" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>$15</span>
                    </div>
                    <button className="mt-2 w-full py-3.5 rounded-2xl font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-purple-600 to-violet-600 shadow-[0_4px_14px_0_rgba(147,51,234,0.39)]" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }} onClick={handleVIP}>
                      {vipLoading ? "Processing..." : (<><i className="fa-solid fa-rocket mr-2"></i> Become a VIP - $15</>)}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white/80 backdrop-blur-xl text-black rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 p-8 md:p-10 w-full max-w-lg text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl md:text-3xl font-semibold text-black/80 tracking-tight" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  Congratulations!
                </h3>
                <h3 className="text-lg font-medium text-purple-600 mt-2" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  You Are Now a WCS {selectedPlan} Member
                </h3>
                <p className="text-black/60 text-sm mt-5" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  Thank you for signing up! Please check your inbox for a confirmation email. If you don&apos;t see it shortly, be sure to check your junk folder.
                </p>
                <div className="mt-8 mb-6">
                  <button className="w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }} type="button" onClick={() => router.push(redirect || "/")} disabled={loading}>
                    {basicLoading ? "Sending Email..." : "Go to Dashboard"}
                  </button>
                </div>
                <p className="text-black/50 text-sm" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                  Interested in becoming a VIP member? Purchase your membership <span className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer transition-colors" onClick={() => window.open("https://estore.eng.uwo.ca/", "_blank")}>here</span>. Your account will be upgraded within 10 business days.
                </p>
              </div>
            )}
          </div>
        </div>
        <Footer />
        {/* Modal */}
        <BecomeVIP isOpen={isModalOpen} onClose={onClose} onComplete={handleVIP} />
      </main>
    </>
  );
}
