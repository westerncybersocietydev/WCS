"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import Navbar from "../components/navbar";
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
  const [formEvent, setFormEvent] = useState<React.FormEvent | null>(null);
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
        const result = await response.json();
        if (result) {
          toast.error(
            "UWO email is taken. Please use a different uwo email or login."
          );
          setLoading(false);
          return;
        }
      } catch (error) {
        toast.error("Error checking email.");
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
  }, [step, formData.uwoEmail, isFormComplete]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormComplete()) {
        toast.error("Please fill in all required fields.");
        return;
      }

      setLoading(true);

      try {
        if (selectedPlan) {
          await createUser(
            formData.firstName,
            formData.lastName,
            formData.uwoEmail,
            formData.preferredEmail,
            formData.currentYear,
            formData.program,
            selectedPlan,
            formData.password
          );
        }

        const token = await loginUser(formData.uwoEmail, formData.password);
        document.cookie = `authToken=${token}; path=/; secure; samesite=strict`; // Setting cookie on the client side

        await fetchUser();

        toast.success("Registration Completed Successfully.");
        setStep(3);

        const emailDetails = {
          from: "info@westerncybersociety.ca",
          to:
            formData.preferredEmail.trim() === ""
              ? formData.uwoEmail
              : formData.preferredEmail,
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

        const emailResponse = await fetch("/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailDetails }),
        });

        if (!emailResponse.ok) {
          throw new Error("Failed to send welcome email.");
        }

        await emailResponse.json();
      } catch (error) {
        toast.error("Error sending email.");
        setStep(3);
      } finally {
        setLoading(false);
        setBasicLoading(false);
        setVipLoading(false);
      }
    },
    [formData, selectedPlan]
  );

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

        // Then redirect to Stripe Checkout for VIP upgrade
        const res = await fetch("/api/upgrade/membership", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.uwoEmail,
            userId: userId,
          }),
        });

        const data = await res.json();
        if (data?.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          console.error("No session URL:", data);
          toast.error("Unable to start checkout. Please try again.");
          setVipLoading(false);
        }
      } catch (err) {
        console.error("Checkout error:", err);
        toast.error("An error occurred starting checkout.");
        setVipLoading(false);
      }
    },
    [handleSubmit, formData.uwoEmail]
  );

  const handleBasic = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSelectedPlan("Basic");
      setIsModalOpen(false);
      setBasicLoading(true);

      // Production mode - real user creation required

      // Call form submission for Basic plan
      await handleSubmit(e);
    },
    [handleSubmit]
  );

  useEffect(() => {
    const submitForm = async () => {
      if (selectedPlan && formEvent) {
        await handleSubmit(formEvent);
        setVipLoading(false);
      }
    };

    submitForm();
  }, [selectedPlan, formEvent, handleSubmit]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1); // Go back to the previous step
    }
  }, [step]);

  return (
    <>
      <main>
        <div>
          <Navbar />
          <div className="mt-16 flex flex-col text-black items-center justify-center min-h-screen p-4">
            <div className="w-full">
              {step === 2 && (
                <button
                  className="mb-4 ml-80 cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-125"
                  onClick={() => handleBack()}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              )}
            </div>

            <div className="w-full flex justify-center">
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-md p-9 w-full max-w-lg shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] shadow-gray-300">
                  <h2 className="text-3xl mb-2 font-bold text-center text-gray-800">
                    SIGN UP
                  </h2>
                  <p className="flex justify-center text-xs text-gray-500 mb-6">
                    Join Western Cyber Society today and become an innovator in
                    our community.
                  </p>
                  <form className="space-y-4">
                    <div className="flex space-x-4">
                      {/* First Name */}
                      <div className="flex flex-col space-y-1 w-1/2">
                        <label
                          htmlFor="firstName"
                          className="text-gray-600 font-bold text-sm"
                        >
                          First Name{" "}
                          <span className="font-normal">(required)</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                          required
                        />
                      </div>

                      {/* Last Name */}
                      <div className="flex flex-col space-y-1 w-1/2">
                        <label
                          htmlFor="lastName"
                          className="text-gray-600 font-bold text-sm"
                        >
                          Last Name{" "}
                          <span className="font-normal">(required)</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                          required
                        />
                      </div>
                    </div>

                    {/* UWO Email */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="uwoEmail"
                        className="text-gray-600 font-bold text-sm"
                      >
                        UWO Email{" "}
                        <span className="font-normal">(required)</span>
                      </label>
                      <input
                        type="email"
                        id="uwoEmail"
                        name="uwoEmail"
                        value={formData.uwoEmail}
                        onChange={handleChange}
                        className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        required
                      />
                    </div>

                    {/* Preferred Email */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="preferredEmail"
                        className="text-gray-600 font-bold text-sm"
                      >
                        Personal Email{" "}
                        <span className="font-normal">(required)</span>
                      </label>
                      <input
                        type="email"
                        id="preferredEmail"
                        name="preferredEmail"
                        value={formData.preferredEmail}
                        onChange={handleChange}
                        className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                      />
                      <label className="text-gray-500 text-xs">
                        Provide a personal email address to have receive WCS
                        communications
                      </label>
                    </div>

                    {/* Current Year */}
                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="currentYear"
                        className="text-gray-700 font-semibold text-sm"
                      >
                        Current Year{" "}
                        <span className="font-normal text-gray-500">
                          (required)
                        </span>
                      </label>
                      <select
                        id="currentYear"
                        name="currentYear"
                        value={formData.currentYear}
                        onChange={handleChange}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
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
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="program"
                        className="text-gray-600 font-bold text-sm"
                      >
                        Program <span className="font-normal">(required)</span>
                      </label>
                      <input
                        type="text"
                        id="program"
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        required
                      />
                      <label className="text-gray-500 text-xs">
                        Provide your full program and any additional
                        majors/minors you are pursuing
                      </label>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="password"
                        className="text-gray-600 font-bold text-sm"
                      >
                        Current Password{" "}
                        <span className="font-normal">(required)</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        required
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col space-y-1">
                      <label
                        htmlFor="confirmPassword"
                        className="text-gray-600 font-bold text-sm"
                      >
                        Confirm Password{" "}
                        <span className="font-normal">(required)</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)] shadow-gray-300 rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={loading}
                      className="mt-6 w-full tracking-widest rounded-full font-semibold text-white
            border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
             py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                    >
                      {loading ? "Saving..." : "Continue"}
                    </button>
                    {(step === 1 || step === 2) && (
                      <p className="mb-5 mt-1 text-center text-sm">
                        Already have an account?{" "}
                        <a
                          onClick={() =>
                            router.push(
                              `/sign-in?event=${encodeURIComponent(
                                redirect || ""
                              )}`
                            )
                          }
                          className="text-blue-500 cursor-pointer"
                        >
                          <u>Login</u>
                        </a>
                      </p>
                    )}
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="flex w-full justify-center space-x-8 mx-32">
                  <div className="w-2/5 bg-white rounded-lg p-8 shadow-lg border-2 border-gray-200">
                    <p className="text-gray-400" style={{ fontSize: "13px" }}>
                      Plan
                    </p>
                    <h1 className="text-black font-bold text-3xl">Basic</h1>
                    <p className="mt-3 mb-8 text-gray-700 text-sm">
                      The Basic Plan is ideal for students beginning their
                      journey.
                    </p>
                    {Basic.map((benefit) => (
                      <li
                        key={benefit}
                        className="mt-2 flex font-semibold text-sm items-center text-gray-500 text-md"
                      >
                        <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                    {VIP.map((benefit, index) => (
                      <li
                        key={index}
                        className="mt-2 flex font-semibold text-sm items-center text-gray-500 text-md"
                      >
                        <i className="fa-solid fa-circle-xmark text-red-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                    <button
                      className="mt-10 w-full tracking-widest rounded-full font-semibold text-white
            border-2 font-bold bg-gradient-to-r from-purple-500 to-violet-500 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-700 hover:to-violet-800
             py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                      onClick={handleBasic}
                    >
                      {basicLoading ? "Creating Account..." : "Continue"}
                    </button>
                  </div>
                  <div className="w-2/5 bg-white rounded-lg p-8 shadow-lg border-2 border-purple-500 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-gray-400" style={{ fontSize: "13px" }}>
                      Plan
                    </p>
                    <h1 className="text-black font-bold text-3xl">VIP</h1>
                    <p className="mt-3 mb-8 text-gray-700 text-sm">
                      Unlock exclusive benefits and premium features with our
                      VIP membership.
                    </p>
                    {Basic.map((benefit, index) => (
                      <li
                        key={index}
                        className="mt-2 flex font-semibold text-sm items-center text-gray-500 text-md"
                      >
                        <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                    {VIP.map((benefit, index) => (
                      <li
                        key={index}
                        className="mt-2 flex font-semibold text-sm items-center text-gray-500 text-md"
                      >
                        <i className="fa-solid fa-circle-check text-green-500 font-bold mr-2"></i>
                        {benefit}
                      </li>
                    ))}
                    <div className="mt-6 mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        $15
                      </span>
                      <span className="text-gray-500 ml-2"></span>
                    </div>
                    <button
                      className="mt-4 w-full tracking-widest rounded-full font-semibold text-white
            border-2 font-bold bg-gradient-to-r from-purple-500 to-violet-500 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-700 hover:to-violet-800
             py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                      onClick={handleVIP}
                    >
                      {vipLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          <i className="fa-solid fa-rocket"></i> Become a VIP -
                          $15
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-2 px-20">
                  <h3 className="text-3xl font-semibold text-gray-800">
                    Congratulations!
                  </h3>
                  <h3 className="text-xl font-semibold text-gray-800">
                    You Are Now a WCS {selectedPlan} Member
                  </h3>
                  <p className="text-gray-600 mt-5">
                    Thank you for signing up for the Western Cyber Society!
                    Please check your inbox for a confirmation email. If you
                    don’t see it shortly, be sure to check your junk mail
                    folder.
                  </p>
                  <div className="my-10 flex justify-center">
                    <button
                      className="my-5 w-3/4 tracking-widest rounded-full font-semibold text-white
                    border-2 font-bold bg-gradient-to-r from-purple-500 to-violet-500 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-700 hover:to-violet-800
                    py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                      type="button"
                      onClick={() => router.push(redirect || "/")}
                      disabled={loading}
                    >
                      {basicLoading ? "Sending Email..." : "Go to Dashboard"}
                    </button>
                  </div>
                  <p className="text-gray-600">
                    Interested in becoming a VIP member at Western Cyber
                    Society? Purchase your membership{" "}
                    <span
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        window.open("https://estore.eng.uwo.ca/", "_blank")
                      }
                    >
                      here
                    </span>
                    . Your account will be upgraded within 10 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
          <Footer />
          {/* Modal */}
          <BecomeVIP
            isOpen={isModalOpen}
            onClose={onClose}
            onComplete={handleVIP}
          />
        </div>
      </main>
    </>
  );
}
