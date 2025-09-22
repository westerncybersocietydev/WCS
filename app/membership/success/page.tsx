"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const isUpgrade = searchParams.get("upgrade") === "true";
  const userId = searchParams.get("userId");

  useEffect(() => {
    // If this is an upgrade, we can show a special message
    if (isUpgrade) {
      console.log("Upgrade completed for user:", userId);
    }
  }, [isUpgrade, userId]);

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-3">
        {isUpgrade ? "Upgrade Successful! 🎉" : "You're a WCS Member! 🎉"}
      </h1>
      <p className="mb-4">
        {isUpgrade
          ? "Congratulations! You've successfully upgraded to VIP membership for the 2024-2025 academic year."
          : "Check your email for the Stripe receipt. Save your receipt for verification at events."}
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
