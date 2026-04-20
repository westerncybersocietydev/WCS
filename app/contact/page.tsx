"use client";

import React, { useCallback, useEffect, useState, Suspense } from "react";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { newInquiry } from "../lib/actions/contact.action";

function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sponsorMode = searchParams.get("sponsor") === "true";

  const [formData, setFormData] = useState({
    topic: "general",
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-select Sponsorships if coming from sponsor page
  useEffect(() => {
    if (sponsorMode) {
      setFormData((prev) => ({
        ...prev,
        topic: "sponsorships",
      }));
    }
  }, [sponsorMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setError("");
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "message") setCharCount(value.length);
  };

  const isFormComplete = useCallback(() => {
    return Object.entries(formData).every(
      ([key, value]) => key === "preferredEmail" || value.trim() !== ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await newInquiry(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.topic,
        formData.message
      );

      toast.success("Inquiry Received Successfully.");

      // Reset form
      setFormData({
        topic: sponsorMode ? "sponsorships" : "general",
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });

      setCharCount(0);
      setError(null);

      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full flex justify-center z-10 px-4 md:px-6">
      <form
        onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-xl bg-white/80 backdrop-blur-md rounded-[2rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 md:p-12 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1"
        >
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] mb-4 tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Contact Us
            </h1>
            <p className="text-[16px] text-[#373a46] opacity-80 max-w-[400px] mx-auto leading-relaxed">
              Have a question or need assistance? Fill out the form below and
              we&apos;ll get back to you soon.
            </p>
          </div>

        {/* TOPIC */}
        <div className="flex flex-col space-y-2 text-black">
          <label
            htmlFor="topic"
            className="text-black/60 font-medium text-xs uppercase tracking-wider"
          >
            Topic
          </label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-[15px] bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 appearance-none"
          >
            <option value="general">General</option>
            <option value="SIP projects">SIP Projects</option>
            <option value="events">Events</option>
            <option value="sponsorships">Sponsorships</option>
          </select>
        </div>

        {/* NAME FIELDS */}
        <div className="flex flex-col sm:flex-row gap-5">
          {/* First Name */}
          <div className="flex flex-col space-y-2 w-full sm:w-1/2 text-black">
            <label
              htmlFor="firstName"
              className="text-black/60 font-medium text-xs uppercase tracking-wider"
            >
              First Name <span className="text-black/40 font-normal ml-1">(required)</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-[15px] bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col space-y-2 w-full sm:w-1/2 text-black">
            <label
              htmlFor="lastName"
              className="text-black/60 font-medium text-xs uppercase tracking-wider"
            >
              Last Name <span className="text-black/40 font-normal ml-1">(required)</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-[15px] bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="flex flex-col space-y-2 text-black">
          <label
            htmlFor="email"
            className="text-black/60 font-medium text-xs uppercase tracking-wider"
          >
            Email <span className="text-black/40 font-normal ml-1">(required)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-[15px] bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30"
            required
          />
        </div>

        {/* MESSAGE */}
        <div className="flex flex-col space-y-2 text-black">
          <label
            htmlFor="message"
            className="text-black/60 font-medium text-xs uppercase tracking-wider"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            maxLength={500}
            rows={5}
            required
            className="w-full px-4 py-3 rounded-xl text-[15px] bg-black/5 border border-transparent focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300 placeholder:text-black/30 custom-scrollbar resize-y min-h-[120px]"
          ></textarea>
          <p className="text-[13px] text-black/40 font-medium mt-1 text-right">
            {500 - charCount} characters remaining
          </p>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full py-3.5 rounded-full font-medium text-white text-[15px] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-md"
        >
          {loading ? "Sending..." : "Submit Inquiry"}
        </button>

        {error && <p className="text-red-500 text-[14px] font-medium text-center mt-4">{error}</p>}
      </form>
    </section>
  );
}

export default function Contact() {
  return (
    <>
      <main className="relative min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="relative z-10 pt-28 flex flex-col min-h-screen">
          <div className="pb-12">
            <Suspense fallback={
              <section className="relative w-full flex justify-center z-10 px-4 md:px-6">
                <div className="space-y-6 w-full max-w-xl bg-white/80 backdrop-blur-md rounded-[2rem] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 md:p-12">
                  <div className="text-center mb-8 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg w-1/2 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              </section>
            }>
              <ContactForm />
            </Suspense>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </main>
    </>
  );
}
