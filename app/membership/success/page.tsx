"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { useUser } from "@/app/context/UserContext";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useUser();
  const isUpgrade = searchParams.get("upgrade") === "true";
  const userId = searchParams.get("userId");
  const token = searchParams.get("token"); // PayPal token
  const PayerID = searchParams.get("PayerID"); // PayPal PayerID
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If this is an upgrade, we can show a special message
    if (isUpgrade) {
      console.log("Upgrade completed for user:", userId);
    }

    // If we have a PayPal token, capture the order
    if (token && !captured && !capturing) {
      const captureOrder = async () => {
        if (!token) return;

        setCapturing(true);
        try {
          // PayPal returns token parameter which is the order ID
          const orderId = token;

          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });

          if (res.ok) {
            const result = await res.json();
            setCaptured(true);
            setUpgraded(result.upgraded || false);
            console.log("Payment captured successfully", result);

            // Refresh user data to show updated membership status
            if (result.upgraded) {
              await fetchUser();
            }
          } else {
            const errorData = await res.json().catch(() => ({}));
            console.error("Failed to capture payment:", errorData);
            setError("Failed to process payment. Please contact support.");
          }
        } catch (error) {
          console.error("Error capturing payment:", error);
          setError("An error occurred. Please contact support.");
        } finally {
          setCapturing(false);
        }
      };

      captureOrder();
    }
  }, [token, isUpgrade, userId, captured, capturing, fetchUser]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {capturing ? (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600"></i>
              </div>
            ) : captured && upgraded ? (
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <i className="fa-solid fa-check text-4xl text-green-600"></i>
              </div>
            ) : error ? (
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fa-solid fa-exclamation text-4xl text-red-600"></i>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="fa-solid fa-crown text-4xl text-purple-600"></i>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {capturing
              ? "Processing Payment..."
              : captured && upgraded
              ? "Welcome to VIP! 🎉"
              : error
              ? "Payment Issue"
              : "Payment Successful!"}
          </h1>

          {/* Status Messages */}
          <div className="mb-8">
            {capturing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-center font-medium">
                  <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                  Confirming your payment and upgrading your membership...
                </p>
              </div>
            )}

            {captured && upgraded && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-center font-medium">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  Payment confirmed! Your VIP membership is now active.
                </p>
              </div>
            )}

            {captured && !upgraded && !error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-center font-medium">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Payment received. Membership upgrade in progress...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-center font-medium">
                  <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Main Message */}
          <p className="text-gray-700 text-center text-lg mb-8">
            {captured && upgraded
              ? "Congratulations! You've successfully upgraded to VIP membership for the 2024-2025 academic year. Your profile has been updated with your new benefits."
              : "Check your email for the PayPal receipt. Save your receipt for verification at events."}
          </p>

          {/* Next Steps */}
          {captured && upgraded && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="fa-solid fa-list-check mr-2 text-purple-600"></i>
                Next Steps
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fa-solid fa-star text-yellow-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">
                    Your VIP benefits are now active for the 2025-2026 academic
                    year!
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fa-brands fa-discord text-indigo-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">
                    Join our Discord community to connect with other members
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-calendar text-green-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">
                    Check out upcoming VIP-exclusive events and workshops
                  </span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-user text-blue-500 mr-3 mt-1"></i>
                  <span className="text-gray-700">
                    Visit your profile to see your updated membership status
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/profile")}
              disabled={capturing}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-user mr-2"></i>
              View Profile
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600 transition-all duration-200"
            >
              <i className="fa-solid fa-home mr-2"></i>
              Back to Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@westerncyber.ca"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              support@westerncyber.ca
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
