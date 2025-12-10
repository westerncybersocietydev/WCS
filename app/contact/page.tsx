"use client";

import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { newInquiry } from "../lib/actions/contact.action";

export default function Contact() {
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
    <>
      <main>
        <div>
          <Navbar />

          <div className="mt-16 w-full flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 max-w-lg bg-white rounded-lg shadow-md p-9"
            >
              <h1 className="text-3xl mb-2 font-bold text-center text-gray-800">
                Contact Us
              </h1>
              <p className="mb-6 text-gray-600 text-center">
                Have a question or need assistance? Fill out the form below and
                we’ll get back to you soon.
              </p>

              {/* TOPIC */}
              <div className="flex flex-col space-y-1 text-black">
                <label
                  htmlFor="topic"
                  className="text-gray-700 font-semibold text-sm"
                >
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-black text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition shadow-sm"
                >
                  <option value="general">General</option>
                  <option value="SIP projects">SIP Projects</option>
                  <option value="events">Events</option>
                  <option value="sponsorships">Sponsorships</option>
                </select>
              </div>

              {/* NAME FIELDS */}
              <div className="flex space-x-4">
                {/* First Name */}
                <div className="flex flex-col space-y-1 w-1/2 text-black">
                  <label
                    htmlFor="firstName"
                    className="text-gray-600 font-bold text-sm"
                  >
                    First Name <span className="font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="shadow rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col space-y-1 w-1/2 text-black">
                  <label
                    htmlFor="lastName"
                    className="text-gray-600 font-bold text-sm"
                  >
                    Last Name <span className="font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="shadow rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex flex-col space-y-1 text-black">
                <label
                  htmlFor="email"
                  className="text-gray-600 font-bold text-sm"
                >
                  Email <span className="font-normal">(required)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>

              {/* MESSAGE */}
              <div className="flex flex-col space-y-1 text-black">
                <label
                  htmlFor="message"
                  className="text-gray-600 font-bold text-sm"
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
                  className="shadow rounded pl-3 px-1 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  {500 - charCount} characters remaining
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full tracking-widest rounded-full font-semibold text-white
                bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105
                px-14 py-3 transition shadow-sm hover:shadow-lg"
              >
                {loading ? "Sending..." : "Submit"}
              </button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
