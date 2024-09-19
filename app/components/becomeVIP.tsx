"use client"
import React, { FormEvent, useState } from "react";
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from '../components/checkoutForm';
import { Elements } from '@stripe/react-stripe-js';

const VIP = [
  'Ad-free experience',
  'Early access to new features',
  'Advanced analytics and insights',
  'Multi-device sync',
  'Offline mode',
  'Community support',
  'Limited storage',
];

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
const options: StripeElementsOptions = {
  mode: "payment",
  amount: 15 * 100,
  currency: "cad",
};

interface BecomeVIPProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (e: React.FormEvent) => Promise<void>;
}

const BecomeVIP: React.FC<BecomeVIPProps> = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="flex relative bg-white h-11/12 w-2/4 mx-4 rounded-lg shadow-lg overflow-hidden">
    <button
        onClick={onClose}
        className="absolute px-2 top-2 right-2 text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none"
    >
        <i className="fa-solid fa-x text-xs"></i>
    </button>

    {/* Left side: Image */}
    <div className="relative"> {/* Set a fixed height */}
        <img
        src="/vipWCS.png"
        alt="VIP"
        className="object-cover w-full h-full" // Use object-contain to preserve image dimensions
        />
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
    </div>


        {/* Right side: Text and button */}
        <div className="md:w-2/3 p-4 flex flex-col justify-between">
        <h2 className="text-2xl text-center font-semibold text-black pb-2 border-b-2 mb-4">
            Upgrade Your Plan
        </h2>
          {paymentOpen ? (
            <>
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm onPaymentSuccess={onComplete} planPrice={15} />
              </Elements>
            </>
          ) : (
            <>
              <div>
                <ul className="space-y-2 ml-8">
                  {VIP.map((benefit, index) => (
                    <li key={index} className="flex font-bold items-center text-gray-700 text-md">
                      <i className="fa-solid fa-check text-black font-bold mr-2"></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setPaymentOpen(true)}
                className="mt-auto w-full font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
               <i className="fa-solid fa-rocket"></i> Become a VIP
              </button>
              <p className="text-gray-500 mt-1 mb-4" style={{fontSize: '10px'}}>
                You will be charged a one-time payment of $15, which will cover your membership for the remainder of the academic year. The next payment will be due in September of the following year.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeVIP;