"use client";
import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { Basic, VIP } from "../dataFiles/perks";
import toast from "react-hot-toast";

export default function MembershipPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleVIPUpgrade = async () => {
    if (!user?.userId) {
      toast.error("Please sign in to upgrade your membership");
      router.push("/sign-in");
      return;
    }

    setLoading(true);

    try {
      // Call the upgrade API to create PayPal checkout session
      const res = await fetch("/api/upgrade/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
        }),
      });

      // Check if the response is successful
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Upgrade API error:", errorData);
        toast.error("Unable to start upgrade checkout. Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data?.url) {
        // Redirect to PayPal Checkout
        window.location.href = data.url;
      } else {
        console.error("No approval URL:", data);
        toast.error("Unable to start upgrade checkout. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Upgrade checkout error:", err);
      toast.error("An error occurred starting upgrade checkout.");
      setLoading(false);
    }
  };

  const handleBasicUpgrade = () => {
    toast("You already have a Basic membership!");
  };

  return (
    <>
      <main>
        <div>
          <Navbar />
          <div className="mt-16 flex flex-col text-black items-center justify-center min-h-screen p-4">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join the Western Cyber Society for the 2024-2025 academic year
                and unlock exclusive benefits, networking opportunities, and
                career development resources.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">
              {/* Basic Plan Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/2 border-2 border-gray-200 hover:border-violet-300 transition-all duration-300">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Basic
                  </h2>
                  <div className="text-4xl font-bold text-gray-600 mb-4">
                    <span className="text-sm">$</span>0
                    <span className="text-lg text-gray-500">
                      /academic year
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Perfect for students beginning their tech journey
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {Basic.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <i className="fa-solid fa-check text-green-500 mr-3"></i>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleBasicUpgrade}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-gray-600 bg-gray-100 border border-gray-300 cursor-not-allowed"
                  disabled
                >
                  Current Plan
                </button>
              </div>

              {/* VIP Plan Card */}
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg p-8 w-full md:w-1/2 text-white relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2">VIP</h2>
                  <div className="text-4xl font-bold mb-4">
                    <span className="text-sm">$</span>15
                    <span className="text-lg opacity-80">/academic year</span>
                  </div>
                  <p className="opacity-90 text-sm">
                    For students serious about their tech career
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {Basic.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <i className="fa-solid fa-check text-green-300 mr-3"></i>
                      <span className="opacity-90">{benefit}</span>
                    </div>
                  ))}
                  {VIP.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <i className="fa-solid fa-star text-yellow-300 mr-3"></i>
                      <span className="font-semibold">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleVIPUpgrade}
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-violet-600 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-rocket mr-2"></i>
                      Upgrade to VIP
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                All memberships are valid for the 2024-2025 academic year. VIP
                members get priority access to exclusive events and resources.
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
