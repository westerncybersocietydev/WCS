// import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from "react";

interface CheckoutFormProps {
  planPrice: number;
  onPaymentSuccess: (e: React.FormEvent) => Promise<void>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  planPrice,
  onPaymentSuccess,
}) => {
  // Production mode - Stripe integration required

  // const stripe = useStripe();
  // const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: planPrice,
          }),
        });

        // Check if the response is successful
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Payment intent creation error:", errorData);
          setErrorMessage("Failed to create payment intent. Please try again.");
          return;
        }

        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret received:", data);
          setErrorMessage("Failed to create payment intent. Please try again.");
        }
      } catch (error) {
        console.error("Payment intent creation error:", error);
        setErrorMessage("Failed to create payment intent. Please try again.");
      }
    };

    if (planPrice > 0) {
      createPaymentIntent();
    }
  }, [planPrice]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!elements || !stripe) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(submitError);
        setErrorMessage("Failed to submit payment details. Please try again.");
        setPaymentSuccess(false);
        return;
      }

      // Confirm the payment
      const { error } = await stripe.confirmPayment({
        clientSecret: clientSecret,
        elements,
        confirmParams: {
          return_url: "https://example.com",
        },
        redirect: "if_required",
      });

      if (error) {
        console.error(error);
        setErrorMessage("Payment failed. Please try again.");
        setPaymentSuccess(false);
      } else {
        setPaymentSuccess(true);
        await onPaymentSuccess(event);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setPaymentSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full overflow-y-auto custom-scrollbar">
      <form onSubmit={handleSubmit} className="w-full p-3 px-1">
        <PaymentElement />
        <button
          className="w-full mt-3 rounded-xl text-white font-bold bg-gradient-to-r from-violet-500 to-purple-500 border hover:bg-blue-800 hover:text-white text-xs md:text-normal py-1 md:py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
          type="submit"
          disabled={!stripe || !elements || !clientSecret || loading}
        >
          {loading ? "Processing..." : "Pay"}
        </button>
        {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
        {paymentSuccess && (
          <p className="mt-2 text-green-500 text-xs">
            Payment successful! Thank you for your purchase.
          </p>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
