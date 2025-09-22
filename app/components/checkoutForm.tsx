import React from "react";

interface CheckoutFormProps {
  planPrice: number;
  onPaymentSuccess: (e: React.FormEvent) => Promise<void>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  planPrice,
  onPaymentSuccess,
}) => {
  // Simplified checkout form - redirects to Stripe Checkout
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onPaymentSuccess(event);
  };

  return (
    <div className="flex justify-center w-full overflow-y-auto custom-scrollbar">
      <form onSubmit={handleSubmit} className="w-full p-3 px-1">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Payment Details
          </h3>
          <p className="text-gray-600 mb-2">
            Amount: ${planPrice.toFixed(2)} CAD
          </p>
          <p className="text-sm text-gray-500">
            You will be redirected to Stripe Checkout for secure payment
            processing.
          </p>
        </div>

        <button
          className="w-full mt-3 rounded-xl text-white font-bold bg-gradient-to-r from-violet-500 to-purple-500 border hover:bg-blue-800 hover:text-white text-xs md:text-normal py-1 md:py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
          type="submit"
        >
          Proceed to Payment - ${planPrice.toFixed(2)} CAD
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
