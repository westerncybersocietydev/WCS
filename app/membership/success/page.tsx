export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-3">You're a WCS Member! 🎉</h1>
      <p className="mb-4">
        Check your email for the Stripe receipt. Save your receipt for
        verification at events.
      </p>
      <p className="mb-2">Next steps:</p>
      <ul className="list-disc ml-6">
        <li>Join the Discord (link)</li>
        <li>We'll update the roster shortly</li>
      </ul>
    </main>
  );
}
