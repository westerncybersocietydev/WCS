// import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';

interface CheckoutFormProps {
  planPrice: number;
  onPaymentSuccess: (e: React.FormEvent) => Promise<void>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planPrice, onPaymentSuccess }) => {
  // DEV MODE - Skip Stripe integration for development
  const DEV_MODE = true;
  
  // const stripe = useStripe();
  // const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (DEV_MODE) {
      console.log("🚀 DEV MODE: Skipping Stripe payment intent creation");
      setClientSecret("dev_mode_secret");
      return;
    }
    
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
    
    if (DEV_MODE) {
      console.log("🚀 DEV MODE: Simulating successful payment");
      setLoading(true);
      setTimeout(() => {
        setPaymentSuccess(true);
        setLoading(false);
        onPaymentSuccess(event);
      }, 1000);
      return;
    }
    
    if (!elements || !stripe) {
      return;
    }

    setLoading(true);
    setErrorMessage(null); 

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(submitError);
        setErrorMessage('Failed to submit payment details. Please try again.');
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
        setErrorMessage('Payment failed. Please try again.');
        setPaymentSuccess(false);
      } else {
        setPaymentSuccess(true);
        await onPaymentSuccess(event);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setPaymentSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center w-full overflow-y-auto custom-scrollbar'>
      <form onSubmit={handleSubmit} className='w-full p-3 px-1'>
        {DEV_MODE ? (
          <div className="p-4 bg-gray-100 rounded-lg mb-4">
            <p className="text-sm text-gray-600">🚀 DEV MODE: Payment form simulation</p>
            <p className="text-xs text-gray-500 mt-1">Amount: ${planPrice}</p>
          </div>
        ) : (
          <PaymentElement />
        )}
        <button
          className='w-full mt-3 rounded-xl text-white font-bold bg-gradient-to-r from-violet-500 to-purple-500 border hover:bg-blue-800 hover:text-white text-xs md:text-normal py-1 md:py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg'
          type='submit'
          disabled={!DEV_MODE && (!stripe || !elements || !clientSecret) || loading}
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
        {errorMessage && (
          <p className='mt-2 text-red-500'>{errorMessage}</p>
        )}
        {paymentSuccess && (
          <p className='mt-2 text-green-500 text-xs'>Payment successful! Thank you for your purchase.</p>
        )}
      </form>
    </div>
  );
}

export default CheckoutForm;