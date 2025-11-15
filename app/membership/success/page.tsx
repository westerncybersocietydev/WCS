"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const isUpgrade = searchParams.get("upgrade") === "true";
  const userId = searchParams.get("userId");
  const token = searchParams.get("token"); // PayPal token
  const PayerID = searchParams.get("PayerID"); // PayPal PayerID
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);

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
            console.log("Payment captured successfully", result);

            // The webhook will handle the VIP upgrade automatically
            // But we can also trigger it here if needed for immediate feedback
          } else {
            const errorData = await res.json().catch(() => ({}));
            console.error("Failed to capture payment:", errorData);
          }
        } catch (error) {
          console.error("Error capturing payment:", error);
        } finally {
          setCapturing(false);
        }
      };

      captureOrder();
    }
  }, [token, isUpgrade, userId, captured, capturing]);

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-3">
        {isUpgrade ? "Upgrade Successful! 🎉" : "You're a WCS Member! 🎉"}
      </h1>
      {capturing && (
        <p className="mb-4 text-blue-600">Processing your payment...</p>
      )}
      {captured && (
        <p className="mb-4 text-green-600">
          Payment confirmed! Your membership is now active.
        </p>
      )}
      <p className="mb-4">
        {isUpgrade
          ? "Congratulations! You've successfully upgraded to VIP membership for the 2024-2025 academic year."
          : "Check your email for the PayPal receipt. Save your receipt for verification at events."}
      </p>
      <p className="mb-2">Next steps:</p>
      <ul className="list-disc ml-6">
        <li>Join the Discord (link)</li>
        <li>We&apos;ll update the roster shortly</li>
        {isUpgrade && (
          <li>
            Your VIP benefits are now active for the 2024-2025 academic year!
          </li>
        )}
      </ul>
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
