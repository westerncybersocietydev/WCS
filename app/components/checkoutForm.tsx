import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';

interface CheckoutFormProps {
  planPrice: number;
  onPaymentSuccess: (e: React.FormEvent) => Promise<void>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planPrice, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error message

  useEffect(() => {
    const createPaymentIntent = async () => {
      const res = await fetch("/api/create-intent", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: planPrice
        }),
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
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

    setLoading(true); // Set loading to true when the process starts
    setErrorMessage(null); // Clear previous error message

    try {
      // Call elements.submit() immediately
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(submitError);
        setErrorMessage('Failed to submit payment details. Please try again.'); // Set error message
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
        redirect: 'if_required'
      });

      if (error) {
        console.error(error);
        setErrorMessage('Payment failed. Please try again.'); // Set error message
        setPaymentSuccess(false);
      } else {
        setPaymentSuccess(true);
        await onPaymentSuccess(event); // Call the callback function
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred. Please try again.'); // Set error message
      setPaymentSuccess(false);
    } finally {
      setLoading(false); // Set loading to false after the process ends
    }
  };

  return (
    <div className='flex justify-center w-full overflow-y-auto custom-scrollbar'>
      <form onSubmit={handleSubmit} className='w-full p-3 px-1'>
        <PaymentElement />
        <button
          className='w-full mt-3 rounded-xl text-white font-bold bg-gradient-to-r from-violet-500 to-purple-500 border hover:bg-blue-800 hover:text-white text-xs md:text-normal py-1 md:py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg'
          type='submit'
          disabled={!stripe || !elements || !clientSecret || loading} // Disable button while loading
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
        {errorMessage && (
          <p className='mt-2 text-red-500'>{errorMessage}</p> // Display error message in red
        )}
        {paymentSuccess && (
          <p className='mt-2 text-green-500 text-xs'>Payment successful! Thank you for your purchase.</p>
        )}
      </form>
    </div>
  );
}

export default CheckoutForm;