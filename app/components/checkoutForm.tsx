import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';

interface CheckoutFormProps {
  planPrice: number;
  onPaymentSuccess: (e: React.FormEvent) => Promise<void>; // Update type here
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planPrice, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

    // Call elements.submit() immediately
    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.error(submitError);
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
      setPaymentSuccess(false);
    } else {
      setPaymentSuccess(true);
      await onPaymentSuccess(event); // Call the callback function
    }
  };

  return (
    <div className='flex flex-col justify-center items-center w-full bg-white'>
      {paymentSuccess && <p className="text-green-500">Payment successful! Redirecting to dashboard...</p>}
      <form className='max-w-md mt-40' onSubmit={handleSubmit}>
        <PaymentElement />
        <button className='w-full bg-customDark p-2 rounded-lg mt-10' type='submit' disabled={!stripe || !elements || !clientSecret}>
          Pay
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
